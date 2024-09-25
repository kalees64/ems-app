import { z } from "zod";
import { loginSchema, registerSchema } from "./formSchemas";

// Login form data preDefine
export type loginData = z.infer<typeof loginSchema>;

// Register form data preDefine
export type registerData = z.infer<typeof registerSchema>;

// User Data PreDefine
export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  doj: string;
  dob: string;
  phone: string;
  alternatePhone: string;
  password: string;
  roles: [
    {
      id: string;
      createdAt: string;
      updatedAt: string;
      title: string;
      key: string;
      description: string;
      active: boolean;
      default: boolean;
      users: [string];
      permissions: string;
    }
  ];
}

// UpdateUser preDefine

export interface UpdateUser {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  email?: string;
  doj?: string;
  dob?: string;
  phone?: string;
  alternatePhone?: string;
  password?: string;
  roles?: [
    {
      id?: string;
      createdAt?: string;
      updatedAt?: string;
      title?: string;
      key?: string;
      description?: string;
      active?: boolean;
      default?: boolean;
      users?: [string];
      permissions?: string;
    }
  ];
}
