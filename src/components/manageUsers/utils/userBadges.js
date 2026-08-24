import React from "react";
import { Chip } from "@mui/material";

export const getTypeChip = (role) => {
  const normalized = role?.toLowerCase();
  const config = {
    customer: { bg: "#F3F4F6", color: "#1F2937", label: "Client" },
    client: { bg: "#F3F4F6", color: "#1F2937", label: "Client" },
    agent: { bg: "#EFF6FF", color: "#1D4ED8", label: "Agent" },
    admin: { bg: "#FEF3C7", color: "#92400E", label: "Admin" },
    super_admin: { bg: "#EDE9FE", color: "#5B21B6", label: "Super Admin" },
  };
  const style = config[normalized] || {
    bg: "#F3F4F6",
    color: "#1F2937",
    label: role || "User",
  };
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: "6px" }}
    />
  );
};

export const getStatusChip = (user) => {
  const isSuspended = user?.suspended || user?.is_suspended;
  const isBanned =
    user?.banned || user?.is_banned || user?.status?.toLowerCase() === "banned";

  let bg = "#ECFDF5",
    color = "#047857",
    label = "Active";
  if (isBanned) {
    bg = "#FEF2F2";
    color = "#B91C1C";
    label = "Banned";
  } else if (isSuspended) {
    bg = "#FFFBEB";
    color = "#B45309";
    label = "Suspended";
  }
  return (
    <Chip
      label={label}
      size="small"
      sx={{ bgcolor: bg, color, fontWeight: 700, borderRadius: "6px" }}
    />
  );
};

export const getVerificationChip = (user) => {
  const isVerified = user?.verified ?? user?.is_verified ?? false;
  return (
    <Chip
      label={isVerified ? "Verified" : "Pending"}
      size="small"
      variant="outlined"
      sx={{
        borderColor: isVerified ? "#22C55E" : "#D1D5DB",
        color: isVerified ? "#22C55E" : "#6B7280",
        fontWeight: 700,
        borderRadius: "6px",
      }}
    />
  );
};