"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationHelper = void 0;
const joi_1 = __importDefault(require("joi"));
class ValidationHelper {
}
exports.ValidationHelper = ValidationHelper;
ValidationHelper.userRegistration = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(8).required(),
    fullName: joi_1.default.string().min(8).max(100).required(),
    phone: joi_1.default.string()
        .pattern(/^[0-9]{10}$/)
        .optional(),
    district: joi_1.default.string().optional(),
    municipality: joi_1.default.string().optional(),
    wardNumber: joi_1.default.number().min(1).max(35).optional(),
});
ValidationHelper.corruptionReport = joi_1.default.object({
    title: joi_1.default.string().min(5).max(200).required(),
    description: joi_1.default.string().min(20).max(5000).required(),
    categoryId: joi_1.default.number().required(),
    locationDescription: joi_1.default.string().max(500).optional(),
    latitude: joi_1.default.number().min(-90).max(90).optional(),
    longitude: joi_1.default.number().min(-180).max(180).optional(),
    district: joi_1.default.string().optional(),
    municipality: joi_1.default.string().optional(),
    ward: joi_1.default.string().optional(),
    dateOccurred: joi_1.default.date().max("now").optional(),
    amountInvolved: joi_1.default.number().min(0).optional(),
    peopleAffectedCount: joi_1.default.number().min(1).optional(),
    isAnonymous: joi_1.default.boolean().default(false),
    publicVisibility: joi_1.default.string()
        .valid("public", "private", "restricted")
        .default("public"),
});
ValidationHelper.politicianRating = joi_1.default.object({
    rating: joi_1.default.number().min(1).max(5).required(),
    category: joi_1.default.string()
        .valid("overall", "transparency", "responsiveness", "effectiveness")
        .required(),
    comment: joi_1.default.string().max(1000).optional(),
});
ValidationHelper.pollCreation = joi_1.default.object({
    title: joi_1.default.string().min(5).max(200).required(),
    description: joi_1.default.string().min(10).max(1000).required(),
    options: joi_1.default.array()
        .items(joi_1.default.string().min(1).max(100))
        .min(2)
        .max(10)
        .required(),
});
ValidationHelper.pollUpdate = joi_1.default.object({
    title: joi_1.default.string().min(5).max(200).optional(),
    description: joi_1.default.string().min(10).max(1000).optional(),
});
ValidationHelper.pollOption = joi_1.default.object({
    option: joi_1.default.string().min(1).max(100).required(),
});
// Historical Event validations
ValidationHelper.historicalEvent = joi_1.default.object({
    title: joi_1.default.string().min(2).max(200).required(),
    description: joi_1.default.string().min(10).max(2000).required(),
    date: joi_1.default.string().required(),
    year: joi_1.default.number().min(1900).max(new Date().getFullYear()).required(),
    category: joi_1.default.string().valid("corruption", "political", "social", "economic").required(),
    significance: joi_1.default.string().valid("high", "medium", "low").required(),
});
ValidationHelper.historicalEventUpdate = joi_1.default.object({
    title: joi_1.default.string().min(2).max(200).optional(),
    description: joi_1.default.string().min(10).max(2000).optional(),
    date: joi_1.default.string().optional(),
    year: joi_1.default.number().min(1900).max(new Date().getFullYear()).optional(),
    category: joi_1.default.string().valid("corruption", "political", "social", "economic").optional(),
    significance: joi_1.default.string().valid("high", "medium", "low").optional(),
});
// Major Case validations
ValidationHelper.majorCase = joi_1.default.object({
    referenceNumber: joi_1.default.string().min(1).max(50).required(),
    title: joi_1.default.string().min(2).max(200).required(),
    description: joi_1.default.string().min(10).max(2000).required(),
    status: joi_1.default.string().valid("unsolved", "ongoing", "solved").required(),
    priority: joi_1.default.string().valid("urgent", "high", "medium", "low").required(),
    amountInvolved: joi_1.default.number().min(0).required(),
    upvotesCount: joi_1.default.number().min(0).default(0),
    category_id: joi_1.default.number().optional(),
    reporter_id: joi_1.default.string().optional(),
    is_anonymous: joi_1.default.boolean().default(false),
    location_description: joi_1.default.string().max(500).optional(),
    latitude: joi_1.default.string().optional(),
    longitude: joi_1.default.string().optional(),
    district: joi_1.default.string().optional(),
    municipality: joi_1.default.string().optional(),
    ward: joi_1.default.string().optional(),
    assigned_to_officer_id: joi_1.default.string().optional(),
    date_occurred: joi_1.default.string().optional(),
    people_affected_count: joi_1.default.number().min(0).optional(),
    public_visibility: joi_1.default.string().optional(),
    downvotes_count: joi_1.default.number().min(0).default(0),
    views_count: joi_1.default.number().min(0).default(0),
    shares_count: joi_1.default.number().min(0).default(0),
    resolved_at: joi_1.default.string().optional(),
    is_public: joi_1.default.boolean().default(true),
});
ValidationHelper.majorCaseUpdate = joi_1.default.object({
    referenceNumber: joi_1.default.string().min(1).max(50).optional(),
    title: joi_1.default.string().min(2).max(200).optional(),
    description: joi_1.default.string().min(10).max(2000).optional(),
    status: joi_1.default.string().valid("unsolved", "ongoing", "solved").optional(),
    priority: joi_1.default.string().valid("urgent", "high", "medium", "low").optional(),
    amountInvolved: joi_1.default.number().min(0).optional(),
    upvotesCount: joi_1.default.number().min(0).optional(),
    category_id: joi_1.default.number().optional(),
    reporter_id: joi_1.default.string().optional(),
    is_anonymous: joi_1.default.boolean().optional(),
    location_description: joi_1.default.string().max(500).optional(),
    latitude: joi_1.default.string().optional(),
    longitude: joi_1.default.string().optional(),
    district: joi_1.default.string().optional(),
    municipality: joi_1.default.string().optional(),
    ward: joi_1.default.string().optional(),
    assigned_to_officer_id: joi_1.default.string().optional(),
    date_occurred: joi_1.default.string().optional(),
    people_affected_count: joi_1.default.number().min(0).optional(),
    public_visibility: joi_1.default.string().optional(),
    downvotes_count: joi_1.default.number().min(0).optional(),
    views_count: joi_1.default.number().min(0).optional(),
    shares_count: joi_1.default.number().min(0).optional(),
    resolved_at: joi_1.default.string().optional(),
    is_public: joi_1.default.boolean().optional(),
});
// Geographic validations
ValidationHelper.district = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    provinceId: joi_1.default.number().min(1).max(7).required(),
});
ValidationHelper.municipality = joi_1.default.object({
    name: joi_1.default.string().min(2).max(100).required(),
    districtId: joi_1.default.string().required(),
    type: joi_1.default.string().valid("metropolitan", "sub_metropolitan", "municipality", "rural_municipality").required(),
});
ValidationHelper.ward = joi_1.default.object({
    number: joi_1.default.number().min(1).max(35).required(),
    municipalityId: joi_1.default.string().required(),
    name: joi_1.default.string().max(100).optional(),
});
// Politician validations
ValidationHelper.politician = joi_1.default.object({
    fullName: joi_1.default.string().min(2).max(100).required(),
    positionId: joi_1.default.number().min(1).required(),
    partyId: joi_1.default.number().min(1).required(),
    constituencyId: joi_1.default.number().min(1).required(),
    biography: joi_1.default.string().min(10).max(2000).required(),
    education: joi_1.default.string().min(2).max(200).required(),
    experienceYears: joi_1.default.number().min(0).required(),
    dateOfBirth: joi_1.default.string().required(),
    profileImageUrl: joi_1.default.string().uri().optional(),
    contactPhone: joi_1.default.string().min(10).max(15).required(),
    contactEmail: joi_1.default.string().email().required(),
    officialWebsite: joi_1.default.string().uri().optional(),
    socialMediaLinks: joi_1.default.object().optional(),
    status: joi_1.default.string().valid("active", "inactive", "deceased").required(),
    termStartDate: joi_1.default.string().required(),
    termEndDate: joi_1.default.string().required(),
    totalVotesReceived: joi_1.default.number().min(0).default(0),
});
ValidationHelper.politicianUpdate = joi_1.default.object({
    fullName: joi_1.default.string().min(2).max(100).optional(),
    positionId: joi_1.default.number().min(1).optional(),
    partyId: joi_1.default.number().min(1).optional(),
    constituencyId: joi_1.default.number().min(1).optional(),
    biography: joi_1.default.string().min(10).max(2000).optional(),
    education: joi_1.default.string().min(2).max(200).optional(),
    experienceYears: joi_1.default.number().min(0).optional(),
    dateOfBirth: joi_1.default.string().optional(),
    profileImageUrl: joi_1.default.string().uri().optional(),
    contactPhone: joi_1.default.string().min(10).max(15).optional(),
    contactEmail: joi_1.default.string().email().optional(),
    officialWebsite: joi_1.default.string().uri().optional(),
    socialMediaLinks: joi_1.default.object().optional(),
    status: joi_1.default.string().valid("active", "inactive", "deceased").optional(),
    termStartDate: joi_1.default.string().optional(),
    termEndDate: joi_1.default.string().optional(),
    totalVotesReceived: joi_1.default.number().min(0).optional(),
});
