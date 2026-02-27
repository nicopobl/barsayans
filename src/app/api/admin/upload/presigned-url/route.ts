import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { S3PresignedPostService } from '@/modules/courses/infrastructure/s3-presigned-post.service';

// Verificar que el usuario es admin
async function verifyAdmin() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return false;
  }
  
  const adminEmails = (process.env.ADMIN_EMAILS?.split(',') || []).map(email => email.trim().toLowerCase());
  return adminEmails.includes(user.email.toLowerCase());
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
    const { courseId, filename, contentType } = body;

    if (!courseId || !filename) {
      return NextResponse.json(
        { error: 'Missing courseId or filename' },
        { status: 400 }
      );
    }

    const presignedPostService = new S3PresignedPostService();
    const videoKey = presignedPostService.generateVideoKey(courseId, filename);
    const presignedData = await presignedPostService.createPresignedPost(
      videoKey,
      contentType || 'video/mp4'
    );

    return NextResponse.json({
      url: presignedData.url,
      fields: presignedData.fields,
      key: videoKey,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    );
  }
}
