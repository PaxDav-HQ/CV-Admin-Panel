import React from "react";
import { Typography, Paper, Button, Stack } from "@mui/material";
import { ChevronRightOutlined } from "@mui/icons-material";

const PlatformSummaryModule = ({ platformSummary = {} }) => {
  const summaryItems = [
    { label: "Total Properties", val: (platformSummary.total_properties ?? 0).toLocaleString() },
    { label: "Total Services", val: (platformSummary.total_services ?? 0).toLocaleString() },
    { label: "Total Events Centers", val: (platformSummary.total_event_centers ?? 0).toLocaleString() },
    { label: "Total Hotels", val: (platformSummary.total_hotels ?? 0).toLocaleString() },
    { label: "Active Cities", val: (platformSummary.active_cities ?? 0).toLocaleString() },
    { label: "Total Reviews", val: (platformSummary.total_reviews ?? 0).toLocaleString() },
  ];

  return (
    <Paper elevation={0} className="p-4 border h-100 d-flex flex-column justify-content-between" sx={{ borderRadius: "20px", bgcolor: "#fff" }}>
      <div>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 2.5 }}>
          Platform Summary
        </Typography>
        <Stack spacing={1.8}>
          {summaryItems.map((item, i) => (
            <div key={i} className="d-flex justify-content-between align-items-center" style={{ fontSize: "12px" }}>
              <span className="text-muted fw-medium">{item.label}</span>
              <strong className="text-dark">{item.val}</strong>
            </div>
          ))}
        </Stack>
      </div>
      <Button
        variant="text"
        endIcon={<ChevronRightOutlined sx={{ fontSize: 14 }} />}
        sx={{
          textTransform: "none",
          color: "#16A34A",
          fontWeight: 700,
          mt: 3,
          fontSize: "12.5px",
          p: 0,
          justifyContent: "flex-start",
        }}
      >
        View full report
      </Button>
    </Paper>
  );
};

export default PlatformSummaryModule;