import { Course } from './course.entity';

export interface CourseRepository {
  getAll(): Promise<Course[]>;
  getById(id: string): Promise<Course | null>;
  create(course: Course): Promise<void>;
  update(course: Course): Promise<void>;
}
