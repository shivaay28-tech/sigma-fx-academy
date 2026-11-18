import { Logo } from '@/components/ui/Logo'
import { BRAND } from '@/assets/brand'
import { APP_NAME, COMPANY_HOST, COMPANY_NAME, COMPANY_URL, DISCLAIMER } from '@/utils/constants'
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

const columns = [
  {
    title: 'Academy',
    links: [
      { to: '/courses', label: 'Courses' },
      { to: '/learning-path', label: 'Learning Path' },
      { to: '/engine', label: 'AI Engine' },
      { to: '/about', label: 'About' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { to: '/categories', label: 'Categories' },
      { to: '/courses/introduction-to-mcx', label: 'Intro to MCX' },
      { to: '/courses/nsc-and-mcx', label: 'NSC and MCX' },
      { to: '/courses/risk-management-fundamentals', label: 'Risk management' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/register', label: 'Create account' },
      { to: '/login', label: 'Log in' },
      { to: '/dashboard', label: 'Dashboard' },
      { to: '/terms', label: 'Terms' },
      { to: '/privacy', label: 'Privacy' },
    ],
  },
]

const SOCIAL_LABELS: Record<keyof typeof BRAND.social, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  telegram: 'Telegram',
  facebook: 'Facebook',
  x: 'X',
  linkedin: 'LinkedIn',
}

function contactRows() {
  const { email, phone, whatsapp, address } = BRAND.contact
  const digits = (value: string) => value.replace(/[^\d+]/g, '')
  return [
    email ? { icon: Mail, label: email, href: `mailto:${email}` } : null,
    phone ? { icon: Phone, label: phone, href: `tel:${digits(phone)}` } : null,
    whatsapp ? { icon: MessageCircle, label: `WhatsApp ${whatsapp}`, href: `https://wa.me/${digits(whatsapp).replace('+', '')}` } : null,
    address ? { icon: MapPin, label: address, href: undefined } : null,
  ].filter((item) => item !== null)
}

export function Footer() {
  const contacts = contactRows()
  const socials = (Object.keys(SOCIAL_LABELS) as Array<keyof typeof BRAND.social>)
    .filter((key) => BRAND.social[key])
    .map((key) => ({ label: SOCIAL_LABELS[key], href: BRAND.social[key] }))

  return (
    <footer className="relative z-[2] bg-navy text-mist">
      <div className="h-1 bg-gradient-to-r from-baazex via-bright to-baazex" />
      <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-14">
        <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="max-w-md">
            <Logo light className="h-10 sm:h-11" />
            <p className="mt-3 text-sm leading-relaxed text-mist/85">
              Structured courses on commodities and Indian markets, with quizzes, certificates and an AI study assistant.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-baazex px-5 text-sm font-semibold text-on-button shadow-float hover:bg-baazex-600"
          >
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 lg:grid-cols-12 lg:gap-10">
          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="lg:col-span-2">
              <p className="text-[11px] font-bold tracking-[0.16em] text-bright uppercase">{column.title}</p>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-[13px] text-mist/85 hover:text-white sm:text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-3 lg:col-span-6 lg:pl-6">
            <p className="text-[11px] font-bold tracking-[0.16em] text-bright uppercase">Contact</p>
            {contacts.length ? (
              <ul className="mt-3 space-y-2.5">
                {contacts.map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5 text-sm text-mist/90">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-bright" />
                    {item.href ? (
                      <a href={item.href} className="hover:text-white hover:underline" target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                        {item.label}
                      </a>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
            <a href={COMPANY_URL} className="mt-3 inline-block text-sm font-semibold text-white hover:underline">
              www.{COMPANY_HOST}
            </a>
            {socials.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-mist hover:border-bright hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
            <p className="mt-4 text-xs leading-relaxed text-mist/70">
              Academy support is educational only and cannot provide personal investment advice.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <p className="text-xs leading-relaxed text-mist/80">{DISCLAIMER}</p>
          <p className="mt-3 text-xs text-mist/70">
            © {new Date().getFullYear()} {COMPANY_NAME}. {APP_NAME === COMPANY_NAME ? '' : `${APP_NAME}. `}All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
