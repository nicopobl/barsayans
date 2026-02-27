import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { CourseRepository } from '../domain/course.repository';
import { Course } from '../domain/course.entity';

export class DynamoDBCourseRepository implements CourseRepository {
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
    this.tableName = process.env.DYNAMODB_COURSES_TABLE || 'courses';
  }

  async getAll(): Promise<Course[]> {
    const result = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
        ExpressionAttributeValues: marshall({
          ':pk': 'COURSE#',
          ':sk': 'METADATA',
        }),
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return [];
    }

    return result.Items.map((item) => {
      const unmarshalled = unmarshall(item);
      return {
        id: unmarshalled.id,
        title: unmarshalled.title,
        description: unmarshalled.description,
        price: unmarshalled.price,
        thumbnail: unmarshalled.thumbnail,
        level: unmarshalled.level,
        videoUrl: unmarshalled.videoUrl,
        videoKey: unmarshalled.videoKey,
      };
    });
  }

  async getById(id: string): Promise<Course | null> {
    const result = await this.client.send(
      new GetItemCommand({
        TableName: this.tableName,
        Key: marshall({
          PK: `COURSE#${id}`,
          SK: 'METADATA',
        }),
      })
    );

    if (!result.Item) {
      return null;
    }

    const item = unmarshall(result.Item);
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      thumbnail: item.thumbnail,
      level: item.level,
      videoUrl: item.videoUrl,
      videoKey: item.videoKey,
    };
  }

  async create(course: Course): Promise<void> {
    const now = new Date().toISOString();
    const item = {
      PK: `COURSE#${course.id}`,
      SK: 'METADATA',
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      level: course.level,
      videoUrl: course.videoUrl,
      videoKey: course.videoKey,
      createdAt: now,
      updatedAt: now,
    };

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item),
      })
    );
  }

  async update(course: Course): Promise<void> {
    const now = new Date().toISOString();
    const item = {
      PK: `COURSE#${course.id}`,
      SK: 'METADATA',
      id: course.id,
      title: course.title,
      description: course.description,
      price: course.price,
      thumbnail: course.thumbnail,
      level: course.level,
      videoUrl: course.videoUrl,
      videoKey: course.videoKey,
      updatedAt: now,
    };

    await this.client.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(item),
      })
    );
  }
}
