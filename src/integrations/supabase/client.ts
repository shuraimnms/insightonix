// We do NOT use real supabase. This is a shim to the Universal Admin Panel.

// We do NOT use real supabase. This is a shim to the Universal Admin Panel.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';
const SITE_ID = import.meta.env.VITE_SITE_ID || window.location.hostname.split('.')[0].toUpperCase();

async function universalFetch(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('universal_auth_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    'X-Site-Abbreviation': SITE_ID,
    ...options.headers,
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    throw new Error('API Request Failed');
  }
  return res.json();
}

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.queryParams = new URLSearchParams();
    this.isSingle = false;
  }

  select(columns, options) {
    this.queryParams.set('select', columns);
    if (options?.head) this.queryParams.set('head', 'true');
    if (options?.count) this.queryParams.set('count', options.count);
    return this;
  }

  eq(column, value) {
    this.queryParams.set(column, value);
    return this;
  }

  or(query) {
    this.queryParams.set('or', query);
    return this;
  }

  limit(count) {
    this.queryParams.set('limit', count);
    return this;
  }

  order(column, options = { ascending: true }) {
    this.queryParams.set('sortBy', column);
    this.queryParams.set('sortOrder', options.ascending ? 'asc' : 'desc');
    return this;
  }
  
  gte(column, value) {
    this.queryParams.set('dateFrom', value); // Map to dateFrom for now
    return this;
  }

  ilike(column, value) {
    this.queryParams.set(column, `ilike:${value}`);
    return this;
  }

  maybeSingle() {
    this.isSingle = true;
    return this;
  }

  async insert(payload) {
    try {
      const data = await universalFetch(`/public/${this.table}`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return { data: this.isSingle ? data[0] : data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async update(payload) {
    try {
      const data = await universalFetch(`/public/${this.table}`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });
      return { data: this.isSingle ? data[0] : data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
  
  async delete() {
    try {
      const data = await universalFetch(`/public/${this.table}?${this.queryParams.toString()}`, {
        method: 'DELETE'
      });
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async then(resolve, reject) {
    try {
      // Map table names to universal backend endpoints
      let endpoint = `/public/${this.table}`;
      if (this.table === 'articles') endpoint = '/public/papers';
      if (this.table === 'board_members') endpoint = '/public/board';
      
      const res = await universalFetch(`${endpoint}?${this.queryParams.toString()}`);
      // universal backend returns various formats: { data: { papers: [...] } } or { issues: [...] }
      let resultData = res;
      if (res.data) {
         if (res.data.papers) resultData = res.data.papers;
         else resultData = res.data;
      } else {
         const keys = Object.keys(res).filter(k => k !== 'pagination' && k !== 'success' && k !== 'error');
         const arrayKey = keys.find(k => Array.isArray(res[k]));
         if (arrayKey) {
             resultData = res[arrayKey];
         }
      }

      if (this.isSingle && Array.isArray(resultData)) {
          resultData = resultData[0] || null;
      }
      
      // Ensure we always return an array if isSingle is false to prevent .map() crashes
      if (!this.isSingle && !Array.isArray(resultData)) {
          resultData = [];
      }

      resolve({ data: resultData, error: null });
    } catch (error) {
      console.warn(`Query failed for ${this.table}:`, error.message);
      // Fail gracefully: return [] for lists so components don't crash
      resolve({ data: this.isSingle ? null : [], error: null });
    }
  }
}

export const supabase = {
  from: (table) => new QueryBuilder(table),
  auth: {
    getSession: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('universal_auth_token') : null;
      const user = typeof window !== 'undefined' ? localStorage.getItem('universal_user') : null;
      if (token && user) return { data: { session: { user: JSON.parse(user) } }, error: null };
      return { data: { session: null }, error: null };
    },
    signOut: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('universal_auth_token');
        localStorage.removeItem('universal_user');
      }
      return { error: null };
    }
  },
  storage: {
    from: (bucket) => ({
      upload: async (path, file) => {
         const formData = new FormData();
         formData.append('file', file);
         try {
           const res = await fetch(`${API_URL}/upload`, {
             method: 'POST',
             headers: { 'X-Site-Abbreviation': SITE_ID },
             body: formData
           });
           const data = await res.json();
           return { data: { path: data.url }, error: null };
         } catch(e) {
           return { data: null, error: e };
         }
      },
      getPublicUrl: (path) => ({ data: { publicUrl: path } })
    })
  }
};

