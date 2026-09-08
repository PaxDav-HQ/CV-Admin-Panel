import React from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const TrendsAndCities = ({
  volumeData = [],
  refundData = [],
  topCities = [],
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 340px" },
        gap: { xs: 2, md: 3 },
        mb: 3,
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* 1. BOOKINGS BY VOLUME */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "20px",
          border: "1px solid #F1F5F9",
          bgcolor: "#FFFFFF",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "15px", mb: 2 }}>
          Bookings by Volume
        </Typography>

        <Box sx={{ width: "100%", height: 220, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="label"
                stroke="#94A3B8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <Tooltip cursor={{ fill: "rgba(241, 245, 249, 0.5)" }} />
              <Bar
                dataKey="volume"
                fill="#22C55E"
                maxBarSize={36} // Adapts cleanly down on narrow mobile screens
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* 2. REFUND TREND */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: "20px",
          border: "1px solid #F1F5F9",
          bgcolor: "#FFFFFF",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "15px", mb: 2 }}>
          Refund Trend
        </Typography>

        <Box sx={{ width: "100%", height: 220, minWidth: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={refundData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" hide />
              <Tooltip
                formatter={(val) => [
                  Number(val).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }),
                ]}
              />
              <Area
                type="stepAfter"
                dataKey="amount"
                stroke="#F87171"
                strokeWidth={2}
                fill="#FEF2F2"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* 3. TOP CITIES BY GROWTH */}
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
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "15px", mb: 2.5 }}>
            Top Cities by Growth
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {topCities.map((city, idx) => {
              const isUp = city.direction === "up";
              return (
                <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "13.5px" }}>
                      {city.city}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "12px" }}>
                      Total: {city.formatted_revenue}
                    </Typography>
                  </div>
                  <Chip
                    label={city.formatted_growth}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "11px",
                      fontWeight: 800,
                      bgcolor: isUp ? "#ECFDF5" : "#FEF2F2",
                      color: isUp ? "#10B981" : "#EF4444",
                      borderRadius: "6px",
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            color: "#0F172A",
            fontWeight: 700,
            cursor: "pointer",
            mt: 2,
            "&:hover": { textDecoration: "underline" },
          }}
        >
          View Heatmap
        </Typography>
      </Paper>
    </Box>
  );
};

export default TrendsAndCities;