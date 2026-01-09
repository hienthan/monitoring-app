export interface NetdataMetrics {
  cpu: number; // CPU usage percentage (100 - idle)
  ram: number; // RAM usage percentage (used / total * 100)
  diskRead: number; // Disk read KB/s
  diskWrite: number; // Disk write KB/s
  networkInbound: number; // Network inbound KB/s
  networkOutbound: number; // Network outbound KB/s
}

interface NetdataDataResponse {
  labels: string[];
  data: number[][];
  dimensions: Record<string, {
    name: string;
    units: string;
  }>;
}

/**
 * Fetch metrics from Netdata API
 * @param netdataBaseUrl - Base URL of Netdata instance (e.g., http://10.13.34.176:19999)
 * @returns Metrics object
 */
export async function fetchNetdataMetrics(netdataBaseUrl: string | null | undefined): Promise<NetdataMetrics | null> {
  if (!netdataBaseUrl) {
    console.warn('[Netdata] No netdataUrl provided');
    return null;
  }

  // Normalize URL - ensure protocol, remove trailing slash, and end up with {host}/api/v1/data
  // Support inputs like:
  // - 10.13.34.176:19999
  // - http://10.13.34.176:19999
  // - http://10.13.34.176:19999/
  // - http://10.13.34.176:19999/api/v1
  // - http://10.13.34.176:19999/api/v1/
  // - http://10.13.34.176:19999/api/v1/data
  // - http://10.13.34.176:19999/api/v1/data/
  let baseUrl = netdataBaseUrl.trim();

  // If protocol is missing (e.g. "10.13.34.176:19999"), default to http://
  if (!/^https?:\/\//i.test(baseUrl)) {
    baseUrl = `http://${baseUrl}`;
  }

  // Remove any trailing slashes
  baseUrl = baseUrl.replace(/\/+$/, '');

  if (baseUrl.endsWith('/api/v1/data')) {
    baseUrl = baseUrl.slice(0, -'/api/v1/data'.length);
  } else if (baseUrl.endsWith('/api/v1')) {
    baseUrl = baseUrl.slice(0, -'/api/v1'.length);
  }

  const dataUrl = `${baseUrl}/api/v1/data`;

  try {
    // Fetch all metrics in parallel
    // Use after=-5 to get latest data (last 5 seconds)
    // Add timestamp to bypass cache and ensure fresh data
    const timestamp = Date.now();
    const cpuUrl = `${dataUrl}?chart=system.cpu&format=json&after=-5&points=2&_t=${timestamp}`;
    const ramUrl = `${dataUrl}?chart=system.ram&format=json&after=-5&points=2&_t=${timestamp}`;
    const diskUrl = `${dataUrl}?chart=system.io&format=json&after=-5&points=2&_t=${timestamp}`;
    const networkUrl = `${dataUrl}?chart=system.net&format=json&after=-5&points=2&_t=${timestamp}`;

    const [cpuData, ramData, diskData, networkData] = await Promise.all([
      fetch(cpuUrl).catch((err) => {
        console.error('[Netdata] CPU fetch error:', err);
        return null;
      }),
      fetch(ramUrl).catch((err) => {
        console.error('[Netdata] RAM fetch error:', err);
        return null;
      }),
      fetch(diskUrl).catch((err) => {
        console.error('[Netdata] Disk fetch error:', err);
        return null;
      }),
      fetch(networkUrl).catch((err) => {
        console.error('[Netdata] Network fetch error:', err);
        return null;
      }),
    ]);

    // Parse CPU data
    // Response format: { labels: ["time", "user", "system", "nice", "iowait", ...] OR ["time","guest_nice","guest",...], data: [[timestamp, val1, val2, ...]] }
    let cpu = 0;
    if (cpuData?.ok) {
      try {
        const cpuJson: any = await cpuData.json();
        
        // Response format is direct: { labels: [...], data: [...] }
        const labels = cpuJson.labels || [];
        const data = cpuJson.data || [];
        
        if (data.length > 0) {
          // Get the latest (most recent) data point
          // Data is sorted by time, last element is most recent
          const latest = data[data.length - 1];

          // Prefer requirement logic if "idle" is present: CPU usage = 100 - idle
          const idleIndex = labels.indexOf('idle');
          if (idleIndex >= 0 && idleIndex < latest.length) {
            const idleVal = latest[idleIndex] as number;
            if (typeof idleVal === 'number' && !isNaN(idleVal)) {
              cpu = Math.round(Math.max(0, Math.min(100, 100 - idleVal)));
            }
          } else {
            // Fallback: no "idle" dimension, calculate CPU usage from sum of all non-time values
            // Example labels from requirement:
            // ["time","guest_nice","guest","steal","softirq","irq","user","system","nice","iowait"]
            let totalUsed = 0;
            for (let i = 1; i < latest.length; i++) {
              const value = latest[i] as number;
              if (typeof value === 'number' && !isNaN(value)) {
                totalUsed += Math.abs(value);
              }
            }
            cpu = Math.round(Math.min(100, totalUsed));
          }
        } else {
          console.warn('[Netdata] CPU: No data in response');
        }
      } catch (e) {
        console.error('[Netdata] Error parsing CPU data:', e);
      }
    } else {
      console.warn('[Netdata] CPU fetch failed:', cpuData?.status, cpuData?.statusText);
    }

    // Parse RAM data
    // Response format: { labels: ["time", "free", "used", "cached", "buffers"], data: [[timestamp, free, used, cached, buffers]] }
    let ram = 0;
    if (ramData?.ok) {
      try {
        const ramJson: any = await ramData.json();
        
        // Response format is direct: { labels: [...], data: [...] }
        const labels = ramJson.labels || [];
        const data = ramJson.data || [];
        
        if (data.length > 0) {
          // Get the latest (most recent) data point
          const latest = data[data.length - 1];
          const previous = data.length > 1 ? data[data.length - 2] : null;
          
          const timeIndex = labels.indexOf('time');
          const usedIndex = labels.indexOf('used');
          const freeIndex = labels.indexOf('free');
          const cachedIndex = labels.indexOf('cached');
          const buffersIndex = labels.indexOf('buffers');
          
          let used = 0;
          let free = 0;
          let cached = 0;
          let buffers = 0;
          
          // Data format: [timestamp, free, used, cached, buffers]
          // Labels: ["time", "free", "used", "cached", "buffers"]
          // Data indices match labels: data[0]=timestamp, data[1]=free, data[2]=used, data[3]=cached, data[4]=buffers
          if (freeIndex >= 0) free = Math.abs((latest[freeIndex] as number) || 0);
          if (usedIndex >= 0) used = Math.abs((latest[usedIndex] as number) || 0);
          if (cachedIndex >= 0) cached = Math.abs((latest[cachedIndex] as number) || 0);
          if (buffersIndex >= 0) buffers = Math.abs((latest[buffersIndex] as number) || 0);
          
          // Total RAM = used + free + cached + buffers
          // RAM usage = used / total * 100 (according to requirement: "RAM used / total")
          const total = used + free + cached + buffers;
          if (total > 0) {
            // Keep 2 decimal places for RAM usage to see small changes
            ram = parseFloat(((used / total) * 100).toFixed(2));
          } else {
            console.warn('[Netdata] RAM: total is 0');
          }
        } else {
          console.warn('[Netdata] RAM: No data in response');
        }
      } catch (e) {
        console.error('[Netdata] Error parsing RAM data:', e);
      }
    } else {
      console.warn('[Netdata] RAM fetch failed:', ramData?.status, ramData?.statusText);
    }

    // Parse Disk I/O data
    // Response format: { labels: ["time", "reads", "writes"], data: [[timestamp, reads, writes]] }
    let diskRead = 0;
    let diskWrite = 0;
    if (diskData?.ok) {
      try {
        const diskJson: any = await diskData.json();
        
        // Response format is direct: { labels: [...], data: [...] }
        const labels = diskJson.labels || [];
        const data = diskJson.data || [];
        
        if (data.length > 0) {
          // Get the latest (most recent) data point
          const latest = data[data.length - 1];
          const previous = data.length > 1 ? data[data.length - 2] : null;
          
          // Labels: ["time", "reads", "writes"]
          const readsIndex = labels.indexOf('reads');
          const writesIndex = labels.indexOf('writes');
          
          // Data format: [timestamp, reads, writes]
          // Labels and data indices match: labels[0]="time" → data[0]=timestamp, labels[1]="reads" → data[1]=reads, etc.
          if (readsIndex >= 0) diskRead = Math.round(Math.abs((latest[readsIndex] as number) || 0));
          if (writesIndex >= 0) diskWrite = Math.round(Math.abs((latest[writesIndex] as number) || 0));
        } else {
          console.warn('[Netdata] Disk: No data in response');
        }
      } catch (e) {
        console.error('[Netdata] Error parsing Disk I/O data:', e);
      }
    } else {
      console.warn('[Netdata] Disk fetch failed:', diskData?.status, diskData?.statusText);
    }

    // Parse Network data
    // Response format: { labels: ["time", "received", "sent"], data: [[timestamp, received, sent]] }
    let networkInbound = 0;
    let networkOutbound = 0;
    if (networkData?.ok) {
      try {
        const networkJson: any = await networkData.json();
        
        // Response format is direct: { labels: [...], data: [...] }
        const labels = networkJson.labels || [];
        const data = networkJson.data || [];
        
        if (data.length > 0) {
          // Get the latest (most recent) data point
          const latest = data[data.length - 1];
          const previous = data.length > 1 ? data[data.length - 2] : null;
          
          // Labels: ["time", "received", "sent"]
          const receivedIndex = labels.indexOf('received');
          const sentIndex = labels.indexOf('sent');
          
          // Data format: [timestamp, received, sent]
          // Labels and data indices match: labels[0]="time" → data[0]=timestamp, labels[1]="received" → data[1]=received, etc.
          if (receivedIndex >= 0) networkInbound = Math.round(Math.abs((latest[receivedIndex] as number) || 0));
          if (sentIndex >= 0) networkOutbound = Math.round(Math.abs((latest[sentIndex] as number) || 0));
        } else {
          console.warn('[Netdata] Network: No data in response');
        }
      } catch (e) {
        console.error('[Netdata] Error parsing Network data:', e);
      }
    } else {
      console.warn('[Netdata] Network fetch failed:', networkData?.status, networkData?.statusText);
    }

    const finalMetrics: NetdataMetrics = {
      cpu: Math.max(0, Math.min(100, cpu)),
      ram: Math.max(0, Math.min(100, ram)),
      diskRead,
      diskWrite,
      networkInbound,
      networkOutbound,
    };

    return finalMetrics;
  } catch (error) {
    console.error('[Netdata] Failed to fetch Netdata metrics:', error);
    return null;
  }
}
