// Utilities to build Netdata URLs/params. Adjust per your Netdata version.

export const netdataEndpoints = {
  chart: (node: string, chart: string, after: number, before: number) =>
    `/data?chart=${encodeURIComponent(chart)}&after=${after}&before=${before}&options=seconds&format=json&context=${encodeURIComponent(
      node
    )}`,
  alerts: () => `/alarms`,
};
