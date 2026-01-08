import { Server, ServerStatus } from './inventory';

/**
 * Extended Server type for table display with metrics
 */
export type ServerRow = Server & {
  cpu?: number;   // CPU usage percentage
  ram?: number;   // RAM usage percentage
  disk?: number;  // Disk usage percentage
  network?: number; // Network usage (optional)
  updatedAt?: string; // Last updated timestamp
  region?: string; // Region/location
  notes?: string; // Notes field from API
  dockerModes?: string[]; // Docker modes (e.g., ["Docker Engine", "Docker Desktop"])
  environment?: string; // Environment display name (e.g., "Prod", "Staging", "Dev")
  os?: string; // Operating system (e.g., "Ubuntu 22.04", "Debian 12")
};

/**
 * Status mapping for HeroUI Chip colors
 */
export const getStatusColor = (status: ServerStatus): "success" | "warning" | "danger" => {
  switch (status) {
    case "up":
      return "success";
    case "degraded":
      return "warning";
    case "down":
      return "danger";
    default:
      return "danger";
  }
};

/**
 * Format status text for display
 */
export const formatStatus = (status: ServerStatus): string => {
  switch (status) {
    case "up":
      return "Online";
    case "degraded":
      return "Degraded";
    case "down":
      return "Down";
    default:
      return status;
  }
};
