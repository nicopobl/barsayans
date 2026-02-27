import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService } from '../domain/storage.service';

export class S3StorageService implements StorageService {
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

  async getPresignedUrl(videoKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: videoKey,
    });

    // URL expira en 3600 segundos (1 hora)
    const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });
    return url;
  }
}
