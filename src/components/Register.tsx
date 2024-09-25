"use client";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/utils/formSchemas";
import { registerData } from "@/utils/objectTypes";
import { Button } from "./ui/button";
import Link from "next/link";
import { Toaster } from "sonner";

const Register = () => {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  const formSubmit: SubmitHandler<registerData> = (data) => {
    console.log(data);
    form.reset();
  };
  return (
    <main className="w-full h-screen flex justify-center items-center  bg-cover bg-[#f1f5f9]">
      <div className="w-96 mx-auto p-4 shadow  max-sm:w-72 rounded-lg bg-white/60 relative text-black">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(formSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-[#637085]">Name</Label>
                  <FormControl>
                    <Input type="text" {...field} placeholder="Robert" />
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
                  <Label className="text-[#637085]">Email</Label>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="robert@gmail.com"
                    />
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
                  <Label className="text-[#637085]">Phone</Label>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      required={false}
                      placeholder="9656458767"
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
                  <Label className="text-[#637085]">Password</Label>
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
              >
                Register
              </Button>
            </div>

            <div>
              <p className="pt-3 text-[#637085]">
                Already you have an account? &nbsp;
                <Link href="/login" className="text-red-500">
                  {" "}
                  Login
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
      <Toaster richColors position="top-center" />
    </main>
  );
};

export default Register;
