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
  Avatar,
  Chip,
  Button,
  Checkbox,
  TextField,
  Pagination,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";

const formatNaira = (amt) =>
  Number(amt || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

const maskAccount = (num) => {
  if (!num || num.length < 4) return num;
  return `****${num.slice(-4)}`;
};

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return { label: "PENDING", bgcolor: "#FFFBEB", color: "#B45309" };
    case "success":
    case "approved":
    case "paid":
      return { label: "APPROVED", bgcolor: "#ECFDF5", color: "#017E53" };
    case "reversed":
      return { label: "REVERSED", bgcolor: "#FEF2F2", color: "#DC2626" };
    case "rejected":
    case "failed":
      return { label: "REJECTED", bgcolor: "#FEF2F2", color: "#DC2626" };
    default:
      return { label: status?.toUpperCase(), bgcolor: "#F1F5F9", color: "#475569" };
  }
};

const PayoutTable = ({
  data = [],
  loading,
  selectedId,
  isDrawerOpen,
  onRowClick,
  searchQuery,
  onSearchChange,
  pagination,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  const totalItems = pagination?.total || 0;
  const currentPage = pagination?.page || 1;
  const itemsPerPage = limit || pagination?.limit || 20;

  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #E5E7EB",
        bgcolor: "#FFFFFF",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden", // Cuts off bleed to outer layout
      }}
    >
      {/* 1. Header Toolbar (wraps cleanly on mobile) */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", fontSize: "15px" }}>
            Withdrawal Queue
          </Typography>
          <Chip
            label={`${data.length} NEW`}
            size="small"
            sx={{
              bgcolor: "#ECFDF5",
              color: "#017E53",
              fontWeight: 800,
              fontSize: "10px",
              height: 20,
              borderRadius: "6px",
            }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: { xs: "100%", sm: "auto" } }}>
          <TextField
            size="small"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ fontSize: 18, color: "#9CA3AF", mr: 1 }} />,
            }}
            sx={{
              flex: { xs: 1, sm: "unset" },
              width: { xs: "100%", sm: 220 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                bgcolor: "#F8FAFC",
                fontSize: "12.5px",
              },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              color: "#475569",
              borderColor: "#E2E8F0",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* 2. Isolated Scrollable Table Container */}
      <TableContainer
        sx={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto", // Keeps horizontal scrolling strictly inside the table
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: "#F9FAFB" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox size="small" />
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>
                REQUEST ID / DATE
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>
                AGENT
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>
                AMOUNT (₦)
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>
                BANK (MASKED)
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>
                STATUS
              </TableCell>
              <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", whiteSpace: "nowrap" }}>
                ACTION
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={24} sx={{ color: "#017E53" }} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#9CA3AF" }}>
                  No payout requests found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const isSelected = selectedId === row.id && isDrawerOpen;
                const badge = getStatusBadge(row.status);

                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => onRowClick(row)}
                    sx={{
                      cursor: "pointer",
                      bgcolor: isSelected ? "#F0FDF4" : "transparent",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox size="small" checked={isSelected} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                        {row.reference?.slice(0, 14)}...
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                        {row.created_at?.split(" ")[0]}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "#017E53",
                            fontSize: "12px",
                            fontWeight: 700,
                          }}
                        >
                          {row.firstname?.[0]}
                          {row.lastname?.[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "13px" }}>
                            {row.firstname} {row.lastname}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            {row.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell sx={{ fontWeight: 800, color: "#0F172A", fontSize: "13.5px", whiteSpace: "nowrap" }}>
                      {formatNaira(row.amount)}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", fontSize: "13px" }}>
                        {row.bank_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                        {maskAccount(row.account_number)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={badge.label}
                        size="small"
                        sx={{
                          bgcolor: badge.bgcolor,
                          color: badge.color,
                          fontWeight: 800,
                          fontSize: "10px",
                          borderRadius: "6px",
                          height: 22,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => onRowClick(row)}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: 700,
                          borderColor: "#E5E7EB",
                          color: "#374151",
                          px: 2,
                          "&:hover": {
                            borderColor: "#017E53",
                            color: "#017E53",
                            bgcolor: "#F0FDF4",
                          },
                        }}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 3. Pagination Footer (responsive wrap) */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        <Typography variant="body2" sx={{ color: "#6B7280", fontSize: { xs: "12px", sm: "13px" } }}>
          Showing <strong>{from} - {to}</strong> of <strong>{totalItems}</strong> requests
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "12px" }}>
              Rows:
            </Typography>
            <FormControl size="small">
              <Select
                value={itemsPerPage}
                onChange={(e) => onLimitChange(Number(e.target.value))}
                sx={{
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  height: "30px",
                  "& .MuiSelect-select": { py: 0.4, px: 1 },
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, p) => onPageChange(p)}
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
      </Box>
    </Paper>
  );
};

export default PayoutTable;