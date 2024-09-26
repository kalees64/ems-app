"use client";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Bar } from "react-chartjs-2";
import { Skeleton } from "./ui/skeleton";
import { Toaster } from "sonner";
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Chart,
} from "chart.js";
import { useUserStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { User } from "@/utils/objectTypes";
import UserProfile from "@/sub-components/UserProfile";

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const UserPanel = ({ id }: { id: string }) => {
  // Bar chart data
  const chartData = {
    labels: ["Casual Leave", "Sick Leave", "Paid Leave", "Pay OFF"],
    datasets: [
      {
        label: "Leave Days",
        data: [1, 3, 5, 7, 12],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  const { getUser } = useUserStore();

  const [user, setUser] = useState<User>();

  const startUp = async () => {
    const res = await getUser(id);
    setUser(res);
  };

  useEffect(() => {
    startUp();
  }, []);

  return (
    <div className="p-6 bg-[#f1f5f9] text-black">
      {/* Logout Button */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold max-md:text-xl max-sm:text-lg">
          Employee Dashboard
        </h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Icon
                icon="lucide:log-out"
                fontSize={35}
                className="cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent className="bg-white text-black max-sm:w-11/12">
              <DialogHeader>
                <DialogTitle>Do you want logout?</DialogTitle>
                <DialogDescription>Click yes to logout</DialogDescription>
              </DialogHeader>
              <div className="flex gap-5">
                <Button>Yes</Button>
                <DialogClose asChild>
                  <Button className="bg-red-700">Cancel</Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Section 1: Leave Type Widgets */}
      <div className="grid grid-cols-5 gap-4 mb-8 max-md:grid-cols-2 max-lg:grid-cols-3">
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold text-[#637085]">Total Leaves</h3>
          <p className="text-2xl font-bold">32</p>
          <p className="text-sm text-[#637085]">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold text-[#637085]">
            Pending Leaves
          </h3>
          <p className="text-2xl font-bold">32</p>
          <p className="text-sm text-[#637085]">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold text-[#637085]">
            Casual Leaves
          </h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-[#637085]">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold text-[#637085]">Sick Leaves</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-sm text-[#637085]">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold text-[#637085]">Paid Leaves</h3>
          <p className="text-2xl font-bold">0</p>
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
          <Skeleton />
        </div>
      </div>

      {/* Section 3: Leave Request Form */}
      <div className="grid grid-cols-2 gap-8 mb-8 max-lg:grid-cols-1">
        <div className="bg-white shadow-md rounded-lg p-6 ">
          <h3 className="text-xl font-bold mb-4">Request Leave</h3>
          <Skeleton />
        </div>

        {/* Profile Section */}

        <div className="w-full">
          {user ? (
            <div>
              <UserProfile user={user} setUser={setUser} />
            </div>
          ) : (
            <Skeleton className="p-2 flex flex-col gap-3 justify-center px-3">
              <Skeleton className="w-full h-20 rounded-sm" />
              <Skeleton className="w-full h-20 rounded-sm" />
              <Skeleton className="w-full h-20 rounded-sm" />
              <Skeleton className="w-full h-20 rounded-sm" />
            </Skeleton>
          )}
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default UserPanel;
