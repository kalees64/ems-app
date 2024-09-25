import { UpdateUser, User } from "@/utils/objectTypes";
import axios from "axios";
import { toast } from "sonner";
import { create } from "zustand";

interface UserStore {
  users: User[];
  fetchUsers: () => void;
  getUser: (id: string) => Promise<User>;
  createUser: (data: User) => void;
  updateUser: (id: string, data: UpdateUser) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  fetchUsers: () => {},
  getUser: async (id) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/id/${id}`
      );
      const user = res.data.data;
      return user;
    } catch (error) {
      return null;
    }
  },
  createUser: (data) => {},
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
      }, 100);
    }
  },
  deleteUser: (id) => {},
}));
