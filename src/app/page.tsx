import { FirestoreCourseRepository } from "@/modules/courses/infrastructure/firestore-course.repository";
import { CourseImage } from "@/components/features/courses/course-image";
import Link from "next/link";

export default async function Home() {
  const courseRepository = new FirestoreCourseRepository();
  const courses = await courseRepository.getAll();

  return (
    <main className="min-h-screen bg-black text-white antialiased">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=1200"
            className="w-full h-full object-cover grayscale brightness-50"
            alt="Barsayans Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-6xl sm:text-8xl md:text-[9rem] font-black italic tracking-tight uppercase leading-none mb-6">
            <span className="block text-white">BARSAYANS</span>
            <span className="block text-[#EAB308]">ACADEMY</span>
          </h1>
          <div className="h-px w-20 bg-[#EAB308] mx-auto mb-6" />
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.4em]">
            Elite Calisthenics · Street Workout
          </p>
        </div>
      </section>

      {/* ── Courses ──────────────────────────────────────────────────────── */}
      <section id="courses" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Section header */}
          <div className="mb-12 text-center">
            <p className="text-[#EAB308] text-[10px] font-bold uppercase tracking-[0.5em] mb-3">
              Programas
            </p>
            <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tight mb-3">
              Cursos Disponibles
            </h2>
            <p className="text-zinc-600 text-xs uppercase tracking-[0.25em]">
              Aprende a dominar tu peso corporal
            </p>
          </div>

          {/* 3-col grid — wraps naturally as courses are added */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="group flex flex-col bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/80 hover:border-[#EAB308]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/60 text-white"
              >
                {/* Thumbnail — 16:9 with graceful fallback */}
                <div className="relative aspect-video overflow-hidden bg-zinc-800">
                  <CourseImage src={course.thumbnail} alt={course.title} />
                  {course.level && (
                    <span className="absolute top-3 left-3 bg-black/75 text-[#EAB308] text-[9px] font-bold uppercase tracking-[0.25em] px-2 py-1 rounded-md backdrop-blur-sm">
                      {course.level}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-white text-sm uppercase italic tracking-tight leading-snug mb-2 group-hover:text-[#EAB308] transition-colors duration-200">
                    {course.title}
                  </h3>
                  <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 flex-1">
                    {course.description}
                  </p>

                  {/* Footer — price stacked above CTA, no awkward corners */}
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <p className="text-2xl font-black text-white tracking-tight leading-none">
                      ${course.price.toLocaleString("es-CL")}
                      <span className="text-xs text-zinc-600 font-normal ml-1.5">CLP</span>
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-600 uppercase tracking-[0.25em] group-hover:text-[#EAB308] transition-colors duration-200">
                      Ver programa →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}
