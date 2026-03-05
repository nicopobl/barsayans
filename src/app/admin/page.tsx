import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Video, DollarSign } from 'lucide-react';
import { FirestoreCourseRepository } from '@/modules/courses/infrastructure/firestore-course.repository';

async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return false;
  }
  
  const adminEmails = (process.env.ADMIN_EMAILS?.split(',') || []).map(email => email.trim().toLowerCase());
  return adminEmails.includes(user.email.toLowerCase());
}

export default async function AdminDashboard() {
  if (!(await verifyAdmin())) {
    redirect('/auth/unauthorized');
  }

  const courseRepository = new FirestoreCourseRepository();
  const courses = await courseRepository.getAll();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase italic">
            Admin<span className="text-yellow-500">.</span>Panel
          </h1>
          <Link
            href="/"
            className="text-zinc-400 hover:text-yellow-500 transition-colors uppercase text-sm font-bold tracking-tighter"
          >
            Volver al Sitio
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold uppercase italic">Cursos</h2>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors border-2 border-transparent hover:border-white"
          >
            <Plus className="w-4 h-4" />
            Nuevo Curso
          </Link>
        </div>

        {/* Courses Table */}
        {courses.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 p-12 text-center rounded-sm">
            <p className="text-zinc-400 uppercase tracking-wider mb-4">
              No hay cursos registrados
            </p>
            <Link
              href="/admin/courses/new"
              className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 text-sm font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Crear Primer Curso
            </Link>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-zinc-800 border-b border-zinc-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-tighter text-zinc-400">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-tighter text-zinc-400">
                    Nivel
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-tighter text-zinc-400">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-tighter text-zinc-400">
                    Video
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-tighter text-zinc-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold uppercase text-sm">{course.title}</div>
                      <div className="text-zinc-500 text-xs mt-1 line-clamp-1">
                        {course.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-black/80 px-3 py-1 text-xs font-bold uppercase tracking-tighter border border-yellow-500 text-yellow-500">
                        {course.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-yellow-500" />
                        <span className="font-black">
                          ${course.price.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {course.videoKey ? (
                        <div className="flex items-center gap-2 text-green-500">
                          <Video className="w-4 h-4" />
                          <span className="text-xs uppercase">Subido</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Video className="w-4 h-4" />
                          <span className="text-xs uppercase">Pendiente</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/courses/${course.id}/edit`}
                        className="inline-flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 text-xs font-bold uppercase tracking-tighter transition-colors border border-zinc-700"
                      >
                        <Edit className="w-3 h-3" />
                        Editar
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
