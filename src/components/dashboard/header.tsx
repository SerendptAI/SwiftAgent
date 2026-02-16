import { Bell, HelpCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="flex h-20 items-center justify-between gap-4 px-6 lg:h-[90px]">
      <div className="flex w-full max-w-lg items-center">
        <div className="relative w-full">
          <input
            type="search"
            placeholder="Search your dashboard"
            className="focus:ring-primary/20 h-10 w-full rounded-full bg-[#EDEDED] px-4 pr-10 text-sm outline-none focus:ring-2"
          />
          {/* the search icon should be in the center vertically */}
          <Search className="text-muted-foreground absolute -top-0.5 right-0 m-1 h-[86%] w-15 rounded-full bg-white p-2" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          className="bg-muted/50 hover:bg-muted/80 h-10 rounded-full px-4"
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">How to use?</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted/50 h-10 w-10 rounded-full"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
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
