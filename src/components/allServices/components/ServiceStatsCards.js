import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  WorkOutlined,
  ShieldOutlined,
  Schedule,
  CancelOutlined,
  FlagOutlined,
} from "@mui/icons-material";

const getStatIcon = (iconName, color) => {
  const iconStyle = { fontSize: 18, color };
  switch (iconName) {
    case "briefcase":
      return <WorkOutlined sx={iconStyle} />;
    case "shield":
      return <ShieldOutlined sx={iconStyle} />;
    case "clock":
      return <Schedule sx={iconStyle} />;
    case "x-circle":
      return <CancelOutlined sx={iconStyle} />;
    case "flag":
      return <FlagOutlined sx={iconStyle} />;
    default:
      return <WorkOutlined sx={iconStyle} />;
  }
};

const ServiceStatsCards = ({ cards = [] }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        // Mobile: 2 equal columns (5th card spans full width or auto-fits)
        // Tablet: 3 columns
        // Desktop: 5 columns
        gridTemplateColumns: {
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: { xs: 1.2, sm: 1.5 },
        mb: 3,
        boxSizing: "border-box",
      }}
    >
      {cards.map((card, idx) => (
        <Paper
          key={card.key || idx}
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: "14px",
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 0, // CRITICAL: allows card to shrink inside grid column
            boxSizing: "border-box",
            // If there's an odd number (5th card) on mobile, make it span cleanly across 2 columns
            ...(idx === 4 && {
              gridColumn: { xs: "span 2", sm: "span 1" },
            }),
          }}
        >
          {/* Top Row: Label & Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 1,
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#64748B",
                fontWeight: 700,
                fontSize: { xs: "10.5px", sm: "11px" },
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              {card.title}
            </Typography>

            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                bgcolor: card.bgColor || "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {getStatIcon(card.icon, card.color)}
            </Box>
          </Box>

          {/* Bottom Row: Value & Badge */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#0F172A",
                fontSize: { xs: "18px", sm: "22px" },
                lineHeight: 1.2,
                mb: 0.3,
              }}
            >
              {card.formatted ?? card.value ?? 0}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: card.direction === "up" ? "#10B981" : "#EF4444",
                fontWeight: 700,
                fontSize: "10px",
                display: "block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {card.badge}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ServiceStatsCards;