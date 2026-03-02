import { FirestoreCourseRepository } from "@/modules/courses/infrastructure/firestore-course.repository";
import { Dumbbell, Zap, Target } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const courseRepository = new FirestoreCourseRepository();
  const courses = await courseRepository.getAll();

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden border-b border-zinc-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=1200" 
            className="w-full h-full object-cover grayscale contrast-150 brightness-[0.3] scale-110" 
            alt="Barsayans Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_black_70%)]" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <h1 className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-black italic tracking-[-0.02em] uppercase mb-8 leading-[0.9]">
            <span className="block">BARSAYANS</span>
            <span className="text-brand-accent">.</span>
            <span className="block">ACADEMY</span>
          </h1>
          <div className="h-[2px] w-32 bg-brand-accent mx-auto mb-8" />
          <p className="text-xl sm:text-2xl md:text-4xl font-black text-white max-w-4xl mx-auto uppercase tracking-[0.15em] leading-tight">
            ELITE CALISTHENICS
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto py-24 px-6 sm:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase italic mb-6 tracking-[-0.02em]">
            CURSOS DISPONIBLES
          </h2>
          <div className="h-[1px] w-24 bg-brand-accent mx-auto mb-6" />
          <p className="text-xl text-zinc-500 uppercase tracking-[0.1em] font-medium">
            Aprende a dominar tu peso corporal
          </p>
        </div>

        <div className="space-y-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group border border-zinc-950 hover:border-brand-accent transition-all duration-300 block bg-black overflow-hidden flex"
            >
              <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden bg-black">
                <img 
                  src={course.thumbnail} 
                  className="object-cover w-full h-full grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-500" 
                  alt={course.title}
                />
                <div className="absolute top-3 left-3 bg-black/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-tighter border border-brand-accent text-brand-accent">
                  {course.level}
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-black uppercase mb-3 group-hover:text-brand-accent transition-colors italic tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-950">
                  <span className="text-2xl font-black">${course.price.toLocaleString('es-CL')}</span>
                  <span className="bg-white text-black px-5 py-2.5 text-xs font-black uppercase group-hover:bg-brand-accent transition-colors inline-block tracking-tighter">
                    Ver Programa
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}