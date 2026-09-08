import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { SendOutlined } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";

import AnalyticsKPIs from "./components/AnalyticsKPIs";
import RevenueCharts from "./components/RevenueCharts";
import TrendsAndCities from "./components/TrendsAndCities";
import TrafficPerformanceChart from "./components/TrafficPerformanceChart";
import TransactionExplorerTable from "./components/TransactionExplorerTable";

const PerformanceOverview = () => {
  const uri = useSelector((state) => state.UriReducer?.uri);
  const token = sessionStorage.getItem("userToken")
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeframe, setTimeframe] = useState("30days");
  const [txnFilter, setTxnFilter] = useState("all");

  useEffect(() => {
    fetchAnalytics(1);
  }, [timeframe]);

  const fetchAnalytics = async (page = 1) => {
    try {
      setLoading(true);      
      const res = await axios.get(`${uri}admin/analytics`, {
        params: { page, timeframe },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.data);
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to load analytics overview:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress sx={{ color: "#017E53" }} />
      </Box>
    );
  }

  return (
    <Box
        sx={{
        p: { xs: 0, sm: 2, md: 3 },
        bgcolor: "#F9FAFB",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden", // Prevents entire page from sliding horizontally
        boxSizing: "border-box",
        }}
    >
      {/* Top Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <div>
          <Typography
            variant="caption"
            sx={{
              color: "#9CA3AF",
              fontWeight: 700,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            INSIGHTS › REPORTS & ANALYTICS
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}
          >
            Performance Overview
          </Typography>
        </div>

        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                // width: "100%",
                gap: { xs: 1, sm: 1.5 },
                flexWrap: "nowrap",
            }}
            >
            {/* Timeframe Segmented Control */}
            <Box
                sx={{
                display: "flex",
                flexDirection: "row",
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "10px",
                p: 0.5,
                flex: 1,
                minWidth: 0,
                }}
            >
                <Button
                size="small"
                onClick={() => setTimeframe("30days")}
                sx={{
                    flex: 1,
                    borderRadius: "8px",
                    fontSize: { xs: "11px", sm: "12px" },
                    fontWeight: 700,
                    textTransform: "none",
                    px: { xs: 0.8, sm: 1.5 },
                    py: 0.6,
                    whiteSpace: "nowrap",
                    bgcolor: timeframe === "30days" ? "#017E53" : "transparent",
                    color: timeframe === "30days" ? "#FFFFFF" : "#64748B",
                    "&:hover": {
                    bgcolor: timeframe === "30days" ? "#016744" : "#F8FAFC",
                    },
                }}
                >
                Last 30 Days
                </Button>
                <Button
                size="small"
                onClick={() => setTimeframe("custom")}
                sx={{
                    flex: 1,
                    borderRadius: "8px",
                    fontSize: { xs: "11px", sm: "12px" },
                    fontWeight: 700,
                    textTransform: "none",
                    px: { xs: 0.8, sm: 1.5 },
                    py: 0.6,
                    whiteSpace: "nowrap",
                    bgcolor: timeframe === "custom" ? "#017E53" : "transparent",
                    color: timeframe === "custom" ? "#FFFFFF" : "#64748B",
                    "&:hover": {
                    bgcolor: timeframe === "custom" ? "#016744" : "#F8FAFC",
                    },
                }}
                >
                Custom Range
                </Button>
            </Box>

            {/* Send Report Action Button */}
            <Button
                variant="contained"
                startIcon={<SendOutlined sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                sx={{
                bgcolor: "#017E53",
                color: "#FFFFFF",
                fontWeight: 700,
                borderRadius: "10px",
                textTransform: "none",
                fontSize: { xs: "11px", sm: "13px" },
                px: { xs: 1.2, sm: 2 },
                py: { xs: 0.8, sm: 0.9 },
                whiteSpace: "nowrap",
                flexShrink: 0,
                boxShadow: "none",
                "&:hover": { bgcolor: "#016744" },
                }}
            >
                Send Report
            </Button>
        </Box>
      </Box>

      {/* 1. Metric KPI Cards */}
      <AnalyticsKPIs overview={data?.overview} />

      {/* 2. Revenue Over Time & Property Type Doughnut */}
      <RevenueCharts
        revenueOverTime={data?.revenueOverTime}
        propertyTypes={data?.revenueByPropertyType}
      />

      {/* 3. Booking Volume, Refund Step Trend, and Top Cities */}
      <TrendsAndCities
        volumeData={data?.bookingsByVolume}
        refundData={data?.refundTrend}
        topCities={data?.topCitiesByGrowth}
      />

      {/* 4. Traffic & Performance Analytics Area Chart */}
      <TrafficPerformanceChart data={data?.trafficPerformance} />

      {/* 5. Raw Transaction Explorer Table */}
      <TransactionExplorerTable
        transactions={data?.rawTransactions}
        pagination={data?.pagination}
        onPageChange={(page) => fetchAnalytics(page)}
        activeFilter={txnFilter}
        onFilterChange={setTxnFilter}
      />
    </Box>
  );
};

export default PerformanceOverview;