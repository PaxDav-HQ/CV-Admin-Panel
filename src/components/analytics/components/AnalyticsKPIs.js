import React from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import { ScheduleOutlined } from "@mui/icons-material";

const AnalyticsKPIs = ({ overview }) => {
  if (!overview) return null;

  const items = Object.values(overview);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(5, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {items.map((item, idx) => {
        const isUp = item.direction === "up";
        const hasChange = item.change !== 0;

        return (
          <Paper
            key={idx}
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              bgcolor: "#FFFFFF",
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
                {item.title}
              </Typography>
              <ScheduleOutlined sx={{ fontSize: 16, color: "#9CA3AF" }} />
            </Box>

            <Typography
              variant="h5"
              sx={{ fontWeight: 800, color: "#111827", mb: 1 }}
            >
              {item.formatted}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
              {hasChange && (
                <Chip
                  label={item.formatted_change}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "10px",
                    fontWeight: 700,
                    bgcolor: isUp ? "#ECFDF5" : "#FEF2F2",
                    color: isUp ? "#017E53" : "#EF4444",
                    borderRadius: "6px",
                  }}
                />
              )}
              <Typography
                variant="caption"
                sx={{ color: "#9CA3AF", fontSize: "11px" }}
              >
                {item.period_label || "vs last period"}
              </Typography>
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default AnalyticsKPIs;