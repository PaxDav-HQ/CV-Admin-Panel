import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import {
  GroupOutlined,
  PeopleAltOutlined,
  SupervisedUserCircleOutlined,
  Block,
} from "@mui/icons-material";

const UserMetricsCards = ({ metrics = {} }) => {
  const metricCards = [
    {
      label: "TOTAL USERS",
      value: metrics?.total_users?.count ?? 0,
      pct: `${(metrics?.total_users?.change ?? 0) >= 0 ? "+" : ""}${metrics?.total_users?.change ?? 0}%`,
      color: "#3B82F6",
      icon: <GroupOutlined />,
      isNeg: (metrics?.total_users?.change ?? 0) < 0,
    },
    {
      label: "CLIENTS",
      value: metrics?.clients?.count ?? 0,
      pct: `${(metrics?.clients?.change ?? 0) >= 0 ? "+" : ""}${metrics?.clients?.change ?? 0}%`,
      color: "#10B981",
      icon: <PeopleAltOutlined />,
      isNeg: (metrics?.clients?.change ?? 0) < 0,
    },
    {
      label: "AGENTS",
      value: metrics?.agents?.count ?? 0,
      pct: `${(metrics?.agents?.change ?? 0) >= 0 ? "+" : ""}${metrics?.agents?.change ?? 0}%`,
      color: "#F59E0B",
      icon: <SupervisedUserCircleOutlined />,
      isNeg: (metrics?.agents?.change ?? 0) < 0,
    },
    {
      label: "BANNED USERS",
      value: metrics?.banned_users?.count ?? 0,
      pct: `${(metrics?.banned_users?.change ?? 0) >= 0 ? "+" : ""}${metrics?.banned_users?.change ?? 0}%`,
      color: "#EF4444",
      icon: <Block />,
      isNeg: (metrics?.banned_users?.change ?? 0) > 0,
    },
  ];

  return (
    <div className="row g-3 mb-4 mx-0">
      {metricCards.map((item, idx) => (
        <div key={idx} className="col-12 col-sm-6 col-lg-3 px-1">
          <Paper elevation={0} className="p-3 border" sx={{ borderRadius: "16px", minWidth: 0, width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Box
                sx={{
                  p: 1,
                  borderRadius: "50%",
                  bgcolor: `${item.color}15`,
                  color: item.color,
                  display: "flex",
                }}
              >
                {item.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{ color: item.isNeg ? "#EF4444" : "#10B981", fontWeight: 700 }}
              >
                {item.pct}
              </Typography>
            </div>
            <Typography
              variant="caption"
              className="text-muted fw-bold d-block mb-1"
            >
              {item.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {item.value?.toLocaleString() || 0}
            </Typography>
            <Typography variant="caption" className="text-muted">
              vs last month
            </Typography>
          </Paper>
        </div>
      ))}
    </div>
  );
};

export default UserMetricsCards;