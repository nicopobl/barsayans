import { mockCourseRepository } from "@/modules/courses/infrastructure/mock-course.repository";
import { Dumbbell, Zap, Target } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const courses = await mockCourseRepository.getAll();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=1200" 
            className="w-full h-full object-cover" 
            alt="Barsayans Background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-4">
            Barsayans<span className="text-yellow-500">.</span>Academy
          </h1>
          <p className="text-xl md:text-2xl font-light text-zinc-400 max-w-2xl mx-auto uppercase tracking-widest">
            Entrenamiento de élite para atletas de calle
          </p>
        </div>
      </section>

      {/* Course Grid */}
      <section className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex items-center gap-4 mb-12">
          <h2 className="text-3xl font-bold uppercase italic">Cursos Disponibles</h2>
          <div className="h-[2px] flex-1 bg-yellow-500/20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-sm hover:border-yellow-500 transition-all duration-300 block"
            >
              <div className="aspect-video relative overflow-hidden bg-zinc-800">
                <img src={course.thumbnail} className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute top-2 left-2 bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-tighter border border-yellow-500 text-yellow-500">
                  {course.level}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold uppercase mb-2 group-hover:text-yellow-500 transition-colors italic">{course.title}</h3>
                <p className="text-zinc-500 text-sm mb-6 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <span className="text-xl font-black">${course.price.toLocaleString('es-CL')}</span>
                  <span className="bg-white text-black px-4 py-2 text-xs font-bold uppercase group-hover:bg-yellow-500 transition-colors inline-block">
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