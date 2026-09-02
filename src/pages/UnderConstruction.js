import React from "react";
import { Box, Typography, Button, Paper, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ConstructionOutlined,
  ArrowBack,
  DashboardOutlined,
} from "@mui/icons-material";

const UnderConstruction = ({
  featureName = "This Feature",
  estimatedRelease = "Coming Soon",
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "75vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Paper
        elevation={0}
        className="border text-center"
        sx={{
          maxWidth: 520,
          width: "100%",
          p: { xs: 3, sm: 5 },
          borderRadius: "24px",
          bgcolor: "#FFFFFF",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "20px",
            bgcolor: "#ECFDF5",
            color: "#017E53",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2.5,
          }}
        >
          <ConstructionOutlined sx={{ fontSize: 36 }} />
        </Box>

        <Chip
          label={estimatedRelease}
          size="small"
          sx={{
            bgcolor: "#FFFBEB",
            color: "#D97706",
            fontWeight: 700,
            fontSize: "11px",
            mb: 2,
            border: "1px solid #FDE68A",
          }}
        />

        <Typography
          variant="h5"
          sx={{ fontWeight: 800, color: "#111827", mb: 1 }}
        >
          Under Construction
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#6B7280",
            lineHeight: 1.6,
            maxWidth: 380,
            mx: "auto",
            mb: 4,
            fontSize: "13.5px",
          }}
        >
          We're currently building out <strong>{featureName}</strong> to ensure
          a smooth administrative experience. Please check back shortly.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            justifyContent: "center",
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: "10px",
              borderColor: "#E5E7EB",
              color: "#374151",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              py: 1,
              px: 2.5,
              "&:hover": { borderColor: "#D1D5DB", bgcolor: "#F9FAFB" },
            }}
          >
            Go Back
          </Button>

          <Button
            variant="contained"
            startIcon={<DashboardOutlined />}
            onClick={() => navigate("/admin")}
            sx={{
              borderRadius: "10px",
              bgcolor: "#017E53",
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "13px",
              py: 1,
              px: 2.5,
              "&:hover": { bgcolor: "#016744" },
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
export default UnderConstruction;