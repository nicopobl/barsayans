import { Subscription } from './subscription.entity';

export interface SubscriptionRepository {
  create(subscription: Subscription): Promise<void>;
  findByUserAndCourse(userId: string, courseId: string): Promise<Subscription | null>;
  findByUserId(userId: string): Promise<Subscription[]>;
}
