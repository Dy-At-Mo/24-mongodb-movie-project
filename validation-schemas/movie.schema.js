import { z } from "zod";

const genresSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      return value.split(",").map((genre) => genre.trim());
    }

    return value;
  },
  z.array(z.string().trim().min(1))
    .min(1, "At least one genre is required")
);

// Actors validation
const actorsSchema = z.preprocess(
  (value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return [value];
      }
    }

    return value;
  },
  z.array(z.string())
);

// Movie fields
const movieFields = {
  title: z.string().trim().min(1, "Title is required"),

  year: z.coerce
    .number()
    .int()
    .min(1888, "Year must be 1888 or later")
    .max(2100, "Year cannot exceed 2100"),

  genres: genresSchema,

  description: z.string().trim().min(1, "Description is required"),

  trailerLink: z
    .string()
    .url("Invalid trailer URL")
    .refine(
      (value) => {
        try {
          const url = new URL(value);

          return (
            ["youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be", "m.youtube.com"].includes(url.hostname) &&
            (url.hostname.includes("youtu.be") || url.pathname === "/watch" || url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/"))
          );
        } catch {
          return false;
        }
      },
      "Trailer must be a valid YouTube URL"
    ),

  director: z.string().trim().min(1, "Director is required"),

  actors: actorsSchema.optional(),
};

// Create Movie
export const createMovieSchema = z.object(movieFields);

// Update Movie
export const updateMovieSchema = z.object(
  Object.fromEntries(
    Object.entries(movieFields).map(([key, schema]) => [
      key,
      schema.optional(),
    ])
  )
);
