import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { GetVideoStreamUrlUseCase } from '@/modules/courses/application/get-video-stream-url.use-case';
import { S3StorageService } from '@/modules/courses/infrastructure/s3-storage.service';
import { DynamoDBAccessService } from '@/modules/courses/infrastructure/dynamodb-access.service';
import { DynamoDBSubscriptionRepository } from '@/modules/subscriptions/infrastructure/dynamodb-subscription.repository';
import { MockCourseRepository } from '@/modules/courses/infrastructure/mock-course.repository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;

    // Obtener userId de la sesión
    const userId = await getCurrentUserId();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Obtener el curso para obtener el videoKey
    const courseRepository = new MockCourseRepository();
    const course = await courseRepository.getById(courseId);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Obtener el videoKey del curso o usar un valor por defecto
    const videoKey = course.videoKey || `courses/${courseId}/video.mp4`;

    // Inicializar servicios
    const storageService = new S3StorageService();
    const subscriptionRepository = new DynamoDBSubscriptionRepository();
    const accessService = new DynamoDBAccessService(subscriptionRepository);
    
    // Inicializar caso de uso
    const getVideoStreamUrlUseCase = new GetVideoStreamUrlUseCase(
      storageService,
      accessService
    );

    // Obtener URL presignada
    const presignedUrl = await getVideoStreamUrlUseCase.execute(
      courseId,
      videoKey,
      userId
    );

    return NextResponse.json({ url: presignedUrl });
  } catch (error) {
    console.error('Error getting video stream URL:', error);
    
    if (error instanceof Error && error.message === 'User does not have access to this course') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get video stream URL' },
      { status: 500 }
    );
  }
}
