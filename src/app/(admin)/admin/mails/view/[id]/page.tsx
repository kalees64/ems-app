"use client";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

import { useLeavesStore } from "@/store/leaveStore";

import { useUserStore } from "@/store/userStore";

import { format } from "date-fns";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

import { toast } from "sonner";

const RequestedPendingMailViewPage = ({
  params,
}: {
  params: { id: string };
}) => {
  const router = useRouter();

  const { mails, fetchMails, approveMail, rejectLeave } = useLeaveApplyStore();

  const { users, fetchUsers } = useUserStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  const { balances, fetchLeaveBalances, approveLeave } = useLeaveBalanceStore();

  const mail = mails.find((val) => val.id === params.id);

  const user = users.find((val) => val.id === mail?.user.id);

  const leaveType = leaves.find((val) => val.id === mail?.leaveType.id);

  const [reason, setReason] = useState<string>("");

  const [error, setError] = useState<string>("");

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

  useEffect(() => {
    fetchMails();
    fetchUsers();
    fetchLeaves();
    fetchLeaveBalances();
  }, []);
  return (
    <section>
      <h1 className="text-2xl fonr-bold pb-2">Leave Request Mail View </h1>

      <Table className="w-96">
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Employee Name</TableHead>
            <TableCell>{user?.name}</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead className="text-black">Leave Type</TableHead>
            <TableCell>{leaveType?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">Start Date</TableHead>
            <TableCell>
              {mail ? format(mail.startDate, "dd-MM-yyyy") : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">End Date</TableHead>
            <TableCell>
              {" "}
              {mail ? format(mail.endDate, "dd-MM-yyyy") : "-"}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">Requested Date</TableHead>
            {mail?.appliedOn && (
              <TableCell>
                {" "}
                {mail ? format(mail.appliedOn, "dd-MM-yyyy") : "-"}
              </TableCell>
            )}
          </TableRow>
          <TableRow>
            <TableHead className="text-black">Reason</TableHead>
            <TableCell>{mail?.reason}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">Total days</TableHead>
            <TableCell>{mail?.totalDays}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black"></TableHead>
            <TableCell className="flex gap-2 items-center">
              {/* Email Approval Model */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600">
                    Approve Leave
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                  <DialogHeader>
                    <h1 className="font-bold">Email Approval Form</h1>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleApprove(
                        mail ? mail.user.id : "",
                        mail?.leaveType.id ? mail.leaveType.id : "",
                        mail ? mail.totalDays : 0,
                        mail ? mail.id : ""
                      );
                    }}
                  >
                    <div>
                      <Label className="font-bold">Employee Name</Label>
                      <h1>{user?.name}</h1>
                    </div>
                    <div>
                      <Label className="font-bold">Start Date</Label>
                      {mail && <h1>{format(mail.startDate, "dd-MM-yyyy")}</h1>}
                    </div>
                    <div>
                      <Label className="font-bold">End Date</Label>
                      {mail && <h1>{format(mail.endDate, "dd-MM-yyyy")}</h1>}
                    </div>
                    <div>
                      <Label className="font-bold">Applied Date</Label>
                      {mail && (
                        <h1>
                          {mail.appliedOn
                            ? format(mail.appliedOn, "dd-MM-yyyy")
                            : "-"}
                        </h1>
                      )}
                    </div>
                    <div>
                      <Label className="font-bold">Leave Reason</Label>
                      <h1>{mail?.reason}</h1>
                    </div>
                    <div>
                      <Label className="font-bold">Total Days</Label>
                      <h1>{mail?.totalDays}</h1>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-red-400 hover:bg-red-500">
                    Reject
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                  <DialogHeader>
                    <h1 className="font-bold">Email Rejection Form</h1>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReject(mail ? mail.id : "");
                    }}
                  >
                    <div>
                      <Label className="font-bold">Employee Name</Label>
                      <h1>{user?.name}</h1>
                    </div>
                    <div>
                      <Label className="font-bold">Leave Reason</Label>
                      <h1>{mail?.reason}</h1>
                    </div>
                    <div>
                      <Label className="font-bold">Total Days</Label>
                      <h1>{mail?.totalDays}</h1>
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
                        Reject Mail
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                className="bg-blue-400 hover:bg-red-500"
                onClick={() => {
                  router.back();
                }}
              >
                Back
              </Button>

              <Button
                className="bg-gray-400 hover:bg-gray-500"
                onClick={() => {
                  router.push(`/admin/emp/${user?.id}`);
                }}
              >
                Leave History
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default RequestedPendingMailViewPage;
