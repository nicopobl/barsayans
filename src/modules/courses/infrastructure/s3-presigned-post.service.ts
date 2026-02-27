import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from '../domain/storage.service';

export interface PresignedPostData {
  url: string;
  fields: Record<string, string>;
}

export class S3PresignedPostService {
  private client: S3Client;
  private bucketName: string;

  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }
        : {}),
    });
    this.bucketName = process.env.S3_BUCKET_NAME || 'barsayans-videos';
  }

  async createPresignedPost(
    key: string,
    contentType: string = 'video/mp4',
    maxFileSize: number = 1073741824 // 1GB
  ): Promise<PresignedPostData> {
    // Para Presigned Post, necesitamos usar un enfoque diferente
    // Usaremos Presigned URL con PUT method
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });

    return {
      url,
      fields: {
        'Content-Type': contentType,
      },
    };
  }

  /**
   * Genera una key única para el video del curso
   */
  generateVideoKey(courseId: string, filename: string): string {
    const extension = filename.split('.').pop() || 'mp4';
    const timestamp = Date.now();
    return `courses/${courseId}/video-${timestamp}.${extension}`;
  }
}
