"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UserPanelSidebar from "@/components/UserPanelSidebar";

import { useLoadStore } from "@/store/authStore";

import { Icon } from "@iconify/react/dist/iconify.js";

import { useRouter } from "next/navigation";

import React, { useState } from "react";

import { Toaster } from "sonner";

const UserLayout = ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const router = useRouter();

  const [side, setSide] = useState<boolean>(false);

  const { loading, startLoading, stopLoading } = useLoadStore();

  return (
    <main className="w-full h-screen overflow-hidden">
      <div className="flex">
        <div className="max-lg:hidden w-64">
          <UserPanelSidebar id={params.id} />
        </div>

        <div className="flex-1 flex flex-col bg-[#f1f5f9] text-black h-screen w-full overflow-x-scroll">
          {/* Nav Bar */}
          <div className="flex justify-between items-center  border-b-2 px-6 py-4 bg-white lg:justify-end">
            <h1
              className="text-2xl font-bold max-md:text-xl max-sm:text-lg cursor-pointer lg:hidden"
              onClick={() => {
                router.push(`/employee/${params.id}`);
              }}
            >
              Employee Dashboard
            </h1>

            <div className="flex gap-4 items-center text-[#637085]">
              <Icon
                icon="iconamoon:menu-burger-horizontal-thin"
                fontSize={30}
                className="lg:hidden self-start cursor-pointer"
                onClick={() => {
                  setSide(!side);
                }}
              />

              <Icon
                icon="gg:profile"
                fontSize={35}
                className="cursor-pointer max-sm:size-7"
                color="#754ffe"
                onClick={() => {
                  router.push(`/employee/${params.id}/profile`);
                }}
              />

              <Dialog>
                <DialogTrigger asChild>
                  <Icon
                    icon="lucide:log-out"
                    fontSize={35}
                    className="cursor-pointer max-sm:size-7"
                    color="#754ffe"
                  />
                </DialogTrigger>

                <DialogContent className="bg-white text-black max-sm:w-11/12">
                  <DialogHeader>
                    <DialogTitle>Do you want logout?</DialogTitle>
                    <DialogDescription>Click yes to logout</DialogDescription>
                  </DialogHeader>

                  <div className="flex gap-5">
                    <Button
                      onClick={() => {
                        startLoading();
                        // logout();
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
          </div>

          {side && (
            <div className="absolute left-0 top-16 bg-white w-full h-12/12 z-50 lg:hidden">
              <UserPanelSidebar id={params.id} side={side} setSide={setSide} />
            </div>
          )}

          <main className="p-4 h-full w-full ">{children}</main>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
};

export default UserLayout;
