import React from "react";
import { useEffect, useState } from "react";
import { dashboardRepo } from "../../repositories/dashboardRepo";
import { DatacenterCard } from "../../components/cards/DatacenterCard";
import { DatacenterCardVM } from "../../types/viewmodels";

export const DatacenterPage: React.FC = () => {
  const [cards, setCards] = useState<DatacenterCardVM[]>([]);

  useEffect(() => {
    dashboardRepo.getDatacenterCards().then(setCards).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Datacenter</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <DatacenterCard key={card.server.id} card={card} />
        ))}
      </div>
    </div>
  );
};
