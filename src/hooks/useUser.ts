"use client";

// import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
import axiosInstance from "../utils/axiosInstance";

// Fetch user from API
const fetchUser = async () => {
  const response = await axiosInstance.get(`/api/logged-in-user`);
  return response.data.user;
};

const useUser = (redirectToLogin: boolean = true) => {
  // const router = useRouter();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // useEffect(() => {
  //   if (!isLoading && !user && redirectToLogin) {
  //     router.push("/login");
  //   }
  // }, [isLoading, user, redirectToLogin, router]);

  return { user, isLoading, isError, refetch };
};

export default useUser;
