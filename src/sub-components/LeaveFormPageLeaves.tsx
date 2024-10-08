"use client";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

import { LeaveBalance } from "@/utils/objectTypes";

import React, { useEffect, useState } from "react";

const LeaveFormPageLeaves = ({ id }: { id: string }) => {
  const { getUserBalanceLeave } = useLeaveBalanceStore();

  const [balanceLeave, setBalanceLeave] = useState<LeaveBalance[]>();

  const start = async () => {
    const res = await getUserBalanceLeave(id);
    setBalanceLeave(res);
    console.log(res);
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <section className="bg-white">
      <ul>
        {balanceLeave?.map((val) => {
          return (
            <li key={val.id} className="text-black">
              {val.leaveType.name} - {val.remaining}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default LeaveFormPageLeaves;
