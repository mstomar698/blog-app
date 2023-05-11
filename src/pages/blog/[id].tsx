/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BlogPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);

        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
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
          <h1>{post?.title}</h1>
          <p>{post?.body}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
