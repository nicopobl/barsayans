export interface StorageService {
  getPresignedUrl(videoKey: string): Promise<string>;
}
