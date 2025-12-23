import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';

@Injectable()
export class ServiceService {
  constructor(private readonly serviceRepo: ServiceRepository) {}
}
