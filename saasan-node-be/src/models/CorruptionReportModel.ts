import db from "../config/database";
import { CorruptionReport, ReportPriority, ReportStatus } from "../types";
import { generateUUID } from "../lib/utils";

export class CorruptionReportModel {
  static async create(
    reportData: Partial<CorruptionReport>
  ): Promise<CorruptionReport> {
    const id = generateUUID();
    const referenceNumber = await this.generateReferenceNumber();

    const [report] = await db("corruption_reports")
      .insert({
        ...reportData,
        id,
        reference_number: referenceNumber,
        upvotes_count: 0,
        downvotes_count: 0,
        views_count: 0,
        shares_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return report;
  }

  static async findById(id: string): Promise<CorruptionReport | null> {
    const report = await db("corruption_reports").where({ id }).first();
    return report || null;
  }

  static async findByReference(
    referenceNumber: string
  ): Promise<CorruptionReport | null> {
    const report = await db("corruption_reports")
      .where({ reference_number: referenceNumber })
      .first();
    return report || null;
  }

  static async findAll(
    filters: {
      status?: ReportStatus;
      priority?: ReportPriority;
      categoryId?: number;
      district?: string;
      municipality?: string;
      assignedToOfficerId?: string;
      reporterId?: string;
      publicVisibility?: string;
      limit?: number;
      offset?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    } = {}
  ): Promise<{ reports: CorruptionReport[]; total: number }> {
    let query = db("corruption_reports")
      .select("corruption_reports.*", "report_categories.name as categoryName")
      .leftJoin(
        "report_categories",
        "corruption_reports.category_id",
        "report_categories.id"
      );

    // Apply filters
    if (filters.status)
      query = query.where("corruption_reports.status", filters.status);
    if (filters.priority)
      query = query.where("corruption_reports.priority", filters.priority);
    if (filters.categoryId)
      query = query.where("corruption_reports.category_id", filters.categoryId);
    if (filters.district)
      query = query.where("corruption_reports.district", filters.district);
    if (filters.municipality)
      query = query.where(
        "corruption_reports.municipality",
        filters.municipality
      );
    if (filters.assignedToOfficerId)
      query = query.where(
        "corruption_reports.assigned_to_officer_id",
        filters.assignedToOfficerId
      );
    if (filters.reporterId)
      query = query.where("corruption_reports.reporter_id", filters.reporterId);
    if (filters.publicVisibility)
      query = query.where(
        "corruption_reports.is_public",
        filters.publicVisibility === "true"
      );

    const total = await query.clone().count("* as count").first();

    // Sorting
    const sortBy = filters.sortBy || "created_at";
    const sortOrder = filters.sortOrder || "desc";
    query = query.orderBy(`corruption_reports.${sortBy}`, sortOrder);

    // Pagination
    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.offset(filters.offset);

    const reports = await query;

    return {
      reports,
      total: parseInt(total?.count as string),
    };
  }

  static async updateStatus(
    id: string,
    status: ReportStatus,
    officerId?: string
  ): Promise<CorruptionReport> {
    const updateData: any = {
      status,
      updated_at: new Date(),
    };

    if (status === ReportStatus.RESOLVED) {
      updateData.resolved_at = new Date();
    }

    if (officerId) {
      updateData.assigned_to_officer_id = officerId;
    }

    const [report] = await db("corruption_reports")
      .where({ id })
      .update(updateData)
      .returning("*");

    return report;
  }

  static async incrementViews(id: string): Promise<void> {
    await db("corruption_reports").where({ id }).increment("views_count", 1);
  }

  static async updateVotes(
    id: string,
    upvotes: number,
    downvotes: number
  ): Promise<void> {
    await db("corruption_reports").where({ id }).update({
      upvotes_count: upvotes,
      downvotes_count: downvotes,
    });
  }

  private static async generateReferenceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await db("corruption_reports")
      .whereRaw("EXTRACT(YEAR FROM created_at) = ?", [year])
      .count("* as count")
      .first();
    const nextNumber = (parseInt(count?.count as string) || 0) + 1;
    return `CR-${year}-${nextNumber.toString().padStart(6, "0")}`;
  }

  static async getStatsByDistrict(): Promise<any[]> {
    return db("corruption_reports")
      .select("district")
      .count("* as totalReports")
      .countDistinct("corruption_reports.id", { as: "uniqueReports" })
      .avg("amount_involved as avgAmount")
      .groupBy("district")
      .orderBy("totalReports", "desc");
  }

  static async getStatsByCategory(): Promise<any[]> {
    return db("corruption_reports")
      .select("report_categories.name as categoryName")
      .count("* as count")
      .leftJoin(
        "report_categories",
        "corruption_reports.category_id",
        "report_categories.id"
      )
      .groupBy("report_categories.name")
      .orderBy("count", "desc");
  }
}
