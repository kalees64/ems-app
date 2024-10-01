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

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useLeavesStore } from "@/store/leaveStore";

import { LeaveDataCopy, LeaveMail } from "@/utils/objectTypes";

import { differenceInDays, isBefore, isSameDay, parseISO } from "date-fns";

import React, { useEffect, useState } from "react";

import { toast } from "sonner";

const LeaveRequestForm = ({ id }: { id: string }) => {
  const { leaves, fetchLeaves } = useLeavesStore();

  const { applyLeave, mails, fetchMails } = useLeaveApplyStore();

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

  const handleSubmit = async () => {
    if (!leaveType && !startDate && !endDate && !reason) {
      return setErrors({
        leaveType: "Please select leave type",
        startDate: "Please select start date",
        endDate: "Please select end date",
        reason: "Please enter the reason",
      });
    }

    if (!leaveType) {
      return setErrors({
        ...errors,
        leaveType: "Please select leave type",
      });
    }

    if (!startDate) {
      return setErrors({
        ...errors,
        startDate: "Please select start date",
      });
    }

    if (!endDate) {
      return setErrors({
        ...errors,
        endDate: "Please select end date",
      });
    }

    if (!reason) {
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
      return setTimeout(() => {
        toast.error("Leave Not Applied...Smething network error");
      });
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchMails();
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

              setTotalDays(totalDays);
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

        {sameDay && (
          <div className="flex gap-8 py-3">
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
          >
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
