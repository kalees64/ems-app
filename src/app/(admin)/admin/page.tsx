"use client";

import { getToken, getUserIDfromToken, useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AdminPage = () => {
  const router = useRouter();

  const { getUser } = useUserStore();

  const startCheck = async () => {
    const token = await getToken();
    if (token) {
      const userID = await getUserIDfromToken();
      const user = await getUser(userID);

      if (user) {
        setTimeout(() => {
          toast.error("Please login to access the portal");
        }, 100);
        return router.push("/login");
      }

      return router.push("/admin/employees");
    }
    setTimeout(() => {
      toast.error("Please login to access the portal");
    }, 100);
    return router.push("/login");
  };

  useEffect(() => {
    startCheck();
  }, []);
  return <div></div>;
};

export default AdminPage;
