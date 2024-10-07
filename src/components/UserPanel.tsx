"use client";

import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Chart,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import { Toaster } from "sonner";

import { useEffect, useState } from "react";

import Calendar from "./Calender";

import { useHolidayStore } from "@/store/holidayStore";

import { useUserStore } from "@/store/userStore";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

import { User } from "@/utils/objectTypes";
import { Card } from "./ui/card";

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

export interface BalanceLeave {
  totalLeaves: number;
  remainingLeaves: number;
  sickLeaves: number;
  casualLeaves: number;
  paidLeaves: number;
}

const UserPanel = ({ id }: { id: string }) => {
  const { holidaysList, fetchHolidays } = useHolidayStore();

  const { getUserBalanceLeave } = useLeaveBalanceStore();

  const { users, fetchUsers, getAllUsers } = useUserStore();

  const user = users.find((user) => user.id === id);

  const [leaveBalace, setLeaveBalance] = useState<BalanceLeave>({
    totalLeaves: 0,
    remainingLeaves: 0,
    sickLeaves: 0,
    casualLeaves: 0,
    paidLeaves: 0,
  });

  const getLeaveBalance = async () => {
    const res = await getUserBalanceLeave(id);
    let totalLeave: number = 0;
    let balanceLeave: number = 0;
    let sickLeave: number = 0;
    let casualLeave: number = 0;
    let paidLeave: number = 0;

    res.forEach((val) => {
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
    setLeaveBalance({
      totalLeaves: totalLeave,
      remainingLeaves: balanceLeave,
      sickLeaves: sickLeave,
      casualLeaves: casualLeave,
      paidLeaves: paidLeave,
    });
  };

  // Bar chart data
  const chartData = {
    labels: ["Casual Leave", "Sick Leave", "Paid Leave"],
    datasets: [
      {
        label: "Leave Days",
        data: [
          leaveBalace.casualLeaves,
          leaveBalace.sickLeaves,
          leaveBalace.paidLeaves,
          12,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  const [birUser, setBirUser] = useState<User[]>();

  const getBirthDay = async () => {
    const all = await getAllUsers();
    const date = new Date();
    const day = date.getDate().toString();
    const toDay = day.length < 2 ? "0" + day : day;
    const month = Number(date.getMonth()) + 1;
    const month1 = month.toString();
    const toMonth = month1.length < 2 ? "0" + month1 : month1;
    const findUser = all.filter((user: User) => {
      try {
        const userMonth = user.dob.slice(5, 7);
        const userDay = user.dob.slice(8, 10);
        if (userMonth == toMonth && userDay == toDay) {
          return user;
        }
      } catch (error) {
        console.log(error);
        return null;
      }
    });
    setBirUser(findUser);
  };

  useEffect(() => {
    fetchHolidays();
    fetchUsers();
    getLeaveBalance();
    getBirthDay();
  }, []);

  return (
    <div className=" bg-[#f1f5f9] text-black">
      <div className="">
        <h1 className="pb-3 font-bold hidden">
          Welcome &nbsp;
          <span className="text-xl font-bold text-[#754ffe] ">
            {" "}
            {user?.name}
          </span>
        </h1>

        {/* Birthday wish section */}
        {birUser &&
          (birUser.length ? (
            <Card className="w-11/12 mx-auto py-2 animate-pulse  rounded flex flex-col justify-center items-center mb-3 max-sm:h-20 max-sm:ps-5">
              {birUser.map((user: User) => {
                const role = user.roles[0].title;
                return (
                  <h1 key={user.id} className="max-sm:text-sm">
                    {role} <b>{user.name}</b> celebrating his birthday today !!!
                  </h1>
                );
              })}
            </Card>
          ) : null)}

        {/* Section 1: Leave Type Widgets */}
        <div className="grid grid-cols-5 gap-4 mb-8 max-md:grid-cols-2 max-lg:grid-cols-3">
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Total Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.totalLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Pending Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.remainingLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Casual Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.casualLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Sick Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.sickLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Paid Leaves
            </h3>
            <p className="text-2xl font-bold">{leaveBalace.paidLeaves}</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>
        </div>

        {/* Section 2: Bar Chart & Holiday Calender */}
        <div className="grid grid-cols-2 gap-8 mb-8 max-lg:grid-cols-1">
          {/* Bar Chart */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Leave Overview</h3>
            <Bar data={chartData} />
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Holiday Calender</h3>
            <Calendar holidays={holidaysList} />
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default UserPanel;
