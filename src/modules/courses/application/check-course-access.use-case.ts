import { AccessService } from '../domain/access.service';

export class CheckCourseAccessUseCase {
  constructor(private accessService: AccessService) {}

  async execute(courseId: string, userId?: string): Promise<boolean> {
    return this.accessService.hasAccess(courseId, userId);
  }
}
