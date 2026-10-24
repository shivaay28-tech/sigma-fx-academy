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
  colors: {
      "navy": "#0c3d28",
      "navy800": "#0a3322",
      "navy700": "#145c38",
      "navy600": "#1d7a4a",
      "baazex": "#1fa85a",
      "baazex600": "#17864a",
      "bright": "#5dcc96",
      "accent": "#128a45",
      "ink": "#12261c",
      "muted": "#5c7266",
      "canvas": "#ffffff",
      "line": "#d5e8dc",
      "onButton": "#ffffff",
      "glow": "31 168 90"
  },
} as const

export type Brand = typeof BRAND
