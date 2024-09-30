import { UpdateUser, User } from "@/utils/objectTypes";

import axios from "axios";

import { toast } from "sonner";

import { create } from "zustand";

interface UserStore {
  users: User[];
  fetchUsers: () => void;
  getUser: (id: string) => Promise<User>;
  createUser: (data: UpdateUser) => Promise<User>;
  updateUser: (id: string, data: UpdateUser) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],

  fetchUsers: async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      set({ users: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  getUser: async (id) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/id/${id}`
      );
      const user = res.data.data;
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  createUser: async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users`,
        data
      );
      set((state) => ({ users: [...state.users, res.data.data] }));
      return res.data.data;
    } catch (error) {
      setTimeout(() => {
        toast.error("User Not Added , User Already Found");

        console.log(error);
      }, 100);
    }
  },

  updateUser: async (id, data) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/id/${id}`,
        data
      );
      const user = res.data.data;
      set((state) => ({
        users: state.users.map((val) => (val.id === id ? user : val)),
      }));
      setTimeout(() => {
        toast.success("Employee Updated");
      }, 100);
    } catch (error) {
      setTimeout(() => {
        toast.success("Server Error");
        console.log(error);
      }, 100);
    }
  },

  deleteUser: async (id) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/id/${id}`
      );
      set((state) => ({
        users: state.users.filter((val) => val.id !== res.data.data.id),
      }));
      setTimeout(() => {
        toast.success("Employee Deleted");
      }, 100);
    } catch (error) {
      setTimeout(() => {
        toast.success("Server Error");
        console.log(error);
      }, 100);
    }
  },
}));
