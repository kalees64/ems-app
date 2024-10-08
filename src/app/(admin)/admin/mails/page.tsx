"use client";

import AdminAllMails from "@/components/AdminAllMails";

import AllMails from "@/components/AllMails";

import CancelledMails from "@/components/CancelledMails";

import RejectedMails from "@/components/RejectedMails";

import ResponsedMails from "@/components/ResponsedMails";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React from "react";

const Mails = () => {
  return (
    <>
      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <AllMails />
        </TabsContent>

        <TabsContent value="approved">
          <ResponsedMails />
        </TabsContent>

        <TabsContent value="rejected">
          <RejectedMails />
        </TabsContent>

        <TabsContent value="cancelled">
          <CancelledMails />
        </TabsContent>

        <TabsContent value="all">
          <AdminAllMails />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Mails;
