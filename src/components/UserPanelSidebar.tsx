"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

import { useRouter } from "next/navigation";

import React from "react";

const UserPanelSidebar = ({
  side,
  setSide,
  id,
}: {
  side?: boolean;
  setSide?: (data: boolean) => void;
  id: string;
}) => {
  const router = useRouter();

  return (
    <div className="h-full w-full bg-[#1e293b] text-white flex flex-col space-y-4 p-4 ">
      <h1 className="text-xl font-bold max-lg:hidden w-full pt-2 ps-3 cursor-pointer">
        Employee Panel
      </h1>

      <nav className="flex flex-col space-y-4 pt-2 max-lg:pt-0 max-lg:pb-4 font-semibold">
        <div
          onClick={() => {
            router.push(`/employee/${id}`);
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="pixelarticons:dashboard" fontSize={25} />

          <p>Dashboard</p>
        </div>

        <div
          onClick={() => {
            router.push(`/employee/${id}/leave-request`);
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="majesticons:mail-line" fontSize={25} />

          <p>Leave Request Form</p>
        </div>

        <div
          onClick={() => {
            router.push(`/employee/${id}/requests`);
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="majesticons:mail-open-line" fontSize={25} />
          <p>Mails</p>
        </div>
      </nav>
    </div>
  );
};

export default UserPanelSidebar;
