import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem, Chip, Button } from "@heroui/react";
import { Server } from "../../types/inventory";
import { getStatusColor, formatStatus } from "../../types/servers";
import { formatDistanceToNow } from "date-fns";

interface ServerHeaderProps {
  server: Server;
  onRefresh: () => void;
  onEdit: () => void;
}

export const ServerHeader: React.FC<ServerHeaderProps> = ({
  server,
  onRefresh,
  onEdit,
}) => {
  const lastSeenDate = new Date(server.lastSeen);

  return (
    <div className="space-y-4">
      <Breadcrumbs>
        <BreadcrumbItem>
          <Link to="/dashboard/servers">Servers</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>{server.name}</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{server.name}</h1>
            <Chip
              color={getStatusColor(server.status)}
              variant="flat"
              size="lg"
            >
              {formatStatus(server.status)}
            </Chip>
          </div>
          <div className="text-sm text-default-500">
            Last updated: {formatDistanceToNow(lastSeenDate, { addSuffix: true })}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="flat" onPress={onRefresh}>
            Refresh
          </Button>
          <Button variant="flat" color="primary" onPress={onEdit}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
};
