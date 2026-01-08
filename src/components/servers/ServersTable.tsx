import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@heroui/react";
import { ServerRow } from "../../types/servers";
import { formatDistanceToNow } from "date-fns";

// Icons
const EyeIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

const DeleteIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

const EditIcon = (props: any) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

interface ServersTableProps {
  rows: ServerRow[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export const ServersTable: React.FC<ServersTableProps> = ({
  rows,
  isLoading = false,
  onRefresh,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter rows by search query (name or ip)
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(query) ||
        row.ip?.toLowerCase().includes(query) ||
        row.hostname?.toLowerCase().includes(query)
    );
  }, [rows, searchQuery]);

  // Format environment display
  const getEnvironmentDisplay = (row: ServerRow) => {
    const env = row.environment || (row.env ? row.env.charAt(0).toUpperCase() + row.env.slice(1) : null);
    if (!env) return "—";
    
    const envMap: Record<string, string> = {
      prod: "Prd",
      staging: "Staging",
      dev: "Dev",
      lab: "Lab",
    };
    return envMap[row.env] || env;
  };

  // Format docker mode display
  const getDockerModeDisplay = (row: ServerRow) => {
    if (!row.dockerModes || row.dockerModes.length === 0) {
      return "—";
    }
    // Return comma-separated values: "cli", "desktop", or "cli, desktop"
    return row.dockerModes.join(", ");
  };

  // Format updated time
  const getUpdatedDisplay = (row: ServerRow) => {
    if (row.updatedAt || row.lastSeen) {
      try {
        const date = new Date(row.updatedAt || row.lastSeen);
        return formatDistanceToNow(date, { addSuffix: true });
      } catch {
        return "—";
      }
    }
    return "—";
  };

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">SERVER</th>
              <th className="px-3 py-2 text-center">ENVIRONMENT</th>
              <th className="px-3 py-2 text-center">OS</th>
              <th className="px-3 py-2 text-center">DOCKER MODE</th>
              <th className="px-3 py-2 text-center">UPDATED</th>
              <th className="px-3 py-2 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search box */}
      <Input
        placeholder="Search by name or IP…"
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="w-[380px]"
        startContent={
          <svg
            className="w-4 h-4 text-default-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
      />

      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">SERVER</th>
              <th className="px-3 py-2 text-center">ENVIRONMENT</th>
              <th className="px-3 py-2 text-center">OS</th>
              <th className="px-3 py-2 text-center">DOCKER MODE</th>
              <th className="px-3 py-2 text-center">UPDATED</th>
              <th className="px-3 py-2 text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-default-500">
                  {searchQuery ? "No servers found matching your search" : "No servers found"}
                  {onRefresh && (
                    <button
                      onClick={onRefresh}
                      className="mt-4 ml-4 px-4 py-2 text-sm bg-default-100 hover:bg-default-200 rounded-lg transition-colors"
                    >
                      Refresh
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 cursor-pointer"
                  onClick={() => navigate(`/dashboard/servers/${row.id}`)}
                >
                  <td className="px-3 py-2">
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold">{row.name}</p>
                      {row.ip && (
                        <p className="text-xs text-slate-500">{row.ip}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {getEnvironmentDisplay(row) === "—" ? (
                      <span className="text-slate-400">—</span>
                    ) : (
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          row.env === "prod"
                            ? "bg-green-100 text-green-800"
                            : row.env === "staging"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {getEnvironmentDisplay(row)}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={!row.os ? "text-slate-400" : ""}>
                      {row.os || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className={getDockerModeDisplay(row) === "—" ? "text-slate-400" : ""}>
                      {getDockerModeDisplay(row)}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-slate-600">{getUpdatedDisplay(row)}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className="text-lg text-slate-400 hover:text-slate-600 cursor-pointer active:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/servers/${row.id}`);
                        }}
                        title="Details"
                      >
                        <EyeIcon />
                      </span>
                      <span
                        className="text-lg text-slate-400 hover:text-slate-600 cursor-pointer active:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Edit server:", row.id);
                        }}
                        title="Edit server"
                      >
                        <EditIcon />
                      </span>
                      <span
                        className="text-lg text-red-500 hover:text-red-700 cursor-pointer active:opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Delete server:", row.id);
                        }}
                        title="Delete server"
                      >
                        <DeleteIcon />
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
