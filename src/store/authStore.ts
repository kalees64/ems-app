"use client";
import { loginData, User } from "@/utils/objectTypes";
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

interface loginAuth {
  user: object;
  login: (data: loginData) => Promise<User>;
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
}));
