import { Leave, UpdateLeave } from "@/utils/objectTypes";

import { toast } from "sonner";

import { create } from "zustand";

import axiosAPI from "./axiosAPI";

interface LeaveStore {
  leaves: Leave[];
  fetchLeaves: () => void;
  addLeave: (data: UpdateLeave) => void;
  updateLeave: (id: string, data: UpdateLeave) => void;
  deleteLeave: (id: string) => void;
  getLeave: (id: string) => Promise<Leave>;
}

export const useLeavesStore = create<LeaveStore>((set) => ({
  leaves: [],

  fetchLeaves: async () => {
    try {
      const res = await axiosAPI.get(`/leaveTypes`);
      set({ leaves: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  addLeave: async (data) => {
    try {
      const res = await axiosAPI.post(`/leaveTypes`, data);
      set((state) => ({ leaves: [...state.leaves, res.data.data] }));
      setTimeout(() => {
        toast.success("Leave Added");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  deleteLeave: async (id) => {
    try {
      const res = await axiosAPI.delete(`/leaveTypes/id/${id}`);
      set((state) => ({
        leaves: state.leaves.filter((val) => val.id !== res.data.data.id),
      }));
      setTimeout(() => {
        toast.success("Leave Deleted");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  updateLeave: async (id, data) => {
    try {
      const res = await axiosAPI.put(`/leaveTypes/id/${id}`, data);
      set((state) => ({
        leaves: state.leaves.map((val) =>
          val.id === id ? res.data.data : val
        ),
      }));
      setTimeout(() => {
        toast.success("Leave Updated");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  getLeave: async (id) => {
    try {
      const res = await axiosAPI.get(`/leaveTypes/id/${id}`);
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  },
}));
