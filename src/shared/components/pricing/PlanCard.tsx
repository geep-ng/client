"use client";
import React from "react";
import { Plan } from "../data";
// import { Plan } from "@/shared/plans";

type Props = {
  plan: Plan;
  billingInterval: "monthly" | "annual";
  onSelect: (planId: string) => void;
  active?: boolean;
};

export default function PlanCard({ plan, billingInterval, onSelect, active }: Props) {
  const price = billingInterval === "monthly" ? plan.monthlyPrice : plan.annualPrice;
  const posts = typeof plan.postsAllowed === "number" ? `${plan.postsAllowed} posts` : "Unlimited";

  return (
    <div
      className={`relative transform transition-all duration-500 hover:scale-105 p-6 rounded-3xl shadow-2xl bg-gradient-to-br from-white/80 to-amber-50
        ${active ? "ring-4 ring-amber-300" : ""}`}
      style={{ backdropFilter: "blur(6px)" }}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-4 bg-amber-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
          {plan.badge}
        </div>
      )}

      <h3 className="text-xl font-extrabold">{plan.name}</h3>
      <p className="mt-1 text-sm text-gray-600">{plan.description}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold">${price}</span>
        <span className="text-sm text-gray-500">/{billingInterval === "monthly" ? "mo" : "yr"}</span>
      </div>

      <div className="mt-4 text-sm text-gray-700">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            <span className="font-semibold">{posts}</span>
          </li>
          {plan.features.map((f) => (
            <li key={f} className="text-sm text-gray-600">• {f}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => onSelect(plan.id)}
        className="mt-6 w-full py-2 rounded-xl bg-amber-600 text-white font-bold shadow hover:bg-amber-700 transition"
        aria-label={`Select ${plan.name}`}
      >
        Choose {plan.name}
      </button>
    </div>
  );
}
