"use client";

import Image from "next/image";

import { useCurrentUser } from "@/hooks/use-auth";

import { Icons } from "../icons";
import { DashboardSearch } from "./dashboard-search";

export function Header() {
  const { data: user } = useCurrentUser();

  // Temporary fallback for testing API endpoints
  const testCompanyId =
    user?.company_id || "123e4567-e89b-12d3-a456-426614174000";
  console.log("TESTING company_id:", testCompanyId);

  return (
    <header className="flex h-20 items-center justify-between gap-4 px-6 lg:h-[90px]">
      <div className="mt-6 flex w-[60%] items-center gap-6">
        <DashboardSearch />
        <div className="flex h-10 cursor-pointer items-center gap-2 rounded-full bg-[#EDEDED] px-1 py-1">
          <Icons.Questiondark className="mr-2 h-8 w-8 rounded-full bg-white p-2" />
          <span className="font-stolzl pr-2 text-lg font-medium whitespace-nowrap">
            How to use?
          </span>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <div className="hover:bg-muted/50 flex h-12 w-12 items-center justify-center rounded-md bg-[#EDEDED]">
          <Icons.bell className="h-10 w-10 p-2" />
        </div>

        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-yellow-500">
          {user?.picture ? (
            <Image
              src={user.picture}
              alt={user.name || "User avatar"}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : user?.name ? (
            <div className="bg-primary text-primary-foreground flex h-full w-full items-center justify-center text-lg font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="grid h-full w-full grid-cols-2">
              <div className="bg-yellow-400" />
              <div className="bg-purple-600" />
              <div className="bg-purple-600" />
              <div className="bg-yellow-400" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
