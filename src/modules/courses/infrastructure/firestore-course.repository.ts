import { Firestore } from '@google-cloud/firestore';
import { CourseRepository } from '../domain/course.repository';
import { Course } from '../domain/course.entity';

export class FirestoreCourseRepository implements CourseRepository {
  private firestore: Firestore;
  private collectionName: string;

  constructor() {
    const config: ConstructorParameters<typeof Firestore>[0] = {
      projectId: process.env.GCP_PROJECT_ID,
    };

    if (process.env.GCP_SERVICE_ACCOUNT_KEY) {
      config.keyFilename = process.env.GCP_SERVICE_ACCOUNT_KEY;
    } else if (process.env.GCP_CREDENTIALS) {
      config.credentials = JSON.parse(process.env.GCP_CREDENTIALS);
    }

    this.firestore = new Firestore(config);
    this.collectionName = process.env.FIRESTORE_COURSES_COLLECTION || 'courses';
  }

  async getAll(): Promise<Course[]> {
    const snapshot = await this.firestore.collection(this.collectionName).get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        price: data.price,
        thumbnail: data.thumbnail,
        level: data.level,
        videoUrl: data.videoUrl,
        videoKey: data.videoKey,
      };
    });
  }

  async getById(id: string): Promise<Course | null> {
    const doc = await this.firestore.collection(this.collectionName).doc(id).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      price: data.price,
      thumbnail: data.thumbnail,
      level: data.level,
      videoUrl: data.videoUrl,
      videoKey: data.videoKey,
    };
  }

  async create(course: Course): Promise<void> {
    const now = new Date().toISOString();
    await this.firestore.collection(this.collectionName).doc(course.id).set({
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      level: course.level,
      videoUrl: course.videoUrl ?? null,
      videoKey: course.videoKey ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  async update(course: Course): Promise<void> {
    const now = new Date().toISOString();
    await this.firestore.collection(this.collectionName).doc(course.id).update({
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      level: course.level,
      videoUrl: course.videoUrl ?? null,
      videoKey: course.videoKey ?? null,
      updatedAt: now,
    });
  }
}
