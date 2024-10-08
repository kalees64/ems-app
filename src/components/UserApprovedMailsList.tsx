"use client";

import React, { useEffect, useState } from "react";

import { Card } from "./ui/card";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail } from "@/utils/objectTypes";

import { format, isBefore } from "date-fns";

import { useLeavesStore } from "@/store/leaveStore";

import { Button } from "./ui/button";

import { ColumnDef } from "@tanstack/react-table";

import { TbMailCancel } from "react-icons/tb";

import { LuArrowDownUp } from "react-icons/lu";

import { CustomTable } from "@/sub-components/CustomTable";

import { useUserStore } from "@/store/userStore";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

const UserApprovedMailsList = ({ id }: { id: string }) => {
  const { mails, fetchMails } = useLeaveApplyStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  const userMails = mails.filter(
    (mail) => mail.user === id && mail.status === "APPROVED"
  );

  const { users, fetchUsers } = useUserStore();

  const [reason, setReason] = useState<string>("");

  const [error, setError] = useState<string>("");

  const { rejectLeave } = useLeaveApplyStore();

  const handleCancel = async (id: string) => {
    if (!reason) {
      return setError("Please enter the reason");
    }
    const today = new Date().toISOString();
    try {
      await rejectLeave(id, {
        comments: reason,
        status: "CANCELLED",
        approvedDate: today,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      header: "Leave Type",
      accessorKey: "leaveType",
      cell: ({ row }) => {
        const userLeave = leaves.find(
          (val) => val.id === row.original.leaveType
        );
        return userLeave?.name;
      },
    },
    {
      header: "Total Days",
      accessorKey: "totalDays",
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
                : row.original.status === "PENDING"
                ? "text-yellow-500"
                : "text-red-500"
            }`}
          >
            {row.original.status}
          </span>
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const day = row.original.startDate;
        const today = new Date();

        let isEnd: boolean;

        const user = users.find((val) => val.id === row.original.user);

        if (day) {
          isEnd = isBefore(day, today);

          return (
            <Dialog>
              <DialogTrigger>
                <TbMailCancel
                  size={25}
                  className={`cursor-pointer ${isEnd ? "hidden" : "block"}`}
                />
              </DialogTrigger>
              <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                <DialogHeader>
                  <h1>Email Cancellation Form</h1>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCancel(row.original.id);
                  }}
                >
                  <div>
                    <Label className="font-bold">Employee Name</Label>
                    <h1>{user?.name}</h1>
                  </div>
                  <div>
                    <Label className="font-bold">Leave Reason</Label>
                    <h1>{row.original.reason}</h1>
                  </div>
                  <div>
                    <Label className="font-bold">Leave Days</Label>
                    <h1>{row.original.totalDays}</h1>
                  </div>
                  <div>
                    <Label className="font-bold">Reason For Cancellation</Label>
                    <Input
                      placeholder="Reason..."
                      autoFocus
                      type="text"
                      value={reason}
                      onChange={(e) => {
                        setReason(e.target.value);
                        setError("");
                      }}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <DialogFooter className="pt-3">
                    <Button
                      type="submit"
                      className="bg-[#754ffe] hover:bg-[#6f42c1]"
                    >
                      Send
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          );
        }
      },
    },
  ];

  useEffect(() => {
    fetchMails();
    fetchLeaves();
    fetchUsers();
  }, []);

  if (!mails) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full ">
      <Card className="w-full max-sm:px-1  relative  shadow ">
        <h2 className="text-lg font-semibold ps-2 pb-4 pt-2">
          Approved Mails ({userMails ? userMails.length : 0})
        </h2>

        <CustomTable
          columns={colums}
          data={userMails}
          placeholder="Filter by reason"
          searchColumn="reason"
          hideSearch={true}
        />
      </Card>
    </section>
  );
};

export default UserApprovedMailsList;
