"use client";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useLeavesStore } from "@/store/leaveStore";

import { useUserStore } from "@/store/userStore";

import { LeaveData } from "@/utils/objectTypes";

import { format } from "date-fns";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

import { toast } from "sonner";

const AdminLeaveRequestConfirmation = () => {
  const [data, setData] = useState<LeaveData>();

  const router = useRouter();

  const { leaves } = useLeavesStore();

  const { users, fetchUsers } = useUserStore();

  const { applyLeave } = useLeaveApplyStore();

  const getData = async () => {
    const res = await localStorage.getItem("formData");

    if (res) {
      const data = JSON.parse(res);
      setData(data);
    }
  };

  const leaveName = leaves.find((val) => val.id === data?.leaveType);

  const user = users.find((val) => val.id === data?.user);

  const handleApply = async () => {
    if (data) {
      try {
        applyLeave(data);
        localStorage.removeItem("formData");
        router.push(`/admin/leave-request`);
      } catch (error) {
        console.log(error);
        return setTimeout(() => {
          localStorage.removeItem("formData");
          toast.error("Leave Not Applied...Smething network error");
        }, 100);
      }
    }
  };

  useEffect(() => {
    getData();
    fetchUsers();
  }, []);
  return (
    <section>
      <h2 className="text-2xl font-bold pb-4">Leave Request Confirmation</h2>

      <Table className="w-96">
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Leave Type</TableHead>
            <TableCell>{leaveName?.name}</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead className="text-black">Employee Name</TableHead>
            <TableCell>{user?.name}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">Start Date</TableHead>
            <TableCell>
              {data ? format(data.startDate, "dd-MM-yyyy") : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">End Date</TableHead>
            <TableCell>
              {data ? format(data.endDate, "dd-MM-yyyy") : ""}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">Reason</TableHead>
            <TableCell>{data?.reason}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black">Total days</TableHead>
            <TableCell>{data?.totalDays}</TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="text-black"></TableHead>
            <TableCell className="flex gap-2 items-center">
              <Button
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  handleApply();
                }}
              >
                Confirm Leave
              </Button>
              <Button
                className="bg-red-400 hover:bg-red-500"
                onClick={() => {
                  localStorage.removeItem("formData");
                  router.back();
                }}
              >
                Cancel
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default AdminLeaveRequestConfirmation;
