import { LeaveData, LeaveMail } from "@/utils/objectTypes";

import axios from "axios";

import { toast } from "sonner";

import { create } from "zustand";

interface LeaveApplyStore {
  mails: LeaveMail[];
  fetchMails: () => void;
  applyLeave: (data: LeaveData) => void;
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
}));
