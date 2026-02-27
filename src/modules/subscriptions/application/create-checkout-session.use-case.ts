import { StripeService } from '../domain/stripe.service';
import { CourseRepository } from '@/modules/courses/domain/course.repository';

export class CreateCheckoutSessionUseCase {
  constructor(
    private stripeService: StripeService,
    private courseRepository: CourseRepository
  ) {}

  async execute(userId: string, courseId: string): Promise<string> {
    // Obtener el curso para obtener el precio
    const course = await this.courseRepository.getById(courseId);
    if (!course) {
      throw new Error(`Course with id ${courseId} not found`);
    }

    // Crear sesión de checkout en Stripe
    const checkoutUrl = await this.stripeService.createCheckoutSession(
      userId,
      courseId,
      course.price,
      course.title
    );

    return checkoutUrl;
  }
}
