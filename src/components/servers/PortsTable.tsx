import React from "react";
import { ServerPort } from "../../types/serverDetail";

interface PortsTableProps {
  ports: ServerPort[];
  isLoading?: boolean;
}

export const PortsTable: React.FC<PortsTableProps> = ({
  ports,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">PORT</th>
              <th className="px-3 py-2 text-center">APP</th>
              <th className="px-3 py-2 text-center">NOTES</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="px-3 py-2">PORT</th>
            <th className="px-3 py-2 text-center">APP</th>
            <th className="px-3 py-2 text-center">NOTES</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {ports.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-3 py-8 text-center text-slate-500">
                No ports found
              </td>
            </tr>
          ) : (
            ports.map((port) => (
              <tr key={port.id} className="hover:bg-slate-50">
                <td className="px-3 py-2">
                  <p className="text-sm font-medium">
                    {port.protocol.toUpperCase()} {port.port}
                  </p>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="text-sm">
                    {port.app?.app?.name || "-"}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="text-sm text-slate-600 max-w-[200px] truncate block mx-auto">
                    {port.notes || "-"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
