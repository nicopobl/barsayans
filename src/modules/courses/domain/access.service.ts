/**
 * Service to check if a user has access to a course
 * In the future, this will be replaced by AWS Cognito + DynamoDB
 */
export interface AccessService {
  hasAccess(courseId: string, userId?: string): Promise<boolean>;
}
