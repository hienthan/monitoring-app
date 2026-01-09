import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumbs, BreadcrumbItem, Chip, Button } from "@heroui/react";
import { Server } from "../../types/inventory";
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
  
  // Use isActive field, default to true (Active)
  const isActive = server.isActive !== undefined ? server.isActive : true;
  const statusText = isActive ? "Active" : "Inactive";
  const statusColor = isActive ? "success" : "default";

  return (
    <div className="space-y-6">
      {/* Breadcrumb section - separated */}
      <div className="pb-4 border-b border-slate-200">
        <Breadcrumbs>
          <BreadcrumbItem>
            <Link to="/dashboard/servers" className="text-slate-600 hover:text-slate-900">
              Servers
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem className="text-slate-900">{server.name}</BreadcrumbItem>
        </Breadcrumbs>
      </div>

      {/* Title and status section - separated */}
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          {/* Title and status row */}
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-900">{server.name}</h1>
            <Chip
              color={statusColor}
              variant="flat"
              size="lg"
              className="font-medium"
            >
              {statusText}
            </Chip>
          </div>
          
          {/* Last updated - separated */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Last updated: {formatDistanceToNow(lastSeenDate, { addSuffix: true })}
            </p>
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
