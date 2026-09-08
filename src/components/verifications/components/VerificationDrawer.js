import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  Close,
  VerifiedUserOutlined,
  OpenInNew,
} from "@mui/icons-material";

const VerificationDrawer = ({
  open,
  onClose,
  verification,
  onDecision,
  actionLoading,
}) => {
  const [adminNotes, setAdminNotes] = useState("");
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    setAdminNotes(verification?.verification?.reason || "");
  }, [verification]);

  if (!verification) return null;

  const { user, verification: details, adminActions } = verification;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 440 },
            boxSizing: "border-box",
            bgcolor: "#FFFFFF",
            overflowX: "hidden", // Prevents bottom horizontal scrollbar
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* 1. STICKY HEADER WITH PADDING */}
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <VerifiedUserOutlined sx={{ color: "#017E53", fontSize: 24 }} />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, color: "#111827", fontSize: "18px" }}
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

          {/* 2. SCROLLABLE CONTENT BODY WITH CLEAN GUTTERS */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              px: 3,
              py: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              "&::-webkit-scrollbar": { width: "6px" },
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
                p: 2,
                borderRadius: "14px",
                border: "1px solid #E2E8F0",
                bgcolor: "#F8FAFC",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar
                  src={user?.avatar}
                  sx={{
                    width: 48,
                    height: 48,
                    border: "2px solid #017E53",
                    bgcolor: "#017E53",
                  }}
                >
                  {user?.name?.[0]}
                </Avatar>
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}
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
                  gap: 1.5,
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
                        height: 90,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    <Box
                      sx={{
                        p: 1.2,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          fontSize: "11.5px",
                          color: "#1E293B",
                        }}
                        noWrap
                      >
                        {doc.name}
                      </Typography>
                      <OpenInNew sx={{ fontSize: 13, color: "#64748B", ml: 0.5 }} />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Internal Review Steps */}
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
                Internal Review Steps
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {(details?.internalReviewSteps || []).map((step) => (
                  <Paper
                    key={step.id}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: "10px",
                      border: "1px solid #E2E8F0",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.2,
                      bgcolor: "#FFFFFF",
                    }}
                  >
                    <Checkbox
                      size="small"
                      sx={{
                        color: "#94A3B8",
                        p: 0,
                        mt: 0.2,
                        "&.Mui-checked": { color: "#017E53" },
                      }}
                    />
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: "#0F172A",
                          fontSize: "12.5px",
                          lineHeight: 1.3,
                        }}
                      >
                        {step.label}{" "}
                        {step.required && (
                          <span style={{ color: "#EF4444" }}>*</span>
                        )}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748B", fontSize: "11px", display: "block", mt: 0.3 }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>

            {/* Audit Trail */}
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
                Audit Trail
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {(details?.auditTrail || []).map((trail, idx) => (
                  <Box key={idx} sx={{ display: "flex", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "#017E53",
                        mt: 0.7,
                        flexShrink: 0,
                      }}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          color: "#1E293B",
                          display: "block",
                        }}
                      >
                        {trail.action}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748B", fontSize: "11px", display: "block" }}
                      >
                        {trail.details?.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#94A3B8", fontSize: "10px" }}
                      >
                        {trail.timestamp} • by {trail.performedBy}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Admin Notes */}
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
                Admin Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter rejection reason or internal notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
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

          {/* 3. STICKY FOOTER ACTIONS WITH BALANCED INSET PADDING */}
          <Box
            sx={{
              p: 2.5,
              borderTop: "1px solid #F1F5F9",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              bgcolor: "#FFFFFF",
            }}
          >
            <Button
              variant="outlined"
              disabled={actionLoading || !adminActions?.canReject}
              onClick={() => onDecision("rejected", adminNotes)}
              sx={{
                borderColor: "#FCA5A5",
                color: "#DC2626",
                fontWeight: 700,
                borderRadius: "10px",
                py: 1.2,
                textTransform: "none",
                fontSize: "14px",
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
              disabled={actionLoading || !adminActions?.canApprove}
              onClick={() => onDecision("approved", adminNotes)}
              sx={{
                bgcolor: "#017E53",
                color: "#FFFFFF",
                fontWeight: 700,
                borderRadius: "10px",
                py: 1.2,
                textTransform: "none",
                fontSize: "14px",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#016744",
                  boxShadow: "0 4px 12px rgba(1, 126, 83, 0.2)",
                },
              }}
            >
              Approve
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