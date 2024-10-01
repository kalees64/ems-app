import { Holiday } from "@/utils/objectTypes";

import axios from "axios";

import { toast } from "sonner";

import { create } from "zustand";

interface HolidayStore {
  holidays: Holiday[];
  holidaysList: string[];
  fetchHolidays: () => void;
  addHoliday: (data: Holiday) => void;
  updateHoliday: (id: string, data: Holiday) => void;
  deleteHoliday: (id: string) => void;
}

export const useHolidayStore = create<HolidayStore>((set) => ({
  holidays: [],

  holidaysList: [],

  fetchHolidays: async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/holiday`);
      set({ holidays: res.data.data });

      const list: string[] = res.data.data.map((val: Holiday) => {
        const fDate = val.date.slice(0, 10);
        return fDate;
      });
      set({ holidaysList: list });
    } catch (error) {
      console.log(error);
    }
  },

  addHoliday: async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/holiday`,
        data
      );
      set((state) => ({ holidays: [...state.holidays, res.data.data] }));
      setTimeout(() => {
        toast.success("Holiday Added");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  updateHoliday: async (id, data) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/holiday/id/${id}`,
        data
      );
      set((state) => ({
        holidays: state.holidays.map((val) =>
          val.id === id ? res.data.data : val
        ),
      }));
      setTimeout(() => {
        toast.success("Holiday Updated");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },

  deleteHoliday: async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/holiday/id/${id}`
      );
      set((state) => ({
        holidays: state.holidays.filter((val) => val.id !== res.data.data.id),
      }));
      setTimeout(() => {
        toast.success("Holiday Deleted");
      }, 100);
    } catch (error) {
      console.log(error);
    }
  },
}));
