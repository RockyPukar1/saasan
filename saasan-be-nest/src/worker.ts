import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker.module';

const logger = new Logger('WorkerBootstrap');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(WorkerModule);
  app.enableShutdownHooks();
  logger.log('Background work started');
}

bootstrap().catch((error) => {
  logger.error('Failed to start worker', error);
  process.exit(1);
});
