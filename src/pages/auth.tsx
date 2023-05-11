import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

import { api } from "~/utils/api";

const SignIn = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );
  return (
    <div className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex flex-col items-center justify-center gap-4">
        <div onClick={() => (window.location.href = "/")} className="text-3xl text-white font-extrabold">Acrudino</div>
        <p className="text-center text-2xl text-white">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
        <button
          className="rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in using Github"}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
