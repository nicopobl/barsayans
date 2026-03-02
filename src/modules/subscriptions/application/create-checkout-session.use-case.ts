import { PaymentService } from '../domain/payment.service';
import { CourseRepository } from '@/modules/courses/domain/course.repository';

export class CreateCheckoutSessionUseCase {
  constructor(
    private paymentService: PaymentService,
    private courseRepository: CourseRepository
  ) {}

  async execute(userId: string, courseId: string): Promise<string> {
    // Obtener el curso para obtener el precio
    const course = await this.courseRepository.getById(courseId);
    if (!course) {
      throw new Error(`Course with id ${courseId} not found`);
    }

    // Crear sesión de checkout (Preference en Mercado Pago)
    const checkoutUrl = await this.paymentService.createCheckoutSession(
      userId,
      courseId,
      course.price,
      course.title
    );

    return checkoutUrl;
  }
}
