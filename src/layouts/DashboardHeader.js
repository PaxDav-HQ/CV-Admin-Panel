import React from "react";
import {
  Avatar,
  Badge,
  Divider,
  IconButton,
  Paper,
  Typography,
  Box,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useSelector } from "react-redux";

const DashboardHeader = () => {
  const currentUser = useSelector(
    (state) => state.UserReducer.userInfo
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderBottom: "1px solid #ECECEC",
        borderRadius: 0,
        background: "#fff",
        px: { xs: 2, md: 3 },
        py: 2,
        width: "100%", // Explicitly forces the wrapper to 100% width
      }}
    >
      {/* Replaced Bootstrap row with an MUI Box flex container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Left Section: Search Property (Hidden on mobile) */}
        <Box 
          sx={{ 
            display: { xs: "none", md: "flex" }, 
            alignItems: "center",
            flexGrow: 1, // Let it claim available space organically
            maxW: "400px" 
          }}
        >
          <div
            className="d-flex align-items-center px-3 w-100"
            style={{
              background: "#F6F7FB",
              borderRadius: "30px",
              height: 46,
            }}
          >
            <SearchIcon sx={{ color: "#9CA3AF", mr: 1 }} />
            <input
              className="form-control"
              placeholder="Search properties, agents or bookings..."
              style={{
                border: 0,
                outline: 0,
                background: "transparent",
                width: "100%",
                fontSize: 14,
              }}
            />
          </div>
        </Box>

        {/* Right Section: Location, Notifications & Profile Meta */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: { xs: 1.5, md: 3 }, // Clean gutters without relying on mt-3 margins
            flexGrow: { xs: 1, md: 0 },
          }}
        >
          {/* Location Wrapper */}
          <Box >
            <div
              className="d-flex align-items-center px-3 cursor-pointer"
              style={{
                background: "#F6F7FB",
                borderRadius: 25,
                height: 46,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              <LocationOnOutlinedIcon sx={{ mr: 1, fontSize: 18 }} />
              Lagos, NG
            </div>
          </Box>

          {/* Action Items Panel */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton>
              <Badge color="error" variant="dot">
                <NotificationsNoneOutlinedIcon />
              </Badge>
            </IconButton>
            
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ height: 28, mx: 1, alignSelf: "center" }} 
            />
          </Box>

          {/* User Data Metadata */}
          <Box sx={{ display: { xs: "none", md: "block" }, textAlign: "right" }}>
            <Typography fontWeight={700} fontSize={15} lineHeight={1.2}>
              {currentUser?.firstname} {currentUser?.lastname}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              Pro Member
            </Typography>
          </Box>

          {/* User Active Avatar Indicator */}
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            badgeContent={
              <span
                style={{
                  width: 11,
                  height: 11,
                  background: "#22C55E",
                  borderRadius: "50%",
                  border: "2px solid white",
                }}
              />
            }
          >
            <Avatar
              src={currentUser.avatar}
              sx={{
                width: 44,
                height: 44,
              }}
            />
          </Badge>
        </Box>
      </Box>
    </Paper>
  );
};

export default DashboardHeader;