/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useEffect, useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import axios from "axios";

const Register = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
    };

    try {
      const response: any = await axios.post("/api/register", user);

      console.log(response.data);
      const newSession = response.data;
      const session = await getSession();
      if (session) {
        signIn("credentials", {
          email: session.user.email,
          name: session.user.name,
          callbackUrl: "/auth",
          redirect: false,
        });

        session.user = newSession.user;
        console.log(sessionData);
        console.log(session);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (sessionData) {
      void router.push("/");
    }
  }, [sessionData, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div
        onClick={() => (window.location.href = "/")}
        className="my-16 text-3xl font-extrabold text-white"
      >
        Acrudino
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 bg-black/30 p-4 text-3xl backdrop-blur-3xl"
      >
        <input
          type="name"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-full bg-red-500/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
