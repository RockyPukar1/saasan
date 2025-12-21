import { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';

export function setupAppMiddleware(app: INestApplication) {
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  return app;
}
