"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

import React, { useEffect, useState } from "react";

import { Card, CardContent } from "./ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import Link from "next/link";

import { useUserStore } from "@/store/userStore";

import { Button } from "./ui/button";

import UserUpdateForm from "@/sub-components/UserUpdateForm";

import { User } from "@/utils/objectTypes";

import { useLoadStore } from "@/store/authStore";
import { Input } from "./ui/input";

const AdminEmployeeList = () => {
  const { users, fetchUsers, deleteUser } = useUserStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const delUser = async (id: string) => {
    deleteUser(id);
  };

  const [searchUsers, setSearchUsers] = useState<User[]>(users);

  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetchUsers();
    if (!search.length) {
      setSearchUsers(users);
    }
  }, []);

  return (
    <section className="w-full ">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold ">All Employees</h2>

        <Link
          href="/admin/add"
          className="bg-[#6343d8] hover:bg-[#593cc1] p-2 rounded text-white flex gap-2 items-center cursor-pointer"
        >
          <Icon icon="gg:add-r" fontSize={25} />
          <p>Add Employee</p>
        </Link>
      </div>

      <div className="w-full flex justify-between">
        <Card className="w-80">
          <CardContent className="flex pt-4">
            <div className="flex flex-col justify-center gap-3 ">
              <h1 className="text-[#637085]">Total Employees</h1>
              <h1 className="font-bold text-xl font-sans">
                {users ? users.length : 0}
              </h1>
            </div>

            <div className="w-5/12 flex justify-end items-center">
              <Icon
                icon="flowbite:users-outline"
                fontSize={25}
                className="text-black/50"
                color="#754ffe"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative px-4 shadow ">
        <div className="w-full flex justify-between items-center pt-2 pb-4">
          <h2 className="text-lg font-semibold ps-2 ">
            Employees List ({users ? users.length : 0}){" "}
          </h2>
          <div className="w-80 px-5 flex items-end">
            <Input
              className="border-2 outline-2 border-[#637085]  focus-visible:ring-0"
              placeholder="Search Employee Name / Email / Phone"
              value={search}
              onChange={(e) => {
                if (!e.target.value.length) {
                  setSearchUsers(users);
                }
                setSearch(e.target.value);
                setSearchUsers(
                  users.filter(
                    (user) =>
                      user.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      user.email
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase()) ||
                      user.phone.includes(e.target.value)
                  )
                );
              }}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f1f5f9]">
              <TableHead className="font-bold text-black">S.No</TableHead>
              <TableHead className="font-bold text-black">
                Employee Email
              </TableHead>
              <TableHead className="font-bold text-black">
                Employee Phone
              </TableHead>
              <TableHead className="font-bold text-black">
                Employee Name
              </TableHead>
              <TableHead className="text-black text-center font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[#637085]">
            {searchUsers?.length ? (
              searchUsers.map((user: User, index: number) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-black">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell className="flex items-center gap-3 justify-center">
                      {/* Employee Editing Form */}

                      <UserUpdateForm
                        user={user}
                        admin={true}
                        setSearchUsers={setSearchUsers}
                      />

                      <Dialog>
                        <DialogTrigger asChild>
                          <Icon
                            icon="ic:baseline-delete-forever"
                            fontSize={30}
                            className="cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                          <DialogHeader>
                            <DialogTitle>
                              Do you want delete {user.name}?
                            </DialogTitle>
                            <DialogDescription>
                              Click yes to delete
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-5">
                            <DialogClose asChild>
                              <Button
                                className="bg-[#754ffe] hover:bg-[#6f42c1]"
                                onClick={() => {
                                  startLoading();
                                  delUser(user.id);
                                  stopLoading();
                                }}
                                disabled={loading}
                              >
                                {loading && (
                                  <span className="size-5 border-4 border-gray-500 border-t-white animate-spin me-2 rounded-full"></span>
                                )}
                                Yes
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button className="bg-red-700">Cancel</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>No Data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </section>
  );
};

export default AdminEmployeeList;
