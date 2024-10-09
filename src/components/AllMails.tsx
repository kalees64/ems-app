"use client";

import React, { useEffect, useState } from "react";

import { Card } from "./ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail, User } from "@/utils/objectTypes";

import { useUserStore } from "@/store/userStore";

import { useLeavesStore } from "@/store/leaveStore";

import { Icon } from "@iconify/react/dist/iconify.js";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

import { format } from "date-fns";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

import { toast } from "sonner";

import { ColumnDef } from "@tanstack/react-table";

import { LuArrowDownUp } from "react-icons/lu";

import { CustomTable } from "@/sub-components/CustomTable";
import Link from "next/link";

const AllMails = () => {
  const { mails, fetchMails, rejectLeave, approveMail } = useLeaveApplyStore();

  const { users, fetchUsers } = useUserStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  const [reason, setReason] = useState<string>("");

  const [error, setError] = useState<string>("");

  const { balances, fetchLeaveBalances, approveLeave } = useLeaveBalanceStore();

  const handleApprove = async (
    userId: string,
    leaveId: string,
    totalDays: number,
    mailId: string
  ) => {
    const userLeave = balances.find(
      (val) => val.user.id === userId && val.leaveType.id === leaveId
    );
    const updateBalance = {
      used: userLeave ? userLeave.used + totalDays : 0,
      remaining: userLeave ? userLeave.remaining - totalDays : 0,
    };
    try {
      const res = await approveLeave(
        userLeave ? userLeave.id : "",
        updateBalance
      );
      if (res) {
        approveMail(mailId);
      } else {
        setTimeout(() => {
          toast.error("Mail Not Approved");
        }, 100);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id: string) => {
    if (!reason) {
      return setError("Please enter the reason");
    }
    const today = new Date().toISOString();
    try {
      await rejectLeave(id, {
        comments: reason,
        status: "REJECTED",
        approvedDate: today,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newMails = mails.filter((val) => val.status === "REQUESTED");

  const [openApprove, setOpenApprove] = useState<boolean>(false);

  const [openCancel, setOpenCancel] = useState<boolean>(false);

  const [selectedMail, setSelectedMail] = useState<LeaveMail>();

  const [selectedUser, setSelectedUser] = useState<User>();

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
      cell: ({ row }) => {
        return (
          <Link href={`/admin/mails/view/${row.original.id}`}>
            {row.original.user.name}
          </Link>
        );
      },
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
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return <span className="text-yellow-500">{row.original.status}</span>;
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const user = users.find((val) => val.id === row.original.user.id);

        return (
          <div className="flex justify-center items-center gap-4">
            <Icon
              icon="duo-icons:approved"
              fontSize={30}
              className="cursor-pointer"
              onClick={() => {
                setOpenApprove(true);
                setSelectedMail(row.original);
                setSelectedUser(user);
              }}
            />

            <Icon
              icon="rivet-icons:close-circle"
              fontSize={25}
              className="cursor-pointer"
              onClick={() => {
                setOpenCancel(true);
                setSelectedMail(row.original);
                setSelectedUser(user);
              }}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchMails();
    fetchUsers();
    fetchLeaves();
  }, []);

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  return (
    <section className="w-full ">
      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative  shadow ">
        <h2 className="text-lg font-semibold ps-3 pb-2 pt-2">
          New Mails ({newMails.length}){" "}
        </h2>

        <CustomTable
          columns={columns}
          data={newMails}
          placeholder="Filter by Name..."
          searchColumn="user"
          hideSearch={true}
        />

        {/* Email Approval Model */}
        <Dialog open={openApprove} onOpenChange={() => setOpenApprove(false)}>
          <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
            <DialogHeader>
              <h1 className="font-bold">Email Approval Form</h1>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApprove(
                  selectedMail ? selectedMail.user.id : "",
                  selectedMail?.leaveType.id ? selectedMail.leaveType.id : "",
                  selectedMail ? selectedMail.totalDays : 0,
                  selectedMail ? selectedMail.id : ""
                );
              }}
            >
              <div>
                <Label className="font-bold">Employee Name</Label>
                <h1>{selectedUser?.name}</h1>
              </div>
              <div>
                <Label className="font-bold">Start Date</Label>
                {selectedMail && (
                  <h1>{format(selectedMail.startDate, "dd-MM-yyyy")}</h1>
                )}
              </div>
              <div>
                <Label className="font-bold">End Date</Label>
                {selectedMail && (
                  <h1>{format(selectedMail.endDate, "dd-MM-yyyy")}</h1>
                )}
              </div>
              <div>
                <Label className="font-bold">Applied Date</Label>
                {selectedMail && (
                  <h1>
                    {selectedMail.appliedOn
                      ? format(selectedMail.appliedOn, "dd-MM-yyyy")
                      : "-"}
                  </h1>
                )}
              </div>
              <div>
                <Label className="font-bold">Leave Reason</Label>
                <h1>{selectedMail?.reason}</h1>
              </div>
              <div>
                <Label className="font-bold">Total Days</Label>
                <h1>{selectedMail?.totalDays}</h1>
              </div>
              <DialogFooter className="pt-3">
                <DialogClose asChild>
                  <Button
                    type="submit"
                    className="bg-[#754ffe] hover:bg-[#6f42c1]"
                  >
                    Approve Mail
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Close</Button>
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Email Cancellation Model */}
        <Dialog open={openCancel} onOpenChange={() => setOpenCancel(false)}>
          <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
            <DialogHeader>
              <h1 className="font-bold">Email Rejection Form</h1>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleReject(selectedMail ? selectedMail.id : "");
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
                <Label className="font-bold">Total Days</Label>
                <h1>{selectedMail?.totalDays}</h1>
              </div>
              <div>
                <Label className="font-bold">Reason For Rejection</Label>
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
                  Cancel Mail
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </Card>
    </section>
  );
};

export default AllMails;
