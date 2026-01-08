import React, { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { Alert } from "../../types/monitoring";
import { formatDistanceToNow } from "date-fns";

interface AlertsTableProps {
  alerts: Alert[];
}

const getSeverityColor = (severity: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
  switch (severity.toLowerCase()) {
    case "critical":
    case "error":
      return "danger";
    case "warning":
      return "warning";
    case "info":
      return "primary";
    default:
      return "default";
  }
};

export const AlertsTable: React.FC<AlertsTableProps> = ({ alerts }) => {
  const columns = [
    { key: "title", label: "Title" },
    { key: "severity", label: "Severity" },
    { key: "message", label: "Message" },
    { key: "timestamp", label: "Time" },
    { key: "status", label: "Status" },
  ];

  const renderCell = useCallback((alert: Alert, columnKey: React.Key) => {
    const key = String(columnKey);
    switch (key) {
      case "title":
        return <div className="font-medium">{alert.title}</div>;
      case "severity":
        return (
          <Chip
            color={getSeverityColor(alert.severity)}
            variant="flat"
            size="sm"
          >
            {alert.severity.toUpperCase()}
          </Chip>
        );
      case "message":
        return <div className="text-sm text-default-600">{alert.message}</div>;
      case "timestamp":
        try {
          const date = new Date(alert.since);
          return (
            <div className="text-xs text-default-500">
              {formatDistanceToNow(date, { addSuffix: true })}
            </div>
          );
        } catch {
          return <div className="text-xs text-default-500">-</div>;
        }
      case "status":
        return (
          <Chip
            color={alert.clearedAt ? "success" : "warning"}
            variant="flat"
            size="sm"
          >
            {alert.clearedAt ? "Cleared" : "Active"}
          </Chip>
        );
      default:
        return <div>-</div>;
    }
  }, []);

  return (
    <Table aria-label="Alerts table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key}>{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={alerts}
        emptyContent="No alerts found"
      >
        {(alert) => (
          <TableRow key={alert.id}>
            {(columnKey) => <TableCell>{renderCell(alert, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
