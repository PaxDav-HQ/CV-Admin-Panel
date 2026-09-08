import React from "react";
import { Box, Typography, Paper, Chip, Button, Stack } from "@mui/material";
import {
  AddHomeWorkOutlined,
  HandymanOutlined,
  CampaignOutlined,
  ManageAccountsOutlined,
  VerifiedUserOutlined,
  AssessmentOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const QuickActionsModule = ({ pendingVerificationsCount = 1 }) => {
  const navigate = useNavigate();
  const actions = [
    { label: "Add Property / Listing", icon: <AddHomeWorkOutlined sx={{ fontSize: 18, color: "#6B7280" }} />, route: "/admin/property-types" },
    { label: "Add Services", icon: <HandymanOutlined sx={{ fontSize: 18, color: "#6B7280" }} />, route: "/admin/services" },
    // { label: "Send Announcement", icon: <CampaignOutlined sx={{ fontSize: 18, color: "#6B7280" }} />, route: "/admin/announcements" },
    { label: "Manage Users", icon: <ManageAccountsOutlined sx={{ fontSize: 18, color: "#6B7280" }} />, route: "/admin/users" },
    {
      label: "Approve Verifications",
      icon: <VerifiedUserOutlined sx={{ fontSize: 18, color: "#6B7280" }} />,
      badge: pendingVerificationsCount,
      route: "/admin/verification",
    },
    { label: "View Reports", route: "/admin/reports", icon: <AssessmentOutlined sx={{ fontSize: 18, color: "#6B7280" }} /> },
  ];

  return (
    <Paper elevation={0} className="p-4 border h-100 d-flex flex-column" sx={{ borderRadius: "20px", bgcolor: "#fff" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", mb: 2 }}>
        Quick Actions
      </Typography>
      <Stack spacing={1.2} sx={{ flexGrow: 1 }}>
        {actions.map((act, i) => (
          <Button
            key={i}
            onClick={() => navigate(act.route)}
            fullWidth
            variant="outlined"
            startIcon={act.icon}
            endIcon={
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {act.badge && (
                  <Chip
                    label={act.badge}
                    size="small"
                    sx={{ bgcolor: "#DCFCE7", color: "#16A34A", fontWeight: 700, height: "18px", fontSize: "10.5px" }}
                  />
                )}
                <ChevronRightOutlined sx={{ color: "#9CA3AF", fontSize: 16 }} />
              </Box>
            }
            sx={{
              justifyContent: "space-between",
              textTransform: "none",
              color: "#374151",
              borderColor: "#F3F4F6",
              borderRadius: "10px",
              py: 1,
              px: 1.5,
              fontWeight: 600,
              fontSize: "12.5px",
              "&:hover": { borderColor: "#E5E7EB", bgcolor: "#F9FAFB" },
            }}
          >
            {act.label}
          </Button>
        ))}
      </Stack>
      {/* <Button fullWidth sx={{ textTransform: "none", color: "#16A34A", fontWeight: 700, mt: 2, fontSize: "13px" }}>
        View all shortcuts
      </Button> */}
    </Paper>
  );
};

export default QuickActionsModule;