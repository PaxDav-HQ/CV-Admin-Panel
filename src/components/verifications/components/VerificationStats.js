import React from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import {
  CheckCircleOutlined,
  AccessTime,
  CancelOutlined,
  DescriptionOutlined,
  NorthEast,
  SouthEast,
} from "@mui/icons-material";

// Map the string keys from backend ("check-circle", "clock", "x-circle", "file-text")
const renderBackendIcon = (iconName, color) => {
  const iconProps = { sx: { fontSize: 20, color: color || "#6B7280" } };

  switch (iconName) {
    case "check-circle":
      return <CheckCircleOutlined {...iconProps} />;
    case "clock":
      return <AccessTime {...iconProps} />;
    case "x-circle":
      return <CancelOutlined {...iconProps} />;
    case "file-text":
      return <DescriptionOutlined {...iconProps} />;
    default:
      return <AccessTime {...iconProps} />;
  }
};

// Clean titles from camelCase keys
const keyTitleMap = {
  totalVerified: "Total Verified",
  pendingReview: "Pending Review",
  rejectedItems: "Rejected Items",
  documentsUploaded: "Documents Uploaded",
  avgReviewTime: "Avg Review Time",
};

const VerificationStats = ({ stats }) => {
  if (!stats) return null;

  const cardEntries = Object.entries(stats);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)", // Exact 5-card layout on desktop
        },
        gap: { xs: 1.5, sm: 2 },
        mb: 3,
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
      {cardEntries.map(([key, item]) => {
        const title = keyTitleMap[key] || key.replace(/([A-Z])/g, " $1").trim();
        const growthNum = Number(item.growth || 0);
        const percentNum = Number(item.percentage || 0);
        const isUp = growthNum >= 0;

        return (
          <Paper
            key={key}
            elevation={0}
            sx={{
              p: 2.2,
              borderRadius: "16px",
              border: "1px solid #E5E7EB",
              bgcolor: "#FFFFFF",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top Row: Title + Custom Colored Backend Icon */}
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
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {title}
              </Typography>

              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: `${item.color || "#6B7280"}14`, // Light tinted background matching icon color
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {renderBackendIcon(item.icon, item.color)}
              </Box>
            </Box>

            {/* Middle Row: Large Value */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: "#111827",
                mb: 1.2,
                fontSize: { xs: "20px", sm: "24px" },
              }}
            >
              {item.formatted ?? item.value ?? 0}
            </Typography>

            {/* Bottom Row: Growth badge + Percentage of total */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, flexWrap: "wrap" }}>
              {growthNum !== 0 ? (
                <Chip
                  icon={
                    isUp ? (
                      <NorthEast sx={{ fontSize: "11px !important", color: "#017E53 !important" }} />
                    ) : (
                      <SouthEast sx={{ fontSize: "11px !important", color: "#EF4444 !important" }} />
                    )
                  }
                  label={`${isUp ? "+" : ""}${growthNum}%`}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "10.5px",
                    fontWeight: 700,
                    bgcolor: isUp ? "#ECFDF5" : "#FEF2F2",
                    color: isUp ? "#017E53" : "#EF4444",
                    borderRadius: "6px",
                    px: 0.5,
                    "& .MuiChip-icon": {
                      ml: "4px",
                      mr: "-2px",
                    },
                  }}
                />
              ) : null}

              {percentNum > 0 && (
                <Typography
                  variant="caption"
                  sx={{ color: "#94A3B8", fontSize: "11px", fontWeight: 600 }}
                >
                  ({item.percentage}%)
                </Typography>
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default VerificationStats;