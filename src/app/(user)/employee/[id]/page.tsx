import UserPanel from "@/components/UserPanel";

import React from "react";

import { Toaster } from "sonner";

const EmployeePage = () => {
  return (
    <main>
      <UserPanel />

      <Toaster richColors position="top-center" />
    </main>
  );
};

export default EmployeePage;
