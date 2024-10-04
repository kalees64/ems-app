import UserPanel from "@/components/UserPanel";

import React from "react";

import { Toaster } from "sonner";

const EmployeePage = ({ params }: { params: { id: string } }) => {
  return (
    <main>
      <UserPanel id={params.id} />

      <Toaster richColors position="top-center" />
    </main>
  );
};

export default EmployeePage;
