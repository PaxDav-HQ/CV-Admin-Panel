import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import { PlaceOutlined } from "@mui/icons-material";
import ServiceActionMenu from "./ServiceActionMenu";

const getStatusBadge = (status) => {
  const map = {
    active: { bg: "#ECFDF5", color: "#10B981", dot: "#10B981" },
    pending: { bg: "#FFFBEB", color: "#D97706", dot: "#D97706" },
    rejected: { bg: "#FEF2F2", color: "#EF4444", dot: "#EF4444" },
    suspended: { bg: "#F3F4F6", color: "#6B7280", dot: "#6B7280" },
    banned: { bg: "#FEF2F2", color: "#DC2626", dot: "#DC2626" },
  };
  const style = map[status?.toLowerCase()] || map.pending;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: 1,
        py: 0.3,
        borderRadius: "20px",
        bgcolor: style.bg,
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: style.dot }} />
      <Typography sx={{ fontSize: "11px", fontWeight: 700, color: style.color, textTransform: "capitalize" }}>
        {status}
      </Typography>
    </Box>
  );
};

const formatDateInWords = (rawDate) => {
  if (!rawDate) return "N/A";
  
  const date = new Date(rawDate);
  if (isNaN(date.getTime())) return rawDate; // Fallback if invalid format

  return date.toLocaleDateString("en-US", {
    month: "short", // "Jan", "Feb", "Mar"
    day: "numeric",  // "14"
    year: "numeric", // "2026"
  });
};

const getCategoryChip = (category) => (
  <Chip
    label={category?.name || "Service"}
    size="small"
    sx={{
      bgcolor: "#F0FDF4",
      color: "#059669",
      fontWeight: 700,
      fontSize: "11px",
      borderRadius: "6px",
      textTransform: "capitalize",
    }}
  />
);

const ServicesTable = ({ services = [], onAction }) => {
  return (
    <TableContainer
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: "#F8FAFC" }}>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox size="small" />
            </TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>SERVICE</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>CATEGORY</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>TYPE</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>PROVIDER</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>LOCATION</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>PRICE</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>STATUS</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>AVAILABILITY</TableCell>
            <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>DATE CREATED</TableCell>
            <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: "#64748B", whiteSpace: "nowrap" }}>
              ACTIONS
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} align="center" sx={{ py: 6, color: "#94A3B8" }}>
                No services found.
              </TableCell>
            </TableRow>
          ) : (
            services.map((srv, idx) => (
              <TableRow key={`${srv.id}-${idx}`} hover sx={{ cursor: "pointer" }}>
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox size="small" />
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      component="img"
                      src={srv.main_photo || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=120"}
                      alt={srv.title}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "8px",
                        objectFit: "cover",
                        bgcolor: "#F1F5F9",
                        flexShrink: 0,
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: 800, color: "#0F172A", fontSize: "12.5px", whiteSpace: "normal" }}
                      >
                        {srv.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "11px" }}>
                        {srv.service_code}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>{getCategoryChip(srv.category)}</TableCell>

                <TableCell>
                  <Chip
                    label={srv.type}
                    size="small"
                    sx={{
                      bgcolor: srv.type === "One-time" ? "#ECFDF5" : "#EFF6FF",
                      color: srv.type === "One-time" ? "#10B981" : "#3B82F6",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      borderRadius: "6px",
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar src={srv.provider?.avatar} sx={{ width: 28, height: 28 }} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 700, color: "#0F172A", display: "block", whiteSpace: "nowrap", fontSize: "11px" }}
                      >
                        {srv.provider?.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "10px", whiteSpace: "nowrap" }}>
                        Service Provider
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748B" }}>
                    <PlaceOutlined sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontSize: "12px", maxWidth: 130 }} noWrap>
                      {srv.location}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#0F172A", fontSize: "12.5px" }}>
                    {srv.price?.formatted}
                  </Typography>
                </TableCell>

                <TableCell>{getStatusBadge(srv.status)}</TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      fontSize: "11px",
                      color: srv.availability === "Available" ? "#10B981" : "#D97706",
                    }}
                  >
                    {srv.availability}
                  </Typography>
                </TableCell>

                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  <Typography variant="caption" sx={{ color: "#64748B", fontSize: "11.5px" }}>
                    {formatDateInWords(srv.created_at)}
                  </Typography>
                </TableCell>

                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <ServiceActionMenu service={srv} onAction={onAction} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ServicesTable;