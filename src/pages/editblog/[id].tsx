/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BlogPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/editpost/${id}`);

        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
          setNewBody(data.post.body);
          setLoading(false);
        } else {
          setError("Post not found");
          setLoading(false);
        }
      } catch (error) {
        setError("Error fetching post");
        setLoading(false);
      }
    };

    if (id) {
      void fetchPost();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/editpost/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: newBody }),
      });

      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
        setNewBody(data.post.body);
        window.location.href = `/blog`;
      } else {
        setError("Failed to update post");
      }
    } catch (error) {
      setError("Error updating post");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        Error: {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        Post not found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div
        onClick={() => (window.location.href = "/")}
        className="my-8 text-3xl font-extrabold text-white"
      >
        Acrudino
      </div>
      <div className="mt-16 flex min-h-screen w-full flex-col flex-wrap items-center justify-start text-3xl text-white">
        <div className="gap-4 border p-6 text-center">
          <h1>{post.title}</h1>
          <textarea
            title="body"
            className="my-2 w-full bg-black/30 p-4 backdrop-blur-3xl"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
          />
          <button
            className="mt-4 px-4 py-2 text-white shadow-md shadow-white"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
