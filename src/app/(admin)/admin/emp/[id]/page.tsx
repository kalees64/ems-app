"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useUserStore } from "@/store/userStore";

import { User } from "@/utils/objectTypes";

import { format } from "date-fns";

import React, { useEffect, useState } from "react";

const EmployeeProfile = ({ params }: { params: { id: string } }) => {
  const { getUser } = useUserStore();

  const [user, setUser] = useState<User>();

  const start = async () => {
    const res = await getUser(params.id);
    setUser(res);
  };

  useEffect(() => {
    start();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <section>
        <h1 className="text-2xl font-bold pb-3">Employee Profile</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableCell>{user.name}</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableCell>{user.email}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Phone</TableHead>
              <TableCell>{user.phone}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Gender</TableHead>
              <TableCell>{user.gender ? user.gender : "-"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Date of Joining</TableHead>
              <TableCell>
                {user.doj ? format(user.doj, "dd-MM-yyyy") : "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Date of Birth</TableHead>
              <TableCell>
                {user.dob ? format(user.dob, "dd-MM-yyyy") : ""}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Last Updated</TableHead>
              <TableCell>
                {user.updatedAt ? format(user.updatedAt, "dd-MM-yyyy") : ""}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    );
  }
};

export default EmployeeProfile;
