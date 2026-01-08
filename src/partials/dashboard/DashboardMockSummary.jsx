import React from 'react';

function Stat({ label, value, tone = 'neutral' }) {
  const tones = {
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700/60 dark:text-gray-100',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200',
  };

  return (
    <div className="flex flex-col rounded-lg bg-white dark:bg-gray-800 shadow-xs border border-gray-100 dark:border-gray-700 p-4">
      <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{label}</div>
      <div className={`mt-1 inline-flex w-fit items-center rounded-full px-2 py-1 text-sm font-semibold ${tones[tone]}`}>
        {value}
      </div>
    </div>
  );
}

function AlertRow({ serverName, env, alerts }) {
  return (
    <li className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{serverName}</div>
        <div className="text-xs uppercase text-gray-500 dark:text-gray-400">{env}</div>
      </div>
      <div className="inline-flex items-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200 px-2 py-1 text-xs font-semibold">
        {alerts} open
      </div>
    </li>
  );
}

function DashboardMockSummary({ cards = [] }) {
  const total = cards.length;
  const up = cards.filter((c) => c.server.status === 'up').length;
  const degraded = cards.filter((c) => c.server.status === 'degraded').length;
  const down = cards.filter((c) => c.server.status === 'down').length;
  const alertsOpen = cards.reduce((sum, c) => sum + (c.alertsOpen || 0), 0);
  const topAlerts = [...cards]
    .sort((a, b) => b.alertsOpen - a.alertsOpen)
    .slice(0, 3)
    .filter((c) => c.alertsOpen > 0);

  return (
    <div className="flex flex-col col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700">
      <div className="px-5 pt-5 pb-4">
        <header className="flex flex-col gap-1 mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Mock Infrastructure Snapshot</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Data is sourced from local mock files to keep the layout stable.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Servers" value={total} tone="neutral" />
          <Stat label="Up" value={up} tone="success" />
          <Stat label="Degraded" value={degraded} tone="warning" />
          <Stat label="Down" value={down} tone="danger" />
        </div>

        <div className="mt-4 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Open alerts</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{alertsOpen}</div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Live mocked sample</div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Top noisy servers</div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {topAlerts.length === 0 ? (
                <li className="py-2 text-sm text-gray-500 dark:text-gray-400">No open alerts in mock data.</li>
              ) : (
                topAlerts.map((c) => (
                  <AlertRow key={c.server.id} serverName={c.server.name} env={c.server.env} alerts={c.alertsOpen} />
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMockSummary;
