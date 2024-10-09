"use client";

import React, { useEffect } from "react";

import { Card } from "./ui/card";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail } from "@/utils/objectTypes";

import { useLeavesStore } from "@/store/leaveStore";

import { format } from "date-fns";

import { ColumnDef } from "@tanstack/react-table";

import { CustomTable } from "@/sub-components/CustomTable";

import { LuArrowDownUp } from "react-icons/lu";

const RejectedMails = () => {
  const { mails, fetchMails } = useLeaveApplyStore();

  const { leaves, fetchLeaves } = useLeavesStore();

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
      accessorKey: "user.name",
    },
    {
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
      accessorKey: "startDate",
      cell: ({ row }) => {
        return format(row.original.startDate, "dd-MM-yyyy");
      },
    },
    {
      header: "End Date",
      accessorKey: "endDate",
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
          return "-";
        }
      },
    },
    {
      header: "Responsed Date",
      accessorKey: "approvedDate",
      cell: ({ row }) => {
        if (row.original.approvedDate) {
          return format(row.original.approvedDate, "dd-MM-yyyy");
        } else {
          return "-";
        }
      },
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
      header: "Reason",
      accessorKey: "reason",
    },
    {
      header: "Leave Type",
      accessorKey: "leaveType",
      cell: ({ row }) => {
        const leaveType = leaves.find(
          (val) => val.id === row.original.leaveType.id
        );
        return leaveType?.name;
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
        return <span className="text-red-500">{row.original.status}</span>;
      },
    },
  ];

  useEffect(() => {
    fetchMails();
    fetchLeaves();
  }, []);

  const oldMails = mails.filter((val) => val.status === "REJECTED");

  return (
    <section className="w-full ">
      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative shadow ">
        <h2 className="text-lg font-semibold ps-3 pb-2 pt-2">
          Rejected Mails ({oldMails.length}){" "}
        </h2>

        <CustomTable
          columns={columns}
          data={oldMails}
          placeholder="Filter by Name..."
          searchColumn="user"
          hideSearch={true}
        />
      </Card>
    </section>
  );
};

export default RejectedMails;
