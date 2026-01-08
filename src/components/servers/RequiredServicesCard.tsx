import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";

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
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Required Services</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-default-200 rounded animate-pulse" />
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Required Services</h3>
      </CardHeader>
      <CardBody>
        {services.length === 0 ? (
          <p className="text-sm text-default-500">No data</p>
        ) : (
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service.id} className="text-sm">
                <div className="flex items-center justify-between">
                  <span>{service.name}</span>
                  {service.status && (
                    <span className="text-xs text-default-500">{service.status}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
};
