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

  const handleApprovalAction = async (itemId, targetType, targetStatus) => {
    try {
      await axios.patch(
        `${uri}admin/approvals/${targetType}/${itemId}`,
        { status: targetStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDashboardData((prev) => ({
        ...prev,
        pendingApprovals: (prev?.pendingApprovals || []).filter(
          (item) => item.id !== itemId
        ),
      }));
    } catch (err) {
      console.error(`Failed handling approval for ${targetType}:`, err);
    }
  };

  return { dashboardData, isLoading, handleApprovalAction };
};