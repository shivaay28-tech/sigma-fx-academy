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
  colors: {
    navy: '#071a3a',
    navy800: '#0b2550',
    navy700: '#123468',
    navy600: '#1b4785',
    baazex: '#1565e0',
    baazex600: '#0f4fb8',
    bright: '#4aa3ff',
    accent: '#0d55c7',
    ink: '#0f1c33',
    muted: '#56667f',
    canvas: '#f5f8fd',
    line: '#d6e1f0',
    onButton: '#ffffff',
    glow: '21 101 224',
  },

} as const

export type Brand = typeof BRAND
