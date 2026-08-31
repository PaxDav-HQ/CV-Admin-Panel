import React from "react";
import { Box, Typography, Paper } from "@mui/material";

// SVG Icon Path Mappings based on backend icon names or keys
const ICON_PATHS = {
  home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", // total_listings
  total_listings: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
  check_circle: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z", // active_listings
  active_listings: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
  pending_approval: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z",
  rejected_listings: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z",
  reported_listings: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z",
};

// Fallback template matching the backend card structure if API is loading/empty
const DEFAULT_CARDS = [
  {
    key: "total_listings",
    title: "Total Listings",
    formatted: "0",
    value: 0,
    badge: "0% vs last month",
    trend: "up",
    color: "#3B82F6",
    bgColor: "#EFF6FF",
    icon: "home",
  },
  {
    key: "active_listings",
    title: "Active Listings",
    formatted: "0",
    value: 0,
    badge: "0% vs last month",
    trend: "up",
    color: "#10B981",
    bgColor: "#ECFDF5",
    icon: "check_circle",
  },
  {
    key: "pending_approval",
    title: "Pending Approval",
    formatted: "0",
    value: 0,
    badge: "0% vs last month",
    trend: "down",
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    icon: "pending_approval",
  },
  {
    key: "rejected_listings",
    title: "Rejected Listings",
    formatted: "0",
    value: 0,
    badge: "0% vs last month",
    trend: "down",
    color: "#EC4899",
    bgColor: "#FDF2F8",
    icon: "rejected_listings",
  },
];

const ListingsMetricsCards = ({ analytics, cards }) => {
  // Use cards array from API response if provided, otherwise fallback
  const displayCards = (cards && cards.length > 0)
    ? cards
    : (analytics?.cards && analytics.cards.length > 0)
    ? analytics.cards
    : DEFAULT_CARDS;

  return (
    <div className="row g-3 mb-4 mx-0">
      {displayCards.map((item, idx) => {
        const isDown = item.trend?.toLowerCase() === "down" || item.direction === "down" || (item.growth && item.growth < 0);
        const iconPath = ICON_PATHS[item.icon] || ICON_PATHS[item.key] || ICON_PATHS.home;
        const iconColor = item.color || "#10B981";
        const iconBg = item.bgColor || `${iconColor}15`;

        return (
          <div key={item.key || idx} className="col-12 col-sm-6 col-lg px-1">
            <Paper
              elevation={0}
              className="p-3 border h-100"
              sx={{ borderRadius: "16px", minWidth: 0, width: "100%", bgcolor: "#fff" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    bgcolor: iconBg,
                    color: iconColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="currentColor" d={iconPath} />
                  </svg>
                </Box>

                {/* Growth Badge / Percentage from API */}
                <Typography
                  variant="caption"
                  sx={{
                    color: isDown ? "#EF4444" : "#10B981",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    fontSize: "11px",
                  }}
                >
                  {item.badge ? (
                    item.badge
                  ) : (
                    <>
                      {isDown ? "▼" : "▲"}{" "}
                      {item.percentage ?? Math.abs(item.change ?? item.growth ?? 0)}%{" "}
                      <span style={{ color: "#6B7280", fontWeight: 400 }}>
                        {item.period || "vs last month"}
                      </span>
                    </>
                  )}
                </Typography>
              </div>

              {/* Main Metric Value */}
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827", my: 0.5 }}>
                {item.formatted ?? item.value?.toLocaleString() ?? 0}
              </Typography>

              {/* Metric Card Title */}
              <Typography
                variant="body2"
                className="text-muted fw-medium d-block mb-1"
                sx={{ fontSize: "12px" }}
              >
                {item.title || item.label}
              </Typography>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

export default ListingsMetricsCards;