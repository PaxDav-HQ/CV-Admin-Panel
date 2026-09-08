import React from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { HelpOutlined } from "@mui/icons-material";

const PayoutStats = ({ cards = [] }) => {
  if (!cards.length) return null;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
        width: "100%",
        minWidth: 0,
      }}
    >
      {cards.map((card) => {
        const isUp = card.direction === "up";
        const hasChange = card.badge_text && card.badge_text !== "0%";

        return (
          <Paper
            key={card.id}
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              bgcolor: "#FFFFFF",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.2,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#6B7280",
                  fontWeight: 700,
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {card.title}
              </Typography>
              <HelpOutlined sx={{ fontSize: 16, color: "#9CA3AF" }} />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#111827", mb: 1, fontSize: { xs: "20px", sm: "24px" } }}
            >
              {card.formatted}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={card.badge_text || "0%"}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "10px",
                  fontWeight: 700,
                  bgcolor: hasChange
                    ? isUp
                      ? "#ECFDF5"
                      : "#FEF2F2"
                    : "#F3F4F6",
                  color: hasChange
                    ? isUp
                      ? "#017E53"
                      : "#EF4444"
                    : "#6B7280",
                  borderRadius: "6px",
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: "#94A3B8", fontSize: "11px" }}
              >
                {card.period_label || "vs last period"}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default PayoutStats;