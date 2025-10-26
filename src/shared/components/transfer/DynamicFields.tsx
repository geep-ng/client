"use client";
import React from "react";
import { useFormContext } from "react-hook-form";
import { countryFieldRules } from "@/components/data/countryFieldRules";

interface Props {
  destinationCountry: string;
}

const DynamicFields: React.FC<Props> = ({ destinationCountry }) => {
  const { register } = useFormContext();

  return (
    <>
      {countryFieldRules[destinationCountry]?.map((f) => (
        <div key={f.name}>
          <label className="text-sm">{f.label}</label>
          <input
            {...register(f.name)}
            placeholder={f.placeholder}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      ))}
    </>
  );
};

export default DynamicFields;