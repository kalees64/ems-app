import UserMailStatusList from "@/components/UserMailStatusList";

import React from "react";

const LeaveRequestStatusPage = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <UserMailStatusList id={params.id} />
    </div>
  );
};

export default LeaveRequestStatusPage;
