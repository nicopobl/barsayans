import { StorageService } from '../domain/storage.service';
import { AccessService } from '../domain/access.service';

export class GetVideoStreamUrlUseCase {
  constructor(
    private storageService: StorageService,
    private accessService: AccessService
  ) {}

  async execute(courseId: string, videoKey: string, userId: string): Promise<string> {
    // Verificar que el usuario tenga acceso al curso
    const hasAccess = await this.accessService.hasAccess(courseId, userId);
    
    if (!hasAccess) {
      throw new Error('User does not have access to this course');
    }

    // Obtener URL presignada de S3
    const presignedUrl = await this.storageService.getPresignedUrl(videoKey);
    
    return presignedUrl;
  }
}
