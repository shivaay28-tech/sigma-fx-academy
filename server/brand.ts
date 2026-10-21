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
      "navy": "#f3d6dc",
      "navy800": "#e8b8c4",
      "navy700": "#d48a9c",
      "navy600": "#fbeff2",
      "baazex": "#b4234a",
      "baazex600": "#8e1b3a",
      "bright": "#e05a7a",
      "accent": "#7a1230",
      "ink": "#2a0c14",
      "muted": "#7a5560",
      "canvas": "#fdf7f8",
      "line": "#ecd4db",
      "onButton": "#ffffff",
      "glow": "180 35 74"
  },
} as const

export type Brand = typeof BRAND
