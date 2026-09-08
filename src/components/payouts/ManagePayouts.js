import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { FileDownloadOutlined, ArrowDropDown } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";

import PayoutStats from "./components/PayoutStats";
import PayoutTable from "./components/PayoutTable";
import PayoutDrawer from "./components/PayoutDrawer";

const ManagePayouts = () => {
  const uri = useSelector((state) => state.UriReducer?.uri);
  const token = sessionStorage.getItem("userToken");

  const [cards, setCards] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [limit, setLimit] = useState(10);

  // Drawer
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchPayouts(1, limit);
  }, [limit]);

  const fetchPayouts = async (page = 1, currentLimit = limit) => {
    try {
      setLoading(true);
      const res = await axios.get(`${uri}admin/payouts`, {
        params: { page, limit: currentLimit },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setCards(res.data?.cards || []);
      setPayouts(res.data?.data || []);

      if (res.data?.pagination) {
        setPagination({
          currentPage: res.data.pagination.currentPage || page,
          totalPages: res.data.pagination.totalPages || 1,
          totalItems: res.data.pagination.totalItems || res.data.data?.length || 0,
        });
      } else {
        setPagination({
          currentPage: page,
          totalPages: Math.ceil((res.data?.data?.length || 0) / currentLimit) || 1,
          totalItems: res.data?.data?.length || 0,
        });
      }
    } catch (err) {
      console.error("Failed to load payout data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayouts = useMemo(() => {
    if (!searchQuery.trim()) return payouts;
    const q = searchQuery.toLowerCase();
    return payouts.filter(
      (item) =>
        item.reference?.toLowerCase().includes(q) ||
        item.firstname?.toLowerCase().includes(q) ||
        item.lastname?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.bank_name?.toLowerCase().includes(q)
    );
  }, [payouts, searchQuery]);

  const handleAction = async (actionType, id, note = "") => {
    try {
      setActionLoading(true);
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      await axios.patch(
        `${uri}admin/payouts/${id}`,
        { action: actionType, note },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      const updatedStatus =
        actionType === "approve"
          ? "approved"
          : actionType === "reject"
          ? "rejected"
          : "paid";

      setPayouts((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: updatedStatus } : item
        )
      );

      if (selectedRequest?.id === id) {
        setSelectedRequest((prev) => ({ ...prev, status: updatedStatus }));
      }
      setIsDrawerOpen(false);
    } catch (err) {
      console.error(`Failed to perform ${actionType} on payout:`, err);
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
          alignItems: "flex-start",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", gap: 1, color: "#9CA3AF", fontSize: "12px", mb: 0.5, fontWeight: 700 }}>
            <span>Admin</span>
            <span>›</span>
            <span style={{ color: "#475569" }}>Withdrawals</span>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#0F172A", letterSpacing: "-0.5px" }}>
            Withdrawals & Payouts (Simplified)
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mt: 0.2 }}>
            Review and approve agent withdrawal requests for manual payout processing.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              color: "#374151",
              borderColor: "#E5E7EB",
              bgcolor: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            Export Requests
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowDropDown />}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              bgcolor: "#017E53",
              fontWeight: 700,
              boxShadow: "none",
              "&:hover": { bgcolor: "#016744" },
            }}
          >
            Bulk Actions
          </Button>
        </Box>
      </Box>

      {/* Metric Cards */}
      <PayoutStats cards={cards} />

      {/* Main Table */}
      <PayoutTable
        data={filteredPayouts}
        loading={loading}
        selectedId={selectedRequest?.id}
        isDrawerOpen={isDrawerOpen}
        onRowClick={(row) => {
          setSelectedRequest(row);
          setIsDrawerOpen(true);
        }}
        onInlineAction={(action, id) => handleAction(action, id)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pagination={pagination}
        onPageChange={(page) => fetchPayouts(page, limit)}
        limit={limit}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          fetchPayouts(1, newLimit);
        }}
      />

      {/* Drawer */}
      <PayoutDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        request={selectedRequest}
        onAction={handleAction}
        actionLoading={actionLoading}
      />
    </Box>
  );
};

export default ManagePayouts;