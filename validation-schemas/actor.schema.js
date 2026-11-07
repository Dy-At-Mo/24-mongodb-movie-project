import { z } from "zod";


const actorFields = {
  name: z
    .string()
    .trim()
    .min(1, "Actor name is required"),

  birthdate: z
    .string()
    .optional()
    .refine(
      (value) => !value || !Number.isNaN(Date.parse(value)),
      "Invalid birthdate"
    ),
};

// create Actor
export const createActorSchema = z.object(actorFields);

// update actor
export const updateActorSchema = z.object({
  name: actorFields.name.optional(),
  birthdate: actorFields.birthdate,
});
