export interface Subscription {
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}
