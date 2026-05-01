import { HttpStatus, Injectable } from '@nestjs/common';
import { CaseRepository } from '../repositories/case.repository';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreateCaseDto } from '../dtos/create-case.dto';
import { GetCasesDto } from '../dtos/get-cases.dto';
import { UpdateCaseDto } from '../dtos/update-case.dto';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { CaseSerializer } from '../serializers/case.serializer';

@Injectable()
export class CaseService {
  constructor(private readonly caseRepo: CaseRepository) {}

  async getAll(query: GetCasesDto) {
    return ResponseHelper.response(
      CaseSerializer,
      await this.caseRepo.getAll(query),
      'Cases fetched successfully',
    );
  }

  async getById(caseId: string) {
    const caseRecord = await this.caseRepo.findById(caseId);
    if (!caseRecord) {
      throw new GlobalHttpException('case404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      CaseSerializer,
      caseRecord,
      'Case fetched successfully',
    );
  }

  async create(caseData: CreateCaseDto) {
    return ResponseHelper.response(
      CaseSerializer,
      await this.caseRepo.create(caseData),
      'Case created successfully',
    );
  }

  async update(caseId: string, updateData: UpdateCaseDto) {
    const updated = await this.caseRepo.update(caseId, updateData);
    if (!updated) {
      throw new GlobalHttpException('case404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      CaseSerializer,
      updated,
      'Case updated successfully',
    );
  }

  async delete(caseId: string) {
    const deleted = await this.caseRepo.delete(caseId);
    if (!deleted) {
      throw new GlobalHttpException('case404', HttpStatus.NOT_FOUND);
    }
  }

  async updateStatus(caseId: string, status: string) {
    const updated = await this.caseRepo.updateStatus(caseId, status);
    if (!updated) {
      throw new GlobalHttpException('case404', HttpStatus.NOT_FOUND);
    }

    return ResponseHelper.response(
      CaseSerializer,
      updated,
      'Case status updated successfully',
    );
  }
}
