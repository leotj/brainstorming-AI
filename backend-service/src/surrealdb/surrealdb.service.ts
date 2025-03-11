import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Surreal } from 'surrealdb';

@Injectable()
export class SurrealdbService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SurrealdbService.name, { timestamp: true });
  private db: Surreal;

  constructor(private readonly configService: ConfigService) {
    this.db = new Surreal();
  }

  async onModuleInit() {
    try {
      const url = this.configService.get<string>('SURREALDB_URL')!;
      const username = this.configService.get<string>('SURREALDB_USERNAME')!;
      const password = this.configService.get<string>('SURREALDB_PASSWORD')!;
      const namespace = this.configService.get<string>('SURREALDB_NAMESPACE');
      const database = this.configService.get<string>('SURREALDB_DATABASE');

      await this.db.connect(url, {
        auth: {
          username,
          password,
        },
        namespace,
        database,
      });

      this.logger.log('Successfully connected to SurrealDB');
    } catch (error) {
      this.logger.error('Failed to connect to SurrealDB:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.db.close();
      this.logger.log('SurrealDB connection closed');
    } catch (error) {
      this.logger.error('Error closing SurrealDB connection:', error);
    }
  }

  getDB(): Surreal {
    return this.db;
  }
}
