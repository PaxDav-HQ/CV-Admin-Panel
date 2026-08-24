import React from "react";
import { Typography, Stack, Button } from "@mui/material";
import { FileDownloadOutlined, Add } from "@mui/icons-material";

const ListingsHeader = ({ onAddNew }) => {
  return (
    <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
      <div>
        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.5px" }}
        >
          Listings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dashboard &gt; Listings &gt; All Listings
        </Typography>
      </div>
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlined />}
          sx={{
            textTransform: "none",
            color: "#374151",
            borderColor: "#D1D5DB",
            fontWeight: 600,
            borderRadius: "10px",
            px: 2.5,
          }}
        >
          Export Listings
        </Button>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddNew}
          sx={{
            textTransform: "none",
            bgcolor: "#111827",
            color: "#fff",
            fontWeight: 600,
            borderRadius: "10px",
            px: 2.5,
            "&:hover": { bgcolor: "#1F2937" },
          }}
        >
          Add New Listing
        </Button>
      </Stack>
    </div>
  );
};

export default ListingsHeader;