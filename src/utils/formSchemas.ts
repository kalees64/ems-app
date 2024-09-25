import { z } from "zod";

// Login form Schema
export const loginSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 8 characters to 16 characters long")
      .max(16, "Password must be at least 8 characters to 16 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      ),
  })
  .required();

// Register form Schema
export const registerSchema = z.object({
  name: z.string().min(3, { message: "Name should be greater than 3 letters" }),
  email: z.string().email("Please enter the valid email address"),
  phone: z
    .string()
    .min(10, { message: "Phone number should be 10 digits" })
    .max(10, { message: "Phone number should be 10 digits" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters to 16 characters long")
    .max(16, "Password must be at least 8 characters to 16 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must include at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
});
