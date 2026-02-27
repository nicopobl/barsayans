import { AccessService } from '../domain/access.service';

/**
 * Mock implementation of AccessService
 * For MVP: returns false by default (no access)
 * In production: will check DynamoDB for user purchases
 */
export class MockAccessService implements AccessService {
  async hasAccess(courseId: string, userId?: string): Promise<boolean> {
    // Mock: For demo purposes, you can hardcode access here
    // Example: return userId === 'demo-user' && courseId === 'basics-003';
    return true; // Default: no access
  }
}
