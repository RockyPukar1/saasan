import { Injectable } from '@nestjs/common';
import { ReportActivityRepository } from '../repositories/report-activity.repository';
import { ReportRepository } from '../repositories/report.repository';

// export interface LogActivityData {
//   reportId: string;
//   modifiedById: string;
//   activityType: ActivityType;
//   oldStatus?: string;
//   newStatus?: string;
//   oldPriority?: string;
//   newPriority?: string;
//   oldVisibility?: string;
//   newVisibility?: string;
//   oldType?: string;
//   newType?: string;
//   comment?: string;
//   assignedToId?: string;
//   oldAssignedToId?: string;
// }

@Injectable()
export class ReportActivityService {
  constructor(
    private readonly activityRepository: ReportActivityRepository,
    private readonly reportRepository: ReportRepository,
  ) {}

  // async logActivity(activityData: LogActivityData) {
  //   // Create the activity record
  //   const activity = await this.activityRepository.create(activityData);

  //   // Update the report's activity log
  //   await this.reportRepository.addActivityToReport(
  //     activityData.reportId,
  //     activity._id.toString(),
  //   );

  //   return activity;
  // }

  // async logStatusChange(
  //   reportId: string,
  //   modifiedById: string,
  //   oldStatus: string,
  //   newStatus: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.STATUS_CHANGED,
  //     oldStatus,
  //     newStatus,
  //     comment,
  //   });
  // }

  // async logPriorityChange(
  //   reportId: string,
  //   modifiedById: string,
  //   oldPriority: string,
  //   newPriority: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.PRIORITY_CHANGED,
  //     oldPriority,
  //     newPriority,
  //     comment,
  //   });
  // }

  // async logVisibilityChange(
  //   reportId: string,
  //   modifiedById: string,
  //   oldVisibility: string,
  //   newVisibility: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.VISIBILITY_CHANGED,
  //     oldVisibility,
  //     newVisibility,
  //     comment,
  //   });
  // }

  // async logTypeChange(
  //   reportId: string,
  //   modifiedById: string,
  //   oldType: string,
  //   newType: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.TYPE_CHANGED,
  //     oldType,
  //     newType,
  //     comment,
  //   });
  // }

  // async logReportCreation(
  //   reportId: string,
  //   modifiedById: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.REPORT_CREATED,
  //     comment,
  //   });
  // }

  // async logReportUpdate(
  //   reportId: string,
  //   modifiedById: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.REPORT_UPDATED,
  //     comment,
  //   });
  // }

  // async logReportAssignment(
  //   reportId: string,
  //   modifiedById: string,
  //   assignedToId: string,
  //   oldAssignedToId?: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.REPORT_ASSIGNED,
  //     assignedToId,
  //     oldAssignedToId,
  //     comment,
  //   });
  // }

  // async logReportVerification(
  //   reportId: string,
  //   modifiedById: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.REPORT_VERIFIED,
  //     comment,
  //   });
  // }

  // async logReportResolution(
  //   reportId: string,
  //   modifiedById: string,
  //   comment?: string,
  // ) {
  //   return await this.logActivity({
  //     reportId,
  //     modifiedById,
  //     activityType: ActivityType.REPORT_RESOLVED,
  //     comment,
  //   });
  // }

  async getReportActivities(reportId: string, page?: number, limit?: number) {
    return await this.activityRepository.findByReportIdWithPagination(
      reportId,
      page,
      limit,
    );
  }

  async getRecentActivities(limit?: number) {
    return await this.activityRepository.getRecentActivities(limit);
  }

  async getActivitiesByType(activityType: string) {
    return await this.activityRepository.findByActivityType(activityType);
  }

  async getActivitiesByUser(modifiedById: string) {
    return await this.activityRepository.findByModifiedBy(modifiedById);
  }
}
