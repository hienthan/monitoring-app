import React from "react";
import { DatacenterCardVM } from "../../types/viewmodels";

export const DatacenterCard: React.FC<{ card: DatacenterCardVM }> = ({ card }) => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm uppercase text-slate-500">{card.server.env}</div>
          <div className="text-lg font-semibold">{card.server.name}</div>
          <div className="text-xs text-slate-500">{card.server.ip}</div>
        </div>
        <div
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            card.server.status === "up"
              ? "bg-emerald-100 text-emerald-700"
              : card.server.status === "degraded"
              ? "bg-amber-100 text-amber-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {card.server.status.toUpperCase()}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded bg-slate-50 px-2 py-1">
          <div className="text-xs text-slate-500">CPU</div>
          <div className="font-semibold">{card.cpuUsage}%</div>
        </div>
        <div className="rounded bg-slate-50 px-2 py-1">
          <div className="text-xs text-slate-500">RAM</div>
          <div className="font-semibold">{card.ramUsage}%</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="text-xs text-slate-500">Open alerts</div>
        <div className="font-semibold">{card.alertsOpen}</div>
      </div>
    </div>
  );
};
