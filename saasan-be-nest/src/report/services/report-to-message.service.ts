import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ReportEntity } from '../entities/report.entity';
import { PoliticianRepository } from '../../politics/politician/repositories/politician.repository';
import { PoliticianIdDto } from '../../politics/politician/dtos/politician-id.dto';
import { MessageService } from '../../message/services/message.service';
import { GlobalHttpException } from 'src/common/exceptions/global-http.exception';
import { MessageRepository } from '../../message/repositories/message.repository';
import { ReportRepository } from '../repositories/report.repository';
import { ReportIdDto } from '../dtos/report-id.dto';
import {
  MessageCategory,
  MessageUrgency,
} from '../../message/entities/message.entity';

export interface ReportApprovalData {
  reportId: string;
  approvedBy: string;
  escalateToHigher?: boolean;
  notes?: string;
}

@Injectable()
export class ReportToMessageService {
  constructor(
    private readonly reportRepo: ReportRepository,
    private readonly politicianRepo: PoliticianRepository,
    private readonly messageService: MessageService,
    private readonly messageRepo: MessageRepository,
  ) {}

  async approveReport(approvalData: ReportApprovalData) {
    const { reportId, approvedBy, escalateToHigher, notes } = approvalData;

    // Find the report
    const report = await this.reportRepo.findByIdWithPopulate(reportId);
    if (!report) {
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);
    }

    // Find target politician based on report level
    const targetPolitician = await this.findTargetPolitician(report);

    if (!targetPolitician) {
      throw new Error('No politician found for this jurisdiction');
    }

    // Create message thread from report
    const messageData = {
      subject: `Report: ${report.title}`,
      content: this.formatReportContent(report),
      category: this.mapReportTypeToMessageCategory(
        report.typeId,
      ) as MessageCategory,
      urgency: this.mapReportPriorityToMessageUrgency(
        report.priorityId,
      ) as MessageUrgency,
      jurisdiction: this.extractJurisdictionFromReport(report),
      participants: {
        citizenId: report.reporterId._id.toString(),
        politicianId: targetPolitician._id.toString(),
      },
      initialMessage: {
        content: report.description,
        attachments: [], // TODO: Get evidence files from evidence repository
      },
      sourceReportId: report._id.toString(),
      messageOrigin: 'report_converted',
      referenceNumber: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, // Add this line
    };

    // Create the message thread
    const messageThread = await this.messageService.create(messageData, {
      citizenId: report.reporterId._id.toString(),
    });

    // Update report with conversion details
    await this.reportRepo.updateReportConversion(reportId, {
      statusId: await this.getReportStatusId('approved'),
      autoConvertedToMessage: true,
      targetPoliticianId: targetPolitician._id,
      escalatedToPoliticianId: escalateToHigher
        ? await this.findHigherLevelPolitician(report)
        : null,
      verificationNotes: notes,
      verifiedById: approvedBy,
      verifiedAt: new Date(),
    });

