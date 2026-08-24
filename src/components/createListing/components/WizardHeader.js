import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";

const WizardHeader = ({ title, currentStep, onBack }) => {
  return (
    <Box
      sx={{
        px: { xs: 2, md: 5 },
        py: 2.5,
        borderBottom: "1px solid #F3F4F6",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <IconButton
        onClick={onBack}
        size="small"
        sx={{ border: "1px solid #E5E7EB", borderRadius: "10px", p: 1 }}
      >
        <ArrowBackIosNew sx={{ fontSize: 16, color: "#374151" }} />
      </IconButton>
      <Typography
        variant="subtitle1"
        sx={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontWeight: 700, color: "#9CA3AF" }}
      >
        Step {currentStep} of 3
      </Typography>
    </Box>
  );
};

export default WizardHeader;