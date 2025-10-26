'use client'
import { useForm } from "react-hook-form"
// import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
// import GoogleButton from "apps/user-ui/src/shared/components/google-button";

type FormData = {
  fullName: string;
  email: string;
  password: string;
};


  export const SignUpView = () => {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userData, setUserData] = useState<FormData | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<FormData>();


    const startResendTimer = () => {
    const interval = setInterval(() => {
    setTimer((prev) =>{
      if(prev <= 1){
        clearInterval(interval);
        setCanResend(true);
        return 0;
      }
      return prev -1;
    });
    }, 1000);
  };

  const signupMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(
        `${process.env['NEXT_PUBLIC_SERVER_URL']}/api/user-registration`,
        data
      );
        return response.data;
    },
      onSuccess: (_, formData) => {
      setUserData(formData)
      setShowOtp(true);
      setCanResend(false);
      setTimer(60);
      startResendTimer();
    }
  });

    const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if(!userData)return;
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-user`,
        {
          ... userData,
          otp: otp.join(""),
          
        },
        { withCredentials: true }
      );

      
      return response.data;
    },
    onSuccess: () =>{
      router.push(`/onboarding`);
    },
  });

  const onSubmit = (data: FormData) => {
    signupMutation.mutate(data)
  };

  const handleOtpchange = (index:number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < inputRefs.current.length -1){
      inputRefs.current[index + 1] ?.focus();
    }
  };

  const handleOtpKeyDown = (index:number,e:React.KeyboardEvent<HTMLElement>) =>{
    if(e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1] ?.focus();
    }
  };

   const resendOtp = () => {
    if(userData){
      signupMutation.mutate(userData);
    }
  };


     return (
         <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
      <div className="bg-blue-900/90 h-screen w-full md:col-span-2 lg:col-span-2 flex flex-col overflow-y-auto"> {/* Rebranded primary color */}
        <div className="h-1/4 flex items-end p-10">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">Hey!</h2>
            <h4 className="text-3xl font-semibold text-white/90">Join In</h4>
          </div>
        </div>

        {!showOtp ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-3/4 flex-col gap-3 p-4 md:p-8 lg:p-16 bg-[#EBF4FF]/90 rounded-t-[40px] md:rounded-t-none" // Rebranded light blue background
          >
            {/* top nav hidden on this layout */}
            <div className="hidden items-center justify-between mb-8">
              <Link href={"/"}>
                <h1 className="text-2xl font-bold">
                  <span className="text-blue-500">Radon</span> Pay
                </h1>
              </Link>
              <div className="border-none underline">
                <Link prefetch href={"/login"}>
                  Login
                </Link>
              </div>
            </div>

            <div className="flex justify-between items-center mb-5 px-10">
              <div>
                <Link href={"/"} className="text-xl font-semibold p-3 border-b-2 border-blue-900"> {/* Rebranded border color */}
                  Signup
                </Link>
              </div>
              <div>
                <Link href={"/login"} className="text-gray-600 hover:text-blue-900 transition-colors">
                  Login
                </Link>
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold ml-5 text-blue-900 mb-1"> {/* Rebranded label text color */}
                Instagram Username
              </label>
              <input
                type="text"
                placeholder="yourusername"
                className="w-full p-4 border-blue-900 border-2 outline-0 !rounded-full mb-1 focus:ring-blue-500 focus:border-blue-500" // Rebranded input border and focus
                {...register("fullName", {
                  required: "Name is required",
                })}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{String(errors.fullName.message)}</p>
              )}
            </div>

            <div>
              <label className="block text-lg font-semibold ml-5 text-blue-900 mb-1">Email</label> {/* Rebranded label text color */}
              <input
                type="email"
                placeholder="hello@radonpay.io"
                className="w-full p-4 border-blue-900 border-2 outline-0 !rounded-full mb-1 focus:ring-blue-500 focus:border-blue-500" // Rebranded input border and focus
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <p className="text-red-500 text-sm">{String(errors.email.message)}</p>}
            </div>

            <div>
              <label className="block text-lg font-semibold ml-5 text-blue-900 mb-1">Password</label> {/* Rebranded label text color */}
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className="w-full p-4 border-blue-900 border-2 outline-0 !rounded-full mb-1 focus:ring-blue-500 focus:border-blue-500" // Rebranded input border and focus
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600" // Hover effect
                >
                  {passwordVisible ? <Eye /> : <EyeOff />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">{String(errors.password.message)}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="w-4/5 text-2xl font-bold mx-auto cursor-pointer bg-blue-700 text-white py-2 mt-2 rounded-xl hover:bg-blue-800 transition-colors duration-200" // Rebranded button color
            >
              {signupMutation.isPending ? "Signing up ..." : "Signup"}
            </button>

            {signupMutation.isError && signupMutation.error instanceof AxiosError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {signupMutation.error.response?.data?.message || signupMutation.error.message}
              </p>
            )}
          </form>
        ) : (
          <div className="flex justify-center items-center h-full p-4 md:p-8 lg:p-16 bg-[#EBF4FF]/90 rounded-t-[40px] md:rounded-t-none"> {/* Rebranded light blue background */}
            <div className="w-full max-w-md">
              <h3 className="text-xl font-semibold text-center mb-4">Enter OTP</h3>
              <div className="flex justify-center gap-6 mb-4">
                {otp?.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-blue-900 outline-none !rounded focus:ring-blue-500 focus:border-blue-500" // Rebranded OTP input border and focus
                    value={digit}
                    onChange={(e) => handleOtpchange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  />
                ))}
              </div>

              <button
                className="w-full mt-4 text-lg cursor-pointer bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200" // Rebranded button color
                disabled={verifyOtpMutation.isPending}
                onClick={() => verifyOtpMutation.mutate()}
              >
                {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-center text-sm mt-4">
                {canResend ? (
                  <button onClick={resendOtp} className="text-blue-900 font-medium hover:underline"> {/* Rebranded resend link color */}
                    Resend OTP
                  </button>
                ) : (
                  `Resend OTP in ${timer}s`
                )}
              </p>

              {verifyOtpMutation.isError && verifyOtpMutation.error instanceof AxiosError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  {verifyOtpMutation.error.response?.data?.message || verifyOtpMutation.error.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          backgroundImage: "url('/assets/bg/signup.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "80%", // Adjusted opacity for consistency
        }}
        className="h-screen w-full hidden md:col-span-2 lg:col-span-3 md:block"
      />
    </div>
     )
  }
