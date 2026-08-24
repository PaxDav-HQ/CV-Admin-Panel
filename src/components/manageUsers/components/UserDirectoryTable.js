import React from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { formatDateTime } from "../utils/userFormatters";
import {
  getTypeChip,
  getStatusChip,
  getVerificationChip,
} from "../utils/userBadges";

const UserDirectoryTable = ({
  users = [],
  loading,
  page,
  setPage,
  totalPages,
  totalEntries,
  limit,
  setLimit,
  onOpenMenu,
}) => {
  return (
    <Box sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
      <Paper
        elevation={0}
        className="border"
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          width: "100%",
          maxWidth: "100%",
          bgcolor: "#fff",
        }}
      >
        {/* Table Header Summary */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white flex-wrap gap-2">
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, color: "#111827" }}
          >
            User Directory
          </Typography>
          <Typography variant="caption" className="text-muted fw-medium">
            Showing {totalEntries > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, totalEntries)} of {totalEntries} users
          </Typography>
        </div>

        {/* Scrollable Viewport Wrapper */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-track": { bgcolor: "#F9FAFB" },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#D1D5DB",
              borderRadius: "10px",
            },
          }}
        >
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CircularProgress sx={{ color: "#22C55E" }} />
            </div>
          ) : (
            <table
              className="table align-middle mb-0 text-nowrap"
              style={{ minWidth: "1100px", width: "100%", margin: 0 }}
            >
              <thead className="table-light">
                <tr
                  className="text-uppercase text-muted fw-bold"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  <th className="py-3 px-4" style={{ width: "24%" }}>
                    User Details
                  </th>
                  <th className="py-3" style={{ width: "18%" }}>
                    Contact Information
                  </th>
                  <th className="py-3" style={{ width: "10%" }}>
                    Type
                  </th>
                  <th className="py-3" style={{ width: "10%" }}>
                    Status
                  </th>
                  <th className="py-3" style={{ width: "10%" }}>
                    Verification
                  </th>
                  <th className="py-3" style={{ width: "11%" }}>
                    Joined Date
                  </th>
                  <th className="py-3" style={{ width: "11%" }}>
                    Last Active
                  </th>
                  <th
                    className="py-3 text-end px-4"
                    style={{ width: "6%" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5 text-muted fw-medium"
                    >
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const joined = formatDateTime(user.joined_date);
                    const lastActive = formatDateTime(
                      user.last_active_raw || user.last_active
                    );
                    const displayName =
                      user.full_name ||
                      user.name ||
                      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
                      "Unnamed User";

                    return (
                      <tr key={user.id} className="hover-row">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <Avatar
                              src={
                                user.avatar ||
                                user.profile_picture ||
                                user.image
                              }
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#F3F4F6",
                                color: "#374151",
                                fontWeight: 700,
                              }}
                            >
                              {displayName.charAt(0)}
                            </Avatar>
                            <div>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#111827",
                                  lineHeight: 1.2,
                                }}
                              >
                                {displayName}
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-muted"
                                sx={{ fontSize: "11px" }}
                              >
                                ID:{" "}
                                {user.userId ||
                                  `USR-${String(user.id).padStart(5, "0")}`}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="fw-medium text-dark">
                              {user.email || "—"}
                            </div>
                            <div className="text-muted">
                              {user.phone_number || user.phone || "—"}
                            </div>
                          </div>
                        </td>
                        <td>{getTypeChip(user.role || user.type)}</td>
                        <td>{getStatusChip(user)}</td>
                        <td>{getVerificationChip(user)}</td>
                        <td>
                          <div className="small">
                            <div className="fw-semibold text-dark">
                              {joined.date}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              {joined.time}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            <div className="fw-semibold text-dark">
                              {lastActive.date}
                            </div>
                            <div
                              className="text-muted"
                              style={{ fontSize: "11px" }}
                            >
                              {lastActive.time}
                            </div>
                          </div>
                        </td>
                        <td className="text-end px-4">
                          <IconButton
                            size="small"
                            onClick={(e) => onOpenMenu(e, user)}
                          >
                            <MoreVert sx={{ fontSize: 18 }} />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </Box>

        {/* Bottom Pagination */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top bg-white gap-3">
          <div className="d-flex align-items-center gap-2">
            <Typography variant="caption" className="text-muted fw-bold">
              SHOW
            </Typography>
            <Select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              size="small"
              sx={{ height: "32px", borderRadius: "8px", fontWeight: 700 }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Typography variant="caption" className="text-muted fw-bold">
              ENTRIES
            </Typography>
          </div>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            size="small"
            sx={{
              "& .MuiPaginationItem-root": { fontWeight: 700 },
              "& .Mui-selected": { bgcolor: "#111827 !important", color: "#fff" },
            }}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default UserDirectoryTable;