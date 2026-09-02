import React from "react";
import { Chip } from "@mui/material";
import {
  CheckCircleOutlined,
  HourglassEmptyOutlined,
  CancelOutlined,
  ReportProblemOutlined,
} from "@mui/icons-material";

// Helper to convert "event_center" or "for rent" -> "Event Center", "For Rent"
export const capitalizeLabel = (text) => {
  if (!text) return "—";
  return String(text)
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getTypeChip = (type) => {
  const normalized = type?.toLowerCase();
  const label = capitalizeLabel(type);

  const config = {
    property: { bg: "#F9FAFB", color: "#6B7280" },
    house: { bg: "#F9FAFB", color: "#6B7280" },
    hostel: { bg: "#EFF6FF", color: "#1D4ED8" },
    hotel: { bg: "#FFFBEB", color: "#D97706" },
    event_center: { bg: "#FAF5FF", color: "#9333EA" },
    service: { bg: "#FFF1F2", color: "#E11D48" },
    land: { bg: "#ECFDF5", color: "#047857" },
  };

  const style = config[normalized] || { bg: "#F9FAFB", color: "#6B7280" };

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        borderRadius: "6px",
        fontSize: "11px",
      }}
    />
  );
};

export const getCategoryChip = (category) => {
  const normalized = category?.toLowerCase();
  const label = capitalizeLabel(category);

  const config = {
    shortlet: { bg: "#ECFDF5", color: "#047857" },
    sale: { bg: "#E0F2FE", color: "#0369A1" },
    "for sale": { bg: "#E0F2FE", color: "#0369A1" },
    rent: { bg: "#EFF6FF", color: "#1D4ED8" },
    "for rent": { bg: "#EFF6FF", color: "#1D4ED8" },
  };

  const style = config[normalized] || { bg: "#F9FAFB", color: "#6B7280" };

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        borderRadius: "6px",
        fontSize: "11px",
      }}
    />
  );
};

export const getStatusChip = (status) => {
  const label = capitalizeLabel(status);
  const config = {
    active: { bg: "#ECFDF5", color: "#047857", icon: <CheckCircleOutlined sx={{ fontSize: "14px !important" }} /> },
    draft: { bg: "#F3F4F6", color: "#6B7280", icon: <HourglassEmptyOutlined sx={{ fontSize: "14px !important" }} /> },
    pending: { bg: "#FFFBEB", color: "#D97706", icon: <HourglassEmptyOutlined sx={{ fontSize: "14px !important" }} /> },
    rejected: { bg: "#FEF2F2", color: "#B91C1C", icon: <CancelOutlined sx={{ fontSize: "14px !important" }} /> },
    reported: { bg: "#FFF1F2", color: "#E11D48", icon: <ReportProblemOutlined sx={{ fontSize: "14px !important" }} /> },
  };

  const style = config[status?.toLowerCase()] || { bg: "#F9FAFB", color: "#6B7280" };

  return (
    <Chip
      label={label}
      icon={style.icon}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        borderRadius: "10px",
        fontSize: "11.5px",
        "& .MuiChip-icon": { color: "inherit" },
      }}
    />
  );
};