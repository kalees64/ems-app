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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

import Link from "next/link";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail } from "@/utils/objectTypes";

import { useUserStore } from "@/store/userStore";

import { useLeavesStore } from "@/store/leaveStore";

import { Icon } from "@iconify/react/dist/iconify.js";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

const AllMails = () => {
  const { mails, fetchMails } = useLeaveApplyStore();

  const { users, fetchUsers } = useUserStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  useEffect(() => {
    fetchMails();
    fetchUsers();
    fetchLeaves();
  }, []);

  const newMails = mails.filter(
    (val) => val.status === "REQUESTED" || val.status === "ON_HOLD"
  );

  return (
    <section className="w-full ">
      <div className="w-full flex gap-5 items-center mb-4">
        <h2 className="text-lg font-semibold ">All Mails</h2>
        <Link href="/admin/mails">New Mails</Link>
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
            {mails.length ? (
              mails.map((mail: LeaveMail, index: number) => {
                const user = users.find((val) => val.id === mail.user);
                const leaveType = leaves.find(
                  (val) => val.id === mail.leaveType
                );
                return (
                  <TableRow key={mail.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-black">{user?.name}</TableCell>
                    <TableCell>{mail.startDate.slice(0, 10)}</TableCell>
                    <TableCell>{mail.endDate.slice(0, 10)}</TableCell>
                    <TableCell>{mail.appliedOn?.slice(0, 10)}</TableCell>
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
                          <form>
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
                                required
                              />
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
