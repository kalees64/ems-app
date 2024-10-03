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

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { LeaveMail } from "@/utils/objectTypes";

import { useUserStore } from "@/store/userStore";

import { useLeavesStore } from "@/store/leaveStore";

import { format } from "date-fns";

const ResponsedMails = ({
  mailState,
  setMailState,
}: {
  mailState: boolean;
  setMailState: (data: boolean) => void;
}) => {
  const { mails, fetchMails } = useLeaveApplyStore();

  const { users, fetchUsers } = useUserStore();

  const { leaves, fetchLeaves } = useLeavesStore();

  useEffect(() => {
    fetchMails();
    fetchUsers();
    fetchLeaves();
  }, []);

  const oldMails = mails.filter(
    (val) => val.status === "APPROVED" || val.status === "REJECTED"
  );

  return (
    <section className="w-full ">
      <div className="w-full flex gap-5 items-center mb-4">
        {/* <h2 className="text-lg font-semibold ">All Mails</h2> */}
        <p
          className="cursor-pointer"
          onClick={() => {
            setMailState(!mailState);
          }}
        >
          New Mails
        </p>
        <p
          className="font-bold cursor-pointer"
          onClick={() => {
            setMailState(!mailState);
          }}
        >
          Responsed Mails
        </p>
      </div>

      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative px-4 shadow ">
        <h2 className="text-lg font-semibold ps-2 pb-2 pt-2">
          Responsed Mails ({oldMails.length}){" "}
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
              <TableHead className="font-bold text-black">
                Response Date
              </TableHead>
              <TableHead className="font-bold text-black">Reason</TableHead>
              <TableHead className="font-bold text-black">Leave Type</TableHead>
              <TableHead className="font-bold text-black">Total Days</TableHead>
              <TableHead className="font-bold text-black">Comments</TableHead>
              <TableHead className="text-black text-center font-bold">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[#637085]">
            {oldMails.length ? (
              oldMails.reverse().map((mail: LeaveMail, index: number) => {
                const user = users.find((val) => val.id === mail.user);
                const leaveType = leaves.find(
                  (val) => val.id === mail.leaveType
                );
                return (
                  <TableRow key={mail.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-black">{user?.name}</TableCell>
                    <TableCell>
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
                    <TableCell
                      className={`${!mail.approvedDate ? "text-center" : ""}`}
                    >
                      {mail.approvedDate
                        ? format(mail.approvedDate, "dd-MM-yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>{mail.reason}</TableCell>
                    <TableCell>{leaveType?.name}</TableCell>
                    <TableCell className="text-black">
                      {mail.totalDays}
                    </TableCell>
                    <TableCell
                      className={`${!mail.comments ? "text-center" : ""}`}
                    >
                      {mail.comments ? mail.comments : "-"}
                    </TableCell>
                    <TableCell
                      className={`flex justify-center items-center gap-4 ${
                        mail.status === "APPROVED"
                          ? "text-lime-500"
                          : "text-red-500"
                      }`}
                    >
                      {mail.status}
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

export default ResponsedMails;
