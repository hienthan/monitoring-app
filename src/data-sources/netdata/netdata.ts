import { http } from "../../lib/http";

const baseUrl =
  import.meta.env.VITE_NETDATA_URL || "http://localhost:19999/api/v1";

export const netdataClient = {
  get: async <T>(path: string, init?: RequestInit): Promise<T> => {
    return http.getJSON<T>(`${baseUrl}${path}`, init);
  },
};
