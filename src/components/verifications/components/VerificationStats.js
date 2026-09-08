import React from "react";
import { Box, Paper, Typography, Chip } from "@mui/material";
import {
  CheckCircleOutlined,
  Schedule,
  CancelOutlined,
  DescriptionOutlined,
  HistoryOutlined,
} from "@mui/icons-material";

const renderStatIcon = (iconName, color) => {
  const iconStyle = { color, fontSize: 20 };
  switch (iconName) {
    case "check-circle":
      return <CheckCircleOutlined sx={iconStyle} />;
    case "clock":
      return <Schedule sx={iconStyle} />;
    case "x-circle":
      return <CancelOutlined sx={iconStyle} />;
    case "file-text":
      return <DescriptionOutlined sx={iconStyle} />;
    default:
      return <HistoryOutlined sx={iconStyle} />;
  }
};

const VerificationStats = ({ stats }) => {
  if (!stats) return null;

  const { totalVerified, pendingReview, rejectedItems, documentsUploaded, avgReviewTime } = stats;

  const statCards = [
    { label: "TOTAL VERIFIED", ...totalVerified },
    { label: "PENDING REVIEW", ...pendingReview },
    { label: "REJECTED ITEMS", ...rejectedItems },
    { label: "DOCS UPLOADED", ...documentsUploaded },
    { label: "AVG. REVIEW TIME", ...avgReviewTime },
  ];

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 2, mb: 3 }}>
      {statCards.map((stat, i) => (
        <Paper key={i} elevation={0} sx={{ p: 2, borderRadius: "14px", border: "1px solid #E5E7EB", bgcolor: "#FFFFFF" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Box sx={{ p: 0.8, borderRadius: "8px", bgcolor: "#F3F4F6", display: "inline-flex" }}>
              {renderStatIcon(stat.icon, stat.color)}
            </Box>
            {stat.growth !== undefined && stat.growth !== 0 && (
              <Chip
                label={`${Number(stat.growth) > 0 ? "+" : ""}${stat.growth}%`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "10px",
                  fontWeight: 700,
                  bgcolor: Number(stat.growth) > 0 ? "#F0FDF4" : "#FEF2F2",
                  color: Number(stat.growth) > 0 ? "#017E53" : "#EF4444",
                }}
              />
            )}
          </Box>
          <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 700, fontSize: "11px" }}>
            {stat.label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", mt: 0.3 }}>
            {stat.formatted ?? stat.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
};

export default VerificationStats;