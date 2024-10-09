"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { BalanceLeave } from "@/components/UserPanel";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

import { useLeavesStore } from "@/store/leaveStore";

import { useUserStore } from "@/store/userStore";

import { CustomTable } from "@/sub-components/CustomTable";

import { LeaveMail, User } from "@/utils/objectTypes";

import { Icon } from "@iconify/react/dist/iconify.js";

import { ColumnDef } from "@tanstack/react-table";

import { format } from "date-fns";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

import { LuArrowDownUp } from "react-icons/lu";

const EmployeeProfile = ({ params }: { params: { id: string } }) => {
  const { getUser } = useUserStore();

  const router = useRouter();

  const [user, setUser] = useState<User>();

  const { mails, fetchMails } = useLeaveApplyStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  const userMails = mails.filter(
    (mail) => mail.user.id === params.id && mail.status === "APPROVED"
  );

  const start = async () => {
    const res = await getUser(params.id);
    setUser(res);
  };

  const { getUserBalanceLeave } = useLeaveBalanceStore();

  const [leaveBalace, setLeaveBalance] = useState<BalanceLeave>({
    totalLeaves: 0,
    usedLeaves: 0,
    sickLeaves: 0,
    casualLeaves: 0,
    paidLeaves: 0,
  });

  const getLeaveBalance = async () => {
    const res = await getUserBalanceLeave(params.id);
    let totalLeave: number = 0;
    let usedLeave: number = 0;
    let sickLeave: number = 0;
    let casualLeave: number = 0;
    let paidLeave: number = 0;

    res.forEach((val) => {
      totalLeave += val.allocated;
      usedLeave += val.used;
      if (val.leaveType.key === "SICK_LEAVE") {
        sickLeave = val.used;
      }
      if (val.leaveType.key === "PAID_LEAVE") {
        paidLeave = val.used;
      }
      if (val.leaveType.key === "CASUAL_LEAVE") {
        casualLeave = val.used;
      }
    });
    setLeaveBalance({
      totalLeaves: totalLeave,
      usedLeaves: usedLeave,
      sickLeaves: sickLeave,
      casualLeaves: casualLeave,
      paidLeaves: paidLeave,
    });
  };

  const columns: ColumnDef<LeaveMail>[] = [
    {
      header: "S.No",
      accessorFn: (_, index) => {
        return index + 1;
      },
    },
    {
      header: "Leave Type",
      cell: ({ row }) => {
        const leaveType = leaves.find(
          (val) => val.id === row.original.leaveType.id
        );
        return <span>{leaveType?.name}</span>;
      },
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
    start();
    fetchMails();
    fetchLeaves();
    getLeaveBalance();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <section>
        <div className="flex items-center gap-3 pb-3">
          <Icon
            icon="weui:back-filled"
            fontSize={25}
            className="cursor-pointer"
            onClick={() => {
              router.back();
            }}
          />
          <h1 className="text-2xl font-bold ">Employee Profile</h1>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableCell>{user.name}</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Phone</TableHead>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Gender</TableHead>
              <TableCell>{user.gender ? user.gender : "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Date of Joining</TableHead>
              <TableCell>
                {user.doj ? format(user.doj, "dd-MM-yyyy") : "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Date of Birth</TableHead>
              <TableCell>
                {user.dob ? format(user.dob, "dd-MM-yyyy") : ""}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Last Updated</TableHead>
              <TableCell>
                {user.updatedAt ? format(user.updatedAt, "dd-MM-yyyy") : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h1 className="text-2xl font-bold py-3">Leave Balance</h1>

        <div className="grid grid-cols-5 gap-4 mb-8 max-md:grid-cols-2 max-lg:grid-cols-3">
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Total Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.totalLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Casual Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.casualLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Sick Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.sickLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Paid Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.paidLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Leaves Taken
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.usedLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>
        </div>

        <h1 className="text-2xl font-bold py-3">Leave History</h1>

        <CustomTable
          columns={columns}
          data={userMails}
          placeholder="Filter by reason"
          searchColumn="reason"
          hideSearch={true}
        />
      </section>
    );
  }
};

export default EmployeeProfile;
