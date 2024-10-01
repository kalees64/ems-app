"use server";

import axios from "axios";

import React from "react";

import https from "https";

import UserProfile from "@/sub-components/UserProfile";

const UserProfilePage = async ({ params }: { params: { id: string } }) => {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/id/${params.id}`,
    { httpsAgent }
  );

  const user = res.data.data;

  return (
    <section className="w-96 mx-auto">
      <UserProfile userData={user} />
    </section>
  );
};

export default UserProfilePage;
