import { DifficultyBadge } from '@/components/ui/DifficultyBadge'
import { courseCover } from '@/data/media'
import type { Category } from '@/types'
import { cn } from '@/utils/cn'
import { Link } from 'react-router-dom'

export function CategoryCard({
  category,
  lessonCount,
}: {
  category: Category
  lessonCount: number
}) {
  const comingSoon = lessonCount === 0
  const body = (
    <>
      <div className="relative h-36 overflow-hidden">
        <img
          src={courseCover(category.id)}
          alt=""
          className={cn('h-full w-full object-cover transition duration-500', comingSoon ? 'grayscale-[60%]' : 'group-hover:scale-105')}
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/20 to-transparent" />
        {comingSoon ? (
          <span className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-navy uppercase">
            Coming soon
          </span>
        ) : null}
        <h3 className="absolute inset-x-4 bottom-4 text-lg font-semibold text-white">{category.name}</h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex-1 text-sm leading-relaxed text-muted">{category.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
          <DifficultyBadge level={category.difficulty} />
          {comingSoon ? (
            <span className="text-muted">Lessons are being prepared</span>
          ) : (
            <>
              <span className="text-muted">{lessonCount} lessons</span>
              <span className="text-muted">·</span>
              <span className="text-muted">{category.estimatedHours}h estimated</span>
            </>
          )}
        </div>
      </div>
    </>
  )

  if (comingSoon) {
    return <div className="panel flex h-full flex-col overflow-hidden rounded-2xl opacity-90" aria-label={`${category.name}, coming soon`}>{body}</div>
  }

  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group panel flex h-full flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-float"
    >
      {body}
    </Link>
  )
}
