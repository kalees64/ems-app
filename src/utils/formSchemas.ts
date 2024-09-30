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

// Leave add form schema
export const leaveAddSchema = z
  .object({
    name: z.string().min(3, "Leave name should be  greater than 3 letters"),
    count: z
      .string()
      .length(2, { message: "Must be exactly 12 characters long." }) // Ensure the string is exactly 12 characters long
      .regex(/^[0-9]+$/, { message: "Must contain only numeric characters." }),
    // key: z.string().min(3, "Key name should be  greater than 3 letters"),
  })
  .required();

// Leave apply form schema
export const leaveApplySchema = z.object({
  startDate: z
    .string()
    .min(1, { message: "From date is required." })
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "From date must be a valid date.",
    }),
  endDate: z
    .string()
    .min(1, { message: "To date is required." })
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "To date must be a valid date.",
    })
    .refine(
      (endDate) => {
        const startDate = z
          .object({
            startDate: z.string(),
            endDate: z.string(),
          })
          .parse({ startDate: "2023-01-01", endDate });
        if (startDate && new Date(endDate) < new Date(startDate.startDate)) {
          return false;
        }
        return true;
      },
      {
        message: "To date must be on or after the From date.",
      }
    ),
  leaveType: z.string().min(1, { message: "Leave type is required." }),
  reason: z.string().min(1, { message: "Reason is required." }),
});
