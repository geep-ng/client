"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export default function CheckoutPage() {
  const params = useSearchParams();
  const plan = params.get("plan") || "creator";
  const interval = (params.get("interval") as "monthly" | "annual") || "monthly";
  const userId = params.get("userId") || ""; // pass authenticated user id or send from front-end auth
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/subscription/checkout`, {
        userId,
        planId: plan,
        billingInterval: interval,
      });

      // If free plan immediate success:
      if (res.data.ok && res.data.message?.includes("Free")) {
        window.location.href = "/"; // or your flow
        return;
      }

      const authUrl = res.data.authorization_url;
    //   const reference = res.data.reference;

      if (authUrl) {
        // Redirect user to Paystack payment page
        window.location.href = authUrl;
      } else {
        setError("Failed to initialize payment");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.error || err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full p-8 rounded-3xl bg-gradient-to-br from-white to-amber-50 shadow-xl">
        <h2 className="text-2xl font-bold mb-2">Confirm your plan</h2>
        <p className="text-sm text-gray-600">Plan: {plan} • {interval}</p>

        <div className="mt-6">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold"
          >
            {loading ? "Processing..." : "Proceed to payment"}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
