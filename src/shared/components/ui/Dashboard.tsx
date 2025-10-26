/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { schema } from "@/utils/schema";
import { BANKS, COUNTRIES, countryFieldRules } from "../data";

/**
 * TransferForm (refactored)
 * - dynamic account fields per destination country
 * - debounced validation calling /api/validate/:country
 * - auto-fill receiverName when validate API returns name
 * - currency selector allows choosing between source or destination currency
 * - removes number input spinners with .no-spinner CSS
 */

const TransferForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isValid },
  } = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      sourceCountry: "NG",
      destinationCountry: "",
      amount: 0,
      currency: "",
      bankName: "",
      receiverName: "",
      narration: "",
    },
  });

  // watches
  const sourceCountry = useWatch({ control, name: "sourceCountry" });
  const destinationCountry = useWatch({ control, name: "destinationCountry" });
  const bankName = useWatch({ control, name: "bankName" });

  // dynamic account field names for the selected destination
  const dynamicFields = destinationCountry ? countryFieldRules[destinationCountry] || [] : [];

  // debounce timer ref
  const debounceRef = useRef<number | null>(null);

  // set source currency automatically when sourceCountry changes
  useEffect(() => {
    const s = COUNTRIES.find((c) => c.value === sourceCountry);
    if (s) setValue("sourceCurrency", s.currency);
  }, [sourceCountry, setValue]);

  // helper: build validation payload depending on country rules
  const buildValidationPayload = (country: string): any => {
    const payload: any = {
      bank: bankName,
    };

    const rules = countryFieldRules[country] || [];
    rules.forEach((r) => {
      // read value from form inputs by name using document.getElementById or watch
      // prefer watch via useWatch? we currently haven't called useWatch for each dynamic field - fallback to DOM
      const el = document.getElementById(r.name) as HTMLInputElement | null;
      payload[r.name] = el ? el.value.trim() : "";
    });

    return payload;
  };

  // function: call validate API for selected country
  const callValidateApi = async (country: string) => {
    if (!country) return { valid: false };
    const payload = buildValidationPayload(country);

    // basic client-side length checks before calling API
    const rules = countryFieldRules[country] || [];
    for (const r of rules) {
      if (r.length && (!payload[r.name] || payload[r.name].length !== r.length)) {
        // set error for that field and skip API call
        setError(r.name, {
          type: "manual",
          message: `${r.label} must be ${r.length} digits`,
        });
        return { valid: false };
      } else {
        clearErrors(r.name);
      }
    }

    try {
      const res = await fetch(`/api/validate/${country.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Validation API error");
      }
      const data = await res.json();
      return data;
    } catch (err: any) {
      // network/other error
      toast.error("Validation error: " + (err?.message || "Unknown error"));
      return { valid: false };
    }
  };

  // watch dynamic fields + bankName and debounce validation
  useEffect(() => {
    // clear possible errors when destinationCountry changes
    dynamicFields.forEach((f) => clearErrors(f.name));

    // if destinationCountry or bankName not set, skip
    if (!destinationCountry || !bankName) return;

    // debounce validation: cancel previous
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      // call validation API
      const result = await callValidateApi(destinationCountry);

      // handle result: expected shape { valid: boolean, name?: string, errors?: { field: message } }
      if (result?.valid) {
        // clear dynamic field errors
        dynamicFields.forEach((f) => clearErrors(f.name));
        // autofill receiverName if returned
        if (result.name) {
          setValue("receiverName", result.name, { shouldValidate: true, shouldDirty: true });
          toast.success("Account validated — receiver name filled");
        } else {
          toast.success("Account validated");
        }
      } else {
        // map errors or generic message
        if (result?.errors) {
          Object.entries(result.errors).forEach(([field, msg]) => {
            setError(field, { type: "manual", message: String(msg) });
          });
        } else {
          // generic failure: mark first dynamic field as invalid
          if (dynamicFields[0]) {
            setError(dynamicFields[0].name, {
              type: "manual",
              message: `Unable to validate ${dynamicFields[0].label}`,
            });
          }
          // clear receiver name if validation fails
          setValue("receiverName", "");
          toast.error("Account validation failed");
        }
      }
    }, 700); // 700ms debounce

    // cleanup
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationCountry, bankName, /* dynamic field DOM values may change without re-render so we rely on DOM reads in buildValidationPayload */]);

  // Submit handler: run final server-side validation before sending transaction
  const onSubmit = async (data: any) => {
    // final validation call
    const validation = await callValidateApi(data.destinationCountry);
    if (!validation?.valid) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    // send transaction to server (example)
    try {
      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Transaction API failed");
      toast.success("Transaction submitted");
    } catch (err: any) {
      toast.error("Submit failed: " + (err?.message || "Unknown"));
    }
  };

  return (
    <>
      {/* local CSS to remove number input spinners */}
      <style>{`
        /* remove stepper arrows for number inputs */
        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>

      <div className="max-w-2xl mx-auto p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6"
        >
          {/* Countries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm block mb-1">Source Country</label>
              <Controller
                name="sourceCountry"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded-lg">
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Destination Country</label>
              <Controller
                name="destinationCountry"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded-lg">
                    <option value="">Select</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          {/* Currency: allow choosing source or destination currency */}
          <div>
            <label className="text-sm block mb-1">Currency</label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => {
                const src = COUNTRIES.find((c) => c.value === sourceCountry);
                const dest = COUNTRIES.find((c) => c.value === destinationCountry);
                return (
                  <select {...field} className="w-full p-2 border rounded-lg">
                    <option value="">Choose currency</option>
                    {src && <option value={src.currency}>Source — {src.currency}</option>}
                    {dest && <option value={dest.currency}>Destination — {dest.currency}</option>}
                  </select>
                );
              }}
            />
            {errors.currency && <p className="text-red-500 text-sm mt-1">{String(errors.currency.message)}</p>}
          </div>

          {/* Amount (no spinner) */}
          <div>
            <label className="text-sm block mb-1">Amount</label>
            <input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              inputMode="decimal"
              step="any"
              placeholder="0.00"
              className="w-full p-2 border rounded-lg no-spinner"
            />
            {errors.amount && <p className="text-red-500 text-sm mt-1">{String(errors.amount.message)}</p>}
          </div>

          {/* Bank selector */}
          {destinationCountry && (
            <div>
              <label className="text-sm block mb-1">Bank</label>
              <Controller
                name="bankName"
                control={control}
                render={({ field }) => (
                  <select {...field} className="w-full p-2 border rounded-lg">
                    <option value="">Select a bank</option>
                    {BANKS[destinationCountry]?.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.bankName && <p className="text-red-500 text-sm mt-1">{String(errors.bankName.message)}</p>}
            </div>
          )}

          {/* Dynamic account fields */}
          {destinationCountry &&
            (countryFieldRules[destinationCountry] || []).map((f) => (
              <div key={f.name}>
                <label className="text-sm block mb-1">{f.label}</label>
                <input
                  id={f.name}
                  {...register(f.name)}
                  type="text"
                  inputMode="numeric"
                  placeholder={f.label}
                  className="w-full p-2 border rounded-lg"
                />
                {errors[f.name] && <p className="text-red-500 text-sm mt-1">{String((errors as any)[f.name]?.message)}</p>}
              </div>
            ))}

          {/* Receiver name (auto-filled when validation returns a name) */}
          <div>
            <label className="text-sm block mb-1">Receiver Name</label>
            <input
              {...register("receiverName")}
              type="text"
              className="w-full p-2 border rounded-lg"
              placeholder="Receiver full name"
            />
            {errors.receiverName && <p className="text-red-500 text-sm mt-1">{String(errors.receiverName.message)}</p>}
          </div>

          {/* Narration */}
          <div>
            <label className="text-sm block mb-1">Narration</label>
            <input {...register("narration")} className="w-full p-2 border rounded-lg" placeholder="Purpose" />
            {errors.narration && <p className="text-red-500 text-sm mt-1">{String(errors.narration.message)}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default TransferForm;
