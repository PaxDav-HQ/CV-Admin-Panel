import React from "react";
import { Box, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";

const STEPS = [
  { step: 1, label: "Property Details" },
  { step: 2, label: "Pricing & Media" },
  { step: 3, label: "Review & Submit" },
];

const WizardStepper = ({ currentStep }) => {
  return (
    <Box sx={{ maxWidth: "550px", mx: "auto", mb: 5 }}>
      <div className="d-flex justify-content-between align-items-center position-relative">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="d-flex flex-column align-items-center"
            style={{ zIndex: 2 }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: currentStep >= s.step ? "#017E53" : "#F3F4F6",
                color: currentStep >= s.step ? "#fff" : "#9CA3AF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {currentStep > s.step ? <Check sx={{ fontSize: 16 }} /> : s.step}
            </Box>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                fontWeight: currentStep === s.step ? 700 : 500,
                color: currentStep >= s.step ? "#017E53" : "#9CA3AF",
                fontSize: "11.5px",
              }}
            >
              {s.label}
            </Typography>
          </div>
        ))}
        <Box
          sx={{
            position: "absolute",
            top: "16px",
            left: "12%",
            right: "12%",
            height: "2px",
            bgcolor: "#E5E7EB",
            zIndex: 1,
          }}
        />
      </div>
    </Box>
  );
};

export default WizardStepper;