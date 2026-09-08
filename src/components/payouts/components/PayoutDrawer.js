import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  TextField,
  Drawer,
  IconButton,
} from "@mui/material";
import { Close, AccountBalanceOutlined } from "@mui/icons-material";

const getStatusChipStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return { bgcolor: "#FFFBEB", color: "#B45309" };
    case "success":
    case "approved":
    case "paid":
      return { bgcolor: "#ECFDF5", color: "#017E53" };
    case "reversed":
    case "rejected":
    case "failed":
      return { bgcolor: "#FEF2F2", color: "#DC2626" };
    default:
      return { bgcolor: "#F1F5F9", color: "#475569" };
  }
};

const PayoutDrawer = ({
  open,
  onClose,
  request,
  onAction,
  actionLoading,
}) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
  }, [request]);

  if (!request) return null;

  const formattedAmount = Number(request.amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 440 },
          bgcolor: "#FFFFFF",
          boxSizing: "border-box",
          overflowX: "hidden",
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 3,
            pt: 3,
            pb: 2,
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <div>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#111827", fontSize: "17px" }}
            >
              Request Details
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#9CA3AF", fontWeight: 600 }}
            >
              {request.reference}
            </Typography>
          </div>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={request.status?.toUpperCase()}
              size="small"
              sx={{
                ...getStatusChipStyle(request.status),
                fontWeight: 800,
                fontSize: "10px",
                height: 22,
                borderRadius: "6px",
              }}
            />
            <IconButton
              size="small"
              onClick={onClose}
              sx={{ color: "#94A3B8" }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Content Body */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 3,
            py: 2.5,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          {/* User profile banner */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 46,
                height: 46,
                bgcolor: "#017E53",
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              {request.firstname?.[0]}
              {request.lastname?.[0]}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}
              >
                {request.firstname} {request.lastname}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                {request.email}
              </Typography>
            </Box>
          </Box>

          {/* Requested Amount Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "14px",
              border: "1px solid #E2E8F0",
              bgcolor: "#F8FAFC",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#64748B",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                display: "block",
                mb: 0.5,
              }}
            >
              REQUESTED AMOUNT
            </Typography>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}
            >
              {formattedAmount}
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
                pt: 1.5,
                borderTop: "1px dashed #CBD5E1",
              }}
            >
              <Typography
                variant="caption"
                sx={{ color: "#64748B", fontWeight: 600 }}
              >
                Net Payout
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontWeight: 800, color: "#017E53", fontSize: "13px" }}
              >
                {formattedAmount}
              </Typography>
            </Box>
          </Paper>

          {/* Bank Destination Card */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#475569",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                display: "block",
                mb: 1,
              }}
            >
              BANK DETAILS
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  bgcolor: "#F1F5F9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#017E53",
                }}
              >
                <AccountBalanceOutlined sx={{ fontSize: 20 }} />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: "#0F172A" }}
                >
                  {request.bank_name} • {request.account_number}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  {request.account_name}
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Transfer Timeline & Fail Notes */}
          {request.reason && (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: "#DC2626",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.8,
                }}
              >
                SYSTEM REASON / LOG
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: "10px",
                  bgcolor: "#FEF2F2",
                  border: "1px solid #FCA5A5",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#991B1B", fontWeight: 600, display: "block" }}
                >
                  {request.reason}
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Admin Notes Field */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#475569",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                display: "block",
                mb: 1,
              }}
            >
              NOTES
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Add note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  bgcolor: "#F8FAFC",
                  fontSize: "13px",
                  "& fieldset": { borderColor: "#E2E8F0" },
                  "&.Mui-focused fieldset": { borderColor: "#017E53" },
                },
              }}
            />
          </Box>
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            p: 2.5,
            borderTop: "1px solid #F1F5F9",
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
            bgcolor: "#FFFFFF",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
            }}
          >
            <Button
              variant="outlined"
              disabled={actionLoading}
              onClick={() => onAction("reject", request.id, note)}
              sx={{
                borderColor: "#FCA5A5",
                color: "#DC2626",
                fontWeight: 700,
                borderRadius: "10px",
                py: 1.2,
                textTransform: "none",
                fontSize: "14px",
                "&:hover": { borderColor: "#EF4444", bgcolor: "#FEF2F2" },
              }}
            >
              Reject
            </Button>
            <Button
              variant="contained"
              disabled={actionLoading}
              onClick={() => onAction("approve", request.id, note)}
              sx={{
                bgcolor: "#017E53",
                color: "#FFFFFF",
                fontWeight: 700,
                borderRadius: "10px",
                py: 1.2,
                textTransform: "none",
                fontSize: "14px",
                boxShadow: "none",
                "&:hover": { bgcolor: "#016744" },
              }}
            >
              Approve
            </Button>
          </Box>

          <Button
            variant="contained"
            disabled={actionLoading}
            onClick={() => onAction("mark_paid", request.id, note)}
            sx={{
              bgcolor: "#F1F5F9",
              color: "#0F172A",
              fontWeight: 700,
              borderRadius: "10px",
              py: 1.2,
              textTransform: "none",
              fontSize: "14px",
              boxShadow: "none",
              "&:hover": { bgcolor: "#E2E8F0" },
            }}
          >
            Mark Paid
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PayoutDrawer;