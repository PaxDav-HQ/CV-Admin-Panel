import React, { useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

import { useAdminDashboardData } from "./hooks/useAdminDashboardData";
import DashboardHeader from "./components/DashboardHeader";
import MetricsCards from "./components/MetricsCards";
import AnalyticsChartModule from "./components/AnalyticsChartModule";
import BookingStatusDonut from "./components/BookingStatusDonut";
import QuickActionsModule from "./components/QuickActionsModule";
import PendingApprovalsModule from "./components/PendingApprovalsModule";
import RecentActivityModule from "./components/RecentActivityModule";
import PlatformSummaryModule from "./components/PlatformSummaryModule";

const AdminDashboardMain = () => {
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem("userToken");
  const [timeframe, setTimeframe] = useState("Monthly");

  const { dashboardData, isLoading, handleApprovalAction } = useAdminDashboardData(uri, token, timeframe);

  if (isLoading || !dashboardData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "75vh" }}>
        <CircularProgress sx={{ color: "#22C55E" }} />
      </Box>
    );
  }

  const {
    totals = {},
    bookingStatus = {},
    chartData = [],
    pendingCounts = {},
    pendingApprovals = [],
    recentActivity = [],
    platformSummary = {},
  } = dashboardData;

  return (
    <div className="container-fluid py-4 px-3 px-md-4" style={{ backgroundColor: "#F9FAFB", minHeight: "100vh" }}>
      {/* 1. Header Actions */}
      <DashboardHeader />

      {/* 2. Top Overview Cards */}
      <MetricsCards totals={totals} />

      {/* 3. Mid-Level Analytics Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-xl-6">
          <AnalyticsChartModule
            chartData={chartData}
            totals={totals}
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
          />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <BookingStatusDonut bookingStatus={bookingStatus} />
        </div>
        <div className="col-12 col-md-6 col-xl-3">
          <QuickActionsModule pendingVerificationsCount={pendingCounts.verifications} />
        </div>
      </div>

      {/* 4. Lower Data Modules */}
      <div className="row g-3">
        <div className="col-12 col-xl-6">
          <PendingApprovalsModule
            pendingApprovals={pendingApprovals}
            pendingCounts={pendingCounts}
            onAction={handleApprovalAction}
          />
        </div>
        <div className="col-12 col-md-7 col-xl-3.5" style={{ flex: "1 0 28%" }}>
          <RecentActivityModule recentActivity={recentActivity} />
        </div>
        <div className="col-12 col-md-5 col-xl-2.5" style={{ flex: "1 0 22%" }}>
          <PlatformSummaryModule platformSummary={platformSummary} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardMain;