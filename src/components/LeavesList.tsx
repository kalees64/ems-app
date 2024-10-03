"use client";

import { Icon } from "@iconify/react/dist/iconify.js";

import Link from "next/link";

import React, { useEffect, useState } from "react";

import { Card } from "./ui/card";

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

import { useLeavesStore } from "@/store/leaveStore";

import { Leave } from "@/utils/objectTypes";

import { Button } from "./ui/button";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { useLoadStore } from "@/store/authStore";

const LeavesList = () => {
  const { leaves, fetchLeaves, deleteLeave, updateLeave } = useLeavesStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const [name, setName] = useState("");

  const [count, setCount] = useState("");

  const handleSubmit = async (id: string) => {
    startLoading();
    const key = name.replace(/\s+/g, "_").toUpperCase();
    if (count) {
      updateLeave(id, { name, count, key });
      stopLoading();
    }
    stopLoading();
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <section className="w-full ">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold ">All Leave Types</h2>
        <Link
          href="/admin/leave/add"
          className="bg-[#6343d8] hover:bg-[#593cc1] p-2 rounded text-white flex gap-2 items-center cursor-pointer"
        >
          <Icon icon="gg:add-r" fontSize={25} />
          <p>Add Leave</p>
        </Link>
      </div>

      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative px-4 shadow ">
        <h2 className="text-lg font-semibold ps-2 pb-2 pt-2">
          Leaves List ({leaves?.length}){" "}
        </h2>

        <Table>
          <TableHeader>
            <TableRow className="bg-[#f1f5f9]">
              <TableHead className="font-bold text-black">S.No</TableHead>
              <TableHead className="font-bold text-black">Leave Name</TableHead>
              <TableHead className="font-bold text-black">
                Leave Count
              </TableHead>
              <TableHead className="text-black text-center font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="text-[#637085]">
            {leaves.length ? (
              leaves.map((leave: Leave, index: number) => {
                return (
                  <TableRow key={leave.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-black">{leave.name}</TableCell>
                    <TableCell>{leave.count}</TableCell>
                    <TableCell className="flex items-center gap-3 justify-center">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Icon
                            icon="mage:edit"
                            fontSize={30}
                            className=" cursor-pointer"
                            onClick={() => {
                              setName(leave.name);
                              setCount(String(leave.count));
                            }}
                          />
                        </DialogTrigger>
                        <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                          <DialogHeader>
                            <DialogTitle>Edit Leave Type</DialogTitle>
                            <DialogDescription className="hidden">
                              Click yes to delete
                            </DialogDescription>
                          </DialogHeader>
                          <div className="">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit(leave.id);
                              }}
                            >
                              <div>
                                <Label>Leave Name</Label>
                                <Input
                                  type="text"
                                  defaultValue={name}
                                  onChange={(e) => {
                                    setName(e.target.value);
                                  }}
                                />
                              </div>
                              <div>
                                <Label>Leave Count</Label>
                                <Input
                                  type="number"
                                  defaultValue={count}
                                  onChange={(e) => {
                                    setCount(e.target.value);
                                  }}
                                />
                              </div>
                              <div className="pt-3">
                                <Button
                                  type="submit"
                                  className="w-full"
                                  disabled={loading}
                                >
                                  {loading && (
                                    <span className="size-5 border-4 border-gray-500 border-t-white animate-spin me-2 rounded-full"></span>
                                  )}
                                  Update Leave
                                </Button>
                              </div>
                            </form>
                          </div>
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
                              Do you want delete {leave.name} ?
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
                                  deleteLeave(leave.id);
                                }}
                              >
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

export default LeavesList;
