import React from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  VisibilityOutlined,
  EditOutlined,
  VerifiedOutlined,
  BlockOutlined,
  PersonOffOutlined,
  LockResetOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";

const ListingsActionMenu = ({ anchorEl, onClose, onAction }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            border: "1px solid #E5E7EB",
            minWidth: "190px",
            "& .MuiMenuItem-root": {
              py: 1,
              px: 2,
              fontSize: "12.5px",
              fontWeight: 600,
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              "& svg": { fontSize: "16px", color: "#9CA3AF" },
            },
          },
        },
      }}
    >
      <MenuItem onClick={() => onAction("view")}>
        <VisibilityOutlined /> View Property details
      </MenuItem>
      <MenuItem onClick={() => onAction("edit")}>
        <EditOutlined /> Edit Property
      </MenuItem>
      <MenuItem onClick={() => onAction("verify")}>
        <VerifiedOutlined sx={{ "&&": { color: "#10B981" } }} /> Verify / Approve
      </MenuItem>
      <MenuItem onClick={() => onAction("reject")}>
        <BlockOutlined sx={{ "&&": { color: "#F59E0B" } }} /> Reject Property
      </MenuItem>
      <MenuItem onClick={() => onAction("ban")}>
        <PersonOffOutlined sx={{ "&&": { color: "#EF4444" } }} /> Ban agent
      </MenuItem>
      <MenuItem onClick={() => onAction("reset_password")}>
        <LockResetOutlined /> Reset Password
      </MenuItem>
      <MenuItem
        onClick={() => onAction("delete")}
        sx={{ color: "#EF4444 !important" }}
      >
        <DeleteOutlineOutlined sx={{ "&&": { color: "#EF4444" } }} /> Delete Property
      </MenuItem>
    </Menu>
  );
};

export default ListingsActionMenu;