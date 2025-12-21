import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { setupAppMiddleware } from './common/utils/setup-app-middleware';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.enableCors();

  setupAppMiddleware(app);

  const PORT = process.env.SAASAN_PORT || 3000;
  await app.listen(PORT);
  logger.log(`Server is running on ${PORT}`);
}

bootstrap().catch((error) => {
  logger.error('Failed to start application', error);
  process.exit(1);
});
