import React from "react";

interface RequiredService {
  id: string;
  name: string;
  status?: string;
}

interface RequiredServicesCardProps {
  services: RequiredService[];
  isLoading?: boolean;
}

export const RequiredServicesCard: React.FC<RequiredServicesCardProps> = ({
  services,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold px-1">Required Services</h3>
        <div className="overflow-hidden rounded border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-3 py-2">SERVICE</th>
                <th className="px-3 py-2 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-3 py-2">
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
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold px-1">Required Services</h3>
      <div className="overflow-hidden rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-3 py-2">SERVICE</th>
              <th className="px-3 py-2 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {services.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-3 py-8 text-center text-slate-500">
                  No data
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2">
                    <span className="text-sm">{service.name}</span>
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="text-sm text-slate-600">
                      {service.status || "-"}
                    </span>
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
