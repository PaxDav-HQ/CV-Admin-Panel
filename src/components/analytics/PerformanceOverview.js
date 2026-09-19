import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Popover,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";
import {
  Close,
  CalendarMonthOutlined,
  CalendarTodayOutlined,
} from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";

import AnalyticsKPIs from "./components/AnalyticsKPIs";
import RevenueCharts from "./components/RevenueCharts";
import TrendsAndCities from "./components/TrendsAndCities";
import TrafficPerformanceChart from "./components/TrafficPerformanceChart";
import TransactionExplorerTable from "./components/TransactionExplorerTable";

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PerformanceOverview = () => {
  const uri = useSelector((state) => state.UriReducer?.uri);
  const token = sessionStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("30days"); // "30days" | "custom"
  const [txnFilter, setTxnFilter] = useState("all");

  // Today's date string for input max constraints
  const todayStr = useMemo(() => formatDate(new Date()), []);

  // Compute standard 30-day range
  const default30DaysRange = useMemo(() => {
    const today = new Date();
    const past30 = new Date();
    past30.setDate(today.getDate() - 30);
    return {
      from: formatDate(past30),
      to: formatDate(today),
    };
  }, []);

  // Custom date range state
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [appliedCustomRange, setAppliedCustomRange] = useState(null);

  // Popover Anchor state
  const [customAnchorEl, setCustomAnchorEl] = useState(null);

  useEffect(() => {
    if (activeTab === "30days") {
      fetchAnalytics(1, default30DaysRange.from, default30DaysRange.to);
    } else if (activeTab === "custom" && appliedCustomRange) {
      fetchAnalytics(1, appliedCustomRange.from, appliedCustomRange.to);
    }
  }, [activeTab, appliedCustomRange]);

  const fetchAnalytics = async (page = 1, fromDate, toDate) => {
    try {
      setLoading(true);

      const params = {
        page,
        from: fromDate,
        to: toDate,
      };

      const res = await axios.get(`${uri}admin/analytics`, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setData(res.data?.data || null);
    } catch (err) {
      console.error("Failed to load analytics overview:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomRangeClick = (event) => {
    setCustomAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setCustomAnchorEl(null);
  };

  const handleApplyCustomRange = () => {
    if (!dateRange.startDate || !dateRange.endDate) return;

    setAppliedCustomRange({
      from: dateRange.startDate,
      to: dateRange.endDate,
    });
    setActiveTab("custom");
    handleClosePopover();
  };

  const handleResetTo30Days = () => {
    setActiveTab("30days");
    setAppliedCustomRange(null);
    setDateRange({ startDate: "", endDate: "" });
  };

  // Human-readable range display (e.g. "Sep 02 – Sep 19")
  const formattedAppliedLabel = useMemo(() => {
    if (!appliedCustomRange) return "";
    const formatShort = (dateStr) => {
      const parts = dateStr.split("-");
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    return `${formatShort(appliedCustomRange.from)} – ${formatShort(appliedCustomRange.to)}`;
  }, [appliedCustomRange]);

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
        overflowX: "hidden",
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
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          {/* If a custom range is applied, show an active filter chip */}
          {activeTab === "custom" && appliedCustomRange && (
            <Chip
              icon={<CalendarTodayOutlined sx={{ fontSize: "14px !important", color: "#017E53 !important" }} />}
              label={formattedAppliedLabel}
              onDelete={handleResetTo30Days}
              deleteIcon={<Close sx={{ fontSize: "14px !important" }} />}
              size="small"
              sx={{
                bgcolor: "#ECFDF5",
                color: "#017E53",
                fontWeight: 700,
                fontSize: "12px",
                border: "1px solid rgba(1, 126, 83, 0.2)",
                height: 32,
                px: 0.5,
              }}
            />
          )}

          {/* Timeframe Segmented Control */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "10px",
              p: 0.5,
            }}
          >
            <Button
              size="small"
              onClick={handleResetTo30Days}
              sx={{
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",
                px: 1.8,
                py: 0.6,
                whiteSpace: "nowrap",
                bgcolor: activeTab === "30days" ? "#017E53" : "transparent",
                color: activeTab === "30days" ? "#FFFFFF" : "#64748B",
                "&:hover": {
                  bgcolor: activeTab === "30days" ? "#016744" : "#F8FAFC",
                },
              }}
            >
              Last 30 Days
            </Button>

            <Button
              size="small"
              onClick={handleCustomRangeClick}
              sx={{
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "none",
                px: 1.8,
                py: 0.6,
                whiteSpace: "nowrap",
                bgcolor: activeTab === "custom" ? "#017E53" : "transparent",
                color: activeTab === "custom" ? "#FFFFFF" : "#64748B",
                "&:hover": {
                  bgcolor: activeTab === "custom" ? "#016744" : "#F8FAFC",
                },
              }}
            >
              Custom Range
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Popover for Date Selection */}
      <Popover
        open={Boolean(customAnchorEl)}
        anchorEl={customAnchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        marginThreshold={16}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)",
              width: 320,
              maxWidth: "calc(100vw - 32px)",
              border: "1px solid #F1F5F9",
              mt: 1,
              overflow: "hidden",
            },
          },
        }}
      >
        <Box sx={{ p: 2.5 }}>
          {/* Popover Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", fontSize: "14px" }}>
              Select Date Range
            </Typography>
            <IconButton
              size="small"
              onClick={handleClosePopover}
              sx={{
                color: "#94A3B8",
                p: 0.5,
                "&:hover": { color: "#1E293B", bgcolor: "#F8FAFC" },
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Date Pickers */}
          {/* Date Pickers */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "#475569",
                  display: "block",
                  mb: 0.8,
                  fontSize: "12px",
                }}
              >
                Start Date
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={dateRange.startDate}
                // Both slotProps.htmlInput and inputProps ensure the native <input> receives the constraints
                slotProps={{
                  htmlInput: {
                    max: dateRange.endDate || todayStr,
                  },
                }}
                inputProps={{
                  max: dateRange.endDate || todayStr,
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  const limit = dateRange.endDate || todayStr;
                  if (val && val > limit) return; // Prevent selection/typing past limit
                  setDateRange((prev) => ({ ...prev, startDate: val }));
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#FFFFFF",
                    fontSize: "13px",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&:hover fieldset": { borderColor: "#CBD5E1" },
                    "&.Mui-focused fieldset": { borderColor: "#017E53" },
                  },
                }}
              />
            </div>

            <div>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "#475569",
                  display: "block",
                  mb: 0.8,
                  fontSize: "12px",
                }}
              >
                End Date
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={dateRange.endDate}
                // Both slotProps.htmlInput and inputProps ensure the native <input> receives the constraints
                slotProps={{
                  htmlInput: {
                    min: dateRange.startDate || undefined,
                    max: todayStr,
                  },
                }}
                inputProps={{
                  min: dateRange.startDate || undefined,
                  max: todayStr,
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val > todayStr) return; // Disallow dates beyond today
                  if (val && dateRange.startDate && val < dateRange.startDate) return; // Disallow before start date
                  setDateRange((prev) => ({ ...prev, endDate: val }));
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#FFFFFF",
                    fontSize: "13px",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&:hover fieldset": { borderColor: "#CBD5E1" },
                    "&.Mui-focused fieldset": { borderColor: "#017E53" },
                  },
                }}
              />
            </div>

            <Button
              fullWidth
              variant="contained"
              disabled={
                !dateRange.startDate ||
                !dateRange.endDate ||
                dateRange.startDate > dateRange.endDate ||
                dateRange.endDate > todayStr
              }
              onClick={handleApplyCustomRange}
              sx={{
                mt: 0.5,
                bgcolor: "#017E53",
                color: "#FFFFFF",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
                py: 1.1,
                fontSize: "13px",
                boxShadow: "none",
                "&:hover": { bgcolor: "#016744", boxShadow: "none" },
                "&.Mui-disabled": {
                  bgcolor: "#E2E8F0",
                  color: "#94A3B8",
                },
              }}
            >
              Apply Range
            </Button>
          </Box>
        </Box>
      </Popover>

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
      {/* <TransactionExplorerTable
        transactions={data?.rawTransactions}
        pagination={data?.pagination}
        onPageChange={(page) =>
          fetchAnalytics(
            page,
            activeTab === "30days" ? default30DaysRange.from : appliedCustomRange?.from,
            activeTab === "30days" ? default30DaysRange.to : appliedCustomRange?.to
          )
        }
        activeFilter={txnFilter}
        onFilterChange={setTxnFilter}
      /> */}
    </Box>
  );
};

export default PerformanceOverview;