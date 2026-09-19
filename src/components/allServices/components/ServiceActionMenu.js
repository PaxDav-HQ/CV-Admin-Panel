import React, { useState } from "react";
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import {
  MoreHoriz,
  EditOutlined,
  VerifiedUserOutlined,
  PauseCircleOutlined,
  BlockOutlined,
  DeleteOutlined,
} from "@mui/icons-material";

const ServiceActionMenu = ({ service, onAction }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (action) => {
    handleClose();
    if (onAction) onAction(action, service);
  };

  return (
    <>
      <IconButton size="small" onClick={handleClick} sx={{ color: "#64748B" }}>
        <MoreHoriz fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            minWidth: 160,
            py: 0.5,
          },
        }}
      >
        {/* <MenuItem onClick={() => handleSelect("edit")} sx={{ fontSize: "12.5px", py: 1 }}>
          <ListItemIcon><EditOutlined sx={{ fontSize: 16, color: "#475569" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "12.5px", fontWeight: 500 }}>
            Edit Service Details
          </ListItemText>
        </MenuItem> */}

        <MenuItem onClick={() => handleSelect("verify")} sx={{ fontSize: "12.5px", py: 1 }}>
          <ListItemIcon><VerifiedUserOutlined sx={{ fontSize: 16, color: "#10B981" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "12.5px", fontWeight: 500 }}>
            Verify / Approve
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleSelect("suspend")} sx={{ fontSize: "12.5px", py: 1 }}>
          <ListItemIcon><PauseCircleOutlined sx={{ fontSize: 16, color: "#F59E0B" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "12.5px", fontWeight: 500, color: "#F59E0B" }}>
            Suspend Service
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleSelect("ban")} sx={{ fontSize: "12.5px", py: 1 }}>
          <ListItemIcon><BlockOutlined sx={{ fontSize: 16, color: "#EF4444" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "12.5px", fontWeight: 500, color: "#EF4444" }}>
            Ban Service
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={() => handleSelect("delete")} sx={{ fontSize: "12.5px", py: 1 }}>
          <ListItemIcon><DeleteOutlined sx={{ fontSize: 16, color: "#EF4444" }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: "12.5px", fontWeight: 500, color: "#EF4444" }}>
            Delete Service
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default ServiceActionMenu;