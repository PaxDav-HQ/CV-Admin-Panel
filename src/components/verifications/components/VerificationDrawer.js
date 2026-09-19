import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  Checkbox,
  TextField,
  Drawer,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  VerifiedUserOutlined,
  OpenInNew,
  BookmarkBorderOutlined,
} from "@mui/icons-material";

const VerificationDrawer = ({
  open,
  onClose,
  verification,
  onDecision,
  actionLoading,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [reason, setReason] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [reviewSteps, setReviewSteps] = useState([]);
  const [skipNotification, setSkipNotification] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    if (verification?.verification) {
      setReason(verification.verification.reason || "");
      setInternalNotes(verification.verification.internalNotes || "");

      const initialSteps = (verification.verification.internalReviewSteps || []).map((step) => ({
        id: step.id,
        label: step.label,
        description: step.description,
        required: Boolean(step.required),
        completed: Boolean(step.completed || step.checked),
        checked: Boolean(step.completed || step.checked),
      }));
      setReviewSteps(initialSteps);
    }
  }, [verification]);

  const { user, verification: details, adminActions } = verification || {};

  const hasUncheckedRequiredSteps = useMemo(() => {
    return reviewSteps.some((step) => step.required && !step.completed);
  }, [reviewSteps]);

  if (!verification) return null;

  const handleStepToggle = (stepId) => {
    setReviewSteps((prev) =>
      prev.map((step) =>
        step.id === stepId
          ? { ...step, completed: !step.completed, checked: !step.checked }
          : step
      )
    );
  };

  const handleActionClick = (decisionStatus) => {
    const payload = {
      status: decisionStatus,
      reason: reason.trim(),
      internalNotes: internalNotes.trim(),
      internalReviewSteps: reviewSteps.map((s) => ({
        id: s.id,
        label: s.label,
        completed: Boolean(s.completed),
        checked: Boolean(s.checked),
      })),
      skipNotification,
    };

    onDecision(payload);
  };

  return (
    <>
      <Drawer
        anchor={isMobile ? "bottom" : "right"}
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 420,
            maxWidth: "100vw",
            height: isMobile ? "88vh" : "100%",
            maxHeight: isMobile ? "88vh" : "100%",
            boxSizing: "border-box",
            bgcolor: "#FFFFFF",
            overflow: "hidden",
            borderTopLeftRadius: isMobile ? "20px" : 0,
            borderTopRightRadius: isMobile ? "20px" : 0,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* Mobile Handle Pill */}
          {isMobile && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                pt: 1.2,
                pb: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 4,
                  bgcolor: "#CBD5E1",
                  borderRadius: 2,
                }}
              />
            </Box>
          )}

          {/* 1. HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: { xs: 2, sm: 2.5 },
              pt: isMobile ? 1 : 2.5,
              pb: 2,
              borderBottom: "1px solid #F1F5F9",
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <VerifiedUserOutlined sx={{ color: "#017E53", fontSize: 22 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#111827", fontSize: "17px" }}
              >
                Review Details
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: "#94A3B8",
                bgcolor: "#F8FAFC",
                "&:hover": { bgcolor: "#F1F5F9", color: "#1E293B" },
              }}
            >
              <Close sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* 2. SCROLLABLE CONTENT BODY */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              px: { xs: 2, sm: 2.5 },
              py: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2.2,
              "&::-webkit-scrollbar": { width: "5px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "#E2E8F0",
                borderRadius: "10px",
              },
            }}
          >
            {/* User Profile Card */}
            <Paper
              elevation={0}
              sx={{
                p: 1.8,
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                bgcolor: "#F8FAFC",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={user?.avatar}
                  sx={{
                    width: 44,
                    height: 44,
                    border: "2px solid #017E53",
                    bgcolor: "#017E53",
                  }}
                >
                  {user?.name?.[0]}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}
                    noWrap
                  >
                    {user?.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748B", display: "block", mt: 0.3 }}
                  >
                    Joined: {user?.joinedAt?.split(" ")[0]}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.8, mt: 0.8 }}>
                    <Chip
                      label={user?.isTrusted ? "Trusted" : "Unverified"}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "10px",
                        fontWeight: 700,
                        bgcolor: user?.isTrusted ? "#ECFDF5" : "#FEF2F2",
                        color: user?.isTrusted ? "#017E53" : "#DC2626",
                      }}
                    />
                    <Chip
                      label={`${user?.rating || 0}★ Rating`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "10px",
                        fontWeight: 700,
                        bgcolor: "#FFFBEB",
                        color: "#B45309",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Document Checklist */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: "#475569",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 1.2,
                }}
              >
                Document Checklist
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 1.2,
                }}
              >
                {(details?.documentChecklist || []).map((doc, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setPreviewDoc(doc)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: "12px",
                      border: "1px solid #E2E8F0",
                      overflow: "hidden",
                      bgcolor: "#FFFFFF",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        borderColor: "#017E53",
                        boxShadow: "0 4px 12px rgba(1, 126, 83, 0.08)",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={doc.url}
                      alt={doc.name}
                      sx={{
                        width: "100%",
                        height: 80,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <Box
                      sx={{
                        p: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11px",
                          color: "#1E293B",
                        }}
                        noWrap
                      >
                        {doc.name}
                      </Typography>
                      <OpenInNew sx={{ fontSize: 13, color: "#64748B", ml: 0.5, flexShrink: 0 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Internal Review Steps */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: "#475569",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    display: "block",
                  }}
                >
                  Internal Review Steps
                </Typography>
                <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "10.5px" }}>
                  * required
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {reviewSteps.map((step) => (
                  <Paper
                    key={step.id}
                    elevation={0}
                    onClick={() => handleStepToggle(step.id)}
                    sx={{
                      p: 1.2,
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.2,
                      bgcolor: step.completed ? "#F0FDF4" : "#FFFFFF",
                      cursor: "pointer",
                    }}
                  >
                    <Checkbox
                      size="small"
                      checked={Boolean(step.completed)}
                      onChange={() => handleStepToggle(step.id)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{
                        color: "#94A3B8",
                        p: 0,
                        mt: 0.1,
                        "&.Mui-checked": { color: "#017E53" },
                      }}
                    />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "#0F172A",
                          fontSize: "12px",
                          lineHeight: 1.3,
                        }}
                      >
                        {step.label}{" "}
                        {step.required && (
                          <span style={{ color: "#EF4444", fontWeight: 900 }}>*</span>
                        )}
                      </Typography>
                      {step.description && (
                        <Typography
                          variant="caption"
                          sx={{ color: "#64748B", fontSize: "10.5px", display: "block", mt: 0.2 }}
                        >
                          {step.description}
                        </Typography>
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>

              {hasUncheckedRequiredSteps && (
                <Alert severity="info" sx={{ mt: 1.2, borderRadius: "8px", fontSize: "11px", py: 0.3 }}>
                  Check all required (*) items before approving.
                </Alert>
              )}
            </Box>

            {/* Decision Reason (User-Facing) */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: "#475569",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.8,
                }}
              >
                Decision Reason (Visible to User)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Specify reason for decision..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#F8FAFC",
                    fontSize: "12.5px",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&.Mui-focused fieldset": { borderColor: "#017E53" },
                  },
                }}
              />
            </Box>

            {/* Internal Staff Notes */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: "#475569",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  display: "block",
                  mb: 0.8,
                }}
              >
                Internal Notes (Staff Only)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Internal review observation notes..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    bgcolor: "#F8FAFC",
                    fontSize: "12.5px",
                    "& fieldset": { borderColor: "#E2E8F0" },
                    "&.Mui-focused fieldset": { borderColor: "#017E53" },
                  },
                }}
              />
            </Box>

            {/* Skip Notification Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={skipNotification}
                  onChange={(e) => setSkipNotification(e.target.checked)}
                  sx={{ "&.Mui-checked": { color: "#017E53" } }}
                />
              }
              label={
                <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600 }}>
                  Skip email/SMS notification to user
                </Typography>
              }
            />
          </Box>

          {/* 3. STICKY ACTION FOOTER */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #F1F5F9",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.2 }}>
              <Button
                variant="outlined"
                disabled={actionLoading || !adminActions?.canReject}
                onClick={() => handleActionClick("rejected")}
                sx={{
                  borderColor: "#FCA5A5",
                  color: "#DC2626",
                  fontWeight: 700,
                  borderRadius: "10px",
                  py: 1,
                  textTransform: "none",
                  fontSize: "13px",
                  "&:hover": {
                    borderColor: "#EF4444",
                    bgcolor: "#FEF2F2",
                  },
                }}
              >
                Reject
              </Button>
              <Button
                variant="contained"
                disabled={
                  actionLoading ||
                  !adminActions?.canApprove ||
                  hasUncheckedRequiredSteps
                }
                onClick={() => handleActionClick("approved")}
                sx={{
                  bgcolor: "#017E53",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  borderRadius: "10px",
                  py: 1,
                  textTransform: "none",
                  fontSize: "13px",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#016744",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#E2E8F0",
                    color: "#94A3B8",
                  },
                }}
              >
                Approve
              </Button>
            </Box>

            <Button
              variant="text"
              fullWidth
              disabled={actionLoading}
              onClick={() => handleActionClick("pending")}
              startIcon={<BookmarkBorderOutlined sx={{ fontSize: 16 }} />}
              sx={{
                color: "#475569",
                fontWeight: 700,
                fontSize: "12px",
                textTransform: "none",
                py: 0.6,
                borderRadius: "8px",
                "&:hover": {
                  bgcolor: "#F8FAFC",
                  color: "#0F172A",
                },
              }}
            >
              Save Progress & Keep Pending
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Document Zoom Modal */}
      <Dialog
        open={Boolean(previewDoc)}
        onClose={() => setPreviewDoc(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {previewDoc?.name}
          <Button
            size="small"
            href={previewDoc?.url}
            target="_blank"
            endIcon={<OpenInNew />}
          >
            Open Original
          </Button>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", p: 2 }}>
          {previewDoc && (
            <Box
              component="img"
              src={previewDoc.url}
              alt={previewDoc.name}
              sx={{
                maxWidth: "100%",
                maxHeight: "75vh",
                borderRadius: "8px",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VerificationDrawer;