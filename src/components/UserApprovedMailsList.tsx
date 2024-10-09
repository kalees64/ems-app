"use client";

import React, { useEffect, useState } from "react";

import { Card } from "./ui/card";

import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./ui/dialog";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail, User } from "@/utils/objectTypes";

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

  const [openCancel, setOpenCancel] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<User>();

  const [selectedMail, setSelectedMail] = useState<LeaveMail>();

  const { cancelLeave } = useLeaveApplyStore();

  const handleCancel = async (id: string) => {
    if (!reason) {
      return setError("Please enter the reason");
    }
    try {
      await cancelLeave(id, {
        comments: reason,
        status: "CANCELLED",
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
            <TbMailCancel
              size={25}
              className={`cursor-pointer ${isEnd ? "hidden" : "block"}`}
              onClick={() => {
                setOpenCancel(true);
                setSelectedUser(user);
                setSelectedMail(row.original);
              }}
            />
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

        <Dialog open={openCancel} onOpenChange={() => setOpenCancel(false)}>
          <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
            <DialogHeader>
              <h1 className="font-bold">Email Cancellation Form</h1>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCancel(selectedMail ? selectedMail.id : "");
              }}
            >
              <div>
                <Label className="font-bold">Employee Name</Label>
                <h1>{selectedUser?.name}</h1>
              </div>
              <div>
                <Label className="font-bold">Leave Reason</Label>
                <h1>{selectedMail?.reason}</h1>
              </div>
              <div>
                <Label className="font-bold">Leave Days</Label>
                <h1>{selectedMail?.totalDays}</h1>
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
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </section>
  );
};

export default UserApprovedMailsList;
