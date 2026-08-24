import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const PLACEHOLDER_METRICS = [
  { key: "total", label: "Total Listings", count: 4562, change: 12.4, trend: "up", color: "#3B82F6", icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
  { key: "active", label: "Active Listings", count: 3120, change: 8.7, trend: "up", color: "#10B981", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" },
  { key: "pending", label: "Pending Approval", count: 235, change: 4.3, trend: "down", color: "#F59E0B", icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" },
  { key: "rejected", label: "Rejected Listings", count: 67, change: 2.1, trend: "down", color: "#EC4899", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" },
  { key: "reported", label: "Reported Listings", count: 38, change: 1.3, trend: "up", color: "#EF4444", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" },
];

const ListingsMetricsCards = () => {
  return (
    <div className="row g-3 mb-4 mx-0">
      {PLACEHOLDER_METRICS.map((item) => {
        const isNeg = item.trend === "down";
        return (
          <div key={item.key} className="col-12 col-sm-6 col-lg px-1">
            <Paper
              elevation={0}
              className="p-3 border h-100"
              sx={{ borderRadius: "16px", minWidth: 0, width: "100%" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    bgcolor: `${item.color}15`,
                    color: item.color,
                    display: "flex",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="currentColor" d={item.icon} />
                  </svg>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: isNeg ? "#EF4444" : "#10B981",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  {isNeg ? "▼" : "▲"} {Math.abs(item.change)}%{" "}
                  <span style={{ color: "#6B7280", fontWeight: 400 }}>vs last month</span>
                </Typography>
              </div>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {item.count.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                className="text-muted fw-medium d-block mb-1"
                sx={{ fontSize: "12px" }}
              >
                {item.label}
              </Typography>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

export default ListingsMetricsCards;