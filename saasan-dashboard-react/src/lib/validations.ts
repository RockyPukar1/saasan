import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  wardNumber: z.number().optional(),
});

// Politician schemas
export const politicianSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  positionId: z.number().min(1, "Position ID is required"),
  partyId: z.number().min(1, "Party ID is required"),
  constituencyId: z.number().min(1, "Constituency ID is required"),
  biography: z.string().min(10, "Biography must be at least 10 characters"),
  education: z.string().min(2, "Education is required"),
  experienceYears: z.number().min(0, "Experience years must be non-negative"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  profileImageUrl: z.string().url("Invalid profile image URL").optional(),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  contactEmail: z.string().email("Invalid email address"),
  officialWebsite: z.string().url("Invalid website URL").optional(),
  socialMediaLinks: z.record(z.string(), z.string()).optional(),
  status: z.enum(["active", "inactive", "deceased"]),
  termStartDate: z.string().min(1, "Term start date is required"),
  termEndDate: z.string().min(1, "Term end date is required"),
  totalVotesReceived: z.number().min(0, "Total votes must be non-negative"),
});

export const politicianUpdateSchema = politicianSchema.partial();

// Geographic schemas
export const provinceSchema = z.object({
  name: z.string().min(2, "Province name is required"),
  name_nepali: z.string().min(2, "Province name in Nepali is required"),
  capital: z.string().min(2, "Capital is required"),
  capital_nepali: z.string().min(2, "Capital in Nepali is required"),
  coordinates: z.array(z.number()).length(2).optional(),
});

export const districtSchema = z.object({
  name: z.string().min(2, "District name is required"),
  name_nepali: z.string().min(2, "District name in Nepali is required"),
  provinceId: z.string().min(1, "Province is required"),
  coordinates: z.array(z.number()).length(2).optional(),
});

export const municipalitySchema = z.object({
  name: z.string().min(2, "Municipality name is required"),
  name_nepali: z.string().min(2, "Municipality name in Nepali is required"),
  districtId: z.string().min(1, "District is required"),
  type: z.enum([
    "metropolitan",
    "sub_metropolitan",
    "municipality",
    "rural_municipality",
  ]),
  coordinates: z.array(z.number()).length(2).optional(),
});

export const wardSchema = z.object({
  number: z.number().min(1, "Ward number is required"),
  municipalityId: z.string().min(1, "Municipality is required"),
  name: z.string().optional(),
  name_nepali: z.string().optional(),
  coordinates: z.array(z.number()).length(2).optional(),
});

export const constituencySchema = z.object({
  name: z.string().min(2, "Constituency name is required"),
  name_nepali: z.string().min(2, "Constituency name in Nepali is required"),
  districtId: z.string().min(1, "District is required"),
  type: z.enum(["federal", "provincial"]).optional(),
  coordinates: z.array(z.number()).length(2).optional(),
});

// Type exports
export type ProvinceFormData = z.infer<typeof provinceSchema>;
export type DistrictFormData = z.infer<typeof districtSchema>;
export type MunicipalityFormData = z.infer<typeof municipalitySchema>;
export type WardFormData = z.infer<typeof wardSchema>;
export type ConstituencyFormData = z.infer<typeof constituencySchema>;

// Report schemas
export const reportStatusUpdateSchema = z.object({
  status: z.enum([
    "submitted",
    "under_review",
    "verified",
    "resolved",
    "dismissed",
  ]),
  comment: z.string().optional(),
});

// Historical Event schemas
export const historicalEventSchema = z.object({
  date: z.string().min(1, "Date is required"),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  year: z.number().min(1900, "Year must be after 1900"),
  category: z.enum(["corruption", "political", "social", "economic"]),
  significance: z.enum(["high", "medium", "low"]),
});

export const historicalEventUpdateSchema = historicalEventSchema.partial();

// Major Case schemas
export const majorCaseSchema = z.object({
  referenceNumber: z.string().min(1, "Reference number is required"),
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  status: z.enum(["unsolved", "ongoing", "solved"]),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  amountInvolved: z.number().min(0, "Amount involved must be non-negative"),
  upvotesCount: z.number().min(0, "Upvotes count must be non-negative"),
  category_id: z.number().optional(),
  reporter_id: z.string().optional(),
  is_anonymous: z.boolean().optional(),
  location_description: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  ward: z.string().optional(),
  assigned_to_officer_id: z.string().optional(),
  date_occurred: z.string().optional(),
  people_affected_count: z.number().optional(),
  public_visibility: z.string().optional(),
  downvotes_count: z.number().optional(),
  views_count: z.number().optional(),
  shares_count: z.number().optional(),
  resolved_at: z.string().optional(),
  is_public: z.boolean().optional(),
});

export const majorCaseUpdateSchema = majorCaseSchema.partial();

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
});

// Search and filter schemas
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  type: z.enum(["politicians", "reports", "events", "cases"]).optional(),
});

export const filterSchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(),
  district: z.string().optional(),
  municipality: z.string().optional(),
  ward: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type PoliticianFormData = z.infer<typeof politicianSchema>;
export type PoliticianUpdateFormData = z.infer<typeof politicianUpdateSchema>;
export type ReportStatusUpdateFormData = z.infer<
  typeof reportStatusUpdateSchema
>;
export type HistoricalEventFormData = z.infer<typeof historicalEventSchema>;
export type HistoricalEventUpdateFormData = z.infer<
  typeof historicalEventUpdateSchema
>;
export type MajorCaseFormData = z.infer<typeof majorCaseSchema>;
export type MajorCaseUpdateFormData = z.infer<typeof majorCaseUpdateSchema>;
export type FileUploadFormData = z.infer<typeof fileUploadSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
