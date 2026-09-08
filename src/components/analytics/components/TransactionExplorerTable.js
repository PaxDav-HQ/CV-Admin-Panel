import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  Button,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";

const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "success":
      return { bgcolor: "#ECFDF5", color: "#017E53" };
    case "pending":
      return { bgcolor: "#FFFBEB", color: "#B45309" };
    case "failed":
      return { bgcolor: "#FEF2F2", color: "#DC2626" };
    default:
      return { bgcolor: "#F1F5F9", color: "#475569" };
  }
};

const TransactionExplorerTable = ({
  transactions = [],
  pagination,
  onPageChange,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Table Header Bar */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
            Raw Transaction Explorer
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {["all", "agent", "manual"].map((type) => (
              <Button
                key={type}
                size="small"
                onClick={() => onFilterChange(type)}
                sx={{
                  textTransform: "capitalize",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  bgcolor: activeFilter === type ? "#F1F5F9" : "transparent",
                  color: activeFilter === type ? "#0F172A" : "#64748B",
                }}
              >
                {type === "all" ? "All Txn" : `${type} txn`}
              </Button>
            ))}
          </Box>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<FilterList />}
          sx={{
            borderRadius: "8px",
            borderColor: "#E2E8F0",
            color: "#475569",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Filter Data
        </Button>
      </Box>

      {/* Table Body */}
      <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: "#F9FAFB" }}>
            <TableRow>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>TXN ID</TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>DATE</TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>USER</TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>PROPERTY</TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>AMOUNT</TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>COMMISSION</TableCell>
              <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>STATUS</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.map((row) => {
              const statusStyle = getStatusStyle(row.status);
              return (
                <TableRow key={row.id} hover sx={{ cursor: "pointer" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                    {row.reference || row.txn_id}
                  </TableCell>
                  <TableCell sx={{ color: "#64748B", fontSize: "12.5px" }}>
                    {row.date}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                    {row.user || row.user_name}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", fontSize: "13px" }}>
                    {row.property || row.property_title}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: "#0F172A", fontSize: "13px" }}>
                    {row.formatted_amount}
                  </TableCell>
                  <TableCell sx={{ color: "#017E53", fontWeight: 700, fontSize: "13px" }}>
                    {row.formatted_commission}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        ...statusStyle,
                        fontWeight: 800,
                        fontSize: "10px",
                        height: 22,
                        borderRadius: "6px",
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Bar */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "13px" }}>
          Showing <strong>{transactions.length}</strong> of{" "}
          <strong>{pagination?.total || 0}</strong> transactions
        </Typography>

        <Pagination
          count={pagination?.totalPages || pagination?.total_pages || 1}
          page={pagination?.page || pagination?.current_page || 1}
          onChange={(e, page) => onPageChange(page)}
          shape="rounded"
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
  );
};

export default TransactionExplorerTable;