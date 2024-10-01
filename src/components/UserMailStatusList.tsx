"use client";

import React, { useEffect } from "react";

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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail } from "@/utils/objectTypes";

import { format } from "date-fns";

import { useLeavesStore } from "@/store/leaveStore";

import { Icon } from "@iconify/react/dist/iconify.js";

import { Button } from "./ui/button";

const UserMailStatusList = ({ id }: { id: string }) => {
  const { mails, fetchMails } = useLeaveApplyStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  const userMails = mails.filter((mail) => mail.user === id);

  useEffect(() => {
    fetchMails();
    fetchLeaves();
  }, []);

  if (!mails) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-full ">
      <Card className="w-full max-sm:px-1 p-2 relative px-4 shadow ">
        <h2 className="text-lg font-semibold ps-2 pb-4 pt-2">
          Leave Mails List ({userMails ? userMails.length : 0})
        </h2>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#f1f5f9]">
              <TableHead className="font-bold text-black">S.No</TableHead>
              <TableHead className="font-bold text-black">Start Date</TableHead>
              <TableHead className="font-bold text-black">End Date</TableHead>
              <TableHead className="font-bold text-black">
                Request Date
              </TableHead>
              <TableHead className="font-bold text-black">
                Response Date
              </TableHead>
              <TableHead className="font-bold text-black">Reason</TableHead>
              <TableHead className="font-bold text-black">Leave Type</TableHead>
              <TableHead className="font-bold text-black">Total Days</TableHead>
              <TableHead className="text-black text-center font-bold">
                Comments
              </TableHead>
              <TableHead className="text-black text-center font-bold">
                Status
              </TableHead>
              <TableHead className="text-black text-center font-bold">
                Cancel
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[#637085]">
            {userMails.length ? (
              userMails.map((mail: LeaveMail, index: number) => {
                const userLeaveType = leaves.find(
                  (val) => val.id === mail.leaveType
                );
                return (
                  <TableRow key={mail.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {format(mail.startDate, "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>{format(mail.endDate, "dd-MM-yyyy")}</TableCell>
                    <TableCell>
                      {mail.appliedOn
                        ? format(mail.appliedOn, "dd-MM-yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {" "}
                      {mail.approvedDate
                        ? format(mail.approvedDate, "dd-MM-yyyy")
                        : "Processing..."}
                    </TableCell>
                    <TableCell>{mail.reason}</TableCell>
                    <TableCell>{userLeaveType?.name}</TableCell>
                    <TableCell className="">{mail.totalDays}</TableCell>
                    <TableCell
                      className={`${
                        mail.comments ? "text-start" : "text-center"
                      }`}
                    >
                      {mail.comments ? mail.comments : "-"}
                    </TableCell>
                    <TableCell
                      className={`${
                        mail.status === "ON_HOLD"
                          ? "text-yellow-500"
                          : mail.status === "REQUESTED"
                          ? "text-yellow-500"
                          : mail.status === "APPROVED"
                          ? "text-lime-500"
                          : "text-red-500"
                      }`}
                    >
                      {mail.status}
                    </TableCell>
                    <TableCell className="flex justify-center items-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Icon
                            icon="rivet-icons:close-circle"
                            fontSize={25}
                            className="cursor-pointer"
                          />
                        </DialogTrigger>

                        <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                          <DialogHeader>
                            <DialogTitle>
                              Do you want to cancel {userLeaveType?.name} mail?
                            </DialogTitle>

                            <DialogDescription>
                              Click yes to delete
                            </DialogDescription>
                          </DialogHeader>

                          <div className="flex gap-5">
                            <DialogClose asChild>
                              <Button className="bg-[#754ffe] hover:bg-[#6f42c1]">
                                Yes
                              </Button>
                            </DialogClose>

                            <DialogClose asChild>
                              <Button className="bg-red-700">Cancel</Button>
                            </DialogClose>
                          </div>
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

export default UserMailStatusList;
