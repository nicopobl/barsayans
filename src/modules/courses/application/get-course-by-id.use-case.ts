import { Course } from '../domain/course.entity';
import { CourseRepository } from '../domain/course.repository';

export class GetCourseByIdUseCase {
  constructor(private courseRepository: CourseRepository) {}

  async execute(courseId: string): Promise<Course | null> {
    return this.courseRepository.getById(courseId);
  }
}
