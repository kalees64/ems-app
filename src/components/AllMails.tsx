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

import Link from "next/link";
import { useLeaveApplyStore } from "@/store/leaveApplyStore";
import { LeaveMail } from "@/utils/objectTypes";
// import { useUserStore } from "@/store/userStore";

const AllMails = () => {
  const { mails, fetchMails } = useLeaveApplyStore();

  //   const { getUser } = useUserStore();

  //   const { getLeave } = useLeavesStore();

  useEffect(() => {
    fetchMails();
  }, []);

  return (
    <section className="w-full ">
      <div className="w-full flex gap-5 items-center mb-4">
        <h2 className="text-lg font-semibold ">All Mails</h2>
        <Link href="/admin/mails">New Mails</Link>
      </div>

      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative px-4 shadow ">
        <h2 className="text-lg font-semibold ps-2 pb-2 pt-2">New Mails (0) </h2>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#f1f5f9]">
              <TableHead className="font-bold text-black">S.No</TableHead>
              {/* <TableHead className="font-bold text-black">
                Employee Name
              </TableHead> */}
              <TableHead className="font-bold text-black">Start Date</TableHead>
              <TableHead className="font-bold text-black">End Date</TableHead>
              <TableHead className="font-bold text-black">
                Request Date
              </TableHead>
              <TableHead className="font-bold text-black">Reason</TableHead>
              <TableHead className="font-bold text-black">Total Days</TableHead>
              <TableHead className="text-black text-center font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[#637085]">
            {mails.length ? (
              mails.map((mail: LeaveMail, index: number) => {
                // const user = getUser(mail.user);
                // const leaveType = await getLeave(mail.leaveType);
                return (
                  <TableRow key={mail.id}>
                    <TableCell>{index + 1}</TableCell>
                    {/* <TableCell>{user?.name}</TableCell> */}
                    <TableCell>{mail.startDate.slice(0, 10)}</TableCell>
                    <TableCell>{mail.endDate.slice(0, 10)}</TableCell>
                    <TableCell>{mail.appliedOn?.slice(0, 10)}</TableCell>
                    <TableCell>{mail.reason}</TableCell>
                    <TableCell>{mail.totalDays}</TableCell>
                    <TableCell>Approve</TableCell>
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
