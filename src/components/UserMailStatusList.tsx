"use client";

import React, { useEffect } from "react";

import { Card } from "./ui/card";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail } from "@/utils/objectTypes";

import { format } from "date-fns";

import { useLeavesStore } from "@/store/leaveStore";

import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/sub-components/CustomTable";

import { LuArrowDownUp } from "react-icons/lu";

const UserMailStatusList = ({ id }: { id: string }) => {
  const { mails, fetchMails } = useLeaveApplyStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  const userMails = mails.filter((mail) => mail.user.id === id);

  const colums: ColumnDef<LeaveMail>[] = [
    {
      header: "S.No",
      accessorFn: (_, index) => index + 1,
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
      header: "Request Date",
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
      header: "Half Day",
      accessorKey: "halfDay",
      cell: ({ row }) => {
        return row.original.halfDay ? "Yes" : "No";
      },
    },
    {
      header: "Half Day Session",
      accessorKey: "halfDaySession",
      cell: ({ row }) => {
        return row.original.halfDaySession ? row.original.halfDaySession : "-";
      },
    },
    {
      header: "Leave Type",
      accessorKey: "leaveType",
      cell: ({ row }) => {
        const userLeave = leaves.find(
          (val) => val.id === row.original.leaveType.id
        );
        return userLeave?.name;
      },
    },
    {
      header: "Total Days",
      accessorKey: "totalDays",
    },
    {
      header: "Comments",
      accessorKey: "comments",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return (
          <span
            className={`${
              row.original.status === "APPROVED"
                ? "text-lime-500"
                : row.original.status === "REQUESTED"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {row.original.status}
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    fetchMails();
    fetchLeaves();
  }, []);

  if (!mails) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full ">
      <Card className="w-full max-sm:px-1  relative  shadow ">
        <h2 className="text-lg font-semibold ps-2 pb-4 pt-2">
          All Mails ({userMails ? userMails.length : 0})
        </h2>
        <CustomTable
          columns={colums}
          data={userMails}
          placeholder="Filter by reason..."
          searchColumn="reason"
          hideSearch={true}
        />
      </Card>
    </section>
  );
};

export default UserMailStatusList;
