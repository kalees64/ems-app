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

import { Icon } from "@iconify/react/dist/iconify.js";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

import { useHolidayStore } from "@/store/holidayStore";

import { Holiday } from "@/utils/objectTypes";

import { Toaster } from "sonner";

import { format } from "date-fns";

import { useLoadStore } from "@/store/authStore";

import { ColumnDef } from "@tanstack/react-table";

import { LuArrowDownUp } from "react-icons/lu";

import { CustomTable } from "@/sub-components/CustomTable";

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

  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const [openDel, setOpenDel] = useState<boolean>(false);

  const [selectedHoliday, setSelectedHoliday] = useState<Holiday>();

  const columns: ColumnDef<Holiday>[] = [
    {
      header: "S.No",
      accessorFn: (_, index) => {
        return index + 1;
      },
    },
    {
      header: "Holiday Name",
      accessorKey: "name",
    },
    {
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <LuArrowDownUp className=" h-3 w-3 " />
          </span>
        );
      },
      accessorKey: "date",
      cell: ({ row }) => {
        return format(row.original.date, "dd-MM-yyyy");
      },
    },
    {
      header: "Day",
      cell: ({ row }) => {
        return format(row.original.date, "EEEE");
      },
    },
    {
      header: "Description",
      accessorKey: "shortDescription",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex gap-3 items-center ">
            <Icon
              icon="material-symbols-light:edit-calendar-outline"
              fontSize={30}
              className=" cursor-pointer"
              onClick={() => {
                setOpenEdit(true);
                setSelectedHoliday(row.original);
                setuName(row.original.name);
                setuDate(row.original.date);
                setuShortDescription(row.original?.shortDescription);
              }}
            />

            <Icon
              icon="ic:baseline-delete-forever"
              fontSize={30}
              className="cursor-pointer"
              onClick={() => {
                setOpenDel(true);
                setSelectedHoliday(row.original);
              }}
            />
          </div>
        );
      },
    },
  ];

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
          <CustomTable
            columns={columns}
            data={holidays}
            placeholder="Filter by Holiday name..."
            searchColumn="name"
            hideSearch={false}
          />
        </div>

        {/* Edit Holiday Dialog */}
        <Dialog open={openEdit} onOpenChange={() => setOpenEdit(false)}>
          <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
            <DialogHeader>
              <DialogTitle>Update Holiday</DialogTitle>

              <DialogDescription className="hidden">holiday</DialogDescription>

              {selectedHoliday && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedHoliday.id) {
                      handleUpdate(
                        selectedHoliday ? selectedHoliday.id : "",
                        selectedHoliday
                      );
                    }
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
                      <p className="text-red-500 text-sm">{errors.name}</p>
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
                      <p className="text-red-500 text-sm">{errors.date}</p>
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
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>

        {/* Delete Holiday Dialog */}
        <Dialog open={openDel} onOpenChange={() => setOpenDel(false)}>
          <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
            <DialogHeader>
              <DialogTitle>
                Do you want delete {selectedHoliday?.name}?
              </DialogTitle>

              <DialogDescription>Click yes to delete</DialogDescription>
            </DialogHeader>

            <div className="flex gap-5">
              <DialogClose asChild>
                {selectedHoliday && (
                  <Button
                    className="bg-[#754ffe] hover:bg-[#6f42c1]"
                    onClick={async () => {
                      await deleteHoliday(
                        selectedHoliday.id ? selectedHoliday.id : ""
                      );
                    }}
                  >
                    Yes
                  </Button>
                )}
              </DialogClose>
              <DialogClose asChild>
                <Button className="bg-red-700">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </section>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default HolidaysList;
