"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

import { useRouter } from "next/navigation";

import React from "react";

const Sidebar = ({
  side,
  setSide,
}: {
  side?: boolean;
  setSide?: (data: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <div className="h-full w-full bg-[#1e293b] text-white flex flex-col space-y-4 p-4 ">
      <h1 className="text-xl font-bold max-lg:hidden w-full pt-2 ps-3 cursor-pointer">
        Admin Portal
      </h1>

      <nav className="flex flex-col space-y-4 pt-2 max-lg:pt-0 max-lg:pb-4 font-semibold">
        <div
          onClick={() => {
            router.push("/admin/employees");
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="flowbite:users-outline" fontSize={25} />

          <p>All Employees List</p>
        </div>

        <div
          onClick={() => {
            router.push("/admin/leave");
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="arcticons:office-reader" fontSize={25} />

          <p>Leave Types</p>
        </div>

        <div
          onClick={() => {
            router.push("/admin/reports");
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="iconoir:reports" fontSize={25} />
          <p>Reports</p>
        </div>

        <div
          onClick={() => {
            router.push("/admin/leave-history");
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="iconoir:reports" fontSize={25} />
          <p>Leave History</p>
        </div>

        <div
          onClick={() => {
            router.push("/admin/mails");
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="uiw:mail-o" fontSize={25} />
          <p>Mails</p>
        </div>

        <div
          onClick={() => {
            router.push("/admin/holidays");
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="uil:calender" fontSize={25} />
          <p>Holidays</p>
        </div>

        <div
          onClick={() => {
            router.push("/admin/leave-request");
            setSide?.(!side);
          }}
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center cursor-pointer"
        >
          <Icon icon="fluent:form-24-regular" fontSize={25} />
          <p>Leave Apply Form</p>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
