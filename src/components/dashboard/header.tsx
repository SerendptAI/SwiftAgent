"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser, useLogout } from "@/hooks/use-auth";

import { Icons } from "../icons";

export function Header() {
  const { data: user } = useCurrentUser();
  const { mutate: logout } = useLogout();
  const locale = useLocale();

  return (
    <header className="flex h-20 items-center justify-between gap-4 px-6 lg:h-[90px]">
      <div className="mt-6 flex w-[60%] items-center gap-6">
        <div className="font-dm-mono relative w-full">
          <input
            type="search"
            placeholder="SEARCH YOUR DASHBOARD"
            className="focus:ring-primary/20 h-10 w-full rounded-full bg-[#EDEDED] px-4 pr-10 text-lg outline-none focus:ring-2"
          />
          {/* the search icon should be in the center vertically */}
          <Icons.Search className="text-muted-foreground absolute -top-0.5 right-0 m-1 h-[90%] w-12 rounded-full bg-white p-2" />
        </div>
        <div className="cursor-pointer flex h-10 items-center gap-2 rounded-full bg-[#EDEDED] px-1 py-1">
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-yellow-500 p-0 shrink-0"
            >
              <span className="sr-only">User menu</span>
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt={user.name || "User avatar"}
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                />
              ) : user?.name ? (
                <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-semibold text-lg">
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                {user?.email && (
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => logout(locale)}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
