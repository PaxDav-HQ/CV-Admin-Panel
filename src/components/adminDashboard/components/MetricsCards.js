import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import {
  PeopleAltOutlined,
  FormatListBulletedOutlined,
  CalendarTodayOutlined,
  CreditCardOutlined,
  TrendingUpOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import { formatNaira } from "../../../utils/formatters";

const MetricsCards = ({ totals = {} }) => {
  const cardsOverview = [
    {
      title: "TOTAL USERS",
      val: (totals.users?.count ?? 0).toLocaleString(),
      pct: `${(totals.users?.change ?? 0) >= 0 ? "+" : ""}${totals.users?.change ?? 0}%`,
      icon: <PeopleAltOutlined sx={{ color: "#3B82F6", fontSize: 20 }} />,
      bg: "#EFF6FF",
    },
    {
      title: "ACTIVE LISTINGS",
      val: (totals.active_listings?.count ?? 0).toLocaleString(),
      pct: `${(totals.active_listings?.change ?? 0) >= 0 ? "+" : ""}${totals.active_listings?.change ?? 0}%`,
      icon: <FormatListBulletedOutlined sx={{ color: "#10B981", fontSize: 20 }} />,
      bg: "#ECFDF5",
    },
    {
      title: "TOTAL BOOKINGS",
      val: (totals.bookings?.count ?? 0).toLocaleString(),
      pct: `${(totals.bookings?.change ?? 0) >= 0 ? "+" : ""}${totals.bookings?.change ?? 0}%`,
      icon: <CalendarTodayOutlined sx={{ color: "#6366F1", fontSize: 20 }} />,
      bg: "#EEF2FF",
    },
    {
      title: "TOTAL REVENUE",
      val: formatNaira(totals.revenue?.amount),
      pct: `${(totals.revenue?.change ?? 0) >= 0 ? "+" : ""}${totals.revenue?.change ?? 0}%`,
      icon: <CreditCardOutlined sx={{ color: "#F97316", fontSize: 20 }} />,
      bg: "#FFF7ED",
    },
    {
      title: "PLATFORM COMMISSION",
      val: formatNaira(totals.commission?.amount),
      pct: `${(totals.commission?.change ?? 0) >= 0 ? "+" : ""}${totals.commission?.change ?? 0}%`,
      icon: <TrendingUpOutlined sx={{ color: "#14B8A6", fontSize: 20 }} />,
      bg: "#F0FDFA",
    },
  ];

  return (
    <div className="row g-3 mb-4">
      {cardsOverview.map((card, idx) => {
        const isNegative = card.pct.startsWith("-");
        return (
          <div key={idx} className="col-12 col-sm-6 col-md-4 col-xl">
            <Paper
              elevation={0}
              className="p-3 border h-100"
              sx={{ borderRadius: "16px", bgcolor: "#fff" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Box sx={{ p: 1, bgcolor: card.bg, borderRadius: "10px", display: "flex" }}>
                  {card.icon}
                </Box>
                <InfoOutlined sx={{ fontSize: 16, color: "#9CA3AF", cursor: "pointer" }} />
              </div>
              <Typography
                variant="caption"
                className="text-muted fw-bold d-block mb-1"
                style={{ fontSize: "11px", letterSpacing: "0.5px" }}
              >
                {card.title}
              </Typography>
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 800, color: "#111827", fontSize: { xs: "18px", md: "20px" } }}
                >
                  {card.val}
                </Typography>
                <Chip
                  label={card.pct}
                  size="small"
                  sx={{
                    bgcolor: isNegative ? "#FEF2F2" : "#ECFDF5",
                    color: isNegative ? "#EF4444" : "#10B981",
                    fontWeight: 700,
                    fontSize: "10.5px",
                    height: "20px",
                    borderRadius: "6px",
                  }}
                />
              </div>
              <Typography
                variant="caption"
                className="text-muted d-block mt-1"
                style={{ fontSize: "11px" }}
              >
                vs last month
              </Typography>
            </Paper>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;