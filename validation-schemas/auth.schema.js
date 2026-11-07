import { z } from "zod";


const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain an uppercase letter")
  .regex(/[a-z]/, "Password must contain a lowercase letter")
  .regex(/[0-9]/, "Password must contain a digit")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain a special character"
  );

// Register
export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, "Username must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    password: passwordSchema,

    password_confirmation: z.string(),
  })
  .refine(
    (data) => data.password === data.password_confirmation,
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    }
  );



// Login
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});



// Forgot Password
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
});

// Reset Password
export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    otp: z
      .string()
      .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

    new_password: passwordSchema,

    new_password_confirmation: z.string(),
  })
  .refine(
    (data) => data.new_password === data.new_password_confirmation,
    {
      message: "Passwords do not match",
      path: ["new_password_confirmation"],
    }
  );
