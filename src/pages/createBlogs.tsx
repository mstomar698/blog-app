/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const CreateBlogs = () => {
  const { data: sessionData, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!sessionData) {
      void router.push("/auth");
    } else {
      setIsLoading(false);
    }
  }, [sessionData, status, router]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const response = await fetch("/api/createposts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData?.expires}`,
      },
      body: JSON.stringify({ title, body }),
    });
    if (response.ok) {
      void router.push("/blog");
    } else {
      const data = await response.json();
      setError(data?.error);
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div
        onClick={() => (window.location.href = "/")}
        className="text-3xl font-extrabold text-white"
      >
        Acrudino
      </div>
      <div className="text-white">Create Blogs here</div>
      <form
        onSubmit={handleSubmit}
        className="flex h-max w-full flex-col items-center justify-evenly gap-4 bg-black/20 px-8 pt-4 text-2xl text-white backdrop-blur-2xl"
      >
        <input
          type="text"
          placeholder="Title"
          className="text-black"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          className="text-black"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          type="submit"
          className="mb-4 rounded-lg shadow-md shadow-white"
        >
          Submit
        </button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default CreateBlogs;
