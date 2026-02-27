import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { CreateCourseUseCase } from '@/modules/courses/application/create-course.use-case';
import { UpdateCourseUseCase } from '@/modules/courses/application/update-course.use-case';
import { DynamoDBCourseRepository } from '@/modules/courses/infrastructure/dynamodb-course.repository';

// Verificar que el usuario es admin
async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return false;
  }
  
  const adminEmails = (process.env.ADMIN_EMAILS?.split(',') || []).map(email => email.trim().toLowerCase());
  return adminEmails.includes(user.email.toLowerCase());
}

export async function GET() {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const courseRepository = new DynamoDBCourseRepository();
    const courses = await courseRepository.getAll();

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, price, thumbnail, level, videoUrl, videoKey } = body;

    if (!title || !description || !price || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const courseRepository = new DynamoDBCourseRepository();
    const createCourseUseCase = new CreateCourseUseCase(courseRepository);

    const course = await createCourseUseCase.execute({
      title,
      description,
      price: Number(price),
      thumbnail: thumbnail || '',
      level,
      videoUrl,
      videoKey,
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, description, price, thumbnail, level, videoUrl, videoKey } = body;

    if (!id || !title || !description || !price || !level) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const courseRepository = new DynamoDBCourseRepository();
    const updateCourseUseCase = new UpdateCourseUseCase(courseRepository);

    await updateCourseUseCase.execute({
      id,
      title,
      description,
      price: Number(price),
      thumbnail,
      level,
      videoUrl,
      videoKey,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}
