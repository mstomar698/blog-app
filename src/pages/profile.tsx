import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Profile = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!sessionData) {
    void router.push("/auth");
    return null;
  }

  const { user } = sessionData;
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div
        onClick={() => (window.location.href = "/")}
        className="my-16 text-3xl font-extrabold text-white"
      >
        Acrudino
      </div>
      <div className="text-center text-3xl text-white">
        <h1 className="my-4 text-start">Profile:</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
