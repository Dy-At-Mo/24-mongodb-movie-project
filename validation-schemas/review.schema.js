import { z } from "zod";


const reviewFields = {
  number: z
    .coerce
    .number()
    .min(0, "Rating must be at least 0")
    .max(10, "Rating must be at most 10"),

  comment: z
    .string()
    .trim()
    .optional(),
};

// create
export const createReviewSchema = z.object({
  number: reviewFields.number,
  comment: reviewFields.comment,
});

// Update 
export const updateReviewSchema = z
  .object({
    number: reviewFields.number.optional(),
    comment: reviewFields.comment,
  })
  .refine(
    (data) => data.number !== undefined || data.comment !== undefined,
    {
      message: "At least one field is required",
    }
  );
