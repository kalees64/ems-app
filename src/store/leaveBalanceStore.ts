import { LeaveBalance, UptLeaveBalance } from "@/utils/objectTypes";

import axios from "axios";

import { create } from "zustand";

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
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/leaveBalance/user/id/${id}`
      );
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  },

  fetchLeaveBalances: async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/leaveBalance`
      );
      set({ balances: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  approveLeave: async (id, data) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/leaveBalance/id/${id}`,
        data
      );
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
