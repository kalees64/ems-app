"use client";

import { T_loginData, User } from "@/utils/objectTypes";

import { create } from "zustand";

import axios from "axios";

import { toast } from "sonner";

interface loginAuth {
  user: object;
  login: (data: T_loginData) => Promise<User>;
  logout: () => void;
}

export const useAuthStore = create<loginAuth>((set) => ({
  user: {},

  login: async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        data,
        { withCredentials: true }
      );
      localStorage.setItem("token", JSON.stringify(res.data.data));
      setTimeout(() => {
        toast.success("Login successfull");
      }, 100);
      const getUser = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/id/${res.data.data.user.id}`
      );
      const user = getUser.data.data;
      set({ user: user });
      return user;
    } catch (error) {
      setTimeout(() => {
        toast.error("Invalid Email & Password");
        console.log(error);
      }, 100);
    }
  },

  logout: async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        { withCredentials: true }
      );
      localStorage.removeItem("token");
      console.log(res);
      setTimeout(() => {
        toast.success("Logout successfull");
      }, 100);
    } catch (error) {
      setTimeout(() => {
        toast.error("");
        console.log(error);
      }, 100);
    }
  },
}));

interface Load {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoadStore = create<Load>((set) => ({
  loading: false,

  startLoading: () => set({ loading: true }),

  stopLoading: () => set({ loading: false }),
}));
