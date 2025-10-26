"use client";

import React from "react";

export default function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-white font-semibold disabled:opacity-60 transition"
    >
      {isSubmitting ? "Processing…" : "Submit Transaction"}
    </button>
  );
}