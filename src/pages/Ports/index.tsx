import React, { useEffect, useState } from "react";
import { inventoryRepo } from "../../repositories/inventoryRepo";
import { PortOccupancy } from "../../types/inventory";

export const PortsPage: React.FC = () => {
  const [ports, setPorts] = useState<PortOccupancy[]>([]);

  useEffect(() => {
    inventoryRepo.getAllPorts().then(setPorts).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Ports</h1>
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">Port</th>
              <th className="px-3 py-2">Protocol</th>
              <th className="px-3 py-2">Process/Container</th>
              <th className="px-3 py-2">Owner</th>
              <th className="px-3 py-2">Server</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ports.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-3 py-2">{p.port}</td>
                <td className="px-3 py-2 uppercase">{p.protocol}</td>
                <td className="px-3 py-2">{p.process}</td>
                <td className="px-3 py-2">{p.owner}</td>
                <td className="px-3 py-2">{p.serverId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
