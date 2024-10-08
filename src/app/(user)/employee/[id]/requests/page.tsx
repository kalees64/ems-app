"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import UserApprovedMailsList from "@/components/UserApprovedMailsList";

import UserCancelledMailsList from "@/components/UserCancelledMailsList";

import UserMailStatusList from "@/components/UserMailStatusList";

import UserPendingMails from "@/components/UserPendingMails";

import UserRejectedMailsList from "@/components/UserRejectedMailsList";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

import { LeaveBalance } from "@/utils/objectTypes";

import React, { useEffect, useState } from "react";

const LeaveRequestStatusPage = ({ params }: { params: { id: string } }) => {
  const { getUserBalanceLeave } = useLeaveBalanceStore();

  const [leaves, setLeaves] = useState<LeaveBalance[]>();

  const getLeaveBalance = async () => {
    const res = await getUserBalanceLeave(params.id);
    setLeaves(res);
  };

  useEffect(() => {
    getLeaveBalance();
  }, []);
  return (
    <div>
      <h1 className="text-xl font-bold pb-2">Leave Balances</h1>
      <div className="grid grid-cols-5 gap-4 mb-8 max-md:grid-cols-2 max-lg:grid-cols-3">
        {leaves?.map((val) => {
          return (
            <div
              className="p-4 bg-white shadow-md rounded-lg text-center"
              key={val.id}
            >
              <h3 className="text-lg font-semibold text-[#637085]">
                {val.leaveType.name}
              </h3>
              <p className="text-2xl font-bold">{val.remaining}</p>
              <p className="text-sm text-[#637085]">Days</p>
            </div>
          );
        })}
      </div>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <UserPendingMails id={params.id} />
        </TabsContent>

        <TabsContent value="approved">
          <UserApprovedMailsList id={params.id} />
        </TabsContent>

        <TabsContent value="rejected">
          <UserRejectedMailsList id={params.id} />
        </TabsContent>

        <TabsContent value="cancelled">
          <UserCancelledMailsList id={params.id} />
        </TabsContent>

        <TabsContent value="all">
          <UserMailStatusList id={params.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeaveRequestStatusPage;
