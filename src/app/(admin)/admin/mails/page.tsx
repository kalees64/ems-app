"use client";

import AllMails from "@/components/AllMails";

import ResponsedMails from "@/components/ResponsedMails";

import React, { useState } from "react";

const Mails = () => {
  const [mailState, setMailState] = useState<boolean>(true);

  return (
    <>
      {mailState ? (
        <AllMails mailState={mailState} setMailState={setMailState} />
      ) : (
        <ResponsedMails mailState={mailState} setMailState={setMailState} />
      )}
    </>
  );
};

export default Mails;
