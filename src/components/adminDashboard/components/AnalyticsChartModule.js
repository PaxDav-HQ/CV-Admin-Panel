import React from "react";
import { Box, Typography, Paper, Chip, Button, Stack } from "@mui/material";
import Chart from "react-apexcharts";
import { formatChartDate } from "../utils/chartDateFormatter";

const TIMEFRAMES = ["Daily", "Weekly", "Monthly", "Yearly"];

const AnalyticsChartModule = ({ chartData = [], totals = {}, timeframe, onTimeframeChange }) => {
  const lineChartCategories =
    chartData.length > 0
      ? chartData.map((d) => formatChartDate(d.date))
      : ["May 1", "May 8", "May 11", "May 16", "May 21", "May 25", "May 31"];

  const lineSeriesUsers =
    chartData.length > 0 ? chartData.map((d) => d.users) : [18, 24, 21, 29, 26, 35, 32];
  const lineSeriesBookings =
    chartData.length > 0 ? chartData.map((d) => d.bookings) : [12, 16, 14, 22, 19, 28, 25];

  const lineChartOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: "inherit",
    },
    colors: ["#10B981", "#3B82F6"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.0,
        stops: [0, 95, 100],
      },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      categories: lineChartCategories,
      labels: {
        style: { colors: "#9CA3AF", fontSize: "11px", fontWeight: 600 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#9CA3AF", fontSize: "11px", fontWeight: 600 },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "12px",
      fontWeight: 600,
      markers: { radius: 12 },
    },
  };

  const lineChartSeries = [
    { name: "Bookings", data: lineSeriesBookings },
    { name: "Users", data: lineSeriesUsers },
  ];

  return (
    <Paper elevation={0} className="p-4 border h-100" sx={{ borderRadius: "20px", bgcolor: "#fff" }}>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827" }}>
          Overview Analytics
        </Typography>
        <div className="d-flex bg-light p-1 rounded-3">
          {TIMEFRAMES.map((tab) => (
            <Button
              key={tab}
              size="small"
              onClick={() => onTimeframeChange(tab)}
              sx={{
                textTransform: "none",
                fontSize: "11px",
                px: 1.5,
                py: 0.3,
                borderRadius: "6px",
                fontWeight: timeframe === tab ? 700 : 500,
                color: timeframe === tab ? "#111827" : "#6B7280",
                bgcolor: timeframe === tab ? "#fff" : "transparent",
                boxShadow: timeframe === tab ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                "&:hover": { bgcolor: timeframe === tab ? "#fff" : "transparent" },
              }}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-12 col-md-8">
          <Box sx={{ width: "100%", height: 230 }}>
            <Chart options={lineChartOptions} series={lineChartSeries} type="area" height="100%" />
          </Box>
        </div>
        <div className="col-12 col-md-4 border-start-md ps-md-3 mt-3 mt-md-0">
          <Stack spacing={2}>
            <div>
              <Typography variant="caption" className="text-muted fw-bold d-block" style={{ fontSize: "10px" }}>
                USERS
              </Typography>
              <div className="d-flex align-items-center justify-content-between">
                <span className="fw-extrabold text-dark fs-6">
                  {(totals.users?.count ?? 0).toLocaleString()}
                </span>
                <Chip
                  label="+12.5%"
                  size="small"
                  sx={{ bgcolor: "#ECFDF5", color: "#10B981", fontWeight: 700, fontSize: "10px", height: "18px" }}
                />
              </div>
            </div>
            <div>
              <Typography variant="caption" className="text-muted fw-bold d-block" style={{ fontSize: "10px" }}>
                BOOKINGS
              </Typography>
              <div className="d-flex align-items-center justify-content-between">
                <span className="fw-extrabold text-dark fs-6">
                  {(totals.bookings?.count ?? 0).toLocaleString()}
                </span>
                <Chip
                  label="+15.3%"
                  size="small"
                  sx={{ bgcolor: "#ECFDF5", color: "#10B981", fontWeight: 700, fontSize: "10px", height: "18px" }}
                />
              </div>
            </div>
          </Stack>
        </div>
      </div>
    </Paper>
  );
};

export default AnalyticsChartModule;