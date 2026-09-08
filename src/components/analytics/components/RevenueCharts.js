import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const defaultColors = ["#064E3B", "#10B981", "#F59E0B", "#3B82F6", "#F87171"];

const RevenueCharts = ({ revenueOverTime = [], propertyTypes = [] }) => {
  const pieData = propertyTypes.map((item, idx) => ({
    name: item.type,
    value: item.amount || item.percentage,
    percentage: item.percentage,
    color: item.color || defaultColors[idx % defaultColors.length],
  }));

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 340px" },
        gap: { xs: 2, md: 3 },
        mb: 3,
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* 1. REVENUE OVER TIME */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "20px",
          border: "1px solid #F1F5F9",
          bgcolor: "#FFFFFF",
          minWidth: 0, // CRITICAL: Allows Recharts to shrink on mobile
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "16px" }}>
              Revenue Over Time
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "12px" }}>
              Comparison between current and previous period
            </Typography>
          </div>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#064E3B" }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "12px" }}>
                Current
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#CBD5E1" }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#94A3B8", fontSize: "12px" }}>
                Previous
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ width: "100%", height: 300, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueOverTime} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="currentRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) =>
                  val >= 1000000
                    ? `₦${(val / 1000000).toFixed(1)}M`
                    : val > 0
                    ? `₦${(val / 1000).toFixed(0)}k`
                    : "₦0M"
                }
              />
              <Tooltip
                formatter={(val) => [
                  Number(val).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }),
                ]}
                contentStyle={{ borderRadius: "10px", border: "1px solid #E2E8F0" }}
              />
              <Area
                type="monotone"
                dataKey="previous_period"
                stroke="#CBD5E1"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="transparent"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="current_period"
                stroke="#064E3B"
                strokeWidth={2.8}
                fill="url(#currentRevenueGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* 2. REVENUE BY PROPERTY TYPE */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "20px",
          border: "1px solid #F1F5F9",
          bgcolor: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minWidth: 0,
        }}
      >
        <div>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "15px", mb: 2 }}>
            Revenue by Property Type
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: 180,
              bgcolor: "#E5E7EB",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              minWidth: 0,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [
                    Number(val).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }),
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4, mt: 2.5 }}>
          {pieData.map((item, idx) => (
            <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: item.color }} />
                <Typography variant="body2" sx={{ color: "#475569", fontSize: "13px", fontWeight: 500 }}>
                  {item.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "13px" }}>
                {item.percentage}%
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default RevenueCharts;