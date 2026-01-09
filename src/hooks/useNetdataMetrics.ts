import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchNetdataMetrics, NetdataMetrics } from '../repositories/netdataMetricsRepo';

const POLL_INTERVAL = 5000; // 5 seconds

export function useNetdataMetrics(netdataUrl: string | null | undefined) {
  const [metrics, setMetrics] = useState<NetdataMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const netdataUrlRef = useRef<string | null | undefined>(netdataUrl);

  // Update ref when URL changes
  useEffect(() => {
    netdataUrlRef.current = netdataUrl;
  }, [netdataUrl]);

  const fetchMetrics = useCallback(async () => {
    const currentUrl = netdataUrlRef.current;
    
    if (!currentUrl) {
      console.warn('[useNetdataMetrics] No netdataUrl provided');
      // Don't reset metrics if URL is not available, keep previous data
      setIsLoading(false);
      return;
    }

    try {
      // Don't set isLoading to true to keep showing previous data
      setError(null);
      const data = await fetchNetdataMetrics(currentUrl);
      
      // Always update metrics state to trigger re-render when new data arrives
      if (data) {
        // Always create a new object to ensure React detects the change
        // This forces re-render even if values are the same
        const newMetrics: NetdataMetrics = {
          cpu: data.cpu,
          ram: data.ram,
          diskRead: data.diskRead,
          diskWrite: data.diskWrite,
          networkInbound: data.networkInbound,
          networkOutbound: data.networkOutbound,
        };
        
        // Always update with new object reference to trigger re-render
        setMetrics(newMetrics);
      } else {
        console.warn('[useNetdataMetrics] No data returned, keeping previous metrics');
      }
    } catch (err) {
      console.error('[useNetdataMetrics] Error fetching Netdata metrics:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      // Keep previous metrics on error
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty deps - use ref for URL

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Fetch immediately
    fetchMetrics();

    // Set up polling interval
    intervalRef.current = setInterval(() => {
      fetchMetrics();
    }, POLL_INTERVAL);

    // Cleanup on unmount or when netdataUrl changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [netdataUrl, fetchMetrics]);

  // Pause polling when tab is hidden, resume when visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else if (document.visibilityState === 'visible') {
        // Fetch immediately on resume
        fetchMetrics();
        // Restart interval if not already running
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            fetchMetrics();
          }, POLL_INTERVAL);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchMetrics]);

  return { metrics, isLoading, error, refetch: fetchMetrics };
}
