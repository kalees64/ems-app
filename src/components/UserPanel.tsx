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

import { useEffect } from "react";

import Calendar from "./Calender";

import { useHolidayStore } from "@/store/holidayStore";

Chart.register(BarController, BarElement, CategoryScale, LinearScale);

const UserPanel = () => {
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

  const { holidaysList, fetchHolidays } = useHolidayStore();

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <div className=" bg-[#f1f5f9] text-black">
      <div className="">
        {/* Section 1: Leave Type Widgets */}
        <div className="grid grid-cols-5 gap-4 mb-8 max-md:grid-cols-2 max-lg:grid-cols-3">
          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Total Leaves
            </h3>
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
            <h3 className="text-lg font-semibold text-[#637085]">
              Sick Leaves
            </h3>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-[#637085]">Days</p>
          </div>

          <div className="p-4 bg-white shadow-md rounded-lg text-center">
            <h3 className="text-lg font-semibold text-[#637085]">
              Paid Leaves
            </h3>
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
            <Calendar holidays={holidaysList} />
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default UserPanel;
