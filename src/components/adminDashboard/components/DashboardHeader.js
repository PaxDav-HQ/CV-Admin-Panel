import React from "react";
import { Typography, Stack, Button } from "@mui/material";
import { FilterListOutlined, FileDownloadOutlined } from "@mui/icons-material";

const DashboardHeader = () => {
  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
      <div>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}
        >
          Welcome back, Admin! 👋
        </Typography>
        <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
          Here's what's happening on your marketplace today.
        </Typography>
      </div>
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={<FilterListOutlined sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            color: "#374151",
            borderColor: "#E5E7EB",
            bgcolor: "#fff",
            fontWeight: 600,
            borderRadius: "10px",
            px: 2.5,
            "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" },
          }}
        >
          Filter
        </Button>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlined sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            color: "#374151",
            borderColor: "#E5E7EB",
            bgcolor: "#fff",
            fontWeight: 600,
            borderRadius: "10px",
            px: 2.5,
            "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" },
          }}
        >
          Export
        </Button>
      </Stack>
    </div>
  );
};

export default DashboardHeader;