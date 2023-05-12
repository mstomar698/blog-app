/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import { signIn, signOut, useSession } from "next-auth/react";
// import React from "react";

// import { api } from "~/utils/api";

// const SignIn = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined,
//     { enabled: sessionData?.user !== undefined }
//   );
//   return (
//     <div className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-[#2e026d] to-[#15162c]">
//       <div className="flex flex-col items-center justify-center gap-4">
//         <div onClick={() => (window.location.href = "/")} className="text-3xl text-white font-extrabold">Acrudino</div>
//         <p className="text-center text-2xl text-white">
//           {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//           {secretMessage && <span> - {secretMessage}</span>}
//         </p>
//         <button
//           className="rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//           onClick={sessionData ? () => void signOut() : () => void signIn()}
//         >
//           {sessionData ? "Sign out" : "Sign in using Github"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SignIn;
// import { signIn, signOut, useSession } from "next-auth/react";
// import React, { useState } from "react";

// import { api } from "~/utils/api";

// const SignIn = () => {
//   const { data: sessionData } = useSession();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleSignIn = async (e: any) => {
//     e.preventDefault();

//     try {
//       const response = await signIn("credentials", {
//         email,
//         password,
//         redirect: false, // Do not redirect automatically, handle it manually
//       });

//       if (response?.error) {
//         setError(response.error);
//       } else {
//         // Redirect to home page after successful sign-in
//         // window.location.href = "/";
//         console.log(response);
//       }
//     } catch (error) {
//       setError("Failed to sign in.");
//     }
//   };

//   const handleSignOut = () => {
//     void signOut();
//   };

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-[#2e026d] to-[#15162c]">
//       <div className="flex flex-col items-center justify-center gap-4">
//         <div
//           onClick={() => (window.location.href = "/")}
//           className="text-3xl font-extrabold text-white"
//         >
//           Acrudino
//         </div>
//         <p className="text-center text-2xl text-white">
//           {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//           {secretMessage && <span> - {secretMessage}</span>}
//         </p>
//         {sessionData ? (
//           <button
//             className="rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//             onClick={handleSignOut}
//           >
//             Sign out
//           </button>
//         ) : (
//           <div>
//             <form onSubmit={handleSignIn} className="flex flex-col flex-wrap my-3">
//               <input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="rounded px-4 py-2"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-2 rounded px-4 py-2"
//               />
//               <button
//                 type="submit"
//                 className="mt-2 rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//               >
//                 Sign in
//               </button>
//               {error && <p className="mt-2 text-red-500">{error}</p>}
//             </form>
//             <button
//               className="rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//               onClick={sessionData ? () => void signOut() : () => void signIn()}
//             >
//               {sessionData ? "Sign out" : "Sign in using Github"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SignIn;
import { signIn, signOut, useSession } from "next-auth/react";
import React, { useState } from "react";

import { api } from "~/utils/api";

const SignIn = () => {
  const { data: sessionData } = useSession();
  const { data: session } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined,
    { enabled: sessionData?.user !== undefined }
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (response?.error) {
      console.log(response.error);
    } else {
      console.log(response);
      if (response?.ok) {
        // window.location.href = "/";
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="flex flex-col items-center justify-center gap-4">
        <div
          onClick={() => (window.location.href = "/")}
          className="text-3xl font-extrabold text-white"
        >
          Acrudino
        </div>
        <p className="text-center text-2xl text-white">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
          {secretMessage && <span> - {secretMessage}</span>}
        </p>
        {sessionData ? (
          <></>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded border border-white/10 bg-transparent px-4 py-2 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded border border-white/10 bg-transparent px-4 py-2 text-white"
              />
              <button
                type="submit"
                className="rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              >
                Sign in using email and password
              </button>
            </form>
            <button
              onClick={() => (window.location.href = "/register")}
              className="rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            >
              Register now
            </button>
          </>
        )}
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
