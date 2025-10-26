"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import axiosInstance from "@/utils/axiosInstance";
import { COUNTRIES } from "@/components/data/COUNTRIES";
import { motion, AnimatePresence } from "framer-motion";

export default function AmountInput() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext();

  // Watch form fields
  const sourceCountry = useWatch({ control, name: "sourceCountry" });
  const destinationCountry = useWatch({ control, name: "destinationCountry" });
  const selectedCurrency = useWatch({ control, name: "currency" });
  const amount = useWatch({ control, name: "amount" });

  const sourceCurrency = COUNTRIES.find((cn) => cn.value === sourceCountry)?.currency;
  const destinationCurrency = COUNTRIES.find((cn) => cn.value === destinationCountry)?.currency;

  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      if (!sourceCurrency || !destinationCurrency) return;
      if (sourceCurrency === destinationCurrency) {
        setRate(1);
        return;
      }
      setLoadingRate(true);
      try {
        const res = await axiosInstance.get("/transaction/exchange-rate", {
          params: {
            from: sourceCurrency,
            to: destinationCurrency,
          },
        });
        setRate(res.data?.rate || null);
      } catch (err) {
        console.error("Failed to fetch exchange rate", err);
        setRate(null);
      } finally {
        setLoadingRate(false);
      }
    };

    fetchRate();
  }, [sourceCurrency, destinationCurrency]);

  let conversionMessage: string | null = null;
  if (amount && rate && sourceCurrency && destinationCurrency && selectedCurrency) {
    if (selectedCurrency === sourceCurrency) {
      // Source entered → calculate destination
      conversionMessage = `${amount} ${sourceCurrency} = ${(amount * rate).toFixed(2)} ${destinationCurrency}`;
    } else if (selectedCurrency === destinationCurrency) {
      // Destination entered → calculate source
      conversionMessage = `${(amount / rate).toFixed(2)} ${sourceCurrency} = ${amount} ${destinationCurrency}`;
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Amount</label>
      <input
        {...register("amount", { valueAsNumber: true })}
        type="number"
        inputMode="decimal"
        step="any"
        placeholder="0.00"
        className="w-full p-2 border rounded-lg no-spinner bg-white dark:bg-gray-800"
        min={0}
      />
      {errors.amount && (
        <p className="text-red-500 text-sm mt-1">{String(errors.amount?.message)}</p>
      )}

      {/* Exchange rate info */}
      {sourceCurrency && destinationCurrency && conversionMessage === null && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {loadingRate ? (
            <span>Fetching exchange rate...</span>
          ) : rate ? (
            <span>
              1 {sourceCurrency} = <strong>{rate}</strong> {destinationCurrency}
            </span>
          ) : (
            <span className="text-red-500">Exchange rate not available</span>
          )}
        </div>
      )}

      {/* Conversion Message with animation */}
      <AnimatePresence mode="wait">
        {conversionMessage && (
          <motion.div
            key={conversionMessage} // triggers animation on change
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400"
          >
            {conversionMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline CSS to remove spinner */}
      <style>{`
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
}