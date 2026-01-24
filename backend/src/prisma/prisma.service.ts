import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connection established');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database connection closed');
  }

  // DEV / TEST ONLY
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const modelKeys = Reflect.ownKeys(this).filter(
      (key): key is string =>
        typeof key === 'string' &&
        !key.startsWith('_') &&
        !key.startsWith('$'),
    );

    for (const key of modelKeys) {
      try {
        const model = (this as any)[key];
        if (model?.deleteMany) {
          await model.deleteMany();
        }
      } catch {
        // ignore non-model properties
      }
    }
  }
}
