import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { Logger } from '@nestjs/common';
import { EventSeeder } from './event.seeder';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seeder = app.get(EventSeeder);
  await seeder.seed();

  await app.close();
  process.exit(0);
}

bootstrap().catch((error) => {
  logger.error('Failed to start application', error);
  process.exit(1);
});
