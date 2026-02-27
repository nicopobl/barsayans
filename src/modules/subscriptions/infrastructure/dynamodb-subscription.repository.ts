import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { SubscriptionRepository } from '../domain/subscription.repository';
import { Subscription } from '../domain/subscription.entity';

export class DynamoDBSubscriptionRepository implements SubscriptionRepository {
  private client: DynamoDBClient;
  private tableName: string;

  constructor() {
    this.client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      ...(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            credentials: {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
          }
        : {}),
    });
    this.tableName = process.env.DYNAMODB_SUBSCRIPTIONS_TABLE || 'subscriptions';
  }

  async create(subscription: Subscription): Promise<void> {
    const now = new Date().toISOString();
    const item = {
      PK: `USER#${subscription.userId}`,
      SK: `COURSE#${subscription.courseId}`,
      userId: subscription.userId,
      courseId: subscription.courseId,
      status: subscription.status,
      createdAt: subscription.createdAt || now,
      updatedAt: subscription.updatedAt || now,
    };

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item),
      })
    );
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<Subscription | null> {
    const result = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall({
          PK: `USER#${userId}`,
          SK: `COURSE#${courseId}`,
        }),
      })
    );

    if (!result.Item) {
      return null;
    }

    const item = unmarshall(result.Item);
    return {
      userId: item.userId,
      courseId: item.courseId,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: marshall({
          ':pk': `USER#${userId}`,
        }),
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => {
      const unmarshalled = unmarshall(item);
      return {
        userId: unmarshalled.userId,
        courseId: unmarshalled.courseId,
        status: unmarshalled.status,
        createdAt: unmarshalled.createdAt,
        updatedAt: unmarshalled.updatedAt,
      };
    });
  }
}
