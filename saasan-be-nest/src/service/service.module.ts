import { Module } from '@nestjs/common';
import { ServiceRepository } from './repositories/service.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceEntity, ServiceEntitySchema } from './entities/service.entity';
import { ServiceService } from './service/service.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceEntity.name, schema: ServiceEntitySchema },
    ]),
  ],
  providers: [ServiceService, ServiceRepository],
  exports: [ServiceRepository],
})
export class ServiceModule {}
