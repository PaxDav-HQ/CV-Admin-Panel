import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { 
  Box, Typography, Button, TextField, MenuItem, Select, FormControl, 
  Avatar, Chip, IconButton, Menu, MenuItem as MuiMenuItem,
  Pagination, CircularProgress, Paper, InputAdornment, 
  Stack
} from "@mui/material";
import { 
  Search, FileDownloadOutlined, Add, MoreVert, 
  VisibilityOutlined, EditOutlined, CheckCircleOutlined, 
  Block, PersonRemoveOutlined, LockReset, DeleteOutlined, GroupOutlined,
  PeopleAltOutlined, ManageAccountsOutlined, SupervisedUserCircleOutlined
} from "@mui/icons-material";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions  
} from "@mui/material";


const ManageUsers = () => {
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem("userToken");
  // Inside ManageUsers component:
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    actionType: "",
    title: "",
    description: "",
    confirmColor: "primary",
    loading: false
  });
  
  // Trigger Confirmation Modal
  const handleSelectAction = (actionType) => {  
    const displayName = selectedUser?.full_name || "this user";

    const modalConfigs = {
      suspend: {
        title: "Suspend User Account?",
        description: `Are you sure you want to suspend ${displayName}? They will lose portal access until reinstated.`,
        confirmColor: "warning"
      },
      reinstate: {
        title: "Reinstate User Account?",
        description: `Restore active access permissions for ${displayName}?`,
        confirmColor: "primary"
      },
      delete: {
        title: "Delete User Permanently?",
        description: `This action cannot be undone. All listings and profile records for ${displayName} will be permanently removed.`,
        confirmColor: "error"
      }
    };

    if (modalConfigs[actionType]) {
      setConfirmModal({
        open: true,
        actionType,
        ...modalConfigs[actionType],
        loading: false
      });
    }
  };

  // Execute API Calls
  const handleConfirmAction = () => {
    if (!selectedUser) return;
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    };

    let requestPromise;

    if (confirmModal.actionType === "suspend" || confirmModal.actionType === "reinstate") {
      requestPromise = axios.patch(
        `${uri}admin/account/suspend`,
        {
          accountId: selectedUser.id,
          suspended: confirmModal.actionType === "suspend"
        },
        config
      );
    } else if (confirmModal.actionType === "delete") {
      requestPromise = axios.delete(`${uri}admin/users/${selectedUser.id}`, config);
    }

    if (requestPromise) {
      requestPromise
        .then(() => {
          fetchUsersAndStats();
          setConfirmModal({ open: false, actionType: "", title: "", description: "", confirmColor: "primary", loading: false });
          // setSelectedUser(null);
          setAnchorEl(null);
        })
        .catch((err) => {
          console.error(`Failed executing ${confirmModal.actionType}:`, err);
          setConfirmModal((prev) => ({ ...prev, loading: false }));
        });
    }
  };

  // Table & Pagination States
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    total_users: { count: 0, change: 0 },
    clients: { count: 0, change: 0 },
    service_providers: { count: 0, change: 0 },
    agents: { count: 0, change: 0 },
    banned_users: { count: 0, change: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [limit, setLimit] = useState(10);

  // Filters State
  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("All");
  const [status, setStatus] = useState("All");

  // Temporary Filters (Applied on clicking "Filter")
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    userType: "All",
    status: "All"
  });

  // Popover Action Menu States
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Helper function to format ISO dates into Date and Time strings
  const formatDateTime = (dateString) => {
    if (!dateString) return { date: "—", time: "" };
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return { date: dateString, time: "" };

    const date = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const time = dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
    return { date, time };
  };

  // Fetch Users & Statistics
  const fetchUsersAndStats = useCallback(() => {
    setLoading(true);
    
    // Map frontend filter selections to API schema query params
    const roleMapping = {
      Client: "customer",
      Agent: "agent",
      "Service Provider": "service_provider",
      Admin: "admin"
    };

    const params = {
      page,
      limit,
      q: activeFilters.search ? activeFilters.search : undefined,
      role: activeFilters.userType !== "All" ? (roleMapping[activeFilters.userType] || activeFilters.userType.toLowerCase()) : undefined,
      suspended: activeFilters.status === "Suspended" ? true : (activeFilters.status === "Active" ? false : undefined),
    };

    axios.get(`${uri}admin/users`, {
      params,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        // Map backend response structures
        setUsers(res.data.data || []);
        
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalEntries(res.data.pagination.totalItems || 0);
        }
        
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user directory:", err);
        setLoading(false);
      });
  }, [uri, token, page, limit, activeFilters]);

  useEffect(() => {
    fetchUsersAndStats();
  }, [fetchUsersAndStats]);

  // Handle Action Filters
  const handleApplyFilters = () => {
    setPage(1);
    setActiveFilters({ search, userType, status });
  };

  const handleResetFilters = () => {
    setSearch("");
    setUserType("All");
    setStatus("All");
    setPage(1);
    setActiveFilters({ search: "", userType: "All", status: "All" });
  };

  // Action Menu Handlers
  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleUserAction = (actionType) => {
    if (!selectedUser) return;
    
    axios.patch(`${uri}admin/users/${selectedUser.id}/action`, 
      { action: actionType },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(() => {
        fetchUsersAndStats();
        handleCloseMenu();
      })
      .catch((err) => {
        console.error(`Failed to execute action ${actionType}:`, err);
      });
  };

  // Styled Chip Helpers for Types & Statuses
  const getTypeChip = (role) => {
    const normalized = role?.toLowerCase();
    const config = {
      customer: { bg: "#F3F4F6", color: "#1F2937", label: "Client" },
      client: { bg: "#F3F4F6", color: "#1F2937", label: "Client" },
      service_provider: { bg: "#ECFDF5", color: "#047857", label: "Service Provider" },
      "service provider": { bg: "#ECFDF5", color: "#047857", label: "Service Provider" },
      agent: { bg: "#EFF6FF", color: "#1D4ED8", label: "Agent" },
      admin: { bg: "#FEF3C7", color: "#92400E", label: "Admin" },
      super_admin: { bg: "#EDE9FE", color: "#5B21B6", label: "Super Admin" }
    };
    const style = config[normalized] || { bg: "#F3F4F6", color: "#1F2937", label: role || "User" };
    return <Chip label={style.label} size="small" sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: "6px" }} />;
  };

  const getStatusChip = (user) => {
    const isSuspended = user?.suspended || user?.is_suspended;
    const isBanned = user?.banned || user?.is_banned || user?.status?.toLowerCase() === "banned";
    
    let bg = "#ECFDF5", color = "#047857", label = "Active";
    if (isBanned) {
      bg = "#FEF2F2"; color = "#B91C1C"; label = "Banned";
    } else if (isSuspended) {
      bg = "#FFFBEB"; color = "#B45309"; label = "Suspended";
    }
    return <Chip label={label} size="small" sx={{ bgcolor: bg, color, fontWeight: 700, borderRadius: "6px" }} />;
  };

  const getVerificationChip = (user) => {
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
          borderRadius: "6px" 
        }} 
      />
    );
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}>
            Manage Users
          </Typography>
        </div>
        {/* <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            sx={{ textTransform: "none", color: "#374151", borderColor: "#D1D5DB", fontWeight: 600, borderRadius: "10px", px: 3 }}
          >
            Export Users
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ textTransform: "none", bgcolor: "#111827", color: "#fff", fontWeight: 600, borderRadius: "10px", px: 3, "&:hover": { bgcolor: "#1F2937" } }}
          >
            Add New User
          </Button>
        </Stack> */}
      </div>

      {/* METRICS ROW CARDS */}
      <div className="row g-3 mb-4">
        {[
          { 
            label: "TOTAL USERS", 
            value: metrics?.total_users?.count ?? 0, 
            pct: `${metrics?.total_users?.change >= 0 ? "+" : ""}${metrics?.total_users?.change ?? 0}%`, 
            color: "#3B82F6", 
            icon: <GroupOutlined />,
            isNeg: (metrics?.total_users?.change ?? 0) < 0
          },
          { 
            label: "CLIENTS", 
            value: metrics?.clients?.count ?? 0, 
            pct: `${metrics?.clients?.change >= 0 ? "+" : ""}${metrics?.clients?.change ?? 0}%`, 
            color: "#10B981", 
            icon: <PeopleAltOutlined />,
            isNeg: (metrics?.clients?.change ?? 0) < 0
          },
          { 
            label: "SERVICE PROVIDERS", 
            value: metrics?.service_providers?.count ?? 0, 
            pct: `${metrics?.service_providers?.change >= 0 ? "+" : ""}${metrics?.service_providers?.change ?? 0}%`, 
            color: "#8B5CF6", 
            icon: <ManageAccountsOutlined />,
            isNeg: (metrics?.service_providers?.change ?? 0) < 0
          },
          { 
            label: "AGENTS", 
            value: metrics?.agents?.count ?? 0, 
            pct: `${metrics?.agents?.change >= 0 ? "+" : ""}${metrics?.agents?.change ?? 0}%`, 
            color: "#F59E0B", 
            icon: <SupervisedUserCircleOutlined />,
            isNeg: (metrics?.agents?.change ?? 0) < 0
          },
          { 
            label: "BANNED USERS", 
            value: metrics?.banned_users?.count ?? 0, 
            pct: `${metrics?.banned_users?.change >= 0 ? "+" : ""}${metrics?.banned_users?.change ?? 0}%`, 
            color: "#EF4444", 
            icon: <Block />, 
            isNeg: (metrics?.banned_users?.change ?? 0) > 0 
          }
        ].map((item, idx) => (
          <div key={idx} className="col-12 col-sm-6 col-lg-2.4 col-xl" style={{ flex: "1 0 18%" }}>
            <Paper elevation={0} className="p-3 border" sx={{ borderRadius: "16px" }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Box sx={{ p: 1, borderRadius: "50%", bgcolor: `${item.color}15`, color: item.color, display: "flex" }}>
                  {item.icon}
                </Box>
                <Typography variant="caption" sx={{ color: item.isNeg ? "#EF4444" : "#10B981", fontWeight: 700 }}>
                  {item.pct}
                </Typography>
              </div>
              <Typography variant="caption" className="text-muted fw-bold d-block mb-1">{item.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>{item.value?.toLocaleString() || 0}</Typography>
              <Typography variant="caption" className="text-muted">vs last month</Typography>
            </Paper>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTERS BOX */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label fw-bold text-muted small text-uppercase">Search User</label>
            <TextField
              fullWidth
              size="small"
              placeholder="Name, email, phone or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </div>
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label fw-bold text-muted small text-uppercase">User Type</label>
            <FormControl fullWidth size="small">
              <Select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="All">All Types</MenuItem>
                <MenuItem value="Client">Client</MenuItem>
                <MenuItem value="Agent">Agent</MenuItem>
                <MenuItem value="Service Provider">Service Provider</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-sm-6 col-md-2">
            <label className="form-label fw-bold text-muted small text-uppercase">Status</label>
            <FormControl fullWidth size="small">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                sx={{ borderRadius: "10px" }}
              >
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Suspended">Suspended</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-4 d-flex justify-content-md-end gap-2 mt-3">
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ textTransform: "none", borderColor: "#D1D5DB", color: "#374151", fontWeight: 600, borderRadius: "10px", py: 1, px: 3 }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{ textTransform: "none", bgcolor: "#111827", color: "#fff", fontWeight: 600, borderRadius: "10px", py: 1, px: 4, "&:hover": { bgcolor: "#1F2937" } }}
            >
              Filter
            </Button>
          </div>
        </div>
      </Paper>

      {/* USER DIRECTORY TABLE */}
      <Paper elevation={0} className="border" sx={{ borderRadius: "16px", overflow: "hidden" }}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827" }}>
            User Directory
          </Typography>
          <Typography variant="caption" className="text-muted fw-medium">
            Showing {totalEntries > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} users
          </Typography>
        </div>

        <div className="table-responsive" style={{ width: "100%", overflowX: "auto" }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CircularProgress sx={{ color: "#22C55E" }} />
            </div>
          ) : (
            <table className="table align-middle mb-0 text-nowrap" style={{ minWidth: "1100px" }}>
              <thead className="table-light">
                <tr className="text-uppercase text-muted fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3">Contact Information</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Verification</th>
                  <th className="py-3">Joined Date</th>
                  <th className="py-3">Last Active</th>
                  <th className="py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted fw-medium">
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const joined = formatDateTime(user.joined_date);
                    const lastActive = formatDateTime(user.last_active_raw || user.last_active);
                    const displayName = user.full_name || user.name || `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Unnamed User";

                    return (
                      <tr key={user.id} className="hover-row">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <Avatar src={user.avatar || user.profile_picture || user.image} sx={{ width: 42, height: 42 }}>
                              {displayName.charAt(0)}
                            </Avatar>
                            <div>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
                                {displayName}
                              </Typography>
                              <Typography variant="caption" className="text-muted">
                                ID: {user.userId || `USR-${String(user.id).padStart(5, "0")}`}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="fw-medium text-dark">{user.email || "—"}</div>
                            <div className="text-muted">{user.phone_number || user.phone || "—"}</div>
                          </div>
                        </td>
                        <td>{getTypeChip(user.role || user.type)}</td>
                        <td>{getStatusChip(user)}</td>
                        <td>{getVerificationChip(user)}</td>
                        <td>
                          <div className="small">
                            <div className="fw-semibold text-dark">{joined.date}</div>
                            <div className="text-muted" style={{ fontSize: "11px" }}>{joined.time}</div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="fw-semibold text-dark">{lastActive.date}</div>
                            <div className="text-muted" style={{ fontSize: "11px" }}>{lastActive.time}</div>
                          </div>
                        </td>
                        <td className="text-end px-4">
                          <IconButton size="small" onClick={(e) => handleOpenMenu(e, user)}>
                            <MoreVert />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* BOTTOM PAGINATION CONTROLS */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top bg-white gap-3">
          <div className="d-flex align-items-center gap-2">
            <Typography variant="caption" className="text-muted fw-bold">SHOW</Typography>
            <Select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              size="small"
              sx={{ height: "32px", borderRadius: "8px", fontWeight: 700 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Typography variant="caption" className="text-muted fw-bold">ENTRIES</Typography>
          </div>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": { fontWeight: 700 },
              "& .Mui-selected": { bgcolor: "#111827 !important", color: "#fff" }
            }}
          />
        </div>
      </Paper>

      {/* ROW ACTION MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
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
                "& svg": { fontSize: "16px", color: "#9CA3AF" }
              }
            }
          }
        }}
      >
        {/* <MuiMenuItem onClick={() => { handleCloseMenu(); }}>
          <VisibilityOutlined /> View Profile
        </MuiMenuItem> */}

        {/* <MuiMenuItem onClick={() => { handleCloseMenu(); }}>
          <EditOutlined /> Edit User
        </MuiMenuItem> */}

        {/* ONLY SHOW VERIFY IF USER IS NOT YET VERIFIED */}
        {!(selectedUser?.verified ?? selectedUser?.is_verified) && (
          <MuiMenuItem onClick={() => handleSelectAction("verify")}>
            <CheckCircleOutlined sx={{ "&": { color: "#10B981 !important" } }} /> Verify / Approve
          </MuiMenuItem>
        )}

        {/* TOGGLE SUSPEND / UNSUSPEND */}
        {selectedUser?.suspended || selectedUser?.is_suspended ? (
          <MuiMenuItem onClick={() => handleSelectAction("unsuspend")}>
            <CheckCircleOutlined sx={{ "&": { color: "#10B981 !important" } }} /> Unsuspend User
          </MuiMenuItem>
        ) : (
          <MuiMenuItem onClick={() => handleSelectAction("suspend")}>
            <Block sx={{ "&": { color: "#F59E0B !important" } }} /> Suspend User
          </MuiMenuItem>
        )}

        {/* BAN USER */}
        {/* <MuiMenuItem onClick={() => handleSelectAction("ban")}>
          <PersonRemoveOutlined sx={{ "&": { color: "#EF4444 !important" } }} /> Ban User
        </MuiMenuItem> */}

        {/* <MuiMenuItem onClick={() => { handleCloseMenu(); }}>
          <LockReset /> Reset Password
        </MuiMenuItem> */}

        {/* DELETE USER */}
        <MuiMenuItem onClick={() => handleSelectAction("delete")} sx={{ color: "#EF4444 !important" }}>
          <DeleteOutlined sx={{ "&&": { color: "#EF4444" } }} /> Delete User
        </MuiMenuItem>
      </Menu>

      <Dialog
        open={confirmModal.open}
        onClose={() => !confirmModal.loading && setConfirmModal((prev) => ({ ...prev, open: false }))}
        PaperProps={{
          sx: { borderRadius: "16px", p: 1, maxWidth: "440px", width: "100%" }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "18px", color: "#111827", pb: 1 }}>
          {confirmModal.title}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText sx={{ color: "#4B5563", fontSize: "14px", lineHeight: 1.5 }}>
            {confirmModal.description}
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            variant="outlined"
            disabled={confirmModal.loading}
            onClick={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
            sx={{ textTransform: "none", borderColor: "#D1D5DB", color: "#374151", fontWeight: 600, borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmModal.confirmColor}
            disabled={confirmModal.loading}
            onClick={() => handleConfirmAction()}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              px: 3,
              bgcolor: confirmModal.confirmColor === "error" ? "#EF4444" : confirmModal.confirmColor === "warning" ? "#F59E0B" : "#111827",
              "&:hover": {
                bgcolor: confirmModal.confirmColor === "error" ? "#DC2626" : confirmModal.confirmColor === "warning" ? "#D97706" : "#1F2937"
              }
            }}
          >
            {confirmModal.loading ? <CircularProgress size={20} color="inherit" /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageUsers;