import { NextRequest, NextResponse } from 'next/server';
import { CreateCheckoutSessionUseCase } from '@/modules/subscriptions/application/create-checkout-session.use-case';
import { StripeServiceImpl } from '@/modules/subscriptions/infrastructure/stripe.service';
import { MockCourseRepository } from '@/modules/courses/infrastructure/mock-course.repository';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: 'courseId is required' },
        { status: 400 }
      );
    }

    // Obtener userId de la sesión de autenticación
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Inicializar dependencias
    const stripeService = new StripeServiceImpl();
    const courseRepository = new MockCourseRepository();
    const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(
      stripeService,
      courseRepository
    );

    // Crear sesión de checkout
    const checkoutUrl = await createCheckoutSessionUseCase.execute(
      userId,
      courseId
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
