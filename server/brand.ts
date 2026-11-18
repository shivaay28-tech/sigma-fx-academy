export const BRAND = {
  id: 'sigma-fx-academy',
  name: 'Sigma FX Academy',
  shortName: 'Sigma FX',
  engineName: 'Sigma FX Engine',
  company: 'Sigma FX Academy',
  url: 'https://www.sigmafxacademy.com',
  host: 'sigmafxacademy.com',
  storagePrefix: 'sigmafx.academy',
  demoStudentEmail: 'student@sigmafxacademy.com',
  demoAdminEmail: 'admin@sigmafxacademy.com',
  /**
   * Public contact details shown in the footer. Leave a field empty to hide it.
   * Fill these with the real Sigma FX Academy details before launch.
   */
  contact: {
    email: '' as string,
    phone: '' as string,
    whatsapp: '' as string,
    address: '' as string,
  },
  /** Social profile URLs. Empty entries are hidden. */
  social: {
    instagram: '' as string,
    youtube: '' as string,
    telegram: '' as string,
    facebook: '' as string,
    x: '' as string,
    linkedin: '' as string,
  },
  /** Link to the live Sigma FX trading platform (Learning Path final stage). Empty hides the button. */
  platformUrl: '' as string,
  /** Theme taken from the logo: deep navy field, cyan Σ and candles, sky-blue "FX", cream lettering. */
  colors: {
    navy: '#04122b',
    navy800: '#071c3d',
    navy700: '#0b2a55',
    navy600: '#123a6e',
    baazex: '#14d2ee',
    baazex600: '#0fb4d4',
    bright: '#22e3f7',
    accent: '#0373a6',
    ink: '#0a1a33',
    muted: '#4a6079',
    canvas: '#f2f9fc',
    line: '#cde6ef',
    onButton: '#04122b',
    glow: '20 210 238',
  },

} as const

export type Brand = typeof BRAND
