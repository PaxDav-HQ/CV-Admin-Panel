import React from "react";
import { Menu, MenuItem } from "@mui/material";
import {
  CheckCircleOutlined,
  Block,
  DeleteOutlined,
} from "@mui/icons-material";

const UserActionMenu = ({ anchorEl, selectedUser, onClose, onSelectAction }) => {
  const isAgent =
    selectedUser?.user_type === "Agent" || selectedUser?.role === "agent";
  const isSuspended = selectedUser?.suspended || selectedUser?.is_suspended;
  const isVerified =
    selectedUser?.verified ?? selectedUser?.is_verified ?? false;

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
            minWidth: "180px",
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
      {!isVerified && (
        <MenuItem onClick={() => onSelectAction("verify")}>
          <CheckCircleOutlined sx={{ "&": { color: "#10B981 !important" } }} />{" "}
          Verify / Approve
        </MenuItem>
      )}

      {isAgent && isSuspended ? (
        <MenuItem onClick={() => onSelectAction("unsuspend")}>
          <CheckCircleOutlined sx={{ "&": { color: "#10B981 !important" } }} />{" "}
          Unsuspend Agent
        </MenuItem>
      ) : isAgent && !isSuspended ? (
        <MenuItem onClick={() => onSelectAction("suspend")}>
          <Block sx={{ "&": { color: "#F59E0B !important" } }} /> Suspend Agent
        </MenuItem>
      ) : null}

      <MenuItem
        onClick={() => onSelectAction("delete")}
        sx={{ color: "#EF4444 !important" }}
      >
        <DeleteOutlined sx={{ "&&": { color: "#EF4444" } }} /> Delete User
      </MenuItem>
    </Menu>
  );
};

export default UserActionMenu;