import LeaveRequestForm from "@/sub-components/LeaveRequestForm";

import React from "react";

const EmployeeLeaveRequestPage = ({ params }: { params: { id: string } }) => {
  return (
    <section className="w-full ">
      <div className="bg-white shadow-md rounded-lg p-4 w-96 mx-auto ">
        <h3 className="text-xl font-bold pb-2">Request Leave</h3>

        <LeaveRequestForm id={params.id} />
      </div>
    </section>
  );
};

export default EmployeeLeaveRequestPage;
