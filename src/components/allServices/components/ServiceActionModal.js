import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  VerifiedUserOutlined,
  PauseCircleOutlined,
  BlockOutlined,
  DeleteOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";

const ACTION_CONFIG = {
  verify: {
    title: "Approve Service",
    status: "active",
    description: "Are you sure you want to approve this service? It will become active and publicly visible.",
    icon: <VerifiedUserOutlined sx={{ color: "#10B981", fontSize: 28 }} />,
    confirmColor: "#10B981",
    confirmText: "Approve & Activate",
    requiresReason: false,
  },
  suspend: {
    title: "Suspend Service",
    status: "suspended",
    description: "This will temporarily hide the service from public listings until reinstated.",
    icon: <PauseCircleOutlined sx={{ color: "#F59E0B", fontSize: 28 }} />,
    confirmColor: "#F59E0B",
    confirmText: "Suspend Service",
    requiresReason: true,
  },
  ban: {
    title: "Ban Service",
    status: "inactive",
    description: "This will restrict the service permanently and flag provider records.",
    icon: <BlockOutlined sx={{ color: "#EF4444", fontSize: 28 }} />,
    confirmColor: "#EF4444",
    confirmText: "Ban Service",
    requiresReason: true,
  },
  reject: {
    title: "Reject Service",
    status: "rejected",
    description: "Provide the reason for rejecting this service submission so the provider can address issues.",
    icon: <WarningAmberOutlined sx={{ color: "#EF4444", fontSize: 28 }} />,
    confirmColor: "#EF4444",
    confirmText: "Reject Service",
    requiresReason: true,
  },
  delete: {
    title: "Permanently Delete Service",
    status: null, // Triggers DELETE endpoint
    description: "This action cannot be undone. All data and metrics associated with this service will be wiped.",
    icon: <DeleteOutlined sx={{ color: "#DC2626", fontSize: 28 }} />,
    confirmColor: "#DC2626",
    confirmText: "Delete Permanently",
    requiresReason: false,
  },
};

const ServiceActionModal = ({ open, onClose, actionType, service, onConfirm, loading }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    setReason("");
  }, [open, actionType]);

  if (!actionType || !ACTION_CONFIG[actionType]) return null;

  const config = ACTION_CONFIG[actionType];

  const handleConfirm = () => {
    onConfirm({
      serviceId: service.id,
      actionType,
      targetStatus: config.status,
      reason,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: "18px", p: 1 },
      }}
    >
      <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
        {config.icon}
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "17px", color: "#0F172A" }}>
          {config.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 1 }}>
        <Typography variant="body2" sx={{ color: "#64748B", fontSize: "13px", mb: 2 }}>
          {config.description}
        </Typography>

        {service && (
          <Box sx={{ p: 1.5, bgcolor: "#F8FAFC", borderRadius: "10px", border: "1px solid #E2E8F0", mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: "13px", color: "#0F172A" }}>
              {service.title}
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              Code: {service.service_code} • Provider: {service.provider?.name}
            </Typography>
          </Box>
        )}

        {config.requiresReason && (
          <TextField
            fullWidth
            size="small"
            multiline
            rows={3}
            label="Reason / Administrative Note"
            placeholder="Specify reason for this action..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "13px" } }}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ textTransform: "none", color: "#64748B", fontWeight: 700 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={loading || (config.requiresReason && !reason.trim())}
          onClick={handleConfirm}
          sx={{
            bgcolor: config.confirmColor,
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: "12.5px",
            textTransform: "none",
            borderRadius: "10px",
            px: 2.2,
            boxShadow: "none",
            "&:hover": { bgcolor: config.confirmColor, filter: "brightness(0.9)" },
          }}
        >
          {loading ? <CircularProgress size={18} color="inherit" /> : config.confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceActionModal;