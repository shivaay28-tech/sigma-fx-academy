import { CourseCard } from '@/components/course/CourseCard'
import { Seo } from '@/components/Seo'
import { PhotoBanner } from '@/components/ui/PhotoBanner'
import { courseCover } from '@/data/media'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAcademy } from '@/context/AcademyContext'
import { categories } from '@/data/categories'
import { BookOpen } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

export function CategoryDetailPage() {
  const { slug } = useParams()
  const { courses } = useAcademy()
  const category = categories.find((item) => item.slug === slug)
  const matches = courses.filter((course) => course.categoryId === category?.id && course.status === 'published')

  if (!category) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={BookOpen} title="Category not found" description="That category is not in the current catalogue." />
      </div>
    )
  }

  return (
    <div>
      <Seo title={category.name} description={category.description} />
      <PhotoBanner image={courseCover(category.id)} alt="" eyebrow="Category" title={category.name} text={category.description} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to="/categories" className="text-sm font-semibold text-accent">
        All categories
      </Link>
      {matches.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {matches.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={BookOpen}
            title="Coming soon"
            description={`Lessons for ${category.name} are being prepared. In the meantime, explore the courses that are ready now.`}
            action={
              <Link to="/courses" className="inline-flex h-10 items-center rounded-xl bg-baazex px-4 text-sm font-semibold text-on-button">
                Explore all courses
              </Link>
            }
          />
        </div>
      )}
      </div>
    </div>
  )
}
