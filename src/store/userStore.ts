import { UpdateUser, User } from "@/utils/objectTypes";

import { toast } from "sonner";

import { create } from "zustand";

import axiosAPI from "./axiosAPI";

interface UserStore {
  users: User[];
  fetchUsers: () => void;
  getAllUsers: () => Promise<User[]>;
  getUser: (id: string) => Promise<User>;
  createUser: (data: UpdateUser) => Promise<User>;
  updateUser: (id: string, data: UpdateUser) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],

  fetchUsers: async () => {
    try {
      const res = await axiosAPI.get(`/users`);
      set({ users: res.data.data });
    } catch (error) {
      console.log(error);
    }
  },

  getAllUsers: async () => {
    try {
      const res = await axiosAPI.get(`/users`);
      set({ users: res.data.data });
      return res.data.data;
    } catch (error) {
      console.log(error);
    }
  },

  getUser: async (id) => {
    try {
      const res = await axiosAPI.get(`/users/id/${id}`);
      const user = res.data.data;
      return user;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  createUser: async (data) => {
    try {
      const res = await axiosAPI.post(`/users`, data);
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
      const res = await axiosAPI.put(`/users/id/${id}`, data);
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
      const res = await axiosAPI.delete(`/users/id/${id}`);
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

export const getToken = async () => {
  const res = await localStorage.getItem("token");
  if (res) {
    const data = await JSON.parse(res);
    const token = data.token;
    return token;
  }
};

export const getUserIDfromToken = async () => {
  const res = await localStorage.getItem("token");
  if (res) {
    const data = await JSON.parse(res);
    const user = data.user;
    return user.id;
  }
};
