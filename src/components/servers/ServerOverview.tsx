import React from "react";
import { Server } from "../../types/inventory";

interface ServerOverviewProps {
  server: Server;
}

export const ServerOverview: React.FC<ServerOverviewProps> = ({ server }) => {
  const details = [
    { label: "Hostname", value: server.hostname },
    { label: "IP Address", value: server.ip },
    { label: "Environment", value: server.env.toUpperCase() },
    { label: "Owner", value: server.owner },
    { label: "Last Seen", value: new Date(server.lastSeen).toLocaleString() },
    { label: "Tags", value: server.tags.join(", ") || "None" },
    { label: "Netdata URL", value: server.netdataUrl || "Not configured" },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold px-1">Server Information</h3>
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <tbody className="divide-y">
            {details.map((detail) => (
              <tr key={detail.label} className="hover:bg-slate-50">
                <td className="px-3 py-2 font-medium text-slate-700 w-1/3">
                  {detail.label}
                </td>
                <td className="px-3 py-2 text-center text-slate-900">
                  {detail.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
