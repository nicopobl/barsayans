import { Course } from '../domain/course.entity';
import { CourseRepository } from '../domain/course.repository';

export class UpdateCourseUseCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(course: Course): Promise<void> {
    // Verificar que el curso existe
    const existingCourse = await this.courseRepository.getById(course.id);
    if (!existingCourse) {
      throw new Error(`Course with id ${course.id} not found`);
    }

    await this.courseRepository.update(course);
  }
}
