"use client";

// import { useState } from "react";

// import { DashboardSearchToolbar } from "@/components/dashboard/dashboard-search-toolbar";
import { ComingSoon } from "@/components/dashboard/coming-soon";
// import { KnowledgeChatPreview } from "@/components/dashboard/knowledge/knowledge-chat-preview";
// import { KnowledgeEntryList } from "@/components/dashboard/knowledge/knowledge-entry-list";

export function KnowledgeBaseClient() {
  // const [searchQuery, setSearchQuery] = useState("");

  // return (
  //   <div className="flex min-h-full w-full flex-col gap-4 lg:h-full lg:min-h-0 lg:gap-8">
  //     <DashboardSearchToolbar
  //       searchQuery={searchQuery}
  //       onSearchQueryChange={setSearchQuery}
  //       searchPlaceholder="Search knowledge base entries"
  //     />

  //     <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:h-170 lg:flex-none lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-8">
  //       <KnowledgeEntryList searchQuery={searchQuery} />
  //       <KnowledgeChatPreview />
  //     </div>
  //   </div>
  // );

  return (
    <ComingSoon
      description="We're building dedicated tools to manage your knowledge sources. Check back soon."
      illustration="/images/pixellife.svg"
    />
  );
}
