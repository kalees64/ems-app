"use client";

import React, { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { useUserStore } from "@/store/userStore";

import { User } from "@/utils/objectTypes";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

const Reports = () => {
  const { users, fetchUsers } = useUserStore();

  const { fetchLeaveBalances, balances } = useLeaveBalanceStore();

  useEffect(() => {
    fetchUsers();
    fetchLeaveBalances();
  }, []);

  return (
    <section className="bg-white rounded-xl p-4 text-black shadow ">
      <h2 className="text-lg font-semibold mb-4">
        Employee Reports ({users ? users.length : 0})
      </h2>
      <div className="w-full pt-5  max-sm:px-1  relative">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f1f5f9]">
              <TableHead className="font-bold text-black">S.no</TableHead>
              <TableHead className="font-bold text-black">
                Employee Name
              </TableHead>

              <TableHead className="font-bold text-black">
                Total Leaves
              </TableHead>
              <TableHead className="font-bold text-black">
                Casual Leaves
              </TableHead>
              <TableHead className="font-bold text-black">
                Sick Leaves
              </TableHead>
              <TableHead className="font-bold text-black">
                Paid Leaves
              </TableHead>
              <TableHead className="font-bold text-black">
                Pending Leaves
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[#637085]">
            {users.length ? (
              users.map((user: User, index: number) => {
                const userBalance = balances.filter(
                  (val) => val.user.id === user.id
                );
                let totalLeave: number = 0;
                let balanceLeave: number = 0;
                let sickLeave: number = 0;
                let casualLeave: number = 0;
                let paidLeave: number = 0;

                userBalance.forEach((val) => {
                  totalLeave += val.allocated;
                  balanceLeave += val.remaining;
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

                return (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-black">{user.name}</TableCell>
                    <TableCell>{totalLeave}</TableCell>
                    <TableCell>{casualLeave}</TableCell>
                    <TableCell>{sickLeave}</TableCell>
                    <TableCell>{paidLeave}</TableCell>
                    <TableCell>{balanceLeave}</TableCell>
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
      </div>
    </section>
  );
};

export default Reports;
