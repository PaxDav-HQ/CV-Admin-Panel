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
} from "recharts";

const TrafficPerformanceChart = ({ data = [] }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "20px",
        border: "1px solid #F1F5F9",
        bgcolor: "#FFFFFF",
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <div>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "16px" }}>
            App/Web Performance Analytics
          </Typography>
          <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "12px" }}>
            Comparison between app and website performance and traffic
          </Typography>
        </div>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#064E3B" }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "12px" }}>
              App Performance
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: "#CBD5E1" }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: "#94A3B8", fontSize: "12px" }}>
              Web Performance
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="appTrafficGrad" x1="0" y1="0" x2="0" y2="1">
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
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #E2E8F0" }} />
            <Area
              type="monotone"
              dataKey="web_performance"
              stroke="#CBD5E1"
              strokeDasharray="5 5"
              strokeWidth={2}
              fill="transparent"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="app_performance"
              stroke="#064E3B"
              strokeWidth={2.8}
              fill="url(#appTrafficGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TrafficPerformanceChart;