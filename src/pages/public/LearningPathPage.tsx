import { Seo } from '@/components/Seo'
import { PhotoBanner } from '@/components/ui/PhotoBanner'
import { Reveal } from '@/components/ui/Reveal'
import { BRAND } from '@/assets/brand'
import { media } from '@/data/media'
import { useAcademy } from '@/context/AcademyContext'
import { useAuth } from '@/context/AuthContext'
import { APP_NAME, APP_SHORT_NAME, PASSING_SCORE } from '@/utils/constants'
import { ArrowRight, Award, BookOpenCheck, CandlestickChart, UserPlus, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const curriculum = [
  {
    title: 'Foundations',
    text: 'How MCX is organised, how gold, silver and crude are quoted, and how orders and expiry work.',
    slugs: ['introduction-to-mcx', 'mcx-gold-silver-crude-and-copper', 'mcx-orders-and-expiry', 'nsc-and-mcx'],
  },
  {
    title: 'Contract maths and the screen',
    text: 'Lot size, margin, mark-to-market, and reading the MCX trading screen.',
    slugs: ['mcx-lots-margin-and-mark-to-market', 'the-mcx-trading-screen'],
  },
  {
    title: 'Analysis',
    text: 'Reading charts and the news that moves prices, as context rather than a forecast.',
    slugs: ['charts-for-mcx-commodities', 'what-moves-mcx-prices'],
  },
  {
    title: 'Risk and conduct',
    text: 'Protecting capital, managing emotions, and how professionals explain risk.',
    slugs: ['risk-management-fundamentals', 'trading-psychology', 'commodity-participants'],
  },
]

interface Step {
  icon: LucideIcon
  kicker: string
  title: string
  text: string
  points: string[]
}

const journey: Step[] = [
  {
    icon: UserPlus,
    kicker: 'Step 1',
    title: 'Create your account and enrol',
    text: 'Sign up free, then enrol in any course with one click. Every course is free.',
    points: ['Enrolled courses appear on your dashboard', 'Save courses to study later', 'Start with Foundations if you are new'],
  },
  {
    icon: BookOpenCheck,
    kicker: 'Step 2',
    title: 'Work through each chapter',
    text: 'Each course is split into short lessons. Mark a lesson complete and your progress updates straight away.',
    points: ['Progress bar for every course', 'Private notes beside each lesson', 'Download lesson notes as a PDF'],
  },
  {
    icon: Award,
    kicker: 'Step 3',
    title: 'Pass the quiz and earn your certificate',
    text: `Finish every lesson and score ${PASSING_SCORE}% or more on the course quiz to complete it. You can review your answers and retake it.`,
    points: ['Certificate issued to your account', 'Print it or save it as a PDF', 'Your dashboard suggests what to study next'],
  },
]

export function LearningPathPage() {
  const { courses } = useAcademy()
  const { user } = useAuth()
  const titleFor = (slug: string) => courses.find((item) => item.slug === slug && item.status === 'published')

  return (
    <div>
      <Seo title="Learning path" description={`How learning works at ${APP_NAME}: enrol, study each chapter, earn your certificate, then trade with mentor guidance on ${APP_SHORT_NAME}.`} />
      <PhotoBanner
        image={media.study}
        alt="A study table prepared for a structured learning path"
        eyebrow="Your learning journey"
        title="From your first lesson to the live market"
        text="Here is what happens at each step, from creating your account to trading on the Sigma FX platform with a mentor's guidance."
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <ol className="relative space-y-10 sm:space-y-14">
          <span aria-hidden className="absolute top-2 bottom-2 left-[1.375rem] w-0.5 bg-gradient-to-b from-baazex via-bright to-baazex/20 sm:left-[1.875rem]" />
          {journey.map((step, index) => (
            <li key={step.title} className="relative pl-16 sm:pl-24">
              <Reveal delay={index * 60}>
                <span className="absolute top-0 left-0 grid h-11 w-11 place-items-center rounded-2xl bg-baazex text-on-button shadow-float sm:h-15 sm:w-15">
                  <step.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <p className="text-xs font-bold tracking-[0.16em] text-accent uppercase">{step.kicker}</p>
                <h2 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">{step.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{step.text}</p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                  {step.points.map((point) => (
                    <li key={point} className="rounded-xl border border-line bg-white px-3 py-2.5 text-sm text-ink">
                      {point}
                    </li>
                  ))}
                </ul>
                {index === 0 ? (
                  <StepCta to={user ? '/courses' : '/register'} label={user ? 'Choose a course' : 'Create Free Account'} />
                ) : null}
              </Reveal>
            </li>
          ))}

          <li className="relative pl-16 sm:pl-24">
            <Reveal>
              <span className="absolute top-0 left-0 grid h-11 w-11 place-items-center rounded-2xl bg-navy text-bright shadow-float sm:h-15 sm:w-15">
                <CandlestickChart className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <p className="text-xs font-bold tracking-[0.16em] text-accent uppercase">What you will study</p>
              <h2 className="mt-1 text-xl font-semibold text-ink sm:text-2xl">Four stages, in a sensible order</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                This order is a recommendation, not a rule. You can enrol in any course at any time.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {curriculum.map((stage, index) => {
                  const ready = stage.slugs.map(titleFor).filter((item) => item !== undefined)
                  return (
                    <article key={stage.title} className="panel rounded-2xl p-4">
                      <p className="text-[11px] font-bold tracking-[0.16em] text-muted uppercase">Stage {index + 1}</p>
                      <h3 className="mt-1 font-semibold text-ink">{stage.title}</h3>
                      <p className="mt-1 text-sm text-muted">{stage.text}</p>
                      {ready.length ? (
                        <ul className="mt-3 space-y-1">
                          {ready.map((course) => (
                            <li key={course.id}>
                              <Link to={`/courses/${course.slug}`} className="text-sm font-medium text-accent hover:underline">
                                {course.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 text-sm font-medium text-muted">Coming soon</p>
                      )}
                    </article>
                  )
                })}
              </div>
              <StepCta to="/courses" label="View Courses" />
            </Reveal>
          </li>

          <li className="relative pl-16 sm:pl-24">
            <Reveal>
              <span className="absolute top-0 left-0 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-baazex to-bright text-white shadow-float sm:h-15 sm:w-15">
                <Users className="h-5 w-5 sm:h-6 sm:w-6" />
              </span>
              <div className="rounded-3xl bg-navy p-6 text-mist sm:p-8">
                <p className="text-xs font-bold tracking-[0.16em] text-bright uppercase">After your courses</p>
                <h2 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Trade with confidence on {APP_SHORT_NAME}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mist/85 sm:text-base">
                  When you are ready to move from study to the live market, you can open an account on the {APP_SHORT_NAME} trading platform. You get dedicated mentor guidance and support while you put what you learned into practice.
                </p>
                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-mist/70">
                  Mentors offer guidance and support. They do not provide signals or trade calls. Trading involves risk, and every decision is your own.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {BRAND.platformUrl ? (
                    <a
                      href={BRAND.platformUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-baazex px-5 text-sm font-semibold text-on-button hover:bg-baazex-600"
                    >
                      Visit the {APP_SHORT_NAME} platform <ArrowRight className="h-4 w-4" />
                    </a>
                  ) : null}
                  <Link
                    to={user ? '/courses' : '/register'}
                    className={
                      BRAND.platformUrl
                        ? 'inline-flex h-11 items-center justify-center rounded-xl border border-white/25 px-5 text-sm font-semibold text-white hover:bg-white/10'
                        : 'inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-baazex px-5 text-sm font-semibold text-on-button hover:bg-baazex-600'
                    }
                  >
                    {user ? 'Continue learning' : 'Create Free Account'}
                  </Link>
                </div>
              </div>
            </Reveal>
          </li>
        </ol>
      </div>
    </div>
  )
}

function StepCta({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  )
}
