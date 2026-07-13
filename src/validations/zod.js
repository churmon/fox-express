import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const vehicleCheckSchema = z.object({// ObjectId as string
  driverName: z.string().optional(),
  regNumber: z.string().min(2),
  details: z.string().optional(),
  images: z.array(z.string().url()).default([]), // Cloudinary URLs
  checklist: z.array(z.string()).default([]), // JSON strings
});