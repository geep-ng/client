"use client";

import { COUNTRIES } from "@/components/data/COUNTRIES";
import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
// import { COUNTRIES } from "../data";
// import { COUNTRIES } from "../../data"; // adjust path if needed

export default function CountrySelect() {
  const { control, setValue, watch, formState: { errors } } = useFormContext();
  const sourceCountry = watch("sourceCountry");

  useEffect(() => {
    // set a sensible default for sourceCountry if missing
    if (!sourceCountry && COUNTRIES.length) {
      setValue("sourceCountry", COUNTRIES[0].value);
    }
  }, [sourceCountry, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Source Country */}
      <div>
        <label className="block text-sm font-medium mb-1">Source Country</label>
        <Controller
          control={control}
          name="sourceCountry"
          render={({ field }) => (
            <select
              {...field}
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.sourceCountry && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <p className="text-red-500 text-sm mt-1">{String((errors as any).sourceCountry?.message)}</p>
        )}
      </div>

      {/* Destination Country */}
      <div>
        <label className="block text-sm font-medium mb-1">Destination Country</label>
        <Controller
          control={control}
          name="destinationCountry"
          render={({ field }) => (
            <select
              {...field}
              className="w-full p-2 border rounded-lg bg-white dark:bg-gray-800"
            >
              <option value="">Select a country</option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          )}
        />
        {errors.destinationCountry && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <p className="text-red-500 text-sm mt-1">{String((errors as any).destinationCountry?.message)}</p>
        )}
      </div>
    </div>
  );
}