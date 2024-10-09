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
  };

  useEffect(() => {
    start();
  }, []);

  return (
    <section className="w-5/12 flex-shrink">
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
