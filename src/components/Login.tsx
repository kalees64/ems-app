"use client";

import React from "react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";

import { Input } from "./ui/input";

import { Button } from "./ui/button";

import Link from "next/link";

import { toast, Toaster } from "sonner";

import { SubmitHandler, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "@/utils/formSchemas";

import { T_loginData } from "@/utils/objectTypes";

import { Label } from "./ui/label";

import { useAuthStore, useLoadStore } from "@/store/authStore";

import { useRouter } from "next/navigation";

const Login = () => {
  const { login } = useAuthStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const formSubmit: SubmitHandler<T_loginData> = async (data) => {
    startLoading();
    try {
      const user = await login(data);
      const userRole: string = user.roles[0].key;
      form.reset();
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

  return (
    <div className="w-full h-screen flex items-center justify-center  bg-[#f1f5f9] ">
      <div className="w-96 mx-auto p-4 border max-sm:w-72 rounded-lg shadow bg-white/60 dark:bg-white text-black">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Login
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)} method="post">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#637085]">
                    Email<span className="text-red-500">&nbsp;*</span>
                  </Label>
                  <FormControl>
                    <Input type="text" {...field} placeholder="abc@gmail.com" />
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
                    <Input type="password" {...field} placeholder="••••••••" />
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
                Login
              </Button>
            </div>

            <div>
              <p className="pt-2 text-[#637085]">
                Already you have an account? &nbsp;
                <Link href="/register" className="text-red-500">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Login;
