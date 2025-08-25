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
}
