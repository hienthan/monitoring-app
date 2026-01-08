import React, { useState, useMemo } from "react";
import { ServerApp, ServerPort } from "../../types/serverDetail";

interface AppsTableProps {
  apps: ServerApp[];
  ports: ServerPort[];
  isLoading?: boolean;
}

export const AppsTable: React.FC<AppsTableProps> = ({
  apps,
  ports,
  isLoading = false,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Group ports by app_link
  const portsByAppId = useMemo(() => {
    const grouped: Record<string, ServerPort[]> = {};
    ports.forEach((port) => {
      const appId = port.app_link || "__unassigned__";
      if (!grouped[appId]) {
        grouped[appId] = [];
      }
      grouped[appId].push(port);
    });
    return grouped;
  }, [ports]);

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2 w-8"></th>
              <th className="px-3 py-2">APP NAME</th>
              <th className="px-3 py-2">OWNER</th>
              <th className="px-3 py-2">RUNTIME</th>
              <th className="px-3 py-2">NOTES</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2">
                  <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2">
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
    <div className="overflow-hidden rounded border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="px-3 py-2 w-8"></th>
            <th className="px-3 py-2">APP NAME</th>
            <th className="px-3 py-2">OWNER</th>
            <th className="px-3 py-2">RUNTIME</th>
            <th className="px-3 py-2">NOTES</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {apps.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                No apps found
              </td>
            </tr>
          ) : (
            apps.map((app) => {
              const appPorts = portsByAppId[app.id] || [];
              const hasPorts = appPorts.length > 0;
              const isExpanded = expandedId === app.id;

              return (
                <React.Fragment key={app.id}>
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2">
                      {hasPorts ? (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : app.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm font-medium">
                        {app.app?.name || app.appId || "Unknown"}
                      </p>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm">{app.app?.owner || "-"}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm">{app.runtime || "-"}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="text-sm text-slate-600 max-w-[200px] truncate block">
                        {app.notes || "-"}
                      </span>
                    </td>
                  </tr>
                  {isExpanded && hasPorts && (
                    <tr>
                      <td colSpan={5} className="px-3 py-4 bg-slate-50 border-t border-slate-200">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Ports</h4>
                          <div className="space-y-1">
                            {appPorts
                              .sort((a, b) => a.port - b.port)
                              .map((port) => (
                                <div
                                  key={String(port.id)}
                                  className="text-xs flex items-center justify-between py-1 px-2 bg-white rounded border border-slate-200"
                                >
                                  <span>
                                    {port.protocol.toUpperCase()} {port.port}
                                  </span>
                                  {port.notes && (
                                    <span className="text-slate-500">{port.notes}</span>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