    return {
      messageThread,
      report: await this.reportRepo.findByIdWithPopulate(reportId),
    };
  }

  async findTargetPolitician(report: any) {
    const locationFilters: any = {};

    switch (report.reportLevel) {
      case 'ward':
        locationFilters.wardId = report.wardId;
        break;
      case 'municipality':
        locationFilters.municipalityId = report.municipalityId;
        break;
      case 'constituency':
        locationFilters.constituencyId = report.constituencyId;
        break;
      case 'district':
        locationFilters.districtId = report.districtId;
        break;
      case 'province':
        locationFilters.provinceId = report.provinceId;
        break;
      case 'federal':
        // Federal level - find highest level politician
        return await this.findHighestLevelPolitician();
    }

    return await this.findByJurisdiction(locationFilters);
  }

  async findHigherLevelPolitician(report: any) {
    const higherLevel = this.getNextLevel(report.reportLevel);
    if (!higherLevel) return null;

    const locationFilters: any = {};

    switch (higherLevel) {
      case 'municipality':
        locationFilters.municipalityId = report.municipalityId;
        break;
      case 'constituency':
        locationFilters.constituencyId = report.constituencyId;
        break;
      case 'district':
        locationFilters.districtId = report.districtId;
        break;
      case 'province':
        locationFilters.provinceId = report.provinceId;
        break;
      case 'federal':
        return await this.findHighestLevelPolitician();
    }

    return await this.findByJurisdiction(locationFilters);
  }

  private getNextLevel(currentLevel: string): string | null {
    const hierarchy = [
      'ward',
      'municipality',
      'constituency',
      'district',
      'province',
      'federal',
    ];
    const currentIndex = hierarchy.indexOf(currentLevel);
    return currentIndex < hierarchy.length - 1
      ? hierarchy[currentIndex + 1]
      : null;
  }

  private async findByJurisdiction(locationFilters: any) {
    // Use existing politician repository methods to find by jurisdiction
    return await this.politicianRepo.findByJurisdiction(locationFilters);
  }

  private async findHighestLevelPolitician() {
    // Find the politician with highest authority level
    return await this.politicianRepo.findHighestLevelPolitician();
  }

  private formatReportContent(report: any): string {
    return `
**Report Details:**

**Title:** ${report.title}
**Description:** ${report.description}
**Date Occurred:** ${new Date(report.dateOccurred).toLocaleDateString()}
**People Affected:** ${report.peopleAffectedCount}
**Amount Involved:** ${report.amountInvolved || 'Not specified'}

**Location:**
${report.wardId ? `- Ward: ${report.wardId}` : ''}
${report.municipalityId ? `- Municipality: ${report.municipalityId}` : ''}
${report.constituencyId ? `- Constituency: ${report.constituencyId}` : ''}
${report.districtId ? `- District: ${report.districtId}` : ''}
${report.provinceId ? `- Province: ${report.provinceId}` : ''}

**Reference Number:** ${report.referenceNumber}

---
*This message was automatically created from an approved citizen report.*
    `.trim();
  }

  private mapReportTypeToMessageCategory(
    reportTypeId: Types.ObjectId,
  ): MessageCategory {
    // Map report types to message categories
    const typeMappings: { [key: string]: MessageCategory } = {
      corruption: MessageCategory.COMPLAINT,
      bribery: MessageCategory.COMPLAINT,
      abuse: MessageCategory.COMPLAINT,
      nepotism: MessageCategory.COMPLAINT,
      suggestion: MessageCategory.SUGGESTION,
      question: MessageCategory.QUESTION,
      request: MessageCategory.REQUEST,
    };

    if (!reportTypeId) {
      return MessageCategory.COMPLAINT;
    }

    return typeMappings[reportTypeId.toString()] || MessageCategory.COMPLAINT;
  }

  private mapReportPriorityToMessageUrgency(
    reportPriorityId: Types.ObjectId,
  ): MessageUrgency {
    // Map report priorities to message urgencies
    const priorityMappings: { [key: string]: MessageUrgency } = {
      low: MessageUrgency.LOW,
      medium: MessageUrgency.MEDIUM,
      high: MessageUrgency.HIGH,
    };

    if (!reportPriorityId) {
      return MessageUrgency.MEDIUM;
    }

    return (
      priorityMappings[reportPriorityId.toString()] || MessageUrgency.MEDIUM
    );
  }

  private extractJurisdictionFromReport(report: any): any {
    return {
      provinceId: report.provinceId?.toString() || '',
      districtId: report.districtId?.toString() || '',
      constituencyId: report.constituencyId?.toString() || '',
      municipalityId: report.municipalityId?.toString() || '',
      wardId: report.wardId?.toString() || '',
    };
  }

  private async getReportStatusId(statusName: string): Promise<Types.ObjectId> {
    // This would need to be implemented to get the status ID by name
    // For now, return a placeholder
    return new Types.ObjectId();
  }

  async getReportsForPolitician(politicianId: string) {
    // Get messages that originated from reports for this politician
    return await this.messageRepo.findBySourceReport(politicianId);
  }

  async escalateReport(reportId: string, escalateTo: string, reason: string) {
    const report = await this.reportRepo.findByIdWithPopulate(reportId);
    if (!report) {
      throw new GlobalHttpException('report404', HttpStatus.NOT_FOUND);
    }

    const higherPolitician = await this.findHigherLevelPolitician({
      ...report,
      reportLevel: escalateTo,
    });

    if (!higherPolitician) {
      throw new Error('No politician found at higher level');
    }

    // Create new message thread for higher level politician
    const messageData = {
      subject: `Escalated Report: ${report.title}`,
      content: this.formatEscalatedContent(report, reason),
      category: this.mapReportTypeToMessageCategory(
        report.typeId,
      ) as MessageCategory,
      urgency: MessageUrgency.HIGH, // Escalated reports are high priority
      jurisdiction: this.extractJurisdictionFromReport(report),
      participants: {
        citizenId: report.reporterId._id.toString(),
        politicianId: higherPolitician._id.toString(),
      },
      initialMessage: {
        content: report.description,
        attachments: [], // TODO: Get evidence files from evidence repository
      },
      sourceReportId: report._id.toString(),
      messageOrigin: 'report_escalated',
    };

    await this.messageService.create(messageData, {
      citizenId: report.reporterId._id.toString(),
    });

    // Update report with escalation details
    await this.reportRepo.updateReportConversion(reportId, {
      escalatedToPoliticianId: higherPolitician._id,
      verificationNotes: `Escalated to ${escalateTo}: ${reason}`,
    });

    return higherPolitician;
  }

  private formatEscalatedContent(report: any, reason: string): string {
    return `
**ESCALATED REPORT**

**Original Report:**
- Title: ${report.title}
- Description: ${report.description}
- Reference: ${report.referenceNumber}

**Escalation Reason:**
${reason}

**Original Handling Politician:**
${report.targetPoliticianId ? 'Assigned to lower level politician' : 'No initial assignment'}

---
*This report has been escalated to a higher authority.*
    `.trim();
  }
}
