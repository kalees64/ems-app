import { LeaveData, LeaveDataCopy, LeaveMail } from "@/utils/objectTypes";

import { toast } from "sonner";

import { create } from "zustand";
import axiosAPI from "./axiosAPI";

interface LeaveApplyStore {
  mails: LeaveMail[];
  fetchMails: () => void;
  applyLeave: (data: LeaveData) => void;
  cancelLeave: (id: string, data: LeaveDataCopy) => void;
  approveMail: (id: string) => void;
  rejectLeave: (id: string, data: LeaveDataCopy) => void;
}

export const useLeaveApplyStore = create<LeaveApplyStore>((set) => ({
  mails: [],

  fetchMails: async () => {
    try {
      const res = await axiosAPI.get(`/leaveRequests`);
      set({ mails: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  applyLeave: async (data) => {
    try {
      const res = await axiosAPI.post(`/leaveRequests`, data);
      set((state) => ({ mails: [...state.mails, res.data.data] }));
      setTimeout(() => {
        toast.success("Leave Applied");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  cancelLeave: async (id, data) => {
    try {
      const res = await axiosAPI.put(`/leaveRequests/id/${id}`, data);
      set((state) => ({
        mails: state.mails.map((val) => (val.id === id ? res.data.data : val)),
      }));
      setTimeout(() => {
        toast.success("Leave Canceled");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  approveMail: async (id) => {
    const today = new Date().toISOString();
    try {
      const res = await axiosAPI.put(`/leaveRequests/id/${id}`, {
        status: "APPROVED",
        approvedDate: today,
      });
      set((state) => ({
        mails: state.mails.map((val) => (val.id === id ? res.data.data : val)),
      }));
      setTimeout(() => {
        toast.success("Leave Approved");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  rejectLeave: async (id, data) => {
    try {
      const res = await axiosAPI.put(`/leaveRequests/id/${id}`, data);
      set((state) => ({
        mails: state.mails.map((val) => (val.id === id ? res.data.data : val)),
      }));
      setTimeout(() => {
        toast.success("Leave Rejected");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },
}));
