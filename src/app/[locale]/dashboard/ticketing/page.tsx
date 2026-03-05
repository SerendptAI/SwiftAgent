import { getServerApiClient } from "@/lib/api-server";

import { TicketingClient } from "./ticketing-client";

export default async function TicketingPage() {
  const api = await getServerApiClient();
  let initialTickets = [];

  try {
    const { data } = await api.get("/api/v1/tickets");
    initialTickets = data;
  } catch (error) {
    console.error("Failed to fetch tickets on server:", error);
  }

  return <TicketingClient initialTickets={initialTickets} />;
}
