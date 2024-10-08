"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

import React, { useEffect, useState } from "react";

import { Card, CardContent } from "./ui/card";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import Link from "next/link";

import { useUserStore } from "@/store/userStore";

import { Button } from "./ui/button";

import { User } from "@/utils/objectTypes";

import { useLoadStore } from "@/store/authStore";

import { Input } from "./ui/input";

import { ColumnDef } from "@tanstack/react-table";

import { LuArrowDownUp } from "react-icons/lu";

import { CustomTable } from "@/sub-components/CustomTable";

import { format } from "date-fns";

import { Label } from "./ui/label";

const AdminEmployeeList = () => {
  const { users, fetchUsers, deleteUser, updateUser } = useUserStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const delUser = async (id: string) => {
    deleteUser(id);
  };

  const [name, setName] = useState<string>("");

  const [phone, setPhone] = useState<string>("");

  const [dob, setDob] = useState<string>("");

  const handleSubmit = async (id: string) => {
    const newUserData = {
      name,
      phone,
      dob,
    };
    console.log(newUserData);
    await updateUser(id, newUserData);
  };

  const columns: ColumnDef<User>[] = [
    {
      header: "S.No",
      accessorFn: (_, index) => {
        return index + 1;
      },
    },
    {
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <LuArrowDownUp className=" h-3 w-3 " />
          </span>
        );
      },
      accessorKey: "name",
      cell: ({ row }) => {
        return (
          <Link href={`/admin/emp/${row.original.id}`}>
            {row.original.name}
          </Link>
        );
      },
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DOJ
            <LuArrowDownUp className=" h-3 w-3 " />
          </span>
        );
      },
      accessorKey: "doj",
      cell: ({ row }) => {
        if (row.original.doj) {
          return format(row.original.doj, "dd-MM-yyyy");
        } else {
          return "-";
        }
      },
    },
    {
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            DOR
            <LuArrowDownUp className=" h-3 w-3 " />
          </span>
        );
      },
      accessorKey: "dor",
      cell: ({ row }) => {
        if (row.original.dor) {
          return format(row.original.dor, "dd-MM-yyyy");
        } else {
          return "-";
        }
      },
    },
    {
      header: "Last Updated",
      accessorKey: "updatedAt",
      cell: ({ row }) => {
        return format(row.original.updatedAt, "dd-MM-yyyy");
      },
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div
            className={`flex items-center gap-3 justify-center ${
              row.original.dor ? "hidden" : "flex"
            }`}
          >
            <Dialog>
              <DialogTrigger asChild>
                <Icon
                  icon="mage:edit"
                  fontSize={30}
                  className=" cursor-pointer"
                  onClick={() => {
                    setName(row.original.name);
                    setPhone(row.original.phone);
                    setDob(row.original.dob ? row.original.dob : "");
                  }}
                />
              </DialogTrigger>

              <DialogContent className="bg-white text-black max-sm:w-11/12">
                <DialogHeader>
                  <DialogTitle>Update Employee</DialogTitle>
                  <DialogDescription className="hidden">
                    Edit Form
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    handleSubmit(row.original.id);
                  }}
                >
                  <div>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      readOnly
                      disabled
                      defaultValue={row.original.email}
                    />
                  </div>

                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  {!row.original.dob && (
                    <div>
                      <Label>DOB</Label>
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                  )}

                  {row.original.dob && (
                    <div>
                      <Label>DOB</Label>
                      <Input
                        type="date "
                        defaultValue={
                          row.original.dob
                            ? format(row.original.dob, "dd-MM-yyyy")
                            : ""
                        }
                        readOnly
                        disabled
                      />
                    </div>
                  )}

                  <DialogFooter className="pt-3">
                    <Button
                      type="submit"
                      className="bg-[#6343d8] hover:bg-[#593cc1]"
                    >
                      Update
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

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
                    Do you want delete {row.original.name}?
                  </DialogTitle>
                  <DialogDescription>Click yes to delete</DialogDescription>
                </DialogHeader>
                <div className="flex gap-5">
                  <DialogClose asChild>
                    <Button
                      className="bg-[#754ffe] hover:bg-[#6f42c1]"
                      onClick={() => {
                        startLoading();
                        delUser(row.original.id);
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
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchUsers();
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
        </div>
        <CustomTable
          columns={columns}
          data={users}
          placeholder="Filter by name"
          searchColumn="name"
          hideSearch={false}
        />
      </Card>
    </section>
  );
};

export default AdminEmployeeList;
