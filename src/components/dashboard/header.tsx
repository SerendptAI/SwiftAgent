import { Bell, HelpCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-28 items-center justify-between gap-4 px-6 lg:h-[120px]">
      <div className="mt-6 flex w-[60%] items-center gap-6">
        <div className="relative w-full">
          <input
            type="search"
            placeholder="Search your dashboard"
            className="focus:ring-primary/20 h-14 w-full rounded-full bg-[#EDEDED] px-4 pr-10 text-lg outline-none focus:ring-2"
          />
          {/* the search icon should be in the center vertically */}
          <Search className="text-muted-foreground absolute -top-0.5 right-0 m-1 h-[90%] w-20 rounded-full bg-white p-2" />
        </div>
        <div className="hover:bg-muted/80 flex h-14 items-center gap-2 rounded-full bg-[#EDEDED] px-1 py-1">
          <HelpCircle className="mr-2 h-12 w-12 rounded-full bg-white p-2" />
          <span className="pr-2 text-lg font-medium whitespace-nowrap">
            How to use?
          </span>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <div className="hover:bg-muted/50 flex h-14 w-14 items-center justify-center rounded-md bg-[#EDEDED]">
          <Bell className="h-12 w-12 p-2" />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-purple-500 to-yellow-500 p-0"
        >
          <span className="sr-only">User menu</span>
          {/* Placeholder for user avatar pattern */}
          <div className="grid h-full w-full grid-cols-2">
            <div className="bg-yellow-400" />
            <div className="bg-purple-600" />
            <div className="bg-purple-600" />
            <div className="bg-yellow-400" />
          </div>
        </Button>
      </div>
    </header>
  );
}
