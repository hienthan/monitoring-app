import PocketBase from "pocketbase";

// Base client init. Swap baseUrl via env as needed.
export const pb = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL || "http://gmo021.cansportsvg.com:8090"
);
