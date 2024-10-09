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

import axiosAPI from "@/store/axiosAPI";

import { useLeaveApplyStore } from "@/store/leaveApplyStore";

import { useLeavesStore } from "@/store/leaveStore";

import { useUserStore } from "@/store/userStore";

import { LeaveBalance, LeaveDataCopy, LeaveMail } from "@/utils/objectTypes";

import { format, isBefore, isSameDay, parseISO } from "date-fns";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";

import { toast } from "sonner";

const AdminLeaveApplyForm = () => {
  const router = useRouter();

  const { leaves, fetchLeaves } = useLeavesStore();

  const { mails, fetchMails } = useLeaveApplyStore();

  const { users, fetchUsers } = useUserStore();

  const { loading, startLoading, stopLoading } = useLoadStore();

  const [errors, setErrors] = useState<LeaveDataCopy>({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    user: "",
  });

  const [leaveType, setLeaveType] = useState<string>("");

  const [user, setUser] = useState<string>();

  const [startDate, setStartDate] = useState<string>("");

  const [endDate, setEndDate] = useState<string>("");

  const [totalDays, setTotalDays] = useState<number>(0);

  const [sameDay, setSameDay] = useState<boolean>(false);

  const [halfDay, setHalfDay] = useState<boolean>(false);

  const [halfDaySession, setHalfDaySession] = useState<string>();

  const [sessionError, setSessionError] = useState<string>();

  const [reason, setReason] = useState<string>();

  const [leaveBalances] = useState<LeaveBalance[]>();

  const [remainingDays, setRemainingDays] = useState<number>(0);

  const handleSubmit = async () => {
    startLoading();
    if (!leaveType && !startDate && !endDate && !reason) {
      stopLoading();
      return setErrors({
        leaveType: "Please select leave type",
        startDate: "Please select start date",
        endDate: "Please select end date",
        reason: "Please enter the reason",
        user: "Please select user",
      });
    }

    if (!leaveType) {
      stopLoading();
      return setErrors({
        ...errors,
        leaveType: "Please select leave type",
      });
    }

    if (!user) {
      stopLoading();
      return setErrors({
        ...errors,
        user: "Please select leave type",
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
      if (
        sd === startDate &&
        ed === endDate &&
        (mail.status === "REQUESTED" || mail.status === "APPROVED") &&
        halfDay &&
        mail.halfDaySession === halfDaySession
      ) {
        return mail;
      }
    });

    if (userMail) {
      stopLoading();
      if (userMail.halfDay) {
        return setTimeout(() => {
          toast.error(
            "Tou have already applied half day session - " +
              userMail.halfDaySession
          );
        }, 100);
      }
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
      user,
      status: "REQUESTED",
    };

    localStorage.setItem("formData", JSON.stringify(data));

    router.push(`/admin/leave-request/view`);

    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setHalfDay(false);
    setTotalDays(0);
    setReason("");
    stopLoading();
  };

  const getTotalLeaves = async (d1: string, d2: string) => {
    const res = await axiosAPI.get(
      `/leaveRequests/calculateDays?startDate=${d1}&endDate=${d2}`
    );
    const totalDays = res.data.data.noofDays;
    return totalDays;
  };

  useEffect(() => {
    fetchLeaves();
    fetchMails();
    fetchUsers();
  }, []);
  return (
    <section>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-96 bg-white rounded-xl mx-auto p-4"
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
            Employee Name<span className="text-red-500">&nbsp;*</span>
          </Label>

          <Select
            value={user}
            onValueChange={(value) => {
              leaveBalances?.forEach((val) => {
                if (val.user.id === value) {
                  if (val.leaveType.id === leaveType) {
                    setRemainingDays(val.remaining);
                  }
                }
              });
              setUser(value);
              setErrors({ ...errors, user: "" });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Employee Name" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Employee</SelectLabel>
                {users.map((val) => {
                  return (
                    <SelectItem value={val.id} key={val.id}>
                      {val.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>

          {errors.user && <p className="text-red-500 text-sm">{errors.user}</p>}
        </div>

        {/* {remainingDays ? (
          <div>
            <Label>Available Days</Label>

            <Input readOnly value={remainingDays} disabled />
          </div>
        ) : null} */}

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
            max={remainingDays}
            value={endDate}
            onChange={async (e) => {
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
                    endDate: "Select start date first",
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
              // const totalDays = differenceInDays(
              //   new Date(e.currentTarget.value),
              //   new Date(startDate)
              // );
              const total = await getTotalLeaves(
                format(startDate, "yyyy-MM-dd"),
                format(e.target.value, "yyyy-MM-dd")
              );

              const totalDays = Number(total);

              //   if (totalDays > remainingDays) {
              //     return setTimeout(() => {
              //       toast.error("Total days not greater than remaing days");
              //       setSameDay(false);
              //       setErrors({
              //         ...errors,
              //         endDate: "Total days not greater than remaing days",
              //       });
              //     }, 100);
              //   }

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

            <Input readOnly value={totalDays} disabled />
          </div>
        ) : null}

        <div className="pt-2">
          {sameDay && (
            <div className="flex gap-8  ">
              <Label>Half Day</Label>

              <Input
                type="checkbox"
                className="size-3"
                checked={halfDay}
                onChange={(e) => {
                  setHalfDay(e.target.checked);
                  if (e.target.checked) {
                    setTotalDays(totalDays - 0.5);
                  } else {
                    setTotalDays(totalDays + 0.5);
                  }
                }}
              />
            </div>
          )}
        </div>

        {halfDay && (
          <div>
            <Label>
              Leave Type<span className="text-red-500">&nbsp;*</span>
            </Label>

            <Select
              value={halfDaySession}
              onValueChange={(value) => {
                setHalfDaySession(value);
                setSessionError("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Half Day Session" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Half Day Session</SelectLabel>
                  <SelectItem value="MORNING">MORNING</SelectItem>
                  <SelectItem value="AFTERNOON">AFTERNOON</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {halfDay && !halfDaySession && (
              <p className="text-red-500 text-sm">{sessionError}</p>
            )}
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

        <div>
          <Label>
            Assigned To<span className="text-red-500">&nbsp;*</span>
          </Label>

          <Input readOnly value="jk1@assaycr.com" disabled />
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
    </section>
  );
};

export default AdminLeaveApplyForm;
