import Navbar from "@/components/Navbar";

import Sidebar from "@/components/Sidebar";

import React from "react";

import { Toaster } from "sonner";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-screen overflow-hidden">
      <div className="flex">
        <div className="max-lg:hidden w-64">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col bg-[#f1f5f9] text-black h-screen w-full overflow-x-scroll">
          <Navbar />

          <main className="p-4 h-full w-full ">{children}</main>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
};

export default AdminLayout;
