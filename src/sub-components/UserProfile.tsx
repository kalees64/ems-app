"use client";

import React from "react";

import UserUpdateForm from "./UserUpdateForm";

import { User } from "@/utils/objectTypes";

import { format } from "date-fns";

const UserProfile = ({ userData }: { userData: User }) => {
  const [user, setUser] = React.useState<User>(userData);

  React.useEffect(() => {
    if (!user) {
      setUser(userData);
    } else {
      setUser(user);
    }
  });

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
          Date of Joining
        </label>
        <h1 className="w-full font-bold">
          {user.doj ? format(user.doj, "dd-MM-yyy") : "Not Updated"}
        </h1>
      </div>
      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Date of Birth
        </label>
        <h1 className="w-full font-bold">
          {user.dob ? format(user.dob, "dd-MM-yyy") : "Not Updated"}
        </h1>
      </div>
      <div className="mb-4">
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Date of Resignation
        </label>
        <h1 className="w-full font-bold">
          {user.dor ? format(user.dor, "dd-MM-yyy") : "Not Updated"}
        </h1>
      </div>

      {!user.dor && (
        <UserUpdateForm user={user} setUser={setUser} admin={false} />
      )}
    </div>
  );
};

export default UserProfile;
