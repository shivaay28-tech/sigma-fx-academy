import { CourseCard } from '@/components/course/CourseCard'
import { Seo } from '@/components/Seo'
import { Button } from '@/components/ui/Button'
import { Disclaimer } from '@/components/ui/Disclaimer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Reveal } from '@/components/ui/Reveal'
import { useAcademy } from '@/context/AcademyContext'
import { useAuth } from '@/context/AuthContext'
import { faqs } from '@/data/faqs'
import { APP_NAME, APP_SHORT_NAME, DISCLAIMER, FREE_QUESTIONS, PASSING_SCORE, POINTS_PER_QUESTION } from '@/utils/constants'
import type { Course } from '@/types'
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Download,
  GraduationCap,
  LineChart,
  ListChecks,
  NotebookPen,
  Search,
  Shield,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const levels = [
  {
    level: 1,
    title: 'Beginner',
    text: 'How MCX works, how gold, silver and crude oil are priced, and how to read an order.',
    items: ['MCX basics', 'Gold, silver, crude oil', 'The trading screen'],
  },
  {
    level: 2,
    title: 'Intermediate',
    text: 'Reading charts, what moves prices, and the maths of lots and margin.',
    items: ['Commodity charts', 'What moves prices', 'Lots and margin'],
  },
  {
    level: 3,
    title: 'Advanced',
    text: 'Trading psychology, risk routines and complete decision checklists.',
    items: ['Trading psychology', 'Risk routines', 'Trading journals'],
  },
]

const why = [
  {
    icon: GraduationCap,
    title: 'A clear order to learn in',
    text: 'Courses build on each other, so you learn the words, the trading screen and risk in a logical sequence instead of from scattered videos.',
  },
  {
    icon: Shield,
    title: 'Risk explained first',
    text: 'Leverage, margin and losses are explained in plain language. Nothing here promises profits.',
  },
  {
    icon: LineChart,
    title: 'Learn the real screen',
    text: 'See how an MCX contract is shown: symbol, expiry, bid and ask, and the order ticket.',
  },
  {
    icon: Award,
    title: 'Progress you can see',
    text: 'Your dashboard tracks courses, completed lessons, quiz results and certificates.',
  },
]

const steps = [
  { icon: UserPlus, title: 'Create a free account', text: 'Sign up with your name, email and mobile number. It takes about a minute.' },
  { icon: BookOpen, title: 'Choose a course', text: 'Start with MCX basics, or pick any course that matches what you want to learn.' },
  { icon: NotebookPen, title: 'Watch the lessons', text: 'Study short lessons, read the notes, and keep your own private notes as you go.' },
  { icon: Award, title: 'Earn your certificate', text: `Pass the course quiz with ${PASSING_SCORE}% or more and receive your certificate.` },
]

const features = [
  { icon: Search, label: 'Search and filter courses' },
  { icon: ListChecks, label: 'Quizzes after every course' },
  { icon: Download, label: 'Downloadable lesson notes' },
  { icon: NotebookPen, label: 'Private notes on each lesson' },
  { icon: Sparkles, label: 'AI study assistant' },
  { icon: Award, label: 'Printable certificates' },
]

function pickShowcase(courses: Course[]) {
  // Up to three published courses from different categories, so each tile has its own image.
  const published = courses.filter((course) => course.status === 'published')
  const ordered = [...published.filter((course) => course.popular), ...published.filter((course) => !course.popular)]
  const picked: Course[] = []
  for (const course of ordered) {
    if (picked.length === 3) break
    if (!picked.some((item) => item.categoryId === course.categoryId)) picked.push(course)
  }
  return picked
}

