import { LeaveData, LeaveDataCopy, LeaveMail } from "@/utils/objectTypes";

import axios from "axios";

import { toast } from "sonner";

import { create } from "zustand";

interface LeaveApplyStore {
  mails: LeaveMail[];
  fetchMails: () => void;
  applyLeave: (data: LeaveData) => void;
  cancelLeave: (id: string) => void;
  rejectLeave: (id: string, data: LeaveDataCopy) => void;
}

export const useLeaveApplyStore = create<LeaveApplyStore>((set) => ({
  mails: [],

  fetchMails: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/leaveRequests`
      );
      set({ mails: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  applyLeave: async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/leaveRequests`,
        data
      );
      set((state) => ({ mails: [...state.mails, res.data.data] }));
      setTimeout(() => {
        toast.success("Leave Applied");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  cancelLeave: async (id) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/leaveRequests/id/${id}`,
        { status: "CANCELLED" }
      );
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

  rejectLeave: async (id, data) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/leaveRequests/id/${id}`,
        data
      );
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
