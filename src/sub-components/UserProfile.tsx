import React from "react";

import UserUpdateForm from "./UserUpdateForm";

import { User } from "@/utils/objectTypes";

import { format } from "date-fns";

const UserProfile = ({
  user,
  setUser,
}: {
  user: User;
  setUser: (data: User) => void;
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Profile</h3>

      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Name
        </label>
        <h1 className="w-full font-bold">{user.name}</h1>
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <h1 className="w-full font-bold">{user.email}</h1>
      </div>

      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Phone
        </label>
        <h1 className="w-full font-bold">{user.phone}</h1>
      </div>

      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          DOB
        </label>
        <h1 className="w-full font-bold">
          {user.dob ? format(user.dob, "dd-MM-yyy") : "Not Updated"}
        </h1>
      </div>

      <UserUpdateForm user={user} setUser={setUser} admin={false} />
    </div>
  );
};

export default UserProfile;
