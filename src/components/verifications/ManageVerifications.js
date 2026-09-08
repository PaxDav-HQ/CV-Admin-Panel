import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { Search, FileDownloadOutlined } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";

import VerificationStats from "./components/VerificationStats";
import VerificationTable from "./components/VerificationTable";
import VerificationDrawer from "./components/VerificationDrawer";

const ManageVerifications = () => {
  const uri = useSelector((state) => state.UriReducer?.uri);
  const token = sessionStorage.getItem("userToken");

  const [verifications, setVerifications] = useState([]);
  const [analyticsStats, setAnalyticsStats] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);

  // Drawer / Selection state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchVerifications(1, limit);
  }, [userTypeFilter, statusFilter, limit]);

  const fetchVerifications = async (page = 1, currentLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${uri}admin/verifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: currentLimit,
          userType: userTypeFilter !== "all" ? userTypeFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        },
      });

      setVerifications(res.data?.data || []);
      setAnalyticsStats(res.data?.analytics?.stats || null);

      if (res.data?.pagination) {
        setPagination({
          currentPage: res.data.pagination.currentPage,
          totalPages: res.data.pagination.totalPages,
          totalItems: res.data.pagination.totalItems,
          itemsPerPage: res.data.pagination.itemsPerPage,
        });
      }
    } catch (err) {
      console.error("Failed to load verifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    fetchVerifications(1, newLimit);
  };

  const filteredVerifications = useMemo(() => {
    if (!searchQuery.trim()) return verifications;
    return verifications.filter(
      (item) =>
        item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(item.id).includes(searchQuery)
    );
  }, [verifications, searchQuery]);

  const handleDecision = async (decision, notes) => {
    if (!selectedVerification) return;
    try {
      setActionLoading(true);
      await axios.patch(`${uri}admin/verifications/${selectedVerification.id}`, {
        status: decision,
        reason: notes,
      });

      setVerifications((prev) =>
        prev.map((item) =>
          item.id === selectedVerification.id
            ? { ...item, verification: { ...item.verification, status: decision, reason: notes } }
            : item
        )
      );
      setIsDrawerOpen(false);
    } catch (err) {
      console.error(`Failed to ${decision} verification:`, err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      {/* Top Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2.5,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <div>
          <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase" }}>
            HOME • USERS • VERIFICATIONS
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827" }}>
            Manage Verifications
          </Typography>
        </div>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search by name, ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ fontSize: 18, color: "#9CA3AF", mr: 1 }} />,
            }}
            sx={{
              width: { xs: "100%", sm: 280 },
              "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#FFFFFF" },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              color: "#374151",
              borderColor: "#E5E7EB",
              bgcolor: "#FFFFFF",
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              bgcolor: "#017E53",
              fontWeight: 700,
              "&:hover": { bgcolor: "#016744" },
            }}
          >
            Bulk Approve
          </Button>
        </Box>
      </Box>

      {/* Analytics Cards */}
      <VerificationStats stats={analyticsStats} />

      {/* Main Table */}
      <VerificationTable
        data={filteredVerifications}
        loading={loading}
        selectedId={selectedVerification?.id}
        isDrawerOpen={isDrawerOpen}
        onSelectRow={(row) => {
          setSelectedVerification(row);
          setIsDrawerOpen(true);
        }}
        userTypeFilter={userTypeFilter}
        setUserTypeFilter={setUserTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetFilters={() => {
          setUserTypeFilter("all");
          setStatusFilter("all");
          setSearchQuery("");
        }}
        pagination={pagination}
        onPageChange={(page) => fetchVerifications(page, limit)}
        limit={limit}
        onLimitChange={handleLimitChange}
      />

      {/* Slide-out Review Drawer */}
      <VerificationDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        verification={selectedVerification}
        onDecision={handleDecision}
        actionLoading={actionLoading}
      />
    </Box>
  );
};

export default ManageVerifications;