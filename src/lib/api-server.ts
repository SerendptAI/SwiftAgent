import axios from "axios";
import { cookies } from "next/headers";

import { API_BASE_URL } from "./api-client";

/**
 * Server-side API client for use in Server Components/Actions.
 * It reads the auth token from cookies.
 */
export async function getServerApiClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return instance;
}
