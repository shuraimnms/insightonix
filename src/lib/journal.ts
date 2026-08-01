// Static journal identity + nav config used by every layout piece.
// Kept out of the DB so it renders instantly during SSR/prerender.
// Nav structure mirrors the INSIGHTONIX policy document's site map.

export const JOURNAL = {
  name: "INSIGHTONIX Global Research",
  short: "INSIGHTONIX",
  tagline:
    "A Peer-Reviewed, Open Access International Journal for High-Quality Multidisciplinary Research in Computer Science, Engineering, Medicine, Business, Humanities, and Life Sciences.",
  issn_online: "2395-6410",
  issn_print: "2455-0116",
  license: "Open Access",
  frequency: "Quarterly",
  founded: 2021,
  email: "editor@insightonix.com",
  address: "Editorial Office, INSIGHTONIX, India",
} as const;

export type NavItem = {
  label: string;
  to?: string;
  external?: string;
  description?: string;
};

export type NavGroup = {
  label: string;
  to?: string;
  items?: NavItem[];
  columns?: 1 | 2;
};

export const NAV: NavGroup[] = [
  { label: "Home", to: "/" },

  {
    label: "About",
    columns: 2,
    items: [
      { label: "About the Journal", to: "/about", description: "Overview, mission, and editorial approach." },
      { label: "Aim & Objectives", to: "/aims-scope", description: "Aim, objectives, and academic focus." },
      { label: "Vision", to: "/vision-mission", description: "Long-term vision of INSIGHTONIX." },
      { label: "Mission", to: "/vision-mission", description: "Mission and editorial commitments." },
      { label: "Focus & Scope", to: "/aims-scope", description: "Subject areas and manuscript types." },
      { label: "Publication Frequency", to: "/publication-timeline", description: "Quarterly publication schedule." },
      { label: "Open Access Policy", to: "/open-access-policy", description: "Open access and licensing terms." },
      { label: "Publication Charges", to: "/apc", description: "Publication and processing charges policy." },
      { label: "Journal Information", to: "/about", description: "Journal profile and details." },
      { label: "Contact Information", to: "/contact", description: "Editorial office contact channels." },
    ],
  },

  {
    label: "Editorial Team",
    items: [
      { label: "Editor-in-Chief", to: "/editor-in-chief", description: "Leadership and editorial vision." },
      { label: "Managing Editor", to: "/editorial-office", description: "Managing editor and editorial office." },
      { label: "Associate Editors", to: "/associate-editors", description: "Subject-area associate editors." },
      { label: "Editorial Board", to: "/editorial-board", description: "Full editorial board members." },
      { label: "Advisory Board", to: "/advisory-board", description: "Senior academic advisors." },
      { label: "Editorial Office", to: "/editorial-office", description: "Editorial office and coordination." },
    ],
  },

  {
    label: "Reviewer",
    items: [
      { label: "Become a Reviewer", to: "/join-reviewer", description: "Apply to join the reviewer panel." },
      { label: "Reviewer Guidelines", to: "/peer-review-policy", description: "How reviewers should evaluate work." },
      { label: "Reviewer Responsibilities", to: "/peer-review-policy", description: "Confidentiality, objectivity, timeliness." },
      { label: "Review Process", to: "/peer-review-policy", description: "Double-blind peer review workflow." },
      { label: "Reviewer Recognition", to: "/reviewers", description: "Acknowledgement and reviewer honours." },
      { label: "Reviewer Certificate", to: "/verify", description: "Verifiable reviewer certificates." },
    ],
  },

  {
    label: "Focus & Scope",
    columns: 2,
    items: [
      { label: "Aim & Scope", to: "/aims-scope", description: "Journal aim and overall scope." },
      { label: "Subject Areas", to: "/aims-scope", description: "All accepted subject areas." },
      { label: "Computer Science", to: "/aims-scope", description: "Computer science and IT." },
      { label: "Engineering", to: "/aims-scope", description: "All fields of engineering." },
      { label: "Medicine", to: "/aims-scope", description: "Medical and health sciences." },
      { label: "Business", to: "/aims-scope", description: "Business and multidisciplinary." },
      { label: "Humanities", to: "/aims-scope", description: "Arts and humanities." },
      { label: "Life Sciences", to: "/aims-scope", description: "Biology and life sciences." },
      { label: "Multidisciplinary Research", to: "/aims-scope", description: "Multidisciplinary studies." },
    ],
  },

  {
    label: "Author Guidelines",
    columns: 2,
    items: [
      { label: "Instructions to Authors", to: "/author-guidelines", description: "Complete instructions for authors." },
      { label: "Manuscript Template", to: "/manuscript-template", description: "Download the official DOCX template." },
      { label: "Paper Format", to: "/author-guidelines", description: "Formatting rules for manuscripts." },
      { label: "APA 7 Referencing", to: "/author-guidelines", description: "Reference style guide." },
      { label: "Tables & Figures", to: "/author-guidelines", description: "Presenting tables and figures." },
      { label: "Submission Checklist", to: "/submission-guidelines", description: "Pre-submission checklist." },
      { label: "Copyright Form", to: "/copyright-form", description: "Fillable rights-assignment form." },
      { label: "Author Declaration", to: "/author-declaration-form", description: "Originality and disclosure form." },
      { label: "AI Policy for Authors", to: "/publication-ethics", description: "Use of generative AI in manuscripts." },
      { label: "FAQs", to: "/faqs", description: "Frequently asked questions." },
    ],
  },

  {
    label: "Publication Ethics",
    columns: 2,
    items: [
      { label: "Publication Ethics", to: "/publication-ethics", description: "Overall ethics statement." },
      { label: "Author Ethics", to: "/publication-ethics", description: "Responsibilities of authors." },
      { label: "Reviewer Ethics", to: "/publication-ethics", description: "Responsibilities of reviewers." },
      { label: "Editor Ethics", to: "/publication-ethics", description: "Responsibilities of editors." },
      { label: "Publisher Ethics", to: "/publication-ethics", description: "Responsibilities of the publisher." },
      { label: "Conflict of Interest", to: "/publication-ethics", description: "Declaring competing interests." },
      { label: "Plagiarism Policy", to: "/plagiarism-policy", description: "Plagiarism detection and penalties." },
      { label: "AI Policy", to: "/publication-ethics", description: "Use of AI in the publishing workflow." },
      { label: "Retraction Policy", to: "/publication-ethics", description: "When and how articles are retracted." },
      { label: "Corrections Policy", to: "/publication-ethics", description: "Corrigenda and errata." },
    ],
  },

  {
    label: "Current Issue",
    items: [
      { label: "Current Issue", to: "/current-issue", description: "The most recent quarterly issue." },
      { label: "Table of Contents", to: "/current-issue", description: "Full table of contents." },
      { label: "Research Articles", to: "/latest-articles", description: "Original research articles." },
      { label: "Review Articles", to: "/articles", description: "Review articles across issues." },
      { label: "Case Studies", to: "/articles", description: "Case studies published in INSIGHTONIX." },
      { label: "Accepted Papers", to: "/accepted-papers", description: "Articles accepted for publication." },
      { label: "In Press", to: "/in-press", description: "Awaiting final issue assignment." },
    ],
  },

  {
    label: "Archives",
    items: [
      { label: "By Year", to: "/archives/year", description: "Browse archives by publication year." },
      { label: "By Volume", to: "/archives/volume", description: "Browse archives by volume number." },
      { label: "By Issue", to: "/archives/issue", description: "Browse archives by issue number." },
      { label: "All Archives", to: "/archives", description: "Complete archive index." },
    ],
  },

  {
    label: "Announcements",
    items: [
      { label: "Call for Papers", to: "/conferences/call-for-papers", description: "Open calls for papers." },
      { label: "Special Issues", to: "/special-issues", description: "Themed and special issues." },
      { label: "Reviewer Invitation", to: "/join-reviewer", description: "Invitation to join the reviewer panel." },
      { label: "Conference Announcements", to: "/conferences", description: "Upcoming conferences and events." },
    ],
  },

  {
    label: "Peer Review",
    columns: 2,
    items: [
      { label: "Initial Screening", to: "/peer-review-policy", description: "Editorial office screening." },
      { label: "Editorial Review", to: "/peer-review-policy", description: "Editor-level assessment." },
      { label: "Double-Blind Review", to: "/peer-review-policy", description: "External double-blind evaluation." },
      { label: "Revision", to: "/peer-review-policy", description: "Author revision cycle." },
      { label: "Final Decision", to: "/peer-review-policy", description: "Editor-in-Chief decision." },
      { label: "Proofreading", to: "/publication-process", description: "Copyediting and proofreading." },
      { label: "DOI Assignment", to: "/doi-information", description: "DOI registration and assignment." },
      { label: "Publication", to: "/publication-process", description: "Final publication in INSIGHTONIX." },
    ],
  },

  {
    label: "Indexing",
    columns: 2,
    items: [
      { label: "Abstracting & Indexing", to: "/indexing", description: "All indexing services." },
      { label: "Google Scholar", to: "/google-scholar", description: "Google Scholar indexing." },
      { label: "Crossref DOI", to: "/crossref", description: "Crossref membership and DOI." },
      { label: "ROAD", to: "/road", description: "Directory of Open Access scholarly Resources." },
      { label: "Copernicus", to: "/copernicus", description: "Copernicus Index information." },
      { label: "DOI Information", to: "/doi-information", description: "DOI policy and prefix." },
    ],
  },

  {
    label: "Contact",
    items: [
      { label: "Contact Us", to: "/contact", description: "Send a message to the editorial office." },
      { label: "Editorial Office", to: "/editorial-office", description: "Editorial office details." },
      { label: "Technical Support", to: "/technical-support", description: "Platform and submission support." },
      { label: "Submit a Query", to: "/submit-query", description: "Ask about your submission." },
    ],
  },

  {
    label: "FAQ",
    columns: 2,
    items: [
      { label: "For Authors", to: "/faqs", description: "FAQs for authors." },
      { label: "For Reviewers", to: "/faqs", description: "FAQs for reviewers." },
      { label: "For Readers", to: "/faqs", description: "FAQs for readers." },
      { label: "Submission", to: "/faqs", description: "Submission-related questions." },
      { label: "Publication Charges", to: "/apc", description: "Charges, waivers, and refunds." },
      { label: "DOI", to: "/doi-information", description: "DOI-related questions." },
      { label: "Copyright", to: "/copyright-policy", description: "Copyright and licensing." },
      { label: "Certificates", to: "/verify", description: "Certificate verification." },
    ],
  },
];

// Compact quick-menu — used on the homepage hero and other feature strips.
// Mirrors the top-level nav categories from the policy document.
export const QUICK_MENU: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Editorial Team", to: "/editorial-board" },
  { label: "Reviewer", to: "/join-reviewer" },
  { label: "Focus & Scope", to: "/aims-scope" },
  { label: "Author Guidelines", to: "/author-guidelines" },
  { label: "Publication Ethics", to: "/publication-ethics" },
  { label: "Current Issue", to: "/current-issue" },
  { label: "Archives", to: "/archives" },
  { label: "Peer Review", to: "/peer-review-policy" },
  { label: "Indexing", to: "/indexing" },
  { label: "Contact", to: "/contact" },
  { label: "FAQ", to: "/faqs" },
];
