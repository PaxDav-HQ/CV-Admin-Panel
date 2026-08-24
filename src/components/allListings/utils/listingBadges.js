import React from "react";
import { Chip } from "@mui/material";
import {
  CheckCircleOutlined,
  HourglassEmptyOutlined,
  CancelOutlined,
  ReportProblemOutlined,
} from "@mui/icons-material";

export const getTypeChip = (type) => {
  const config = {
    property: { bg: "#F9FAFB", color: "#6B7280", label: "House" },
    house: { bg: "#F9FAFB", color: "#6B7280", label: "House" },
    hostel: { bg: "#EFF6FF", color: "#1D4ED8", label: "Hostel" },
    hotel: { bg: "#FFFBEB", color: "#D97706", label: "Hotel" },
    event_center: { bg: "#FAF5FF", color: "#9333EA", label: "Event Center" },
    service: { bg: "#FFF1F2", color: "#E11D48", label: "Service" },
  };
  const style = config[type?.toLowerCase()] || {
    bg: "#F9FAFB",
    color: "#6B7280",
    label: type || "Listing",
  };
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: "6px" }}
    />
  );
};

export const getCategoryChip = (category) => {
  const config = {
    shortlet: { bg: "#ECFDF5", color: "#047857", label: "Shortlet" },
    "for sale": { bg: "#E0F2FE", color: "#0369A1", label: "For Sale" },
    "for rent": { bg: "#EFF6FF", color: "#1D4ED8", label: "For Rent" },
  };
  const style = config[category?.toLowerCase()] || {
    bg: "#F9FAFB",
    color: "#6B7280",
    label: category || "Category",
  };
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: "6px" }}
    />
  );
};

export const getStatusChip = (status) => {
  const config = {
    active: { bg: "#ECFDF5", color: "#047857", label: "Active", icon: <CheckCircleOutlined /> },
    draft: { bg: "#F3F4F6", color: "#6B7280", label: "Draft", icon: <HourglassEmptyOutlined /> },
    pending: { bg: "#FFFBEB", color: "#D97706", label: "Pending", icon: <HourglassEmptyOutlined /> },
    rejected: { bg: "#FEF2F2", color: "#B91C1C", label: "Rejected", icon: <CancelOutlined /> },
    reported: { bg: "#FFF1F2", color: "#E11D48", label: "Reported", icon: <ReportProblemOutlined /> },
  };
  const style = config[status?.toLowerCase()] || {
    bg: "#F9FAFB",
    color: "#6B7280",
    label: status || "Status",
  };
  return (
    <Chip
      label={style.label}
      icon={style.icon}
      size="small"
      sx={{
        bgcolor: style.bg,
        color: style.color,
        fontWeight: 700,
        borderRadius: "10px",
        fontSize: "12px",
      }}
    />
  );
};