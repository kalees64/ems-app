"use client";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { Icon } from "@iconify/react/dist/iconify.js";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

import { useHolidayStore } from "@/store/holidayStore";

import { Holiday } from "@/utils/objectTypes";

import { Toaster } from "sonner";

import { format } from "date-fns";

import { useLoadStore } from "@/store/authStore";

const HolidaysList = () => {
  const { holidays, fetchHolidays, addHoliday, updateHoliday, deleteHoliday } =
    useHolidayStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const [name, setName] = useState<string>("");

  const [date, setDate] = useState<string>("");

  const [shortDescription, setShortDescription] = useState<string>("");

  const [errors, setErrors] = useState<Holiday>({
    name: "",
    date: "",
  });

  const [uname, setuName] = useState<string>("");

  const [udate, setuDate] = useState<string>("");

  const [ushortDescription, setuShortDescription] = useState<
    string | undefined
  >("");

  const handleSubmit = async () => {
    startLoading();
    if (!name && !date) {
      stopLoading();
      return setErrors({
        ...errors,
        name: "Please enter the holiday name",
        date: "Please select the holiday date",
      });
    }

    if (!name) {
      stopLoading();
      return setErrors({
        ...errors,
        name: "Please enter the holiday name",
      });
    }

    if (!date) {
      stopLoading();
      return setErrors({
        ...errors,

        date: "Please select the holiday date",
      });
    }

    setErrors({ name: "", date: "" });

    const data = { name, date, shortDescription };

    await addHoliday(data);

    setName("");
    setDate("");
    setShortDescription("");
    stopLoading();
  };

  const handleUpdate = async (id: string, data: Holiday) => {
    if (!uname && !udate) {
      return setErrors({
        ...errors,
        name: "Please enter the holiday name",
        date: "Please select the holiday date",
      });
    }

    if (!uname) {
      return setErrors({
        ...errors,
        name: "Please enter the holiday name",
      });
    }

    if (!udate) {
      return setErrors({
        ...errors,
        date: "Please select the holiday date",
      });
    }

    setErrors({ name: "", date: "" });

    const updatedData = {
      ...data,
      name: uname,
      date: udate,
      shortDescription: ushortDescription,
    };

    await updateHoliday(id, updatedData);
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <div>
      <section className="bg-white rounded-xl shadow  p-4 ">
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-lg font-semibold mb-4 pe-5">
            Holidays ({holidays ? holidays.length : 0})
          </h1>
          <div>
            {/* Add Holiday Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 p-1.5 rounded-sm cursor-pointer bg-[#6343d8] hover:bg-[#593cc1]">
                  <Icon icon="zondicons:date-add" fontSize={25} color="white" />
                  <span className="text-white">Add Holiday</span>
                </div>
              </DialogTrigger>

              <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                <DialogHeader>
                  <DialogTitle>Add Holiday</DialogTitle>

                  <DialogDescription className="hidden">
                    holiday
                  </DialogDescription>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <div>
                      <Label>
                        Holiday Name
                        <span className="text-red-500">&nbsp;*</span>
                      </Label>

                      <Input
                        placeholder="Diwali"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors({ ...errors, name: "" });
                        }}
                      />

                      {errors.name && (
                        <p className="text-red-500 text-sm">{errors.name}</p>
                      )}
                    </div>

                    <div className="pt-2">
                      <Label>
                        Holiday Date
                        <span className="text-red-500">&nbsp;*</span>
                      </Label>

                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setErrors({ ...errors, date: "" });
                        }}
                      />

                      {errors.date && (
                        <p className="text-red-500 text-sm">{errors.date}</p>
                      )}
                    </div>

                    <div className=" pt-2 pb-3">
                      <Label>Holiday Description</Label>

                      <Input
                        type="text"
                        placeholder="Diwali Festival"
                        value={shortDescription}
                        onChange={(e) => {
                          setShortDescription(e.target.value);
                        }}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="bg-[#754ffe] hover:bg-[#6f42c1]"
                      disabled={loading}
                    >
                      {loading && (
                        <span className="size-5 border-4 border-gray-500 border-t-white animate-spin me-2 rounded-full"></span>
                      )}
                      submit
                    </Button>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f1f5f9]">
                <TableHead className="font-bold text-black">S.No</TableHead>
                <TableHead className="font-bold text-black">
                  Leave Name
                </TableHead>
                <TableHead className="font-bold text-black">
                  Leave Date
                </TableHead>
                <TableHead className="font-bold text-black">
                  Leave Description
                </TableHead>
                <TableHead className="font-bold text-black">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="text-[#637085]">
              {holidays.length > 0 ? (
                holidays.map((data: Holiday, index) => {
                  return (
                    <TableRow key={data.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-black">{data.name}</TableCell>
                      <TableCell>{format(data.date, "dd-MM-yyyy")}</TableCell>
                      <TableCell>
                        {data.shortDescription ? data.shortDescription : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 items-center ">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Icon
                                  icon="material-symbols-light:edit-calendar-outline"
                                  fontSize={30}
                                  className=" cursor-pointer"
                                  onClick={() => {
                                    setuName(data.name);
                                    setuDate(data.date);
                                    setuShortDescription(
                                      data?.shortDescription
                                    );
                                  }}
                                />
                              </DialogTrigger>

                              <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                                <DialogHeader>
                                  <DialogTitle>Update Holiday</DialogTitle>

                                  <DialogDescription className="hidden">
                                    holiday
                                  </DialogDescription>

                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      handleUpdate(
                                        data.id ? data.id : "id",
                                        data
                                      );
                                    }}
                                  >
                                    <div>
                                      <Label>Holiday Name</Label>

                                      <Input
                                        placeholder="Diwali"
                                        value={uname}
                                        onChange={(e) => {
                                          setuName(e.target.value);
                                          setErrors({ ...errors, name: "" });
                                        }}
                                      />

                                      {errors.name && (
                                        <p className="text-red-500 text-sm">
                                          {errors.name}
                                        </p>
                                      )}
                                    </div>

                                    <div className="pt-2">
                                      <Label>Holiday Date</Label>

                                      <Input
                                        type="date"
                                        value={udate.slice(0, 10)}
                                        onChange={(e) => {
                                          setuDate(e.target.value);
                                          setErrors({ ...errors, date: "" });
                                        }}
                                      />

                                      {errors.date && (
                                        <p className="text-red-500 text-sm">
                                          {errors.date}
                                        </p>
                                      )}
                                    </div>

                                    <div className=" pt-2 pb-3">
                                      <Label>Holiday Description</Label>

                                      <Input
                                        type="text"
                                        value={ushortDescription}
                                        onChange={(e) => {
                                          setuShortDescription(e.target.value);
                                        }}
                                        placeholder="Diwali Festival"
                                      />
                                    </div>

                                    <DialogClose asChild>
                                      <Button
                                        type="submit"
                                        className="bg-[#754ffe] hover:bg-[#6f42c1]"
                                      >
                                        update
                                      </Button>
                                    </DialogClose>
                                  </form>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>

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
                                  Do you want delete {data.name}?
                                </DialogTitle>

                                <DialogDescription>
                                  Click yes to delete
                                </DialogDescription>
                              </DialogHeader>

                              <div className="flex gap-5">
                                <DialogClose asChild>
                                  <Button
                                    className="bg-[#754ffe] hover:bg-[#6f42c1]"
                                    onClick={async () => {
                                      await deleteHoliday(
                                        data.id ? data.id : "id"
                                      );
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
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default HolidaysList;
