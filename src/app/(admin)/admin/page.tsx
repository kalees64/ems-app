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
      const roles = user.roles.map((val) => val.key);

      if (roles.includes("ADMIN")) {
        return router.push("/admin/employees");
      } else if (roles.includes("EMPLOYEE")) {
        setTimeout(() => {
          toast.error("Please login to access the portal");
        }, 100);
        return router.push("/login");
      } else {
        setTimeout(() => {
          toast.error("Insufficient Privileges");
        }, 100);
        return router.push("/login");
      }
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
