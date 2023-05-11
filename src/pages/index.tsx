import { type NextPage } from "next";
import Head from "next/head";
import { signOut, useSession } from "next-auth/react";

// import { api } from "~/utils/api";
import BlogPosts from "~/components/BlogPosts";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { data: sessionData } = useSession();
  const redirect = () => {
    window.location.href = "/auth";
  };

  const blogRedirecter = () => {
    window.location.href = "/blog";
  };
  const createBlogRedirector = () => {
    window.location.href = "/createBlogs";
  };
  const profileRouter = () => {
    window.location.href = "/profile";
  };

  return (
    <>
      <Head>
        <title>acrudino</title>
        <meta name="description" content="internship assignment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="flex h-20 w-full flex-row items-center justify-between bg-black/20 px-8 text-2xl backdrop-blur-2xl">
          {sessionData ? (
            <>
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => void profileRouter()}
              >
                {sessionData.user?.name}
              </button>
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => void signOut()}
              >
                {"Sign out"}
              </button>
            </>
          ) : (
            <>
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => void redirect()}
              >
                {"Sign in"}
              </button>
            </>
          )}
        </div>
        <div className="flex h-20 w-full flex-row items-center justify-between bg-black/20 px-8 text-2xl backdrop-blur-2xl">
          <>
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => void createBlogRedirector()}
            >
              {"Create BlogPosts"}
            </button>
          </>
          {sessionData ? (
            <>
              <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={() => void blogRedirecter()}
              >
                {"See Your BlogPosts"}
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="container flex min-h-screen px-4 py-8 ">
          {/* <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p> */}
          <BlogPosts />
        </div>
      </main>
    </>
  );
};

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