export function HomePage() {
  const { courses } = useAcademy()
  const { user } = useAuth()
  const showcase = pickShowcase(courses)
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(faqs[0]?.id)
  const freePoints = FREE_QUESTIONS * POINTS_PER_QUESTION

  return (
    <>
      <Seo
        title="Learn to Trade Commodities with Expert Guidance"
        description={`${APP_NAME}: structured courses on gold, silver, crude oil and more, with quizzes, certificates and an AI study assistant. Educational content only.`}
      />

      {/* 1 · Hero */}
      <section className="relative isolate overflow-hidden">
        <img src="/images/hero-person.jpg" alt="" className="absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <div className="absolute inset-0 bg-linear-to-b from-navy/90 via-navy/70 to-navy/50 lg:hidden" />
        <div className="absolute inset-0 hidden bg-linear-to-r from-navy from-[20%] via-navy/45 via-[45%] to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-navy to-transparent" />
        <div className="relative mx-auto flex min-h-[34rem] max-w-7xl items-center px-4 py-16 sm:min-h-[40rem] sm:px-6 sm:py-24 lg:min-h-[44rem]">
          <div className="min-w-0 max-w-xl lg:max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-bright" /> Free courses · Certificates · AI study assistant
            </p>
            <h1 className="display mt-5 text-[2rem] leading-[1.1] font-semibold text-white sm:text-5xl sm:leading-tight lg:text-[64px] lg:leading-[1.02]">
              Learn to Trade Commodities <span className="text-gradient">with Expert Guidance</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-lg">
              Join structured courses on gold, silver, crude oil and more, with an AI study assistant to practise what you learn. Create your free account and start today.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate(user ? '/dashboard' : '/register')} icon={<UserPlus className="h-4 w-4" />}>
                {user ? 'Go to your dashboard' : 'Create Free Account'}
              </Button>
              <Button size="lg" className="w-full sm:w-auto" variant="outline" onClick={() => navigate('/courses')} icon={<BookOpen className="h-4 w-4" />}>
                Explore Courses
              </Button>
            </div>
            <Link to="/engine" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:underline">
              <Sparkles className="h-4 w-4 text-bright" /> Or try the AI Engine
            </Link>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-white/80">{DISCLAIMER}</p>
          </div>
        </div>
      </section>

      {/* 2 · AI Engine */}
      <section className="bg-navy py-12 text-mist sm:py-16">
        <div className="mx-auto grid max-w-7xl min-w-0 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
          <Reveal>
            <p className="text-xs font-bold tracking-[0.18em] text-bright uppercase">AI Engine</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-4xl">An AI study assistant for live markets</h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mist/90">
              Ask about gold, crude oil, Nifty, Bank Nifty and more. The engine reads live TradingView prices and explains the trend, key levels and risk in plain language, so you learn how a setup is built before you place a trade.
            </p>
            <div className="mt-5 max-w-xl rounded-2xl border border-white/15 bg-white/5 p-4 text-sm leading-relaxed text-mist/90">
              <p className="font-semibold text-white">How credits work</p>
              <p className="mt-1">
                Your account starts with {freePoints} points: {FREE_QUESTIONS} free questions, at {POINTS_PER_QUESTION} points each. A {APP_SHORT_NAME} deposit adds points worth 15% of the amount. For example, ₹1,000 adds 150 points, enough for 15 more questions.
              </p>
            </div>
            <Button className="mt-6" size="lg" onClick={() => navigate('/engine')} icon={<Sparkles className="h-4 w-4" />}>
              Try the AI Engine
            </Button>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 sm:p-6">
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-baazex px-4 py-3 text-sm text-on-button">How is gold looking today?</div>
              <div className="mt-3 max-w-[92%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm leading-relaxed text-ink">
                <p className="font-semibold">GOLD — MCX Gold</p>
                <p className="mt-1 text-muted">The engine shows the last TradingView price, today's change and range, then walks through the trend, the level that would prove the idea wrong, and the risk to size for.</p>
                <p className="mt-2 text-[11px] font-semibold text-accent">Study example · not a trade instruction</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {['Ask about any market', 'Upload a chart', 'Share your screen', "Today's brief"].map((item) => (
                  <p key={item} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-mist">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3 · Courses (single section) */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading kicker="Courses" title="Start with a clear foundation" text="Free, self-paced courses on MCX commodities, charts, risk and trading psychology." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((course, index) => (
            <Reveal key={course.id} delay={index * 80}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/courses')} icon={<BookOpen className="h-4 w-4" />}>
            Explore All Courses
          </Button>
          {user ? null : (
            <Button size="lg" variant="secondary" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
              Create an Account to Enrol
            </Button>
          )}
        </div>
      </section>

      {/* 4 · Learning levels */}
      <section className="relative overflow-hidden bg-linear-to-b from-baazex/[0.06] to-transparent py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading kicker="Learning levels" title="A path that grows with your knowledge" />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {levels.map((level, index) => (
              <Reveal key={level.title} delay={index * 80}>
                <article className="relative h-full overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card">
                  <span aria-hidden className="absolute -top-6 -right-2 font-serif text-[7rem] leading-none font-semibold text-baazex/[0.07]">
                    {level.level}
                  </span>
                  <div className="flex gap-1.5" aria-hidden>
                    {[1, 2, 3].map((bar) => (
                      <span key={bar} className={`h-1.5 w-8 rounded-full ${bar <= level.level ? 'bg-baazex' : 'bg-line'}`} />
                    ))}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{level.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{level.text}</p>
                  <ul className="mt-5 space-y-2.5">
                    {level.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm font-medium text-ink">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
          <AccountCta signedIn={Boolean(user)} />
        </div>
      </section>

      {/* 5 · Why */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading kicker={`Why ${APP_NAME}`} title={`Why learn with ${APP_SHORT_NAME}?`} />
        <div className="mt-8 grid gap-4 md:grid-cols-3 md:grid-rows-2">
          {why.map((item, index) => (
            <Reveal key={item.title} delay={index * 60} className={index === 0 ? 'md:row-span-2' : index === 3 ? 'md:col-span-2' : ''}>
              <article
                className={
                  index === 0
                    ? 'flex h-full flex-col justify-between rounded-3xl bg-navy p-6 text-mist shadow-float sm:p-8'
                    : 'flex h-full gap-4 rounded-3xl border border-line bg-white p-6 shadow-card'
                }
              >
                <span
                  className={
                    index === 0
                      ? 'grid h-14 w-14 place-items-center rounded-2xl bg-baazex text-on-button'
                      : 'grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-baazex/15 text-accent'
                  }
                >
                  <item.icon className={index === 0 ? 'h-6 w-6' : 'h-5 w-5'} />
                </span>
                <div className={index === 0 ? 'mt-10' : ''}>
                  <h3 className={index === 0 ? 'text-2xl font-semibold text-white' : 'text-lg font-semibold text-ink'}>{item.title}</h3>
                  <p className={index === 0 ? 'mt-3 text-[15px] leading-relaxed text-mist/90' : 'mt-1.5 text-sm leading-relaxed text-muted'}>{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <AccountCta signedIn={Boolean(user)} />
      </section>

      {/* 6 · How it works */}
      <section className="bg-navy py-12 text-mist sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading kicker="How it works" title="Four steps from account to certificate" light />
          <ol className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
            <span aria-hidden className="absolute top-6 right-[12.5%] left-[12.5%] hidden h-0.5 bg-linear-to-r from-baazex via-bright to-baazex md:block" />
            <span aria-hidden className="absolute top-6 bottom-6 left-6 w-0.5 bg-linear-to-b from-baazex via-bright to-baazex/30 md:hidden" />
            {steps.map((item, index) => (
              <li key={item.title} className="relative pl-16 md:pl-0 md:text-center">
                <Reveal delay={index * 100}>
                  <span className="absolute top-0 left-0 grid h-12 w-12 place-items-center rounded-full border-4 border-navy bg-baazex text-on-button shadow-float md:relative md:mx-auto">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-bold tracking-[0.16em] text-bright uppercase md:mt-4">Step {index + 1}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist/85">{item.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <AccountCta signedIn={Boolean(user)} light />
        </div>
      </section>

      {/* 7 · Platform features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              kicker="Platform features"
              title="Everything you need to learn, in one place"
              text="Search courses, take quizzes, download lesson notes, and track your progress as you go. Earn a certificate when you finish."
            />
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <li key={feature.label} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-3 text-sm font-medium text-ink">
                  <feature.icon className="h-4 w-4 shrink-0 text-accent" />
                  {feature.label}
                </li>
              ))}
            </ul>
            <AccountCta signedIn={Boolean(user)} />
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-3xl border border-line bg-white p-6 shadow-float sm:p-8">
              <p className="text-xs font-bold tracking-[0.16em] text-accent uppercase">Your dashboard</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Track your learning</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                After you sign up, your dashboard shows the courses you have started, how far you have got, and what to study next.
              </p>
              <div className="mt-6 space-y-4">
                <ProgressBar value={72} label="Introduction to MCX" />
                <ProgressBar value={40} label="MCX Gold, Silver, Crude, and Copper" />
                <ProgressBar value={18} label="NSC and MCX" />
              </div>
              <p className="mt-4 text-[11px] text-muted">Example progress for illustration.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8 · FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeading kicker="FAQ" title="Frequently asked questions" />
        <div className="mt-8 space-y-3">
          {faqs.slice(0, 5).map((item) => {
            const open = openFaq === item.id
            return (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                <button
                  type="button"
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold text-ink sm:px-5"
                  onClick={() => setOpenFaq((current) => (current === item.id ? undefined : item.id))}
                >
                  {item.question}
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition ${open ? 'rotate-180' : ''}`} />
                </button>
                {open ? <p className="px-4 pb-5 text-sm leading-relaxed text-muted sm:px-5">{item.answer}</p> : null}
              </article>
            )
          })}
        </div>
        <div className="mt-4 text-center">
          <Link to="/faq" className="text-sm font-semibold text-accent">
            View all questions
          </Link>
        </div>
      </section>

      {/* 9 · Closing CTA */}
      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="gradient-hero mx-auto max-w-7xl overflow-hidden rounded-3xl px-5 py-10 text-center sm:px-6 sm:py-14">
          <h2 className="text-2xl font-semibold text-white sm:text-4xl">Start your trading education today</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85">
            Follow a structured, free curriculum at your own pace. Education first. No profit claims. No personal investment advice.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate(user ? '/dashboard' : '/register')}>
              {user ? 'Go to your dashboard' : 'Create Free Account'}
            </Button>
            <Button size="lg" className="w-full sm:w-auto" variant="outline" onClick={() => navigate('/courses')}>
              Explore Courses
            </Button>
          </div>
          <Disclaimer className="mx-auto mt-8 max-w-3xl text-white/75" compact />
        </div>
      </section>
    </>
  )
}

function AccountCta({ signedIn, light = false }: { signedIn: boolean; light?: boolean }) {
  return (
    <div className="mt-8">
      <Link
        to={signedIn ? '/courses' : '/register'}
        className={
          light
            ? 'inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-navy hover:bg-mist'
            : 'inline-flex h-11 items-center gap-2 rounded-xl bg-baazex px-5 text-sm font-semibold text-on-button shadow-float hover:bg-baazex-600'
        }
      >
        {signedIn ? 'View Courses' : 'Create Free Account'} <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

function SectionHeading({ kicker, title, text, light }: { kicker: string; title: string; text?: string; light?: boolean }): ReactNode {
  return (
    <div>
      <p className={`text-xs font-bold tracking-[0.18em] uppercase ${light ? 'text-bright' : 'text-accent'}`}>{kicker}</p>
      <h2 className={`mt-2 text-2xl font-semibold tracking-tight sm:text-3xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {text ? <p className={`mt-3 max-w-2xl text-[15px] leading-relaxed ${light ? 'text-mist/85' : 'text-muted'}`}>{text}</p> : null}
    </div>
  )
}
