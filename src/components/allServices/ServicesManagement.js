import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Pagination,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { Add, FileDownloadOutlined } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ServiceStatsCards from "./components/ServiceStatsCards";
import ServiceFilterBar from "./components/ServiceFilterBar";
import ServicesTable from "./components/ServicesTable";
import ServiceActionModal from "./components/ServiceActionModal";

const ServicesManagement = () => {
  const navigate = useNavigate();
  const uri = useSelector((state) => state.UriReducer?.uri);

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [statsCards, setStatsCards] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [filters, setFilters] = useState({
    q: "",
    category: "all",
    type: "all",
    status: "all",
    location: "",
    availability: "all",
    limit: 10,
    sortBy: "created_at",
    sortOrder: "desc",
  });

  const [modalState, setModalState] = useState({
    open: false,
    actionType: null,
    service: null,
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchServices(1);
  }, [filters.category, filters.type, filters.status, filters.availability]);

  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("userToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = {
        page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.q.trim() && { q: filters.q }),
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.type !== "all" && { type: filters.type }),
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.availability !== "all" && { availability: filters.availability }),
      };

      const res = await axios.get(`${uri}admin/services`, {
        params,
        headers,
      });

      setServices(res.data?.data || []);
      setStatsCards(res.data?.stats?.cards || []);
      if (res.data?.pagination) {
        setPagination({
          page: res.data.pagination.page,
          totalPages: res.data.pagination.totalPages,
          total: res.data.pagination.total,
        });
      }
    } catch (err) {
      console.error("Failed to load services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      q: "",
      category: "all",
      type: "all",
      status: "all",
      location: "",
      availability: "all",
      limit: 10,
      sortBy: "created_at",
      sortOrder: "desc",
    });
  };

  const handleAction = (actionType, service) => {
    if (actionType === "edit") {
      navigate(`/agent/services/edit/${service.id}`, { state: { serviceData: service } });
      return;
    }

    setModalState({
      open: true,
      actionType,
      service,
    });
  };

  const handleConfirmAction = async ({ serviceId, actionType, targetStatus, reason }) => {
    try {
      setActionLoading(true);
      const token = sessionStorage.getItem("userToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (actionType === "delete") {
        await axios.delete(`${uri}admin/services/${serviceId}`, { headers });
        setServices((prev) => prev.filter((s) => s.id !== serviceId));
        setPagination((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      } else {
        const payload = {
          status: targetStatus,
          reason: reason || "Administrative update",
        };

        await axios.patch(`${uri}admin/services/${serviceId}/status`, payload, { headers });

        setServices((prev) =>
          prev.map((s) => (s.id === serviceId ? { ...s, status: targetStatus } : s))
        );
      }

      setModalState({ open: false, actionType: null, service: null });
    } catch (err) {
      console.error(`Failed to execute ${actionType} on service:`, err);
      alert(err.response?.data?.message || "Operation failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    // <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
      <Box
        sx={{
          p: { xs: 1.5, sm: 2, md: 3 },
          bgcolor: "#F9FAFB",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden", // Locks horizontal page scroll
          boxSizing: "border-box",
        }}
      >
      {/* Top Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <div>
          <Breadcrumbs sx={{ fontSize: "12px", color: "#94A3B8", mb: 0.5 }}>
            <Link underline="hover" color="inherit" href="#">
              Dashboard
            </Link>
            <Link underline="hover" color="inherit" href="#">
              Services
            </Link>
            <Typography sx={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}>
              All Services
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "#0F172A", fontSize: { xs: "20px", sm: "24px" } }}
          >
            Services
          </Typography>
        </div>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: { xs: "100%", sm: "auto" } }}>
          {/* <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            fullWidth={{ xs: true, sm: false }}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "#E2E8F0",
              color: "#334155",
              bgcolor: "#FFFFFF",
              fontWeight: 700,
              fontSize: "12.5px",
              py: 0.9,
            }}
          >
            Export Services
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            fullWidth={{ xs: true, sm: false }}
            onClick={() => navigate("/agent/services/create")}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              bgcolor: "#017E53",
              fontWeight: 700,
              boxShadow: "none",
              fontSize: "12.5px",
              whiteSpace: "nowrap",
              py: 0.9,
              "&:hover": { bgcolor: "#016744", boxShadow: "none" },
            }}
          >
            Add New Service
          </Button> */}
        </Box>
      </Box>

      {/* Metric Cards */}
      <ServiceStatsCards cards={statsCards} />

      {/* Main Table Container */}
      {/* In ServicesManagement.jsx */}
<Paper
  elevation={0}
  sx={{
    borderRadius: "20px",
    border: "1px solid #E2E8F0",
    bgcolor: "#FFFFFF",
    overflow: "hidden",
    width: "100%",
  }}
>
  <ServiceFilterBar
    filters={filters}
    onFilterChange={handleFilterChange}
    onReset={handleResetFilters}
  />

  {loading ? (
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <CircularProgress sx={{ color: "#017E53" }} />
    </Box>
  ) : (
    <ServicesTable services={services} onAction={handleAction} />
  )}

  <Box
    sx={{
      p: 2,
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      justifyContent: "space-between",
      alignItems: "center",
      gap: 1.5,
      borderTop: "1px solid #F1F5F9",
    }}
  >
    <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
      Showing 1 to {services.length} of {pagination.total} services
    </Typography>

    <Pagination
      count={pagination.totalPages}
      page={pagination.page}
      onChange={(e, page) => fetchServices(page)}
      color="primary"
      size="small"
      sx={{
        "& .Mui-selected": {
          bgcolor: "#017E53 !important",
          color: "#FFFFFF",
        },
      }}
    />
  </Box>
</Paper>

      {/* Modal Dialog */}
      <ServiceActionModal
        open={modalState.open}
        onClose={() => setModalState({ open: false, actionType: null, service: null })}
        actionType={modalState.actionType}
        service={modalState.service}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
      />
    </Box>
  );
};

export default ServicesManagement;