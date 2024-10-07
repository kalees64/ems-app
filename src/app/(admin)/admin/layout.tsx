"use client";

import Navbar from "@/components/Navbar";

import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";

import { useUserStore } from "@/store/userStore";

import { User } from "@/utils/objectTypes";

import React, { useEffect, useState } from "react";

import { Toaster } from "sonner";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { getAllUsers } = useUserStore();

  const [birUser, setBirUser] = useState<User[]>();

  const getBirthDay = async () => {
    const all = await getAllUsers();
    const date = new Date();
    const day = date.getDate().toString();
    const toDay = day.length < 2 ? "0" + day : day;
    const month = Number(date.getMonth()) + 1;
    const month1 = month.toString();
    const toMonth = month1.length < 2 ? "0" + month1 : month1;
    const findUser = all.filter((user: User) => {
      try {
        const userMonth = user.dob.slice(5, 7);
        const userDay = user.dob.slice(8, 10);
        if (userMonth == toMonth && userDay == toDay) {
          return user;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    });
    setBirUser(findUser);
  };

  useEffect(() => {
    getBirthDay();
  }, []);

  return (
    <main className="w-full h-screen overflow-hidden">
      <div className="flex">
        <div className="max-lg:hidden w-64">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col bg-[#f1f5f9] text-black h-screen w-full overflow-x-scroll">
          <Navbar />

          {/* Birthday wish section */}
          {birUser &&
            (birUser.length ? (
              <Card className="w-11/12 mx-auto py-2 animate-pulse  rounded flex flex-col justify-center items-center mt-3 max-sm:h-20 max-sm:ps-5">
                {birUser.map((user: User) => {
                  const role = user.roles[0].title;
                  return (
                    <h1 key={user.id} className="max-sm:text-sm">
                      {role} <b>{user.name}</b> celebrating his birthday today
                      !!!
                    </h1>
                  );
                })}
              </Card>
            ) : null)}

          <main className="p-4 h-full w-full ">{children}</main>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
};

export default AdminLayout;
