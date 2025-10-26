"use client";

import { getBanksForCountry } from "@/components/data/banks";
import React, { useMemo, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Combobox } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";

type Props = {
  destinationCountry?: string;
};

type Bank = {
  id?: string;
  code?: string;
  name: string;
  currency?: string;
};

export default function BankSelect({ destinationCountry }: Props) {
  const { control, formState: { errors } } = useFormContext();
  const [query, setQuery] = useState("");

  const banks = useMemo<Bank[]>(() => {
    if (!destinationCountry) return [];
    return getBanksForCountry(destinationCountry);
  }, [destinationCountry]);

  const filteredBanks =
    query === ""
      ? banks
      : banks.filter((b) =>
          b.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div>
      <label className="block text-sm font-medium mb-1">Bank</label>
      <Controller
        name="bankCode"
        control={control}
        render={({ field }) => (
          <Combobox value={field.value} onChange={field.onChange}>
            <div className="relative">
              <div className="relative w-full cursor-default overflow-hidden rounded-lg border bg-white dark:bg-gray-800 text-left shadow-md focus:outline-none">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 bg-transparent text-gray-900 dark:text-gray-100 focus:ring-0"
                  displayValue={(val: string) =>
                    banks.find((b) => b.code === val || b.id === val)?.name || ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search bank..."
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronsUpDown className="h-5 w-5 text-gray-400" />
                </Combobox.Button>
              </div>
              {filteredBanks.length > 0 && (
                <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {filteredBanks.map((b) => (
                    <Combobox.Option
                      key={b.id ?? b.code}
                      value={b.code ?? b.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-indigo-600 text-white"
                            : "text-gray-900 dark:text-gray-100"
                        }`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {b.name} {b.currency ? `(${b.currency})` : ""}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-indigo-600"
                              }`}
                            >
                              <Check className="h-5 w-5" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              )}
            </div>
          </Combobox>
        )}
      />
      {errors.bankCode && (
        <p className="text-red-500 text-sm mt-1">
          {String(errors.bankCode?.message)}
        </p>
      )}
    </div>
  );
}