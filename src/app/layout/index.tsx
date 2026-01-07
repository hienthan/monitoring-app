import React from "react";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Placeholder layout; wire with sidebar/topbar from your UI kit later.
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
};
