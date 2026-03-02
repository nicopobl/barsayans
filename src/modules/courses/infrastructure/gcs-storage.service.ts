import { Storage } from '@google-cloud/storage';
import { StorageService } from '../domain/storage.service';

/**
 * Google Cloud Storage implementation of StorageService
 * Provides signed URLs equivalent to S3 presigned URLs
 */
export class GCSStorageService implements StorageService {
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

  async getPresignedUrl(videoKey: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(videoKey);

    // Generar signed URL con expiración de 1 hora (3600 segundos)
    // Equivalente a S3 presigned URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 3600 * 1000, // 1 hora en milisegundos
    });

    return url;
  }
}
