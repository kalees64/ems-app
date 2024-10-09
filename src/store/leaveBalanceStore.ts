import { LeaveBalance, UptLeaveBalance } from "@/utils/objectTypes";

import { create } from "zustand";
import axiosAPI from "./axiosAPI";

interface LeaveBalanceStore {
  balances: LeaveBalance[];
  getUserBalanceLeave: (id: string) => Promise<LeaveBalance[]>;
  fetchLeaveBalances: () => {};
  approveLeave: (id: string, data: UptLeaveBalance) => Promise<boolean>;
}

export const useLeaveBalanceStore = create<LeaveBalanceStore>((set) => ({
  balances: [],

  getUserBalanceLeave: async (id: string) => {
    try {
      const res = await axiosAPI.get(`/leaveBalance/user/id/${id}`);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  },

  fetchLeaveBalances: async () => {
    try {
      const res = await axiosAPI.get(`/leaveBalance`);
      set({ balances: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  approveLeave: async (id, data) => {
    try {
      const res = await axiosAPI.put(`/leaveBalance/id/${id}`, data);
      set((state) => ({
        balances: state.balances.map((val) =>
          val.id === id ? res.data.data : val
        ),
      }));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
}));
