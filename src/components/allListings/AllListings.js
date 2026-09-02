import React, { useState } from "react";
import {
  Box,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAllListings } from "./hooks/useAllListings";
import { extractErrorMessage } from "../../utils/errorParser";
import ListingsHeader from "./components/ListingsHeader";
import ListingsMetricsCards from "./components/ListingsMetricsCards";
import ListingsFiltersBar from "./components/ListingsFiltersBar";
import ListingsDirectoryTable from "./components/ListingsDirectoryTable";
import PropertyDetailsDrawer from "./components/PropertyDetailsDrawer";

const AllListings = () => {
  const navigate = useNavigate();
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem("userToken");

  const {
    listings,
    analytics,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalEntries,
    searchTerm,
    setSearchTerm,
    propertyType,
    setPropertyType,
    status,
    setStatus,
    applyFilters,
    resetFilters,
    fetchListings,
  } = useAllListings(uri, token);

  const [selectedListing, setSelectedListing] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // Action Confirmation Dialog
  const [actionModal, setActionModal] = useState({
    open: false,
    actionType: "",
    listing: null,
    reason: "",
    loading: false,
  });

  const handleViewProperty = (listing) => {
    setSelectedListing(listing);
    setDrawerOpen(true);
  };

  const handleTriggerAction = (actionType, listing) => {
    if (actionType === "edit") {
      navigate(`/admin/listings/edit/${listing.id}`);
      return;
    }

    setActionModal({
      open: true,
      actionType,
      listing,
      reason: "",
      loading: false,
    });
  };

  const handleExecuteAction = async () => {
  const { actionType, listing, reason } = actionModal;
  if (!listing) return;

  setActionModal((prev) => ({ ...prev, loading: true }));
  const authHeaders = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    if (actionType === "approve") {
      // Approve: sets status to "approved"
      await axios.patch(
        `${uri}admin/approve-property`,
        {
          propertyId: listing.id,
          status: "approved",
          reason: reason || "Listing approved by admin",
        },
        authHeaders
      );
    } else if (actionType === "reject") {
      // Reject: sets status to "rejected"
      await axios.patch(
        `${uri}admin/approve-property`,
        {
          propertyId: listing.id,
          status: "rejected",
          reason: reason || "Listing rejected by admin",
        },
        authHeaders
      );
    } else if (actionType === "delete") {
      // Delete: DELETE /api/admin/listings/{id}
      await axios.delete(`${uri}admin/listings/${listing.id}`, {
        headers: authHeaders.headers,
        data: {
          listing_type: listing.listing_type || listing.type || "property",
        },
      });
    } else if (actionType === "ban") {
      // Ban Agent: PATCH /api/admin/account/suspend
      await axios.patch(
        `${uri}admin/account/suspend`,
        {
          accountId: listing.owner_id,
          suspended: true,
        },
        authHeaders
      );
    }

    setActionModal({ open: false, actionType: "", listing: null, reason: "", loading: false });
    setDrawerOpen(false);
    setToast({
      open: true,
      message: `Property ${actionType === "approve" ? "approved" : actionType === "reject" ? "rejected" : "action completed"} successfully!`,
      severity: "success",
    });
    fetchListings();
  } catch (err) {
    const errorMsg = extractErrorMessage(err, `Failed to execute ${actionType}. Please try again.`);
    setActionModal((prev) => ({ ...prev, loading: false }));
    setToast({
      open: true,
      message: errorMsg,
      severity: "error",
    });
  }
};

  return (
    <Box
      sx={{
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        py: 4,
        px: { xs: 1.5, sm: 3, md: 4 },
        boxSizing: "border-box",
      }}
    >
      <ListingsHeader onAddNew={() => navigate("/admin/property-types")} />
      <ListingsMetricsCards cards={analytics?.cards} analytics={analytics} />
      <ListingsFiltersBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        status={status}
        setStatus={setStatus}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {/* Directory Table with Direct View CTA */}
      <ListingsDirectoryTable
        listings={listings}
        loading={loading}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
        totalEntries={totalEntries}
        onViewProperty={handleViewProperty}
      />

      {/* Slide-over Drawer containing detailed inspection & status-aware actions */}
      <PropertyDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        listing={selectedListing}
        onAction={handleTriggerAction}
      />

      {/* ACTION CONFIRMATION DIALOG */}
      <Dialog
        open={actionModal.open}
        onClose={() => !actionModal.loading && setActionModal((p) => ({ ...p, open: false }))}
        PaperProps={{ sx: { borderRadius: "16px", p: 1, maxWidth: "440px", width: "100%" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "18px", color: "#111827" }}>
          {actionModal.actionType === "approve" && "Approve Listing?"}
          {actionModal.actionType === "reject" && "Reject Listing?"}
          {actionModal.actionType === "delete" && "Delete Listing Permanently?"}
          {actionModal.actionType === "ban" && "Suspend / Ban Agent?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#4B5563", fontSize: "14px", mb: 2 }}>
            {actionModal.actionType === "approve" && `Approve "${actionModal.listing?.name}" to make it public on the marketplace?`}
            {actionModal.actionType === "reject" && `Reject "${actionModal.listing?.name}". The property will not be publicized.`}
            {actionModal.actionType === "delete" && `Are you sure you want to delete "${actionModal.listing?.name}"? This action cannot be undone.`}
            {actionModal.actionType === "ban" && `Suspend account for ${actionModal.listing?.owner_name || "this agent"}? They will lose access.`}
          </DialogContentText>

          {/* Reason input for rejection */}
          {actionModal.actionType === "reject" && (
            <TextField
              fullWidth
              size="small"
              placeholder="Reason for rejection (Optional)"
              value={actionModal.reason}
              onChange={(e) => setActionModal((prev) => ({ ...prev, reason: e.target.value }))}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            disabled={actionModal.loading}
            onClick={() => setActionModal((p) => ({ ...p, open: false }))}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={actionModal.loading}
            onClick={handleExecuteAction}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              px: 3,
              bgcolor: actionModal.actionType === "approve" ? "#017E53" : "#EF4444",
              "&:hover": { bgcolor: actionModal.actionType === "approve" ? "#016744" : "#DC2626" },
            }}
          >
            {actionModal.loading ? <CircularProgress size={18} color="inherit" /> : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FEEDBACK TOASTER */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 7 }}
      >
        <Alert
          onClose={() => setToast((p) => ({ ...p, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{ width: "100%", borderRadius: "10px", fontWeight: 600 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AllListings;