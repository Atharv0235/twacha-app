// Central settings. Edit this file before the demo.

// Backend base URL. Set VITE_API_BASE_URL in Netlify / .env; falls back to local dev.
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');

// Real team members shown in the "Built by" block. Add names here, e.g.
//   { name: 'Your Name', role: 'Backend and model' }
export const TEAM = [
  { name: 'Atharv Jain', role: 'Developer' }
];

// Contact email shown in the privacy policy and About screen (leave '' to hide).
export const CONTACT_EMAIL = 'atharv@twacha.app';

export const DISCLAIMER = 'Experimental estimate for a class project. Not a medical diagnosis.';

export const WAQI_CREDIT = 'Air quality data: World Air Quality Index Project (aqicn.org)';
