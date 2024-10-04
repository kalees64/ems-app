"use client";

import { Button } from "@/components/ui/button";

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

import { useLoadStore } from "@/store/authStore";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useLeaveBalanceStore } from "@/store/leaveBalanceStore";

import { useLeavesStore } from "@/store/leaveStore";

import { LeaveBalance, LeaveDataCopy, LeaveMail } from "@/utils/objectTypes";

import { differenceInDays, isBefore, isSameDay, parseISO } from "date-fns";

import React, { useEffect, useState } from "react";

import { toast } from "sonner";

const LeaveRequestForm = ({ id }: { id: string }) => {
  const { leaves, fetchLeaves } = useLeavesStore();

  const { applyLeave, mails, fetchMails } = useLeaveApplyStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const { getUserBalanceLeave } = useLeaveBalanceStore();

  const [errors, setErrors] = useState<LeaveDataCopy>({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [leaveType, setLeaveType] = useState<string>("");

  const [startDate, setStartDate] = useState<string>("");

  const [endDate, setEndDate] = useState<string>("");

  const [totalDays, setTotalDays] = useState<number>(0);

  const [sameDay, setSameDay] = useState<boolean>(false);

  const [halfDay, setHalfDay] = useState<boolean>(false);

  const [reason, setReason] = useState<string>();

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>();

  const [remainingDays, setRemainingDays] = useState<number>(0);

  const getLeaveBalances = async () => {
    const res = await getUserBalanceLeave(id);
    setLeaveBalances(res);
  };

  const handleSubmit = async () => {
    startLoading();
    if (!leaveType && !startDate && !endDate && !reason) {
      stopLoading();
      return setErrors({
        leaveType: "Please select leave type",
        startDate: "Please select start date",
        endDate: "Please select end date",
        reason: "Please enter the reason",
      });
    }

    if (!leaveType) {
      stopLoading();
      return setErrors({
        ...errors,
        leaveType: "Please select leave type",
      });
    }

    if (!startDate) {
      stopLoading();
      return setErrors({
        ...errors,
        startDate: "Please select start date",
      });
    }

    if (!endDate) {
      stopLoading();
      return setErrors({
        ...errors,
        endDate: "Please select end date",
      });
    }

    if (!reason) {
      stopLoading();
      return setErrors({
        ...errors,
        reason: "Please enter the reason",
      });
    }

    setErrors({ startDate: "", endDate: "", reason: "", leaveType: "" });

    const userMail = mails.find((mail: LeaveMail) => {
      const sd = mail.startDate.slice(0, 10);
      const ed = mail.endDate.slice(0, 10);
      if (sd === startDate && ed === endDate) {
        return mail;
      }
    });

    if (userMail) {
      stopLoading();
      return setTimeout(() => {
        toast.error("This leave already applied");
      }, 100);
    }

    const data = {
      leaveType,
      startDate,
      endDate,
      totalDays,
      halfDay,
      reason,
      user: id,
      status: "REQUESTED",
    };
    try {
      applyLeave(data);
    } catch (error) {
      console.log(error);
      stopLoading();
      return setTimeout(() => {
        toast.error("Leave Not Applied...Smething network error");
      });
    }

    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setHalfDay(false);
    setTotalDays(0);
    setReason("");
    stopLoading();
  };

  useEffect(() => {
    fetchLeaves();
    fetchMails();
    getLeaveBalances();
  }, []);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <Label>
            Leave Type<span className="text-red-500">&nbsp;*</span>
          </Label>

          <Select
            value={leaveType}
            onValueChange={(value) => {
              leaveBalances?.forEach((val) => {
                if (val.leaveType.id === value) {
                  setRemainingDays(val.remaining);
                }
              });
              setLeaveType(value);
              setErrors({ ...errors, leaveType: "" });
            }}
          >
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

          {errors.leaveType && (
            <p className="text-red-500 text-sm">{errors.leaveType}</p>
          )}
        </div>

        {leaveType ? (
          <div>
            <Label>
              Remaining Days<span className="text-red-500">&nbsp;*</span>
            </Label>

            <Input readOnly value={remainingDays} />
          </div>
        ) : null}

        <div>
          <Label>
            Start Date<span className="text-red-500">&nbsp;*</span>
          </Label>

          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              const today = new Date();
              const date = parseISO(e.target.value);

              if (isSameDay(date, today)) {
                setStartDate(e.target.value);
                return setErrors({ ...errors, startDate: "" });
              }

              if (isBefore(date, today)) {
                return setTimeout(() => {
                  toast.error("Start date is not before than today");
                  setStartDate("");
                  setErrors({
                    ...errors,
                    startDate: "Start date is not before than today",
                  });
                }, 100);
              }

              setStartDate(e.target.value);
              setErrors({ ...errors, startDate: "" });
            }}
          />

          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate}</p>
          )}
        </div>

        <div>
          <Label>
            End Date<span className="text-red-500">&nbsp;*</span>
          </Label>

          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setTotalDays(0);
              const date = parseISO(e.target.value);
              const start = parseISO(startDate);

              if (!startDate) {
                return setTimeout(() => {
                  toast.error("Select Start Date First");
                  setEndDate("");
                  setSameDay(false);
                  setErrors({
                    ...errors,
                    endDate: "Select Start Date First",
                  });
                }, 100);
              }

              if (isSameDay(date, start)) {
                setEndDate(e.target.value);
                setTotalDays(1);
                setSameDay(true);
                return setErrors({ ...errors, endDate: "" });
              }

              if (isBefore(date, start)) {
                return setTimeout(() => {
                  toast.error("End date is not before than start date");
                  setEndDate("");
                  setSameDay(false);
                  setErrors({
                    ...errors,
                    endDate: "End date is not before than start date",
                  });
                }, 100);
              }

              setEndDate(e.target.value);
              setErrors({ ...errors, endDate: "" });
              const totalDays = differenceInDays(
                new Date(e.currentTarget.value),
                new Date(startDate)
              );

              if (totalDays + 1 > remainingDays) {
                return setTimeout(() => {
                  toast.error("Total Days not Greater Than Remaing days");
                  setSameDay(false);
                  setErrors({
                    ...errors,
                    endDate: "Total Days not Greater Than Remaing days",
                  });
                }, 100);
              }

              setTotalDays(totalDays + 1);
              setSameDay(false);
            }}
          />

          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate}</p>
          )}
        </div>

        {totalDays > 0 ? (
          <div>
            <Label>
              Total Days<span className="text-red-500">&nbsp;*</span>
            </Label>

            <Input readOnly value={totalDays} />
          </div>
        ) : null}

        <div className="pt-2">
          {sameDay && (
            <div className="flex gap-8  ">
              <Label>Half Day</Label>

              <Input
                type="checkbox"
                className="size-14"
                checked={halfDay}
                onChange={(e) => {
                  setHalfDay(e.target.checked);
                }}
              />
            </div>
          )}
        </div>

        <div>
          <Label>
            Reason<span className="text-red-500">&nbsp;*</span>
          </Label>

          <Textarea
            id="reason"
            className="w-full"
            rows={4}
            placeholder="Write reason here..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setErrors({ ...errors, reason: "" });
            }}
          />

          {errors.reason && (
            <p className="text-red-500 text-sm">{errors.reason}</p>
          )}
        </div>

        <div className="pt-3">
          <Button
            type="submit"
            className="w-full bg-[#6343d8] hover:bg-[#593cc1]"
            disabled={loading}
          >
            {loading && (
              <span className="size-5 border-4 border-gray-500 border-t-white animate-spin me-2 rounded-full"></span>
            )}
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
