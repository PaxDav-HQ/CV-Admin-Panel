import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getDateRange } from "../utils/dateRangeHelper";

export const useAdminDashboardData = (uri, token, timeframe) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(() => {
    if (!token) return;

    const { from, to } = getDateRange(timeframe);
    const apiQueryPath = `from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

    setIsLoading(true);
    axios
      .get(`${uri}admin/dashboard?${apiQueryPath}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const payload = res.data?.data || res.data;
        setDashboardData(payload);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed capturing dashboard data:", err);
        setIsLoading(false);
      });
  }, [uri, token, timeframe]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  return { dashboardData, isLoading, fetchDashboardData };
};