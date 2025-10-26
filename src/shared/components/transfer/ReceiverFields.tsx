import React from "react";
import { useFormContext } from "react-hook-form";
import { COUNTRIES } from "@/components/data/COUNTRIES";

const ReceiverFields: React.FC<{ destinationCountry: string }> = ({
  destinationCountry,
}) => {
  const { register } = useFormContext();
  const country = COUNTRIES.find((c) => c.value === destinationCountry);

  return (
    <>
      <div>
        <label className="text-sm">Receiver Name</label>
        <input {...register("receiverName")} className="w-full p-2 border rounded-lg" />
      </div>

      <div>
        <label className="text-sm">Receiver Email (optional)</label>
        <input type="email" {...register("receiverEmail")} className="w-full p-2 border rounded-lg" />
      </div>

      <div>
        <label className="text-sm">Receiver Phone (optional)</label>
        <div className="flex">
          <span className="px-3 py-2 border rounded-l-lg bg-gray-100 dark:bg-gray-800">
            {country?.phoneCode}
          </span>
          <input
            type="tel"
            {...register("receiverPhone")}
            className="w-full p-2 border rounded-r-lg"
            placeholder="8123456789"
          />
        </div>
      </div>
    </>
  );
};

export default ReceiverFields;