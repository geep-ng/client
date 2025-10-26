'use client'
import { useForm } from "react-hook-form"
// import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";


type FormData = {
  email: string;
  password: string;
};


  export const SignInView = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>();


    const loginMutation = useMutation ({
      mutationFn: async(data:FormData) => {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/login-user`,
          data,
          {withCredentials: true }
        );
        // console.log(response.data)
        return response.data;
      },
      onSuccess: (data) =>{
        setServerError(null);

        // console.log(``)

        router.push(`/${data.user.username}`);
      },
      onError: (error: AxiosError) =>{
        const errorMessage = (error.response?.data as {message?: string}) ?.message ||
        "Invalid credentials"
        setServerError(errorMessage);
      },
    });

    const onSubmit = (data: FormData) => {
      loginMutation.mutate(data);
    };



     return (
         <div className=" grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
             <div className=" bg-blue-900/90 h-screen w-full md:col-span-2 lg:col-span-2 flex flex-col overflow-y-auto">
                <div className=" h-1/4 flex items-end p-10">
                  <div>
                    <h2 className=" text-4xl font-bold text-white mb-2">
                      Hey!
                    </h2>
                    <h4 className=" text-3xl font-semibold text-white/90">
                      Welcome back
                    </h4>
                  </div>
                </div>
                 {/* <Form {...form}> */}
                     <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex h-3/4 flex-col gap-4 p-4 md:p-8 lg:p-16 bg-[#EBF4FF]/90 rounded-t-[40px] md:rounded-t-none" // Light blue background for form area
                     >
                      <div className=" hidden items-center justify-between mb-8">
                          <Link href={'/'}>
                          <h1 className="text-2xl font-bold">
                            <span className="text-blue-500">Radon</span> Pay
                          </h1>
                              {/* <Image src={'/assets/logo/logo.png'} alt='' width={100} height={100} className=' h-10 w-auto' /> */}
                          </Link>
                          <div
                              className=" border-none underline"
                          >
                              <Link prefetch href={'/signup'}>
                                  Sign up
                              </Link>
                          </div>
                      </div>

                      <div className=" flex justify-between items-center mb-5 px-10">
                        <div>
                          <Link href={'/'} className=" text-xl font-semibold p-3 border-b-2 border-blue-900"> {/* Blue border */}
                            Login
                          </Link>
                        </div>
                        <div>
                          <Link href={'/signup'} className="text-gray-600 hover:text-blue-900 transition-colors">
                            Sign Up
                          </Link>
                        </div>
                      </div>
                         

                      <div>
                        <label className="block text-lg font-semibold ml-5 text-blue-900 mb-2">Email or Username</label>
                        <input
                          type="text"
                          placeholder="shopper@luj.ng"
                          className="w-full p-4 border-blue-900 border-2 outline-0 !rounded-full mb-1 focus:ring-blue-500 focus:border-blue-500" // Blue borders and focus rings
                          {...register("email", {
                            required: "Email is required",
                            // pattern: {
                            //   value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            //   message: "Invalid email address",
                            // }
                          })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">
                            {String(errors.email.message)}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-lg font-semibold ml-5 text-blue-900 mb-2">Password</label>
                        <div className="relative">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Min. 6 characters"
                            className="w-full p-4 border-blue-900 border-2 outline-0 !rounded-full mb-1 focus:ring-blue-500 focus:border-blue-500" // Blue borders and focus rings
                            {...register ("password",{
                              required: "Password is required",
                              minLength: {
                                value:6,
                                message: "Password must be at least 6 characters",
                              },
                            })}
                            />
                            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)}
                              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600"
                            >
                              {passwordVisible? <Eye/> : <EyeOff />}
                            </button>
                            {errors.password && (
                              <p className="text-red-500 text-sm">
                                {String(errors.password.message)}
                              </p>
                            )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center my-4">
                          <label className="flex items-center text-gray-700"> {/* Darker grey for text */}
                            <input
                              type="checkbox"
                              className="mr-2 text-blue-600 focus:ring-blue-500" // Blue checkbox
                              checked={rememberMe}
                              onChange={() => setRememberMe(!rememberMe)}
                            />
                              Remember me
                          </label>
                          <Link href={"/forgot-password"} className="text-blue-700 text-sm hover:underline"> {/* Blue link */}
                            Forgot Password?
                          </Link>
                      </div>
                      <button
                        type="submit"
                        disabled={loginMutation.isPending}
                        className="w-4/5 text-2xl font-bold mx-auto cursor-pointer bg-blue-700 text-white py-2 rounded-xl hover:bg-blue-800 transition-colors duration-200" // Blue button
                      >
                        {loginMutation?.isPending ? "Logging in ..." : "Login"}
                      </button>

                      {serverError && (
                        <p className="text-red-500 text-sm mt-2 text-center">{serverError}</p>
                      )}
                    </form>
                 {/* </Form> */}
             </div>
             <div
                 style={{
                     backgroundImage: "url('/assets/bg/login.jpg')", // You'd likely replace this with a blue-themed image or pattern
                     backgroundSize: "cover",
                     backgroundPosition: "center",
                     opacity: "80%" // Adjusted opacity for a crisper look
                 }}
                 className=" h-screen w-full hidden md:col-span-2 lg:col-span-3 md:block "
             />

         </div>
     )
  }
