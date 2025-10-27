// import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import axiosInstance from '@/utils/axiosInstance';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const ChangePassword = () => {

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setError("");
    setMessage("");
    try {
      await axiosInstance.post("/api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data?.confirmPassword,
      });
      setMessage("Password updated successfully!");
      reset();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error?.response?.data?.message)
    }
  }

  return (
    <div className='max-w-md mx-auto space-y-6'>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    {/* Current Password */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Current Password
      </label>
      <input
        type="password"
        placeholder="Enter current password"
        className={`w-full px-4 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          errors.currentPassword ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register("currentPassword", {
          required: "Current password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        })}
      />
      {errors.currentPassword?.message && (
        <p className="text-red-500 text-xs mt-1">
          {String(errors.currentPassword.message)}
        </p>
      )}
    </div>

    {/* New Password */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        New Password
      </label>
      <input
        type="password"
        placeholder="Enter new password"
        className={`w-full px-4 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          errors.newPassword ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register("newPassword", {
          required: "New password is required",
          minLength: {
            value: 6,
            message: "Must be at least 8 characters",
          },
          // validate: {
          //   hasLower: (v) => /[a-z]/.test(v) || "Must include a lowercase letter",
          //   hasUpper: (v) => /[A-Z]/.test(v) || "Must include an uppercase letter",
          //   hasNumber: (v) => /\d/.test(v) || "Must include a number",
          // },
        })}
      />
      {errors.newPassword?.message && (
        <p className="text-red-500 text-xs mt-1">{String(errors.newPassword.message)}</p>
      )}
    </div>

    {/* Confirm Password */}
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Confirm Password
      </label>
      <input
        type="password"
        placeholder="Re-enter new password"
        className={`w-full px-4 py-2 border rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register("confirmPassword", {
          required: "Confirmation is required",
          validate: (value) =>
            value === watch("newPassword") || "Passwords do not match",
        })}
      />
      {errors.confirmPassword?.message && (
        <p className="text-red-500 text-xs mt-1">{String(errors.confirmPassword.message)}</p>
      )}
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full mt-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isSubmitting ? "Updating..." : "Update Password"}
    </button>
  </form>

  {/* Feedback */}
  {error && <p className="text-red-500 text-center text-sm">{error}</p>}
  {message && <p className="text-green-600 text-center text-sm">{message}</p>}
    </div>
  )
}

export default ChangePassword
