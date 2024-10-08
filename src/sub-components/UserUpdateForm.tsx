"use client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
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
  setSearchUsers,
}: {
  user: User;
  setUser?: (data: User) => void;
  admin?: boolean;
  setSearchUsers?: (data: User[]) => void;
}) => {
  const { updateUser, getUser, users, fetchUsers } = useUserStore();

  const [name, setName] = useState<string>("");

  const [phone, setPhone] = useState<string>("");

  const [dob, setDob] = useState<string>("");

  const [error, setError] = useState({
    name: "",
    phone: "",
  });

  const handleSubmit = async () => {
    if (!name && !phone) {
      return setError({
        name: "Please enter name",
        phone: "Please enter phone",
      });
    }

    if (!name) {
      return setError({ ...error, name: "Please enter name" });
    }

    if (!phone) {
      return setError({ ...error, phone: "Please enter phone" });
    }

    const newUserData = {
      name,
      phone,
      dob,
    };
    await updateUser(user.id, newUserData);
    const updatedUser = await getUser(user.id);
    setUser?.(updatedUser);
    setSearchUsers?.(
      users.map((val) => (val.id === user.id ? updatedUser : val))
    );
  };

  const setValues = () => {
    setName(user.name);
    setPhone(user.phone);
    setDob(user.dob ? user.dob : "");
  };

  useEffect(() => {
    setValues();
    fetchUsers();
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
              onChange={(e) => {
                setName(e.target.value);
                setError({ ...error, name: "" });
              }}
            />
            {error.name && <p className="text-red-500 text-sm">{error.name}</p>}
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
              onChange={(e) => {
                setPhone(e.target.value);
                setError({ ...error, phone: "" });
              }}
            />
            {error.phone && (
              <p className="text-red-500 text-sm">{error.phone}</p>
            )}
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
            <Button type="submit" className="bg-[#6343d8] hover:bg-[#593cc1]">
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserUpdateForm;
