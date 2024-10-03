"use client";

import React, { useEffect, useState } from "react";

import { Card } from "./ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail } from "@/utils/objectTypes";

import { useUserStore } from "@/store/userStore";

import { useLeavesStore } from "@/store/leaveStore";

import { Icon } from "@iconify/react/dist/iconify.js";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

import { format } from "date-fns";

const AllMails = ({
  mailState,
  setMailState,
}: {
  mailState: boolean;
  setMailState: (data: boolean) => void;
}) => {
  const { mails, fetchMails, rejectLeave } = useLeaveApplyStore();

  const { users, fetchUsers } = useUserStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  useEffect(() => {
    fetchMails();
    fetchUsers();
    fetchLeaves();
  }, []);

  const [reason, setReason] = useState<string>("");

  const [error, setError] = useState<string>("");

  const handleReject = async (id: string) => {
    if (!reason) {
      return setError("Please enter the reason");
    }

    try {
      await rejectLeave(id, { comments: reason, status: "REJECTED" });
    } catch (error) {
      console.log(error);
    }
  };

  const newMails = mails.filter(
    (val) => val.status === "REQUESTED" || val.status === "ON_HOLD"
  );

  return (
    <section className="w-full ">
      <div className="w-full flex gap-5 items-center mb-4">
        {/* <h2 className="text-lg font-semibold ">All Mails</h2> */}
        <p
          className="font-bold cursor-pointer"
          onClick={() => {
            setMailState(!mailState);
          }}
        >
          New Mails
        </p>
        <p
          className="cursor-pointer"
          onClick={() => {
            setMailState(!mailState);
          }}
        >
          Responsed Mails
        </p>
      </div>

      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative px-4 shadow ">
        <h2 className="text-lg font-semibold ps-2 pb-2 pt-2">
          New Mails ({newMails.length}){" "}
        </h2>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#f1f5f9]">
              <TableHead className="font-bold text-black">S.No</TableHead>
              <TableHead className="font-bold text-black">
                Employee Name
              </TableHead>
              <TableHead className="font-bold text-black">Start Date</TableHead>
              <TableHead className="font-bold text-black">End Date</TableHead>
              <TableHead className="font-bold text-black">
                Request Date
              </TableHead>
              <TableHead className="font-bold text-black">Reason</TableHead>
              <TableHead className="font-bold text-black">Leave Type</TableHead>
              <TableHead className="font-bold text-black">Total Days</TableHead>
              <TableHead className="text-black text-center font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[#637085]">
            {newMails.length ? (
              newMails.reverse().map((mail: LeaveMail, index: number) => {
                const user = users.find((val) => val.id === mail.user);
                const leaveType = leaves.find(
                  (val) => val.id === mail.leaveType
                );
                return (
                  <TableRow key={mail.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-black">{user?.name}</TableCell>
                    <TableCell>
                      {" "}
                      {format(mail.startDate, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>{format(mail.endDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell
                      className={`${!mail.appliedOn ? "text-center" : ""}`}
                    >
                      {mail.appliedOn
                        ? format(mail.appliedOn, "dd-MM-yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{mail.reason}</TableCell>
                    <TableCell>{leaveType?.name}</TableCell>
                    <TableCell className="text-black">
                      {mail.totalDays}
                    </TableCell>
                    <TableCell className="flex justify-center items-center gap-4">
                      <Icon
                        icon="duo-icons:approved"
                        fontSize={30}
                        className="cursor-pointer"
                      />

                      <Dialog>
                        <DialogTrigger>
                          <Icon
                            icon="rivet-icons:close-circle"
                            fontSize={25}
                            className="cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                          <DialogHeader>
                            <h1>Email Rejection Form</h1>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              handleReject(mail.id);
                            }}
                          >
                            <div>
                              <Label className="font-bold">Employee Name</Label>
                              <h1>{user?.name}</h1>
                            </div>
                            <div>
                              <Label className="font-bold">Leave Reason</Label>
                              <h1>{mail.reason}</h1>
                            </div>
                            <div>
                              <Label className="font-bold">Leave Days</Label>
                              <h1>{mail.totalDays}</h1>
                            </div>
                            <div>
                              <Label className="font-bold">
                                Reason For Rejection
                              </Label>
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
                              {error && (
                                <p className="text-red-500 text-sm">{error}</p>
                              )}
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
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>No Data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
};

export default AllMails;
