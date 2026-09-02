import React from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  Button,
  Select,
  MenuItem,
  Pagination,
  PaginationItem,
  Tooltip,
} from "@mui/material";
import {
  LocationOnOutlined,
  VisibilityOutlined,
  ArrowBack,
  ArrowForward,
} from "@mui/icons-material";
import {
  getTypeChip,
  getCategoryChip,
  getStatusChip,
} from "../utils/listingBadges";

const ListingsDirectoryTable = ({
  listings = [],
  loading,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
  totalEntries,
  onViewProperty,
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
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white flex-wrap gap-2">
          <Typography variant="body2" className="text-muted fw-bold">
            Showing {totalEntries > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, totalEntries)} of {totalEntries} listings
          </Typography>
        </div>

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
              style={{ minWidth: "1080px", width: "100%", margin: 0 }}
            >
              <thead className="table-light">
                <tr
                  className="text-muted fw-bold"
                  style={{ fontSize: "11px", letterSpacing: "0.5px" }}
                >
                  <th className="py-3 px-4" style={{ width: "26%" }}>Listing</th>
                  <th className="py-3" style={{ width: "9%" }}>Type</th>
                  <th className="py-3" style={{ width: "10%" }}>Category</th>
                  <th className="py-3" style={{ width: "20%" }}>Location</th>
                  <th className="py-3" style={{ width: "10%" }}>Price</th>
                  <th className="py-3" style={{ width: "12%" }}>Listed By</th>
                  <th className="py-3" style={{ width: "8%" }}>Status</th>
                  <th className="py-3 text-end px-4" style={{ width: "7%" }}>View</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-5 text-muted fw-medium"
                    >
                      No matching records found.
                    </td>
                  </tr>
                ) : (
                  listings.map((listing) => {
                    const mainPhoto = listing.metadata?.main_photo || listing.image || "";
                    const price = listing.metadata?.price || listing.total_price || 0;
                    const fullAddress = listing.address || listing.location || "—";

                    return (
                      <tr key={listing.id} className="hover-row">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <Box
                              component="img"
                              src={mainPhoto}
                              alt=""
                              sx={{
                                width: 52,
                                height: 36,
                                borderRadius: "8px",
                                objectFit: "cover",
                                bgcolor: "#F3F4F6",
                              }}
                            />
                            <div>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#111827",
                                  lineHeight: 1.2,
                                }}
                              >
                                {listing.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                className="text-muted"
                                sx={{ fontSize: "11px" }}
                              >
                                ID: LIS-{String(listing.id).padStart(5, "0")}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td>{getTypeChip(listing.type || listing.listing_type)}</td>
                        <td>{getCategoryChip(listing.category)}</td>
                        
                        {/* TRUNCATED ADDRESS COLUMN */}
                        <td style={{ maxWidth: "220px" }}>
                          <Tooltip title={fullAddress} placement="top" arrow>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.8,
                                color: "#4B5563",
                                fontSize: "12.5px",
                                overflow: "hidden",
                              }}
                            >
                              <LocationOnOutlined sx={{ fontSize: 16, color: "#9CA3AF", flexShrink: 0 }} />
                              <span
                                style={{
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "inline-block",
                                }}
                              >
                                {fullAddress}
                              </span>
                            </Box>
                          </Tooltip>
                        </td>

                        <td>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, color: "#111827" }}
                          >
                            ₦{Number(price).toLocaleString()}
                          </Typography>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Avatar sx={{ width: 26, height: 26, fontSize: "11px" }}>
                              {listing.owner_name?.charAt(0) || "A"}
                            </Avatar>
                            <div>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  fontWeight: 700,
                                  color: "#111827",
                                  fontSize: "12px",
                                }}
                              >
                                {listing.owner_name || "Agent"}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td>{getStatusChip(listing.status)}</td>
                        <td className="text-end px-4">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<VisibilityOutlined sx={{ fontSize: 14 }} />}
                            onClick={() => onViewProperty(listing)}
                            sx={{
                              textTransform: "none",
                              fontSize: "11.5px",
                              fontWeight: 700,
                              py: 0.4,
                              px: 1.5,
                              borderRadius: "8px",
                              borderColor: "#E5E7EB",
                              color: "#374151",
                              "&:hover": {
                                bgcolor: "#F9FAFB",
                                borderColor: "#D1D5DB",
                              },
                            }}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </Box>

        {/* PAGINATION CONTROLS */}
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
              sx={{
                height: "32px",
                borderRadius: "8px",
                fontWeight: 700,
                fontSize: "12px",
              }}
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
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBack, next: ArrowForward }}
                {...item}
                sx={{
                  fontWeight: 700,
                  fontSize: "13px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  mx: "2px",
                  minWidth: "32px",
                  height: "32px",
                  "&.Mui-selected": {
                    bgcolor: "#017E53 !important",
                    color: "#fff",
                    border: "none",
                  },
                }}
              />
            )}
          />
        </div>
      </Paper>
    </Box>
  );
};

export default ListingsDirectoryTable;