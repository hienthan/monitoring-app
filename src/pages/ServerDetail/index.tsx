import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dashboardRepo } from "../../repositories/dashboardRepo";
import { ServerDetailVM } from "../../types/viewmodels";

export const ServerDetailPage: React.FC = () => {
  const { id = "" } = useParams();
  const [detail, setDetail] = useState<ServerDetailVM | null>(null);

  useEffect(() => {
    if (!id) return;
    dashboardRepo.getServerDetail(id).then(setDetail).catch(console.error);
  }, [id]);

  if (!id) return <p>Missing server id</p>;
  if (!detail) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{detail.server.name}</h1>
      <div className="text-sm text-slate-600">
        {detail.server.ip} · {detail.server.env.toUpperCase()}
      </div>
      <section className="space-y-2">
        <h2 className="font-semibold">Ports</h2>
        <ul className="divide-y rounded border bg-white">
          {detail.ports.map((p) => (
            <li key={p.id} className="px-3 py-2 flex justify-between">
              <span>
                {p.protocol.toUpperCase()} {p.port} — {p.process}
              </span>
              <span className="text-xs text-slate-500">{p.owner}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="space-y-2">
        <h2 className="font-semibold">Alerts</h2>
        <ul className="divide-y rounded border bg-white">
          {detail.alerts.map((a) => (
            <li key={a.id} className="px-3 py-2">
              <div className="text-sm font-semibold">{a.title}</div>
              <div className="text-xs text-slate-500">{a.severity.toUpperCase()}</div>
              <div className="text-xs text-slate-600">{a.message}</div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
