"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

import React, { useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Button } from "./ui/button";

import Sidebar from "./Sidebar";

import { useRouter } from "next/navigation";

import { useAuthStore, useLoadStore } from "@/store/authStore";

const Navbar = () => {
  const [side, setSide] = useState<boolean>(false);

  const router = useRouter();

  const { logout } = useAuthStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md text-black relative">
      {/* <div>Admin Dashboard</div> */}
      <div className="space-x-4 flex items-center">
        <Icon
          icon="iconamoon:menu-burger-horizontal-thin"
          fontSize={30}
          className="lg:hidden self-start cursor-pointer"
          onClick={() => {
            setSide(!side);
          }}
        />
        <h1 className="lg:hidden font-bold">Admin</h1>
      </div>

      <div className="flex items-center justify-end space-x-4  ">
        <Dialog>
          <DialogTrigger asChild>
            {/* <Button>Logout</Button> */}
            <Icon
              icon="lucide:log-out"
              fontSize={35}
              className="cursor-pointer"
              color="#754ffe"
            />
          </DialogTrigger>

          <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
            <DialogHeader>
              <DialogTitle>Do you want logout?</DialogTitle>
              <DialogDescription>Click yes to logout</DialogDescription>
            </DialogHeader>

            <div className="flex gap-5">
              <Button
                className="bg-[#754ffe] hover:bg-[#6f42c1]"
                onClick={() => {
                  startLoading();
                  logout();
                  localStorage.removeItem("token");
                  stopLoading();
                  router.push("/login");
                }}
                disabled={loading}
              >
                {loading && (
                  <span className="size-5 border-4 border-gray-500 border-t-white animate-spin me-2 rounded-full"></span>
                )}
                Yes
              </Button>

              <DialogClose asChild>
                <Button className="bg-red-700">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {side && (
        <div className="absolute left-0 top-16 bg-white w-full h-12/12 z-50 lg:hidden">
          <Sidebar side={side} setSide={setSide} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
