// components/transfer/CurrencySelect.tsx
"use client";

import { COUNTRIES } from "@/components/data/COUNTRIES";
import React from "react";
import { useFormContext, Controller } from "react-hook-form";
// import { COUNTRIES } from "../../data";

type Props = { destinationCountry?: string };

export default function CurrencySelect({ destinationCountry }: Props) {
  const { control, watch, formState: { errors } } = useFormContext();
  const sourceCountry = watch("sourceCountry");

  const src = COUNTRIES.find((c) => c.value === sourceCountry);
  const dest = COUNTRIES.find((c) => c.value === destinationCountry);

  // Build unique currency options (avoid duplicates)
  const options: { value: string; label: string }[] = [];
  if (src) options.push({ value: src.currency, label: `Source — ${src.currency}` });
  if (dest && dest.currency !== src?.currency) {
    options.push({ value: dest.currency, label: `Destination — ${dest.currency}` });
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Currency</label>
      <Controller
        name="currency"
        control={control}
        render={({ field }) => (
          <select {...field} className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800">
            <option value="">Select currency</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      />
      {errors.currency && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <p className="text-red-500 text-sm mt-1">{String((errors as any).currency?.message)}</p>
      )}
    </div>
  );
}
