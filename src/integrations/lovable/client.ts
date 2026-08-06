export const lovable = {
  auth: {
    signInWithOAuth: async (provider, options) => {
      // Mock OAuth, ideally redirect to universal backend oauth
      window.location.href = "/login";
      return { error: null, redirected: true };
    },
  },
};
