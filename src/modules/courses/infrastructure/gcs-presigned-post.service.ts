import { Storage } from '@google-cloud/storage';

/**
 * Interface for presigned post data (compatible with S3 format)
 */
export interface PresignedPostData {
  url: string;
  fields: Record<string, string>;
}

/**
 * Google Cloud Storage service for generating signed URLs for video uploads
 * Equivalent to S3PresignedPostService but using GCS
 */
export class GCSPresignedPostService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    const config: any = {
      projectId: process.env.GCP_PROJECT_ID,
    };

    // Prioridad: keyFilename > GCP_CREDENTIALS > Application Default Credentials
    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      config.keyFilename = process.env.GCP_SERVICE_ACCOUNT_KEY;
    } else if (process.env.GCP_CREDENTIALS) {
      config.credentials = JSON.parse(process.env.GCP_CREDENTIALS);
    }

    this.storage = new Storage(config);
    this.bucketName = process.env.GCS_BUCKET_NAME || 'barsayans-videos';
  }

  /**
   * Genera una signed URL para subir un archivo a GCS
   * Equivalente a S3 presigned POST pero usando signed URL con método PUT
   */
  async createPresignedPost(
    key: string,
    contentType: string = 'video/mp4',
    maxFileSize: number = 1073741824 // 1GB
  ): Promise<PresignedPostData> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(key);

    // Generar signed URL para PUT (subida de archivo)
    // Expira en 1 hora (3600 segundos)
    const [url] = await file.getSignedUrl({
      action: 'write',
      expires: Date.now() + 3600 * 1000, // 1 hora en milisegundos
      contentType,
    });

    return {
      url,
      fields: {
        'Content-Type': contentType,
      },
    };
  }

  /**
   * Genera una key única para el video del curso
   * Mantiene el mismo formato que S3PresignedPostService
   */
  generateVideoKey(courseId: string, filename: string): string {
    const extension = filename.split('.').pop() || 'mp4';
    const timestamp = Date.now();
    return `courses/${courseId}/video-${timestamp}.${extension}`;
  }
}
