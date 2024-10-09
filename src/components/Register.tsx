"use client";

import React, { useState } from "react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

import { Label } from "./ui/label";

import { Input } from "./ui/input";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "@/utils/formSchemas";

import { T_registerData } from "@/utils/objectTypes";

import { Button } from "./ui/button";

import Link from "next/link";

import { toast, Toaster } from "sonner";

import { useUserStore } from "@/store/userStore";

import { useRouter } from "next/navigation";

import { useLoadStore } from "@/store/authStore";

import { format } from "date-fns";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Register = ({ admin }: { admin: boolean }) => {
  const { createUser } = useUserStore();

  const router = useRouter();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const [gender, setGender] = useState<string>();

  const [doj, setDoj] = useState<string>();

  const [dob, setDob] = useState<string>();

  const [doError, setDoError] = useState({ doj: "", dob: "" });

  const [error, setError] = useState<string>();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const formSubmit: SubmitHandler<T_registerData> = async (data) => {
    if (!gender && !doj && !dob) {
      setError("Please select gender");
      return setDoError({
        doj: "Please select date of joining",
        dob: "Please select date of birth",
      });
    }

    if (!gender) {
      return setError("Please select gender");
    }

    if (!doj) {
      return setDoError({
        ...doError,
        dob: "Please select date of joining",
      });
    }
    if (!dob) {
      return setDoError({
        ...doError,
        doj: "Please select date of joining",
      });
    }

    const newData = {
      ...data,
      phone: data.phone,
      doj,
      dob,
      gender,
    };
    startLoading();
    try {
      const user = await createUser(newData);
      form.reset();
      if (admin) {
        if (user) {
          setTimeout(() => {
            toast.success("Employee Added");
          }, 100);
        }
        stopLoading();
        return router.push("/admin");
      }
      const userRole: string = user.roles[0].key;
      if (userRole === "Employee") {
        setTimeout(() => {
          toast.success(`Welcome ${user.name}`);
        }, 100);
        stopLoading();
        return router.push(`/employee/${user.id}`);
      } else if (userRole === "ADMIN") {
        setTimeout(() => {
          toast.success(`Welcome ${user.name}`);
        }, 100);
        stopLoading();
        return router.push(`/admin`);
      }
    } catch (error) {
      form.reset();
      console.log(error);
      stopLoading();
      return null;
    }
  };

  const today = new Date().toJSON().substring(0, 10);

  return (
    <main className="w-full h-full flex justify-center items-center  bg-cover bg-[#f1f5f9]">
      <div className="w-96 mx-auto p-4 shadow  max-sm:w-72 rounded-lg bg-white/60 relative text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {admin ? "Add Employee" : "Register"}
        </h2>

        <Form {...form}>
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
                    <Input type="text" {...field} placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#637085]">
                    Email<span className="text-red-500">&nbsp;*</span>
                  </Label>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Enter email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#637085]">
                    Phone<span className="text-red-500">&nbsp;*</span>
                  </Label>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      required={false}
                      placeholder="Enter phone number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#637085]">
                    Password<span className="text-red-500">&nbsp;*</span>
                  </Label>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label className="text-[#637085]">
                Gender<span className="text-red-500">&nbsp;*</span>
              </Label>
              <Select
                value={gender}
                onValueChange={(value) => {
                  setGender(value);
                  setError("");
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select gender"
                    className="text-[#637085]"
                  />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-[#637085]">Gender</SelectLabel>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div>
              <Label className="text-[#637085]">
                Date of Joining<span className="text-red-500">&nbsp;*</span>
              </Label>
              <Input
                type="date"
                value={doj}
                onChange={(e) => {
                  setDoj(e.target.value);
                  setDoError({
                    ...doError,
                    doj: "",
                  });
                }}
              />
              {doError.doj && (
                <p className="text-sm text-red-500">{doError.doj}</p>
              )}
            </div>

            <div>
              <Label className="text-[#637085]">
                Date of Birth<span className="text-red-500">&nbsp;*</span>
              </Label>
              <Input
                type="date"
                value={dob}
                max={today}
                onChange={(e) => {
                  setDob(e.target.value);
                  setDoError({
                    ...doError,
                    dob: "",
                  });
                }}
              />
              {doError.dob && (
                <p className="text-sm text-red-500">{doError.dob}</p>
              )}
            </div>

            <div className="pt-3 w-full">
              <Button
                type="submit"
                className="w-full bg-[#6343d8] hover:bg-[#593cc1]"
                disabled={loading}
              >
                {loading && (
                  <span className="size-5 border-4 border-gray-500 border-t-white animate-spin me-2 rounded-full"></span>
                )}
                {admin ? "Add Employee" : "Register"}
              </Button>
            </div>

            {!admin && (
              <div>
                <p className="pt-3 text-[#637085]">
                  Already you have an account? &nbsp;
                  <Link href="/login" className="text-red-500">
                    {" "}
                    Login
                  </Link>
                </p>
              </div>
            )}
          </form>
        </Form>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
};

export default Register;
