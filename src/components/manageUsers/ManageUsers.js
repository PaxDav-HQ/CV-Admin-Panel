import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";

import { useManageUsers } from "./hooks/useManageUsers";
import UserMetricsCards from "./components/UserMetricsCards";
import UserFiltersBar from "./components/UserFiltersBar";
import UserDirectoryTable from "./components/UserDirectoryTable";
import UserActionMenu from "./components/UserActionMenu";
import UserConfirmModal from "./components/UserConfirmModal";

const ACTION_MODAL_CONFIGS = {
  suspend: {
    title: "Suspend User Account?",
    getDescription: (name) =>
      `Are you sure you want to suspend ${name}? They will lose portal access until reinstated.`,
    confirmColor: "warning",
  },
  unsuspend: {
    title: "Reinstate User Account?",
    getDescription: (name) =>
      `Restore active access permissions for ${name}?`,
    confirmColor: "primary",
  },
  delete: {
    title: "Delete User Permanently?",
    getDescription: (name) =>
      `This action cannot be undone. All listings and profile records for ${name} will be permanently removed.`,
    confirmColor: "error",
  },
  verify: {
    title: "Verify / Approve User?",
    getDescription: (name) =>
      `Are you sure you want to verify and approve ${name}? This will grant them full access to the platform.`,
    confirmColor: "primary",
  },
};

const ManageUsers = () => {
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem("userToken");

  const {
    users,
    metrics,
    loading,
    page,
    setPage,
    totalPages,
    totalEntries,
    limit,
    setLimit,
    search,
    setSearch,
    userType,
    setUserType,
    status,
    setStatus,
    applyFilters,
    resetFilters,
    fetchUsersAndStats,
  } = useManageUsers(uri, token);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    actionType: "",
    title: "",
    description: "",
    confirmColor: "primary",
    loading: false,
  });

  const handleOpenMenu = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleSelectAction = (actionType) => {
    const displayName = selectedUser?.full_name || "this user";
    const config = ACTION_MODAL_CONFIGS[actionType];

    if (config) {
      setConfirmModal({
        open: true,
        actionType,
        title: config.title,
        description: config.getDescription(displayName),
        confirmColor: config.confirmColor,
        loading: false,
      });
    }
  };

  const handleConfirmAction = () => {
    if (!selectedUser) return;
    setConfirmModal((prev) => ({ ...prev, loading: true }));

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    let requestPromise;
    if (confirmModal.actionType === "delete") {
      requestPromise = axios.delete(
        `${uri}admin/users/${selectedUser.id}`,
        config
      );
    } else if (
      confirmModal.actionType === "suspend" ||
      confirmModal.actionType === "unsuspend"      
    ) {
      requestPromise = axios.patch(
        `${uri}admin/account/suspend/`,
        {
          accountId: selectedUser.id,
          suspended: confirmModal.actionType === "suspend" ? true : false,
        },
        config
      );
    }

    if (requestPromise) {
      requestPromise
        .then(() => {
          fetchUsersAndStats();
          setConfirmModal({
            open: false,
            actionType: "",
            title: "",
            description: "",
            confirmColor: "primary",
            loading: false,
          });
          setAnchorEl(null);
        })
        .catch((err) => {
          console.error(`Failed executing ${confirmModal.actionType}:`, err);
          setConfirmModal((prev) => ({ ...prev, loading: false }));
        });
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}
    >
      <Box
        sx={{
          bgcolor: "#F9FAFB",
          minHeight: "100vh",
          py: 4,
          // px: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        {/* Header, Cards, Filters, Table */}
        {/* 1. Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}
          >
            Manage Users
          </Typography>
        </div>

        {/* 2. Metrics Cards */}
        <UserMetricsCards metrics={metrics} />

        {/* 3. Search & Filters Bar */}
        <UserFiltersBar
          search={search}
          setSearch={setSearch}
          userType={userType}
          setUserType={setUserType}
          status={status}
          setStatus={setStatus}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        {/* 4. Table & Pagination */}
        <UserDirectoryTable
          users={users}
          loading={loading}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalEntries={totalEntries}
          limit={limit}
          setLimit={setLimit}
          onOpenMenu={handleOpenMenu}
        />

        {/* 5. Floating Action Context Menu */}
        <UserActionMenu
          anchorEl={anchorEl}
          selectedUser={selectedUser}
          onClose={handleCloseMenu}
          onSelectAction={handleSelectAction}
        />

        {/* 6. Confirmation Modal */}
        <UserConfirmModal
          confirmModal={confirmModal}
          onClose={() =>
            setConfirmModal((prev) => ({ ...prev, open: false }))
          }
          onConfirm={handleConfirmAction}
        />
      </Box>
    </div>
  );
};

export default ManageUsers;