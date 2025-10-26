"use client";

import { ReactNode } from "react";
// import Link from "next/link";
import Navigation from "@/shared/components/Navigation";
import useUser from "@/hooks/useUser";

export default function UserLayout({ children }: { children: ReactNode }) {

    const { user } = useUser();
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navigation user={user} />

      

      {/* Page content */}
      <div className="flex-1">{children}</div>
    </div>
  );
}