import { Course } from '../domain/course.entity';
import { CourseRepository } from '../domain/course.repository';

export class CreateCourseUseCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(courseData: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
    // Generar ID si no se proporciona
    const id = courseData.id || this.generateCourseId(courseData.title);
    
    const course: Course = {
      id,
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      thumbnail: courseData.thumbnail,
      level: courseData.level,
      videoUrl: courseData.videoUrl,
      videoKey: courseData.videoKey,
    };

    await this.courseRepository.create(course);
    return course;
  }

  private generateCourseId(title: string): string {
    // Generar ID basado en el título: "EL CAMINO A LA PLANCHE" -> "planche-001"
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 20);
    
    const timestamp = Date.now().toString().slice(-6);
    return `${slug}-${timestamp}`;
  }
}
