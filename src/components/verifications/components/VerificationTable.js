import React from "react";
import {
  Box,
  Paper,
  Button,
  Avatar,
  Chip,
  Checkbox,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Typography,
} from "@mui/material";
import { FilterList } from "@mui/icons-material";

const VerificationTable = ({
  data,
  loading,
  selectedId,
  isDrawerOpen,
  onSelectRow,
  userTypeFilter,
  setUserTypeFilter,
  statusFilter,
  setStatusFilter,
  onResetFilters,
  pagination,
  onPageChange,
  limit,
  onLimitChange,
}) => {
  // Compute the current range: "Showing X - Y of Z"
  const totalItems = pagination?.totalItems || 0;
  const currentPage = pagination?.currentPage || 1;
  const itemsPerPage = limit || pagination?.itemsPerPage || 10;

  const from = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, totalItems);

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
      {/* Table Toolbar */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#6B7280" }}>
          <FilterList sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "13px" }}>
            Filters:
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={userTypeFilter}
            onChange={(e) => setUserTypeFilter(e.target.value)}
            sx={{ borderRadius: "10px", fontSize: "13px" }}
          >
            <MenuItem value="all">All User Types</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
            <MenuItem value="agent">Agent</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: "10px", fontSize: "13px" }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="pending">Pending Review</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>

        <Button
          size="small"
          onClick={onResetFilters}
          sx={{
            textTransform: "none",
            color: "#017E53",
            fontWeight: 700,
            ml: "auto",
          }}
        >
          Reset Filters
        </Button>
      </Box>

      {/* Table Body */}
      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: "#F9FAFB" }}>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox size="small" />
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>
                USER INFORMATION
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>
                TYPE
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>
                REQUIREMENT
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>
                DOCUMENTS
              </TableCell>
              <TableCell sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>
                SUBMITTED ON
              </TableCell>
              <TableCell align="right" sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280" }}>
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
                  No verifications found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const isSelected = selectedId === row.id && isDrawerOpen;
                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => onSelectRow(row)}
                    sx={{
                      cursor: "pointer",
                      bgcolor: isSelected ? "#F0FDF4" : "transparent",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox size="small" />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          src={row.user?.avatar}
                          sx={{ width: 34, height: 34, bgcolor: "#017E53", fontSize: "13px" }}
                        >
                          {row.user?.name?.[0]}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: "#111827", fontSize: "13px" }}
                          >
                            {row.user?.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#6B7280", display: "block" }}>
                            {row.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.user?.userType?.toUpperCase()}
                        size="small"
                        sx={{
                          fontSize: "10px",
                          fontWeight: 700,
                          borderRadius: "6px",
                          bgcolor: row.user?.userType === "agent" ? "#EFF6FF" : "#F3F4F6",
                          color: row.user?.userType === "agent" ? "#2563EB" : "#4B5563",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>
                      {row.verification?.type || "Identity"}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {(row.verification?.documentChecklist || []).map((doc, idx) => (
                          <Box
                            key={idx}
                            component="img"
                            src={doc.url}
                            alt={doc.name}
                            sx={{
                              width: 38,
                              height: 28,
                              borderRadius: "4px",
                              objectFit: "cover",
                              border: "1px solid #E5E7EB",
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontSize: "12px", color: "#6B7280" }}>
                      {row.verification?.submittedAt ? row.verification.submittedAt.split(" ")[0] : "N/A"}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRow(row);
                        }}
                        sx={{
                          textTransform: "none",
                          borderRadius: "8px",
                          fontSize: "12px",
                          borderColor: "#E5E7EB",
                          color: "#374151",
                          "&:hover": { borderColor: "#017E53", color: "#017E53" },
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

      {/* MATCHING FOOTER: Showing 1-X of Y + Rows Select + Pagination */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          borderTop: "1px solid #F3F4F6",
        }}
      >
        {/* Left: Showing Range */}
        <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "13px" }}>
          Showing{" "}
          <strong style={{ color: "#111827" }}>
            {from} - {to}
          </strong>{" "}
          of <strong style={{ color: "#111827" }}>{totalItems.toLocaleString()}</strong> users
        </Typography>

        {/* Center: Rows Limit Dropdown */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "13px" }}>
            Rows:
          </Typography>
          <FormControl size="small">
            <Select
              value={itemsPerPage}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              sx={{
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                height: "32px",
                "& .MuiSelect-select": { py: 0.5, px: 1.5 },
              }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Right: Pagination Controls */}
        <Pagination
          count={pagination?.totalPages || 1}
          page={currentPage}
          onChange={(e, page) => onPageChange(page)}
          shape="rounded"
          size="small"
          sx={{
            "& .MuiPaginationItem-root": {
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "12.5px",
            },
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

export default VerificationTable;