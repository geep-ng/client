"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TransactionsTable({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "reference",
      header: "ID",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => (
        <Link href={`/app/transactions/${info.getValue()}`} className="text-blue-600 underline">
          {info.getValue().slice(0, 8)}...
        </Link>
      ),
    },
    // { accessorKey: "sender", header: "Sender" },
    { accessorKey: "receiverName", header: "Receiver" },
    { accessorKey: "amountReceived", header: "Amount" },
    { accessorKey: "receivingCurrency", header: "Currency" },
    {
        accessorKey: "destinationCountry",
        header: "Country",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cell: (info: any) => {
            const raw = info.getValue();
            if (!raw) return "";
            const code = String(raw);
            // If it's likely an ISO country code (2-3 chars) try to look up the full name,
            // otherwise return the value as-is.
            if (code.length <= 3) {
                try {
                    // use the user's locale when available
                    const locale = typeof navigator !== "undefined" && navigator.language ? [navigator.language] : ["en"];
                    const regionNames = new Intl.DisplayNames(locale, { type: "region" });
                    return regionNames.of(code.toUpperCase()) ?? code;
                } catch {
                    return code;
                }
            }
            return code;
        },
        },
        {
          accessorKey: "createdAt",
          header: "Date",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cell: (info: any) => {
        const raw = info.getValue();
        if (!raw) return "";
        const date = new Date(raw);
        if (isNaN(date.getTime())) return String(raw);

        const locale =
          typeof navigator !== "undefined" && navigator.language ? navigator.language : "en";

        // e.g. "18 Sep"
        const dayMonth = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(
          date
        );

        // e.g. "2PM" (remove space so it matches "2PM" instead of "2 PM")
        let time = new Intl.DateTimeFormat(locale, { hour: "numeric", hour12: true }).format(date);
        time = time.replace(/\s+/g, "");

        const now = new Date();
        const includeYear = date.getFullYear() !== now.getFullYear();
        const yearPart = includeYear ? ` ${date.getFullYear()}` : "";

        return `${dayMonth}${yearPart}, ${time}`;
          },
        },
        {
          accessorKey: "status",
          header: "Status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: (info: any) => (
        <Badge
          variant={
            info.getValue() === "Completed"
              ? "default"
              : info.getValue() === "Pending"
              ? "secondary"
              : "destructive"
          }
        >
          {info.getValue()}
        </Badge>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) return <p>Loading transactions...</p>;

  return (
    <div className="rounded-lg border">
      <table className="min-w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b dark:hover:bg-gray-500 hover:bg-gray-100">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}