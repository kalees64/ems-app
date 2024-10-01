"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { useUserStore } from "@/store/userStore";

import { User } from "@/utils/objectTypes";

import { Icon } from "@iconify/react/dist/iconify.js";

import { format } from "date-fns";

import React, { useEffect, useState } from "react";

const UserUpdateForm = ({
  user,
  setUser,
  admin,
}: {
  user: User;
  setUser?: (data: User) => void;
  admin?: boolean;
}) => {
  const { updateUser, getUser } = useUserStore();

  const [name, setName] = useState<string>("");

  const [phone, setPhone] = useState<string>("");

  const [dob, setDob] = useState<string>("");

  const handleSubmit = async () => {
    const newUserData = {
      name,
      phone,
      dob,
    };
    await updateUser(user.id, newUserData);
    const updatedUser = await getUser(user.id);
    setUser?.(updatedUser);
  };

  const setValues = () => {
    setName(user.name);
    setPhone(user.phone);
    setDob(user.dob ? user.dob : "");
  };

  useEffect(() => {
    setValues();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {admin ? (
          <Icon icon="mage:edit" fontSize={30} className=" cursor-pointer" />
        ) : (
          <Button className="w-full bg-[#6343d8] hover:bg-[#593cc1]">
            Update Profile
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="bg-white text-black max-sm:w-11/12">
        <DialogHeader>
          <DialogTitle>Update Employee</DialogTitle>
          <DialogDescription className="hidden">Edit Form</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input type="email" readOnly disabled defaultValue={user.email} />
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {!user.dob && (
            <div>
              <Label>DOB</Label>
              <Input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
          )}

          {user.dob && (
            <div>
              <Label>DOB</Label>
              <Input
                type="date "
                defaultValue={user.dob ? format(user.dob, "dd-MM-yyyy") : ""}
                readOnly
                disabled
              />
            </div>
          )}

          <DialogFooter className="pt-3">
            <DialogClose asChild>
              <Button type="submit" className="bg-[#6343d8] hover:bg-[#593cc1]">
                Update
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserUpdateForm;
