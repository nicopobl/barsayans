import { Firestore } from '@google-cloud/firestore';
import { SubscriptionRepository } from '../domain/subscription.repository';
import { Subscription } from '../domain/subscription.entity';

/**
 * Firestore implementation of SubscriptionRepository
 * Maps DynamoDB pattern USER#ID / COURSE#ID to Firestore collection structure:
 * - Collection: subscriptions
 * - Document ID: {userId}_{courseId}
 */
export class FirestoreSubscriptionRepository implements SubscriptionRepository {
  private firestore: Firestore;
  private collectionName: string;

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

    this.firestore = new Firestore(config);
    this.collectionName = process.env.FIRESTORE_SUBSCRIPTIONS_COLLECTION || 'subscriptions';
  }

  /**
   * Genera el document ID basado en userId y courseId
   * Formato: {userId}_{courseId}
   */
  private generateDocumentId(userId: string, courseId: string): string {
    return `${userId}_${courseId}`;
  }

  /**
   * Parsea el document ID para extraer userId y courseId
   */
  private parseDocumentId(documentId: string): { userId: string; courseId: string } {
    const [userId, ...courseIdParts] = documentId.split('_');
    const courseId = courseIdParts.join('_');
    return { userId, courseId };
  }

  async create(subscription: Subscription): Promise<void> {
    const now = new Date().toISOString();
    const documentId = this.generateDocumentId(subscription.userId, subscription.courseId);

    await this.firestore
      .collection(this.collectionName)
      .doc(documentId)
      .set({
        userId: subscription.userId,
        courseId: subscription.courseId,
        status: subscription.status,
        createdAt: subscription.createdAt || now,
        updatedAt: subscription.updatedAt || now,
      });
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<Subscription | null> {
    const documentId = this.generateDocumentId(userId, courseId);
    const doc = await this.firestore
      .collection(this.collectionName)
      .doc(documentId)
      .get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data()!;
    return {
      userId: data.userId,
      courseId: data.courseId,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where('userId', '==', userId)
      .get();

    if (snapshot.empty) {
      return [];
    }

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        userId: data.userId,
        courseId: data.courseId,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
  }
}
