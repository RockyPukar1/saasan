import { Injectable } from '@nestjs/common';
import { ReportRepository } from '../repositories/report.repository';

@Injectable()
export class ReportService {
  constructor(private readonly reportRepo: ReportRepository) {}
}
