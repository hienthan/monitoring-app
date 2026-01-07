import React, { useEffect, useState } from "react";
import { monitoringRepo } from "../../repositories/monitoringRepo";
import { Alert } from "../../types/monitoring";

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    monitoringRepo.getAlerts().then(setAlerts).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Alerts</h1>
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Server</th>
              <th className="px-3 py-2">Since</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {alerts.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="px-3 py-2">{a.title}</td>
                <td className="px-3 py-2 uppercase">{a.severity}</td>
                <td className="px-3 py-2">{a.serverId}</td>
                <td className="px-3 py-2">{new Date(a.since).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
