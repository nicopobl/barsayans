import { notFound } from 'next/navigation';
import { ArrowLeft, Target, Clock, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { VideoPlayer } from '@/modules/courses/presentation/components/video-player';
import { GetCourseByIdUseCase } from '@/modules/courses/application/get-course-by-id.use-case';
import { CheckCourseAccessUseCase } from '@/modules/courses/application/check-course-access.use-case';
import { FirestoreCourseRepository } from '@/modules/courses/infrastructure/firestore-course.repository';
import { DynamoDBAccessService } from '@/modules/courses/infrastructure/dynamodb-access.service';
import { FirestoreSubscriptionRepository } from '@/modules/subscriptions/infrastructure/firestore-subscription.repository';
import { getCurrentUserId } from '@/lib/auth';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;

  // Inicializar dependencias
  const courseRepository = new FirestoreCourseRepository();
  const subscriptionRepository = new FirestoreSubscriptionRepository();
  const accessService = new DynamoDBAccessService(subscriptionRepository);
  
  // Inicializar casos de uso
  const getCourseByIdUseCase = new GetCourseByIdUseCase(courseRepository);
  const checkCourseAccessUseCase = new CheckCourseAccessUseCase(accessService);

  // Obtener curso
  const course = await getCourseByIdUseCase.execute(id);

  if (!course) {
    notFound();
  }

  // Obtener userId de la sesión de autenticación
  const userId = await getCurrentUserId();

  // Verificar acceso en DynamoDB (solo si hay sesión)
  const hasAccess = userId ? await checkCourseAccessUseCase.execute(id, userId) : false;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header con navegación */}
      <header className="border-b border-zinc-900 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-accent transition-colors uppercase text-sm font-black tracking-tighter"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Cursos
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Video Player Section */}
        <section className="mb-12">
          <VideoPlayer
            videoUrl={course.videoUrl}
            hasAccess={hasAccess}
            courseId={course.id}
            coursePrice={course.price}
          />
        </section>

        {/* Course Info Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="bg-black px-4 py-2 text-xs font-black uppercase tracking-tighter border border-brand-accent text-brand-accent">
                  {course.level}
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black uppercase italic mb-6 tracking-tighter leading-tight">
                {course.title}
              </h1>
              <p className="text-zinc-300 text-xl leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Course Details */}
            <div className="border-t border-zinc-900 pt-12">
              <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Sobre este curso</h2>
              <div className="space-y-6 text-zinc-300 text-lg leading-relaxed">
                <p>
                  Este curso está diseñado para llevarte desde los fundamentos hasta la maestría en calistenia.
                  Cada lección está estructurada para maximizar tu progreso y minimizar el riesgo de lesiones.
                </p>
                <p>
                  Incluye protocolos de entrenamiento probados, análisis técnico detallado y progresiones
                  adaptadas a tu nivel actual.
                </p>
              </div>
            </div>

            {/* Curriculum Placeholder */}
            <div className="border-t border-zinc-900 pt-12">
              <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tighter">Contenido del Curso</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((lesson) => (
                  <div
                    key={lesson}
                    className="bg-zinc-950 border border-zinc-900 p-6 flex items-center justify-between hover:border-brand-accent/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.05)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-black border border-zinc-800 flex items-center justify-center text-sm font-black">
                        {lesson}
                      </div>
                      <div>
                        <h3 className="font-black uppercase text-sm tracking-tighter">Lección {lesson}</h3>
                        <p className="text-zinc-500 text-xs">Contenido premium</p>
                      </div>
                    </div>
                    {!hasAccess && (
                      <Lock className="w-5 h-5 text-zinc-800" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-950 border border-zinc-900 p-8 sticky top-24">
              <div className="space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-black mb-2">
                    ${course.price.toLocaleString('es-CL')}
                  </div>
                  <p className="text-zinc-500 text-sm uppercase tracking-wider">
                    Pago único
                  </p>
                </div>

                {/* CTA Button */}
                {!hasAccess ? (
                  <Link
                    href={`/checkout?course=${course.id}`}
                    className="block w-full bg-brand-accent text-black px-8 py-5 text-center text-sm font-black uppercase tracking-tighter hover:bg-brand-accent/90 transition-all duration-300 border-2 border-brand-accent hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                  >
                    Comprar Ahora
                  </Link>
                ) : (
                  <div className="block w-full bg-green-500/10 border-2 border-green-500 text-green-500 px-8 py-5 text-center text-sm font-black uppercase tracking-tighter">
                    Acceso Activo
                  </div>
                )}

                {/* Course Stats */}
                <div className="border-t border-zinc-900 pt-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <Target className="w-5 h-5 text-brand-accent" />
                    <div>
                      <div className="font-black text-sm uppercase tracking-tighter">Nivel {course.level}</div>
                      <div className="text-zinc-500 text-xs">Dificultad</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-brand-accent" />
                    <div>
                      <div className="font-black text-sm uppercase tracking-tighter">5+ Horas</div>
                      <div className="text-zinc-500 text-xs">Contenido</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Users className="w-5 h-5 text-brand-accent" />
                    <div>
                      <div className="font-black text-sm uppercase tracking-tighter">Acceso Vitalicio</div>
                      <div className="text-zinc-500 text-xs">Sin límites</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
