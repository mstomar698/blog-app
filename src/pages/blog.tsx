/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Blog = () => {
  const { data: sessionData, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/api/posts?page=${currentPage}`, {
          headers: {
            Authorization: `Bearer ${sessionData?.expires}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data?.posts.reverse());
        } else {
          throw new Error("Failed to fetch posts");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    if (sessionData) {
      void fetchPosts();
    }
  }, [sessionData, currentPage]);

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!sessionData) {
    return <div>You must be logged in to view this page</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const postsPerPage = 5;
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const editBlogClick = (id: any) => {
    window.location.href = `/editblog/${id}`;
  };

  const renderPosts = () => {
    if (posts.length === 0) {
      return <p>No posts available</p>;
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    return (
      <ul className="flex h-full flex-wrap justify-evenly gap-4">
        {currentPosts.map((post: any) => (
          <li key={post?.id} onClick={() => editBlogClick(post?.id)}>
            <div className="flex h-max w-max flex-col flex-wrap border p-8">
              <div className="text-2xl text-white">{post?.title}</div>
              <div className="text-xl text-white/50">{post?.body}</div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const renderPagination = () => {
    if (totalPages === 1) {
      return null;
    }

    return (
      <div className="mt-4 flex">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`mx-1 rounded px-2 py-1 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-blue-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-around bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div
        onClick={() => (window.location.href = "/")}
        className="text-3xl font-extrabold text-white"
      >
        Acrudino
      </div>

      <div className="flex h-full min-h-screen w-full flex-col flex-wrap items-center  justify-start  text-white">
        <h1 className="my-1">
          Blog Posts for user: <span>{sessionData?.user.name}</span>
        </h1>
        <div className="w-full text-start text-3xl">Posts:</div>
        <div className="mt-16">{renderPosts()}</div>
        {renderPagination()}
      </div>
    </div>
  );
};

export default Blog;
