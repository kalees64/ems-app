import { z } from "zod";
import {
  leaveAddSchema,
  leaveApplySchema,
  loginSchema,
  registerSchema,
} from "./formSchemas";

// Login form data preDefine
export type T_loginData = z.infer<typeof loginSchema>;

// Register form data preDefine
export type T_registerData = z.infer<typeof registerSchema>;

// Leave add form data preDefine
export type T_leaveData = z.infer<typeof leaveAddSchema>;

// Leave application form submit type
export type T_leaveSubmit = z.infer<typeof leaveApplySchema>;

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
  roles?: string[];
}

// Leave type Predefine
export interface Leave {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  key: string;
  count: number;
  carryForward: boolean;
}

// Leave Type Create/Update predefine
export interface UpdateLeave {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  key?: string;
  count?: string;
  carryForward?: boolean;
}

// Leave application form type define
export interface ApplyLeave {
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
}

// Leave apply data type define
export interface LeaveData {
  startDate: string;
  endDate: string;
  appliedOn?: string;
  approvedDate?: string;
  halfDay: boolean;
  reason: string;
  totalDays: number;
  user: string;
  status: string;
  leaveType: string;
  comments?: string;
}

// Leave Apply form errors  type define
export interface LeaveDataCopy {
  startDate?: string;
  endDate?: string;
  appliedOn?: string;
  approvedDate?: string;
  halfDay?: boolean;
  reason?: string;
  totalDays?: number;
  user?: string;
  status?: string;
  leaveType?: string;
  comments?: string;
}

// Leave Mail Object
export interface LeaveMail {
  id: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  appliedOn: null | string;
  approvedDate: null | string;
  halfDay: boolean;
  halfDaySession: null | string;
  reason: string;
  status: string;
  comments: null | string;
  totalDays: number;
  approvedBy: null | User;
  assignedTo: null | User;
  user: string;
  leaveType: string;
}

// Holiday object
export interface Holiday {
  id?: string;
  name: string;
  shortDescription?: string;
  date: string;
}

// Leave Balance
export interface LeaveBalance {
  id: string;
  createdAt: string;
  updatedAt: string;
  allocated: number;
  used: number;
  remaining: number;
  leaveType: Leave;
  user: User;
}

// Update LeaveBalance
export interface UptLeaveBalance {
  id?: string;
  allocated?: number;
  used: number;
  remaining: number;
  leaveType?: Leave;
  user?: User;
}
