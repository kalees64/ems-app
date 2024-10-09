"use client";

import { Card } from "@/components/ui/card";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useUserStore } from "@/store/userStore";

import { CustomTable } from "@/sub-components/CustomTable";

import { LeaveMail } from "@/utils/objectTypes";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";

import Link from "next/link";

import React, { useEffect } from "react";

import { LuArrowDownUp } from "react-icons/lu";

const AdminPageLeavesHistory = () => {
  const { mails, fetchMails } = useLeaveApplyStore();

  const { users, fetchUsers } = useUserStore();

  const userMails = mails.filter((mail) => mail.status === "APPROVED");

  const columns: ColumnDef<LeaveMail>[] = [
    {
      header: "S.No",
      accessorFn: (_, index) => {
        return index + 1;
      },
    },
    {
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Employee Name
            <LuArrowDownUp className=" h-3 w-3 " />
          </span>
        );
      },
      accessorKey: "user",
      cell: ({ row }) => {
        return (
          <Link
            href={`/admin/emp/${
              users.find((user) => user.id === row.original.user.id)?.id
            }`}
          >
            {users.find((user) => user.id === row.original.user.id)?.name}
          </Link>
        );
      },
    },
    {
      header: "Leave Type",
      accessorKey: "leaveType.name",
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Start Date
            <LuArrowDownUp className=" h-3 w-3 " />
          </span>
        );
      },
      cell: ({ row }) => {
        return format(row.original.startDate, "dd-MM-yyyy");
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        return format(row.original.endDate, "dd-MM-yyyy");
      },
    },
    {
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Request Date
            <LuArrowDownUp className=" h-3 w-3 " />
          </span>
        );
      },
      accessorKey: "appliedOn",
      cell: ({ row }) => {
        if (row.original.appliedOn) {
          return format(row.original.appliedOn, "dd-MM-yyyy");
        } else {
          return "...";
        }
      },
    },
    {
      header: "Approved Date",
      accessorKey: "approvedDate",
      cell: ({ row }) => {
        if (row.original.approvedDate) {
          return format(row.original.approvedDate, "dd-MM-yyyy");
        } else {
          return "...";
        }
      },
    },
    {
      header: "Reason",
      accessorKey: "reason",
    },

    {
      header: "Total Days",
      accessorKey: "totalDays",
    },
  ];

  useEffect(() => {
    fetchMails();
    fetchUsers();
  }, []);
  return (
    <section>
      <h1 className="text-2xl font-bold pb-3">Employee Leave History</h1>

      <Card className="py-2 pt-3 ">
        <CustomTable
          columns={columns}
          data={userMails}
          placeholder="Filter by reason"
          searchColumn="reason"
          hideSearch={false}
        />
      </Card>

      <p>Note: Only approved leaves data is displayed.</p>
    </section>
  );
};

export default AdminPageLeavesHistory;
