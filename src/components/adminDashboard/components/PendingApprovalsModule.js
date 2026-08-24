import React, { useState } from "react";
import { Typography, Paper, Chip, Avatar, Button, Tabs, Tab, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";

const TAB_TYPES = ["property", "service", "verification"];

const PendingApprovalsModule = ({ pendingApprovals = [], pendingCounts = {}, onAction }) => {
  const [approvalTab, setApprovalTab] = useState(0);

  const currentApprovals = pendingApprovals.filter(
    (item) => item.type?.toLowerCase() === TAB_TYPES[approvalTab]
  );

  return (
    <Paper elevation={0} className="border h-100 d-flex flex-column" sx={{ borderRadius: "20px", bgcolor: "#fff", overflow: "hidden" }}>
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
            "& .MuiTab-root": { minHeight: "34px", py: 0.5, px: 1.5, textTransform: "none", fontSize: "12px", fontWeight: 700 },
          }}
        >
          <Tab label={`Listings (${pendingCounts.listings ?? 0})`} sx={{ "&.Mui-selected": { color: "#16A34A" } }} />
          <Tab label={`Services (${pendingCounts.services ?? 0})`} sx={{ "&.Mui-selected": { color: "#16A34A" } }} />
          <Tab label={`Verifications (${pendingCounts.verifications ?? 0})`} sx={{ "&.Mui-selected": { color: "#16A34A" } }} />
        </Tabs>
      </div>

      <div className="p-3 flex-grow-1" style={{ maxHeight: "380px", overflowY: "auto" }}>
        {currentApprovals.length > 0 ? (
          currentApprovals.map((item) => (
            <div key={item.id} className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between p-2 mb-2 rounded-3 border hover-row gap-2">
              <div className="d-flex align-items-center gap-3">
                <Avatar
                  src={item.image || ""}
                  variant="rounded"
                  sx={{ width: 44, height: 44, borderRadius: "8px", bgcolor: "#F3F4F6", color: "#374151", fontWeight: 700 }}
                />
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827", fontSize: "13px" }}>
                      {item.title}
                    </Typography>
                    <Chip
                      label={item.type === "property" ? "Property" : item.type === "service" ? "Service" : "Verification"}
                      size="small"
                      sx={{ bgcolor: "#ECFDF5", color: "#10B981", fontWeight: 700, fontSize: "9.5px", height: "18px" }}
                    />
                  </div>
                  <Typography variant="caption" className="text-muted d-block" style={{ fontSize: "11px" }}>
                    {item.location}
                  </Typography>
                  <Typography variant="caption" className="text-muted" style={{ fontSize: "10.5px" }}>
                    Submitted by:{" "}
                    <Avatar
                      src={item.avatar || ""}
                      variant="rounded"
                      sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#F3F4F6", color: "#374151", display: "inline-block", mr: 0.5 }}
                    />
                    <span className="text-dark">{item.submitted_by || "—"}</span>
                  </Typography>
                </div>
              </div>

              <div className="d-flex align-items-center gap-1 align-self-end align-self-sm-center">
                <Button
                  size="small"
                  onClick={() => onAction(item.id, TAB_TYPES[approvalTab], "approved")}
                  variant="outlined"
                  sx={{ color: "#16A34A", borderColor: "#DCFCE7", bgcolor: "#F0FDF4", textTransform: "none", fontWeight: 700, borderRadius: "6px", fontSize: "11px", px: 1.5, py: 0.3 }}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  onClick={() => onAction(item.id, TAB_TYPES[approvalTab], "rejected")}
                  variant="outlined"
                  sx={{ color: "#EF4444", borderColor: "#FEE2E2", bgcolor: "#FEF2F2", textTransform: "none", fontWeight: 700, borderRadius: "6px", fontSize: "11px", px: 1.5, py: 0.3 }}
                >
                  Reject
                </Button>
                <IconButton size="small">
                  <MoreVert sx={{ fontSize: 16 }} />
                </IconButton>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-5 text-muted small">No pending items in this category.</div>
        )}
      </div>

      <div className="p-2 border-top text-center mt-auto">
        <Button sx={{ textTransform: "none", color: "#16A34A", fontWeight: 700, fontSize: "12.5px" }}>
          View all pending approvals &rarr;
        </Button>
      </div>
    </Paper>
  );
};

export default PendingApprovalsModule;