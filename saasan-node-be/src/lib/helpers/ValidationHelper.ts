import Joi from "joi";

export class ValidationHelper {
  static userRegistration = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    fullName: Joi.string().min(8).max(100).required(),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional(),
    district: Joi.string().optional(),
    municipality: Joi.string().optional(),
    wardNumber: Joi.number().min(1).max(35).optional(),
  });

  static corruptionReport = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(20).max(5000).required(),
    categoryId: Joi.number().required(),
    locationDescription: Joi.string().max(500).optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    district: Joi.string().optional(),
    municipality: Joi.string().optional(),
    ward: Joi.string().optional(),
    dateOccurred: Joi.date().max("now").optional(),
    amountInvolved: Joi.number().min(0).optional(),
    peopleAffectedCount: Joi.number().min(1).optional(),
    isAnonymous: Joi.boolean().default(false),
    publicVisibility: Joi.string()
      .valid("public", "private", "restricted")
      .default("public"),
  });

  static politicianRating = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    category: Joi.string()
      .valid("overall", "transparency", "responsiveness", "effectiveness")
      .required(),
    comment: Joi.string().max(1000).optional(),
  });

  static pollCreation = Joi.object({
    title: Joi.string().min(5).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    type: Joi.string()
      .valid("single_choice", "multiple_choice", "rating")
      .required(),
    options: Joi.array()
      .items(Joi.string().min(1).max(100))
      .min(2)
      .max(10)
      .required(),
    status: Joi.string().valid("active", "inactive").required(),
    category: Joi.string().min(1).max(100).required(),
    end_date: Joi.string().required(),
    is_anonymous: Joi.boolean().required(),
    requires_verification: Joi.boolean().required(),
  });

  static pollUpdate = Joi.object({
    title: Joi.string().min(5).max(200).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    type: Joi.string()
      .valid("single_choice", "multiple_choice", "rating")
      .optional(),
    options: Joi.array()
      .items(Joi.string().min(1).max(100))
      .min(2)
      .max(10)
      .optional(),
    status: Joi.string().valid("active", "inactive").optional(),
    category: Joi.string().min(1).max(100).optional(),
    end_date: Joi.string().optional(),
    is_anonymous: Joi.boolean().optional(),
    requires_verification: Joi.boolean().optional(),
  });

  static pollOption = Joi.object({
    text: Joi.string().min(1).max(100).required(),
  });

  // Historical Event validations
  static historicalEvent = Joi.object({
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    date: Joi.string().required(),
    year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
    category: Joi.string()
      .valid("corruption", "political", "social", "economic")
      .required(),
    significance: Joi.string().valid("high", "medium", "low").required(),
  });

  static historicalEventUpdate = Joi.object({
    title: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    date: Joi.string().optional(),
    year: Joi.number().min(1900).max(new Date().getFullYear()).optional(),
    category: Joi.string()
      .valid("corruption", "political", "social", "economic")
      .optional(),
    significance: Joi.string().valid("high", "medium", "low").optional(),
  });

  // Major Case validations
  static majorCase = Joi.object({
    referenceNumber: Joi.string().min(1).max(50).required(),
    title: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    status: Joi.string().valid("unsolved", "ongoing", "solved").required(),
    priority: Joi.string().valid("urgent", "high", "medium", "low").required(),
    amountInvolved: Joi.number().min(0).required(),
    upvotesCount: Joi.number().min(0).default(0),
    category_id: Joi.number().optional(),
    reporter_id: Joi.string().optional(),
    is_anonymous: Joi.boolean().default(false),
    location_description: Joi.string().max(500).optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    district: Joi.string().optional(),
    municipality: Joi.string().optional(),
    ward: Joi.string().optional(),
    assigned_to_officer_id: Joi.string().optional(),
    date_occurred: Joi.string().optional(),
    people_affected_count: Joi.number().min(0).optional(),
    public_visibility: Joi.string().optional(),
    downvotes_count: Joi.number().min(0).default(0),
    views_count: Joi.number().min(0).default(0),
    shares_count: Joi.number().min(0).default(0),
    resolved_at: Joi.string().optional(),
    is_public: Joi.boolean().default(true),
  });

  static majorCaseUpdate = Joi.object({
    referenceNumber: Joi.string().min(1).max(50).optional(),
    title: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    status: Joi.string().valid("unsolved", "ongoing", "solved").optional(),
    priority: Joi.string().valid("urgent", "high", "medium", "low").optional(),
    amountInvolved: Joi.number().min(0).optional(),
    upvotesCount: Joi.number().min(0).optional(),
    category_id: Joi.number().optional(),
    reporter_id: Joi.string().optional(),
    is_anonymous: Joi.boolean().optional(),
    location_description: Joi.string().max(500).optional(),
    latitude: Joi.string().optional(),
    longitude: Joi.string().optional(),
    district: Joi.string().optional(),
    municipality: Joi.string().optional(),
    ward: Joi.string().optional(),
    assigned_to_officer_id: Joi.string().optional(),
    date_occurred: Joi.string().optional(),
    people_affected_count: Joi.number().min(0).optional(),
    public_visibility: Joi.string().optional(),
    downvotes_count: Joi.number().min(0).optional(),
    views_count: Joi.number().min(0).optional(),
    shares_count: Joi.number().min(0).optional(),
    resolved_at: Joi.string().optional(),
    is_public: Joi.boolean().optional(),
  });

  // Geographic validations
  static district = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    provinceId: Joi.number().min(1).max(7).required(),
  });

  static municipality = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    districtId: Joi.string().required(),
    type: Joi.string()
      .valid(
        "metropolitan",
        "sub_metropolitan",
        "municipality",
        "rural_municipality"
      )
      .required(),
  });

  static ward = Joi.object({
    number: Joi.number().min(1).max(35).required(),
    municipalityId: Joi.string().required(),
    name: Joi.string().max(100).optional(),
  });

  // Politician validations
  static politician = Joi.object({
    fullName: Joi.string().min(2).max(100).required(),
    positionId: Joi.number().min(1).required(),
    partyId: Joi.number().min(1).required(),
    constituencyId: Joi.number().min(1).required(),
    biography: Joi.string().min(10).max(2000).required(),
    education: Joi.string().min(2).max(200).required(),
    experienceYears: Joi.number().min(0).required(),
    dateOfBirth: Joi.string().required(),
    profileImageUrl: Joi.string().uri().optional(),
    contactPhone: Joi.string().min(10).max(15).required(),
    contactEmail: Joi.string().email().required(),
    officialWebsite: Joi.string().uri().optional(),
    socialMediaLinks: Joi.object().optional(),
    status: Joi.string().valid("active", "inactive", "deceased").required(),
    termStartDate: Joi.string().required(),
    termEndDate: Joi.string().required(),
    totalVotesReceived: Joi.number().min(0).default(0),
  });

  static politicianUpdate = Joi.object({
    fullName: Joi.string().min(2).max(100).optional(),
    positionId: Joi.number().min(1).optional(),
    partyId: Joi.number().min(1).optional(),
    constituencyId: Joi.number().min(1).optional(),
    biography: Joi.string().min(10).max(2000).optional(),
    education: Joi.string().min(2).max(200).optional(),
    experienceYears: Joi.number().min(0).optional(),
    dateOfBirth: Joi.string().optional(),
    profileImageUrl: Joi.string().uri().optional(),
    contactPhone: Joi.string().min(10).max(15).optional(),
    contactEmail: Joi.string().email().optional(),
    officialWebsite: Joi.string().uri().optional(),
    socialMediaLinks: Joi.object().optional(),
    status: Joi.string().valid("active", "inactive", "deceased").optional(),
    termStartDate: Joi.string().optional(),
    termEndDate: Joi.string().optional(),
    totalVotesReceived: Joi.number().min(0).optional(),
  });
}
