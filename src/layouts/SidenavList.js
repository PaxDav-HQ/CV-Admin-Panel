import React, { useState } from "react";
import { 
  DashboardOutlined, 
  PeopleAltOutlined,        // For Users
  ListAltOutlined,         // For Listings
  WorkOutlineOutlined,     // For Services
  CalendarTodayOutlined,   // For Bookings
  VerifiedUserOutlined,    // For Verification
  AccountBalanceWalletOutlined, // For Earnings & Transactions
  BarChartOutlined,        // For Reports & Analytics
  NotificationsNoneOutlined, // For Notifications
  SettingsOutlined,        // For Settings
  HistoryOutlined,
  LogoutOutlined,          // For Logout
  ExpandLess,              // Submenu open indicator
  ExpandMore               // Submenu closed indicator
} from "@mui/icons-material";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Collapse,
  Divider,
} from "@mui/material";

import { Link, useLocation, useNavigate } from "react-router-dom";
import CompanyLogo from "../assets/icon.png";

const SidenavList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. ADDED MISSING STATE MATRIX (Keeps 'Listings' expanded by default like your screenshot)
  const [openSubmenus, setOpenSubmenus] = useState({
    Listings: true,
  });

  const toggleSubmenu = (title) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const menus = [
    { title: "Dashboard", icon: <DashboardOutlined />, path: "/admin" },
    { title: "Users", icon: <PeopleAltOutlined />, path: "/admin/users" },
    { 
      title: "Listings", 
      icon: <ListAltOutlined />, 
      path: "/admin/listings",
      children: [
        { title: "All Listings", path: "/admin/listings/all" },
        { title: "Add New Listing", path: "/admin/property-types" }
      ]
    },
    // { title: "Services", icon: <WorkOutlineOutlined />, path: "/admin/services" },
    // { title: "Bookings", icon: <CalendarTodayOutlined />, path: "/admin/bookings" },
    { title: "Verification", icon: <VerifiedUserOutlined />, path: "/admin/verification" },
    { title: "Payouts", icon: <AccountBalanceWalletOutlined />, path: "/admin/payouts" },
    { title: "Reports & Analytics", icon: <BarChartOutlined />, path: "/admin/analytics" },
    // { title: "Notifications", icon: <NotificationsNoneOutlined />, path: "/admin/notifications" },
    // { title: "Settings", icon: <SettingsOutlined />, path: "/admin/settings" },
    // { title: "System Logs", icon: <HistoryOutlined />, path: "/admin/system-logs" }
  ];

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Box
      className="bg-sidebar"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "100vh",
        bgcolor: "#011c0e" // Dark green admin backdrop custom hex
      }}
    >
      {/* Brand Profile Row */}
      <div className="d-flex align-items-center justify-content-start py-3 px-4">
        <div>
          <img src={CompanyLogo} alt="Company Logo" width="45px" height="45px" style={{ objectFit: "contain" }} />
        </div>
        <div onClick={() => navigate('/')} className="d-flex flex-column align-items-start ms-3" style={{ cursor: "pointer" }}>
          <p className="text-white fw-bold fs-5 mb-0" style={{ lineHeight: 1.2 }}>
            CV Properties
          </p>
          <p className="text-white-50 mb-0" style={{ fontSize: "12px" }}>
            Admin Panel
          </p>
        </div>
      </div>
      
      <Divider sx={{ opacity: 0.1, bgcolor: "#fff" }} />
      
      {/* Top Menu Container */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", px: 1.5 }}> 
        <List sx={{ mt: 2 }} disablePadding>
          {menus.map((menu) => {
            const hasChildren = menu.children && menu.children.length > 0;
            const isSubmenuOpen = !!openSubmenus[menu.title];
            
            // Check active state safely: direct match or nested path child match
            const isDirectActive = location.pathname === menu.path;
            const isParentActive = hasChildren && location.pathname.startsWith(menu.path);
            const active = isDirectActive || isParentActive;

            return (
              // Use React.Fragment instead of grouping inside structural standard ListItems
              <React.Fragment key={menu.title}>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={hasChildren ? () => toggleSubmenu(menu.title) : () => navigate(menu.path)}
                    sx={{
                      borderRadius: "12px",
                      py: 1.2,
                      px: 2,
                      bgcolor: isDirectActive ? "#23663E" : "transparent",
                      color: active ? "#fff" : "#B8C4B8",
                      "&:hover": {
                        bgcolor: isDirectActive ? "#23663E" : "rgba(255,255,255,0.04)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: active ? "#fff" : "#B8C4B8", minWidth: 38 }}>
                      {menu.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={menu.title}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: active ? 600 : 400,
                      }}
                    />
                    {/* Render indicator toggle arrows for active folder nodes */}
                    {hasChildren && (isSubmenuOpen ? <ExpandLess sx={{ fontSize: 18 }} /> : <ExpandMore sx={{ fontSize: 18 }} />)}
                  </ListItemButton>
                </ListItem>

                {/* 2. RE-ANCHORED SUBMENU COLLAPSE BLOCK OUTSIDE PRIMARY ITEM WRAPPERS */}
                {hasChildren && (
                  <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 4, mb: 1 }}>
                      {menu.children.map((child) => {
                        const isChildActive = location.pathname === child.path;

                        return (
                          <ListItemButton
                            key={child.title}
                            component={Link}
                            to={child.path}
                            sx={{
                              py: 1,
                              px: 2,
                              borderRadius: "8px",
                              mb: 0.5,
                              bgcolor: isChildActive ? "rgba(255, 255, 255, 0.08)" : "transparent",
                              color: isChildActive ? "#ffffff" : "#B8C4B8",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.04)",
                                color: "#ffffff"
                              },
                            }}
                          >
                            <ListItemText 
                              primary={child.title} 
                              primaryTypographyProps={{ 
                                fontSize: "13px", 
                                fontWeight: isChildActive ? 600 : 400 
                              }} 
                            />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* Logout Row */}
      <Box sx={{ pb: 2, px: 1.5 }}>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: "12px",
                color: "#B8C4B8",
                py: 1.2,
                px: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.04)",
                  color: "#fff"
                },
              }}
            >
              <ListItemIcon sx={{ color: "#B8C4B8", minWidth: 38 }}>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: 14,
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default SidenavList;