"use client";

import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

type FormData = {
  email: string;
  password: string;
};

const ForgotPassword = () => {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const startResendTimer = () => {
    setCanResend(false);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const requestOtpMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const reponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/forgot-password-user`,
        { email }
      );
      return reponse.data;
    },
    onSuccess: (_, { email }) => {
      setUserEmail(email);
      setStep("otp");
      setServerError(null);
      setCanResend(false);
      startResendTimer();
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message ||
        "Invalid OTP. Try again!";
      setServerError(errorMessage);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      if (!userEmail) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/verify-forgot-password-user`,
        { email: userEmail, otp: otp.join("") }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("reset");
      setServerError(null);
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })
        ?.message;
      setServerError(errorMessage || "Invalid OTP. Try again!");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      if (!password) return;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/reset-password-user`,
        { email: userEmail, newPassword: password }
      );
      return response.data;
    },
    onSuccess: () => {
      setStep("email");
      toast.success(
        "Password reset successfully! Please login with your new password."
      );
      setServerError(null);
      router.push("/login");
    },
    onError: (error: AxiosError) => {
      const errorMessage = (error.response?.data as { message?: string })
        ?.message;
      setServerError(errorMessage || "Failed to reset password. Try again!");
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmitEmail = ({ email }: { email: string }) => {
    requestOtpMutation.mutate({ email });
  };

  const onSubmitPassword = ({ password }: { password: string }) => {
    resetPasswordMutation.mutate({ password });
  };

  return (
    <div className=" grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5">
             <div className=" bg-neutral-100 h-screen w-full md:col-span-2 lg:col-span-2 overflow-y-auto">

                 {step === "email" && (
                     <form
                      onSubmit={handleSubmit(onSubmitEmail)}
                      className="flex flex-col gap-8 p-4 md:p-8 lg:p-16"
                     >
                      <div className=" flex items-center justify-between mb-8">
                             <Link href={'/'}>
                                 <Image src={'/assets/logo/logo.png'} alt='' width={100} height={100} className=' h-10 w-auto' />
                             </Link>
                             <div
                                 className=" border-none underline"
                             >
                                 <Link prefetch href={'/signup'}>
                                     Sign up
                                 </Link>
                             </div>
                         </div>
                         <h1 className=" text-3xl font-medium">
                             Hey, Lujer <br />Let's help you reset your password!
                         </h1>

                      <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          placeholder="shopper@luj.ng"
                          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: "Invalid email address",
                            }
                          })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">
                            {String(errors.email.message)}
                          </p>
                        )}
                      </div>



                      <button
                        type="submit"
                        disabled={requestOtpMutation.isPending}
                        className="w-full text-lg cursor-pointer mt-4 bg-black text-white py-2 rounded-lg"
                      >
                        {requestOtpMutation.isPending ? "Sending OTP..." : "Submit"}
                      </button>

                      {serverError && (
                        <p className="text-red-500 text-sm mt-2">{serverError}</p>
                      )}
                    </form>
                 )}

                 {step === "otp" && (
                  <div className="flex justify-center items-center h-full p-4 md:p-8 lg:p-16">
                    <div>
                      <h3 className="text-xl font-semibold text-center mb-4">
                        Enter OTP
                      </h3>
                      <div className="flex justify-center gap-6">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => {
                              if (el) inputRefs.current[index] = el;
                            }}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center border border-gray-300 outline-none !rounded"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          />
                        ))}
                      </div>
                      <button
                        onClick={() => verifyOtpMutation.mutate()}
                        className="w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
                        disabled={verifyOtpMutation.isPending}
                      >
                        {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
                      </button>
                      {canResend ? (
                        <button
                          onClick={() =>
                            requestOtpMutation.mutate({ email: userEmail! })
                          }
                          className="text-blue-500 w-full text-center mt-4 cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      ) : (
                        <p className="text-center text-sm mt-4">
                          Resend OTP in {timer}s
                        </p>
                      )}

                      {serverError && (
                        <p className="text-red-500 text-sm mt-2">{serverError}</p>
                      )}

                    </div>

                  </div>
                )}


                {step === "reset" && (
                  <div className="flex justify-center items-center h-full p-4 md:p-8 lg:p-16">
                    <div>
                      <h3 className="text-xl font-semibold text-center mb-4">
                        Reset Password
                      </h3>
                      <form onSubmit={handleSubmit(onSubmitPassword)}>
                        <label className="block text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          placeholder="Enter new password"
                          className="w-full p-2 border border-gray-300 outline-0 !rounded mb-1"
                          {...register("password", {
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters",
                            },
                          })}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm">
                            {String(errors.password.message)}
                          </p>
                        )}

                        <button
                          type="submit"
                          className="w-full mt-4 text-lg cursor-pointer bg-black text-white py-2 rounded-lg"
                          disabled={resetPasswordMutation.isPending}
                        >
                          {resetPasswordMutation.isPending
                            ? "Resetting..."
                            : "Reset Password"}
                        </button>

                        {serverError && (
                          <p className="text-red-500 text-sm mt-2">{serverError}</p>
                        )}
                      </form>
                    </div>
                  </div>
                )}

             </div>
             <div
                 style={{
                     backgroundImage: "url('/assets/images/bg2.jpg')",
                     backgroundSize: "cover",
                     backgroundPosition: "canter",
                     opacity: "60%"
                 }}
                 className=" h-screen w-full hidden md:col-span-2 lg:col-span-3 md:block "
             />

         </div>
  );
};

export default ForgotPassword;
