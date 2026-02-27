import { notFound } from 'next/navigation';
import { ArrowLeft, Target, Clock, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { VideoPlayer } from '@/modules/courses/presentation/components/video-player';
import { GetCourseByIdUseCase } from '@/modules/courses/application/get-course-by-id.use-case';
import { CheckCourseAccessUseCase } from '@/modules/courses/application/check-course-access.use-case';
import { MockCourseRepository } from '@/modules/courses/infrastructure/mock-course.repository';
import { DynamoDBAccessService } from '@/modules/courses/infrastructure/dynamodb-access.service';
import { DynamoDBSubscriptionRepository } from '@/modules/subscriptions/infrastructure/dynamodb-subscription.repository';
import { getCurrentUserId } from '@/lib/auth';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;

  // Inicializar dependencias
  const courseRepository = new MockCourseRepository();
  const subscriptionRepository = new DynamoDBSubscriptionRepository();
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
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-yellow-500 transition-colors uppercase text-sm font-bold tracking-tighter"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Cursos
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
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
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Badge */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-black/80 px-3 py-1 text-xs font-bold uppercase tracking-tighter border border-yellow-500 text-yellow-500">
                  {course.level}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-4">
                {course.title}
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Course Details */}
            <div className="border-t border-zinc-800 pt-8">
              <h2 className="text-2xl font-bold uppercase italic mb-6">Sobre este curso</h2>
              <div className="space-y-4 text-zinc-300">
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
            <div className="border-t border-zinc-800 pt-8">
              <h2 className="text-2xl font-bold uppercase italic mb-6">Contenido del Curso</h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((lesson) => (
                  <div
                    key={lesson}
                    className="bg-zinc-900 border border-zinc-800 p-4 flex items-center justify-between hover:border-yellow-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-bold">
                        {lesson}
                      </div>
                      <div>
                        <h3 className="font-bold uppercase text-sm">Lección {lesson}</h3>
                        <p className="text-zinc-500 text-xs">Contenido premium</p>
                      </div>
                    </div>
                    {!hasAccess && (
                      <Lock className="w-5 h-5 text-zinc-700" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-900 border border-zinc-800 p-6 sticky top-24">
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
                    className="block w-full bg-yellow-500 text-black px-6 py-4 text-center text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-white"
                  >
                    Comprar Ahora
                  </Link>
                ) : (
                  <div className="block w-full bg-green-500/20 border-2 border-green-500 text-green-500 px-6 py-4 text-center text-sm font-black uppercase tracking-tighter">
                    Acceso Activo
                  </div>
                )}

                {/* Course Stats */}
                <div className="border-t border-zinc-800 pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-bold text-sm uppercase">Nivel {course.level}</div>
                      <div className="text-zinc-500 text-xs">Dificultad</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-bold text-sm uppercase">5+ Horas</div>
                      <div className="text-zinc-500 text-xs">Contenido</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-yellow-500" />
                    <div>
                      <div className="font-bold text-sm uppercase">Acceso Vitalicio</div>
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
