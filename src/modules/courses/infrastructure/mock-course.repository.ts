import { Course } from '../domain/course.entity';
import { CourseRepository } from '../domain/course.repository';

const MOCK_COURSES: Course[] = [
  {
    id: 'planche-001',
    title: 'EL CAMINO A LA PLANCHE',
    description: 'Desde lean hollow body hasta Full Planche. Protocolos de fuerza y acondicionamiento de muñecas.',
    price: 45000,
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800',
    level: 'Pro',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder - reemplazar con video real
  },
  {
    id: 'front-002',
    title: 'FRONT LEVER EXPLOSIVO',
    description: 'Domina el tirón y la estática. Progresiones reales sin bandas elásticas.',
    price: 35000,
    thumbnail: 'https://images.unsplash.com/photo-1590239926044-245806f19f96?q=80&w=800',
    level: 'Intermedio',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder - reemplazar con video real
  },
  {
    id: 'basics-003',
    title: 'FUNDAMENTOS BARSAYANS',
    description: 'La base de todo atleta. Dominadas perfectas, fondos profundos y control escapular.',
    price: 25000,
    thumbnail: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=800',
    level: 'Básico',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Placeholder - reemplazar con video real
  }
];

export class MockCourseRepository implements CourseRepository {
  async getAll(): Promise<Course[]> {
    return MOCK_COURSES;
  }

  async getById(id: string): Promise<Course | null> {
    return MOCK_COURSES.find(course => course.id === id) || null;
  }

  async create(course: Course): Promise<void> {
    // Mock: solo agregar a la lista en memoria (no persiste)
    MOCK_COURSES.push(course);
  }

  async update(course: Course): Promise<void> {
    // Mock: actualizar en la lista en memoria
    const index = MOCK_COURSES.findIndex(c => c.id === course.id);
    if (index !== -1) {
      MOCK_COURSES[index] = course;
    }
  }
}

// Export singleton instance for backward compatibility
export const mockCourseRepository = new MockCourseRepository();