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
export interface PoliticianFormData {
  fullName: string;
  biography?: string;
  education?: string;
  profession?: string;
  experienceYears?: number;
  experiences?: {
    category: string;
    title: string;
    company: string;
    startDate: Date;
    endDate: Date;
  }[];
  isIndependent?: boolean;
  party?: string;
  partyId?: string;
  positionIds?: string[];
  constituencyId?: string;
  status?: "active" | "inactive" | "deceased";
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  age?: number;
  rating?: number;
  totalVotes?: number;
  totalReports?: number;
  verifiedReports?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  photoUrl?: string;
  dateOfBirth?: string;
  totalVotesReceived?: number;
  termStartDate?: string;
  termEndDate?: string;
  profileImageUrl?: string;
  officialWebsite?: string;
  levelIds?: string[];
  sourceCategories?: {
    party: string | null;
    positions: string[];
    levels: string[];
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  promises?: {
    title: string;
    description: string;
    status: "ongoing" | "fulfilled" | "broken" | "not-started" | "in-progress";
    dueDate: string;
    progress: number;
  }[];
  achievements?: {
    title: string;
    description: string;
    category: "policy" | "development" | "social" | "economic" | "economy";
    date: Date;
  }[];
}

export const politicianSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  biography: z.string().optional(),
  education: z.string().optional(),
  profession: z.string().optional(),
  experienceYears: z
    .number()
    .min(0, "Experience years must be non-negative")
    .optional(),
  experiences: z
    .array(
      z.object({
        category: z.string(),
        title: z.string(),
        company: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .optional(),
  isIndependent: z.boolean().optional(),
  party: z.string().optional(),
  partyId: z.string().optional(),
  positionIds: z.array(z.string()).optional(),
  constituencyId: z.string().optional(),
  status: z.enum(["active", "inactive", "deceased"]).optional(),
  contact: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  age: z.number().min(0).max(150).optional(),
  rating: z.number().min(0).max(5).optional(),
  totalVotes: z.number().min(0).optional(),
  totalReports: z.number().min(0).optional(),
  verifiedReports: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  photoUrl: z.string().url().optional(),
  dateOfBirth: z.string().optional(),
  totalVotesReceived: z.number().min(0).optional(),
  termStartDate: z.string().optional(),
  termEndDate: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  officialWebsite: z.string().url().optional(),
  levelIds: z.array(z.string()).optional(),
  sourceCategories: z
    .object({
      party: z.string().nullable(),
      positions: z.array(z.string()),
      levels: z.array(z.string()),
    })
    .optional(),
  socialMedia: z
    .object({
      facebook: z.string().optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional(),
    })
    .optional(),
  promises: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        status: z.enum([
          "ongoing",
          "fulfilled",
          "broken",
          "not-started",
          "in-progress",
        ]),
        dueDate: z.string(),
        progress: z.number().min(0).max(100),
      }),
    )
    .optional(),
  achievements: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        category: z.enum([
          "policy",
          "development",
          "social",
          "economic",
          "economy",
        ]),
        date: z.date(),
      }),
    )
    .optional(),
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
