"use client";
import React, { useState } from "react";
// import { PLANS } from "@/shared/plans";
import PlanCard from "./PlanCard";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { PLANS } from "../data";

export default function PlansGrid({ userId }: { userId: string }) {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");
  const router = useRouter();

  const onSelect = (planId: string) => {
    // Navigate to checkout with selected plan
    router.push(`/checkout?plan=${planId}&interval=${billingInterval}&userId=${userId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold">Choose your plan</h2>
        <p className="mt-2 text-gray-600">Scale as you grow — flexible billing, cancel anytime.</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setBillingInterval("monthly")}
          className={`px-4 py-2 rounded-full ${billingInterval === "monthly" ? "bg-amber-600 text-white" : "bg-gray-200"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingInterval("annual")}
          className={`px-4 py-2 rounded-full ${billingInterval === "annual" ? "bg-amber-600 text-white" : "bg-gray-200"}`}
        >
          Annual (Save)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLANS.map((p) => (
          <PlanCard key={p.id} plan={p} billingInterval={billingInterval} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}
