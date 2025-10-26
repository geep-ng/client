"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axiosInstance from "@/utils/axiosInstance";
import Gallery from "@/shared/components/gallery/Gallery";
import GallerySkeleton from "@/shared/components/gallery/GallerySkleton";
import UserNotFound from "@/shared/components/gallery/NotFound";
import { Facebook, Instagram, Linkedin } from "lucide-react";

export default function UserPortfolio() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: user, isLoading, error } = useQuery<any, AxiosError>({
    queryKey: ["userPortfolio", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/${username}/posts`);
      return res.data;
    },
  });

  if (isLoading) return <GallerySkeleton />;

  // Handle 404 user not found
  if (error && error.response?.status === 404) {
    return <UserNotFound username={username} />;
  }

  if (error) return <p className="text-center mt-20">Something went wrong.</p>;
  
  console.log(user)


  if (!user.public) {
    return <p className="text-center mt-20">This portfolio is private.</p>;
  }

  return (
    <main className="">
      <div className=" py-28 md:py-40 px-12">
        <p className=" uppercase font-thin text-2xl md:text-4xl text-neutral-600 tracking-widest text-center">
          Explore the world of <span className=" border-b border-red-500 italic">{user.username}</span>  <br /> through their stunning portfolio <br />
          
        </p>
      </div>
      {/* <h1 className="text-2xl font-bold mb-4">{user.username}&apos;s Portfolio</h1> */}
      <Gallery posts={user.posts} />
      {/* <GallerySkeleton /> */}

      <div className=" w-full py-24 bg-neutral-200 flex justify-center items-center">
        <div>
          <p className=" text-center text-2xl font-semibold text-neutral-700">
            {user.username}
          </p>
          <div className=" flex items-center gap-6 justify-center mt-4 text-neutral-600">
            <Facebook />
            <Instagram />
            <Linkedin />
          </div>
        </div>
      </div>
    </main>
  );
}