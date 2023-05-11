/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const BlogPosts = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/blogs");
      const data = await response.json();
      setBlogs(data?.posts.reverse());
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  const handleBlogClick = (id: any) => {
    void router.push(`/blog/${id}`);
  };
  const handleUnAuthBlogClick = () => {
    void router.push(`/auth`);
  };
  useEffect(() => {
    if (!sessionData) {
      console.log("not authorized");
      void fetchBlogs();
    } else {
      void fetchBlogs();
    }
  }, [sessionData]);
  if (status === "loading") {
    return <div className="text-white">Loading...</div>;
  }

  const handlePageChange = (pageNumber: any) => {
    setCurrentPage(pageNumber);
  };
  const renderBlogPosts = () => {
    if (!blogs.length) {
      return <div>No blogs found.</div>;
    }

    const blogsPerPage = 5;
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    return currentBlogs.map((blog: any) => (
      <div
        key={blog?.id}
        onClick={() => handleBlogClick(blog?.id)}
        className="m-2 flex h-max w-max flex-col flex-wrap items-center gap-2 border p-8"
      >
        <h2>{blog?.title}</h2>
        <p>{blog?.body}</p>
      </div>
    ));
  };
  const renderUnAuthBlogPosts = () => {
    if (!blogs.length) {
      return <div>No blogs found.</div>;
    }

    const blogsPerPage = 5;
    const indexOfLastBlog = currentPage * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    return currentBlogs.map((blog: any) => (
      <div
        key={blog?.id}
        onClick={() => handleUnAuthBlogClick()}
        className="m-2 flex h-max w-max flex-col flex-wrap items-center gap-2 border p-8"
      >
        <h2>{blog?.title}</h2>
        <p>{blog?.body}</p>
      </div>
    ));
  };
  const blogsPerPage = 5;
  const totalBlogs = blogs.length;
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

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
    <div className="flex h-full w-full flex-col flex-wrap items-center  justify-evenly  text-white">
      {sessionData ? (
        <>
          <h1 className="text-3xl text-white">Blog Posts</h1>
          <div className="mt-16 flex h-full w-full flex-wrap justify-evenly">
            {renderBlogPosts()}
          </div>
          {renderPagination()}
        </>
      ) : (
        <>
          <h1 className="text-3xl text-white"> UnAuth Blog Posts</h1>
          <div className="mt-16 flex h-full w-full flex-wrap justify-evenly">
            {renderUnAuthBlogPosts()}
          </div>
          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default BlogPosts;
