import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { AppModule } from '../../app.module';

const logger = new Logger('ResetPreserveLocations');

const PRESERVED_COLLECTIONS = new Set([
  'provinces',
  'districts',
  'constituencies',
  'municipalities',
  'wards',
]);

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const connection = app.get<Connection>(getConnectionToken());
    const db = connection.db;

    if (!db) {
      throw new Error('Database connection is not available');
    }

    const collections = await db
      .listCollections({}, { nameOnly: true })
      .toArray();

    const deletableCollections = collections
      .map((collection) => collection.name)
      .filter(
        (name) =>
          !PRESERVED_COLLECTIONS.has(name) && !name.startsWith('system.'),
      );

    for (const collectionName of deletableCollections) {
      await db.collection(collectionName).deleteMany({});
      logger.log(`Cleared collection: ${collectionName}`);
    }

    logger.log(
      `Preserved collections: ${Array.from(PRESERVED_COLLECTIONS).join(', ')}`,
    );

    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Failed to clear non-location collections', error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
