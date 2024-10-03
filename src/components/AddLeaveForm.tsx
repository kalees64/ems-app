"use client";

import React from "react";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { FormControl, FormField, FormItem, FormMessage } from "./ui/form";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

import { Toaster } from "sonner";

import { T_leaveData, UpdateLeave } from "@/utils/objectTypes";

import { zodResolver } from "@hookform/resolvers/zod";

import { leaveAddSchema } from "@/utils/formSchemas";

import { useLeavesStore } from "@/store/leaveStore";

import { useRouter } from "next/navigation";

import { useLoadStore } from "@/store/authStore";

const AddLeaveForm = () => {
  const { addLeave } = useLeavesStore();

  const router = useRouter();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const form = useForm({
    resolver: zodResolver(leaveAddSchema),
    defaultValues: {
      name: "",
      count: "",
    },
  });

  const formSubmit: SubmitHandler<T_leaveData> = async (data: UpdateLeave) => {
    startLoading();
    const carryForward = false;
    const name = data.name;
    if (name) {
      const key = name.replace(/\s+/g, "_").toUpperCase();
      await addLeave({ ...data, carryForward, key });
      stopLoading();
      router.push("/admin/leave");
    }
    stopLoading();
    form.reset();
  };
  return (
    <main className="w-full h-full flex justify-center items-center  bg-cover bg-[#f1f5f9]">
      <div className="w-96 mx-auto p-4 shadow  max-sm:w-72 rounded-lg bg-white/60 relative text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Leave</h2>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#637085]">
                    Name<span className="text-red-500">&nbsp;*</span>
                  </Label>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Sick Leave" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="count"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#637085]">
                    Leave Count<span className="text-red-500">&nbsp;*</span>
                  </Label>
                  <FormControl>
                    <Input type="text" {...field} placeholder="12" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-3 w-full">
              <Button
                type="submit"
                className="w-full bg-[#6343d8] hover:bg-[#593cc1]"
                disabled={loading}
              >
                {loading && (
                  <span className="size-5 border-4 border-gray-500 border-t-white animate-spin me-2 rounded-full"></span>
                )}
                Add Leave
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      <Toaster richColors position="top-center" />
    </main>
  );
};

export default AddLeaveForm;
