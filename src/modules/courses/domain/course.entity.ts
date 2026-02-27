export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  level: 'Básico' | 'Intermedio' | 'Pro';
  videoUrl?: string; // URL pública (para preview)
  videoKey?: string; // Key en S3 para streaming privado
}
