import React from "react";
import { Box, Typography, Paper, Stack } from "@mui/material";
import Chart from "react-apexcharts";

const BookingStatusDonut = ({ bookingStatus = {} }) => {
  const donutSeries = [
    bookingStatus.completed?.count || 22,
    bookingStatus.confirmed?.count || 23,
    bookingStatus.pending?.count || 6,
    bookingStatus.cancelled?.count || 17,
  ];

  const donutOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: ["Completed", "Confirmed", "Pending", "Cancelled"],
    colors: ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"],
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 800,
              color: "#111827",
              offsetY: 8,
              formatter: () => (bookingStatus.total ?? 71).toLocaleString(),
            },
            total: {
              show: true,
              showAlways: true,
              label: "",
              formatter: () => (bookingStatus.total ?? 71).toLocaleString(),
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Bookings`,
      },
    },
  };

  const statusItems = [
    { label: "Completed", count: bookingStatus.completed?.count, pct: bookingStatus.completed?.percentage, color: "#10B981" },
    { label: "Confirmed", count: bookingStatus.confirmed?.count, pct: bookingStatus.confirmed?.percentage, color: "#3B82F6" },
    { label: "Pending", count: bookingStatus.pending?.count, pct: bookingStatus.pending?.percentage, color: "#F59E0B" },
    { label: "Cancelled", count: bookingStatus.cancelled?.count, pct: bookingStatus.cancelled?.percentage, color: "#EF4444" },
  ];

  return (
    <Paper elevation={0} className="p-4 border h-100 d-flex flex-column" sx={{ borderRadius: "20px", bgcolor: "#fff" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", mb: 1 }}>
        Booking Status
      </Typography>

      <div
        className="p-3 my-auto rounded-3 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#F9FAFB", minHeight: "180px" }}
      >
        <Box sx={{ width: "100%", maxWidth: "160px" }}>
          <Chart options={donutOptions} series={donutSeries} type="donut" height={170} />
        </Box>
      </div>

      <Stack spacing={1} sx={{ mt: 2 }}>
        {statusItems.map((item) => (
          <div key={item.label} className="d-flex justify-content-between align-items-center" style={{ fontSize: "12px" }}>
            <div className="d-flex align-items-center gap-2">
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: item.color }} />
              <span className="text-muted fw-medium">{item.label}</span>
            </div>
            <span className="fw-bold text-dark">
              {item.count}{" "}
              <span className="text-muted fw-normal" style={{ fontSize: "11px" }}>
                ({item.pct}%)
              </span>
            </span>
          </div>
        ))}
      </Stack>
    </Paper>
  );
};

export default BookingStatusDonut;