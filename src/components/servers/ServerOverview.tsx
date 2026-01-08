import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
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
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Server Information</h3>
      </CardHeader>
      <CardBody>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {details.map((detail) => (
            <div key={detail.label} className="space-y-1">
              <dt className="text-sm font-medium text-default-600">{detail.label}</dt>
              <dd className="text-sm text-default-900">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
};
