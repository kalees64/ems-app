"use client";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useLeavesStore } from "@/store/leaveStore";

import { leaveApplySchema } from "@/utils/formSchemas";

import { ApplyLeave, LeaveMail, T_leaveSubmit } from "@/utils/objectTypes";

import { zodResolver } from "@hookform/resolvers/zod";

import { differenceInDays, format, isBefore, parseISO } from "date-fns";

import React, { useEffect } from "react";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { toast } from "sonner";

const LeaveRequestForm = ({ id }: { id: string }) => {
  const { leaves, fetchLeaves } = useLeavesStore();

  const { applyLeave, mails, fetchMails } = useLeaveApplyStore();

  const form = useForm({
    resolver: zodResolver(leaveApplySchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      leaveType: "",
      reason: "",
    },
  });

  const formSubmit: SubmitHandler<T_leaveSubmit> = async (data: ApplyLeave) => {
    const from = data.startDate;
    const to = data.endDate;
    const totalDays = differenceInDays(new Date(to), new Date(from));
    const checkTo = parseISO(to);
    const checkFrom = parseISO(from);
    if (isBefore(checkTo, checkFrom)) {
      return setTimeout(() => {
        toast.error("End date is not before than start date");
      }, 100);
    }

    const userMail = mails.find((mail: LeaveMail) => {
      const sd = mail.startDate.slice(0, 10);
      const ed = mail.endDate.slice(0, 10);
      if (sd === data.startDate && ed === data.endDate) {
        return mail;
      }
    });

    if (userMail) {
      return setTimeout(() => {
        toast.error("This leave already applied");
      }, 100);
    }
    // const user = await getUser(id);
    // const leaveType: Leave = await getLeave(data.leaveType);
    const newLeave = {
      ...data,
      appliedOn: format(new Date(), "yyyy-MM-dd"),
      halfDay: false,
      status: "ON_HOLD",
      totalDays,
      user: id,
    };
    console.log(newLeave);
    applyLeave(newLeave);
    form.reset();
  };

  useEffect(() => {
    fetchLeaves();
    fetchMails();
  }, []);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)}>
        <FormField
          name="startDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>
                Leave From<span className="text-red-500">&nbsp;*</span>
              </Label>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="endDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>
                Leave To<span className="text-red-500">&nbsp;*</span>
              </Label>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="leaveType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>
                Leave Type<span className="text-red-500">&nbsp;*</span>
              </Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Leave Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Leave Type</SelectLabel>
                    {leaves.map((leave) => {
                      return (
                        <SelectItem value={leave.id} key={leave.id}>
                          {leave.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="reason"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <Label>
                Reason<span className="text-red-500">&nbsp;*</span>
              </Label>
              <FormControl>
                <Textarea
                  id="reason"
                  {...field}
                  className="w-full"
                  rows={4}
                  placeholder="Write reason here..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-3">
          <Button
            type="submit"
            className="w-full bg-[#6343d8] hover:bg-[#593cc1]"
          >
            Submit Request
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LeaveRequestForm;
