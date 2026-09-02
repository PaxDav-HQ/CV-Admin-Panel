import React, { useState } from "react";
import {
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { extractErrorMessage } from "../../../utils/errorParser";

const TAB_TYPES = ["property", "service", "verification"];

const PendingApprovalsModule = ({
  pendingApprovals = [],
  pendingCounts = {},
  onRefresh, // Callback to refresh parent lists/metrics
}) => {
  const [approvalTab, setApprovalTab] = useState(0);

  const uri = useSelector((state) => state.UriReducer?.uri);
  const token = sessionStorage.getItem("userToken");

  // Modal & Async Action State
  const [actionModal, setActionModal] = useState({
    open: false,
    item: null,
    status: "", // "approved" | "rejected"
    reason: "",
    loading: false,
  });

  // Feedback Notification Toast
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const currentApprovals = pendingApprovals.filter(
    (item) => item.type?.toLowerCase() === TAB_TYPES[approvalTab]
  );

  const handleOpenConfirm = (item, status) => {
    setActionModal({
      open: true,
      item,
      status,
      reason: "",
      loading: false,
    });
  };

  const handleCloseConfirm = () => {
    if (actionModal.loading) return;
    setActionModal({
      open: false,
      item: null,
      status: "",
      reason: "",
      loading: false,
    });
  };

  const handleExecuteApproval = async () => {
    const { item, status, reason } = actionModal;
    if (!item) return;

    setActionModal((prev) => ({ ...prev, loading: true }));

    try {
      // Direct integration with PATCH /api/admin/approve-property
      await axios.patch(
        `${uri}admin/approve-property`,
        {
          propertyId: item.id,
          status,
          reason:
            reason ||
            (status === "approved"
              ? "Listing approved by administrator"
              : "Listing rejected by administrator"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setActionModal({
        open: false,
        item: null,
        status: "",
        reason: "",
        loading: false,
      });

      setToast({
        open: true,
        message: `Listing ${status === "approved" ? "approved" : "rejected"} successfully!`,
        severity: "success",
      });

      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to update approval status:", err);
      setActionModal((prev) => ({ ...prev, loading: false }));

      const errorMsg = extractErrorMessage(
        err,
        `Failed to ${status} listing. Please check your network and try again.`
      );

      setToast({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    }
  };

  return (
    <Paper
      elevation={0}
      className="border h-100 d-flex flex-column"
      sx={{ borderRadius: "20px", bgcolor: "#fff", overflow: "hidden" }}
    >
      {/* HEADER & TAB SELECTOR */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center p-3 border-bottom gap-2">
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827" }}>
          Pending Approvals
        </Typography>
        <Tabs
          value={approvalTab}
          onChange={(e, val) => setApprovalTab(val)}
          sx={{
            minHeight: "34px",
            "& .MuiTabs-indicator": { bgcolor: "#16A34A" },
            "& .MuiTab-root": {
              minHeight: "34px",
              py: 0.5,
              px: 1.5,
              textTransform: "none",
              fontSize: "12px",
              fontWeight: 700,
            },
          }}
        >
          <Tab
            label={`Listings (${pendingCounts.listings ?? 0})`}
            sx={{ "&.Mui-selected": { color: "#16A34A" } }}
          />
          <Tab
            label={`Services (${pendingCounts.services ?? 0})`}
            sx={{ "&.Mui-selected": { color: "#16A34A" } }}
          />
          
        </Tabs>
      </div>

      {/* LISTINGS CONTAINER */}
      <div className="p-3 flex-grow-1" style={{ maxHeight: "380px", overflowY: "auto" }}>
        {currentApprovals.length > 0 ? (
          currentApprovals.map((item) => (
            <div
              key={item.id}
              className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-2 mb-2 rounded-3 border hover-row gap-2"
            >
              <div className="d-flex align-items-center gap-3">
                <Avatar
                  src={item.image || ""}
                  variant="rounded"
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "8px",
                    bgcolor: "#F3F4F6",
                    color: "#374151",
                    fontWeight: 700,
                  }}
                />
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#111827", fontSize: "13px" }}
                    >
                      {item.title}
                    </Typography>
                    <Chip
                      label={
                        item.type === "property"
                          ? "Property"
                          : item.type === "service"
                          ? "Service"
                          : "Verification"
                      }
                      size="small"
                      sx={{
                        bgcolor: "#ECFDF5",
                        color: "#10B981",
                        fontWeight: 700,
                        fontSize: "9.5px",
                        height: "18px",
                      }}
                    />
                  </div>
                  <Typography
                    variant="caption"
                    className="text-muted d-block"
                    style={{ fontSize: "11px" }}
                  >
                    {item.location}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted"
                    style={{ fontSize: "10.5px" }}
                  >
                    Submitted by:{" "}
                    <Avatar
                      src={item.avatar || ""}
                      variant="rounded"
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#F3F4F6",
                        color: "#374151",
                        display: "inline-block",
                        mr: 0.5,
                      }}
                    />
                    <span className="text-dark">{item.submitted_by || "—"}</span>
                  </Typography>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="d-flex align-items-center gap-1.5 align-self-end align-self-sm-center">
                <Button
                  size="small"
                  onClick={() => handleOpenConfirm(item, "approved")}
                  variant="outlined"
                  sx={{
                    color: "#16A34A",
                    borderColor: "#DCFCE7",
                    bgcolor: "#F0FDF4",
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: "6px",
                    fontSize: "11px",
                    px: 1.5,
                    py: 0.4,
                    "&:hover": { bgcolor: "#DCFCE7", borderColor: "#16A34A" },
                  }}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  onClick={() => handleOpenConfirm(item, "rejected")}
                  variant="outlined"
                  sx={{
                    color: "#EF4444",
                    borderColor: "#FEE2E2",
                    bgcolor: "#FEF2F2",
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: "6px",
                    fontSize: "11px",
                    px: 1.5,
                    py: 0.4,
                    "&:hover": { bgcolor: "#FEE2E2", borderColor: "#EF4444" },
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 text-muted small">
            No pending items in this category.
          </div>
        )}
      </div>

      {/* CONFIRMATION / REJECTION DIALOG */}
      <Dialog
        open={actionModal.open}
        onClose={handleCloseConfirm}
        PaperProps={{
          sx: { borderRadius: "16px", p: 1, maxWidth: "420px", width: "100%" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "17px", color: "#111827" }}>
          {actionModal.status === "approved" ? "Approve Listing?" : "Reject Listing?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#4B5563", fontSize: "13.5px", mb: 2 }}>
            {actionModal.status === "approved"
              ? `Are you sure you want to approve "${actionModal.item?.title}"? This will set publicized to true and publish it live.`
              : `Are you sure you want to reject "${actionModal.item?.title}"?`}
          </DialogContentText>

          {/* Reason input on rejection */}
          {actionModal.status === "rejected" && (
            <TextField
              fullWidth
              size="small"
              placeholder="Reason for rejection (Optional)"
              value={actionModal.reason}
              onChange={(e) =>
                setActionModal((prev) => ({ ...prev, reason: e.target.value }))
              }
              sx={{ mt: 1 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            disabled={actionModal.loading}
            onClick={handleCloseConfirm}
            sx={{ textTransform: "none", fontWeight: 600, borderRadius: "8px" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={actionModal.loading}
            onClick={handleExecuteApproval}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: "8px",
              px: 2.5,
              bgcolor: actionModal.status === "approved" ? "#16A34A" : "#EF4444",
              "&:hover": {
                bgcolor: actionModal.status === "approved" ? "#15803D" : "#DC2626",
              },
            }}
          >
            {actionModal.loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : actionModal.status === "approved" ? (
              "Confirm Approve"
            ) : (
              "Confirm Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* FEEDBACK NOTIFICATION TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 7 }}
      >
        <Alert
          onClose={() => setToast((prev) => ({ ...prev, open: false }))}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            bgcolor: toast.severity === "success" ? "#16A34A" : "#EF4444",
            color: "#fff",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default PendingApprovalsModule;