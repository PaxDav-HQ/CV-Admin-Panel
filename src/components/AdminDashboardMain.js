import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Grid, Paper, Chip, Avatar, Button, 
  Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText,
  Divider, CircularProgress, Stack 
} from "@mui/material";
import { 
  PeopleAltOutlined, ListAltOutlined, CalendarTodayOutlined, 
  AccountBalanceWalletOutlined, AutoGraphOutlined, FilterListOutlined,
  IosShareOutlined, CheckCircleOutlined, CancelOutlined, AddHomeWorkOutlined,
  HandymanOutlined, CampaignOutlined, VerifiedUserOutlined,
  ChevronRightOutlined
} from "@mui/icons-material";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useSelector } from "react-redux";
import axios from "axios";

const AdminDashboardMain = () => {
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem("userToken");

  // State Management
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approvalTab, setApprovalTab] = useState(0);
  const [timeframe, setTimeframe] = useState("Monthly");

  // Fetch Dashboard Summary Data from Backend
  useEffect(() => {
    if (!token) return;
    
    setIsLoading(true);
    axios
      .get(`${uri}admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        console.log(res.data)
        // setDashboardData(res.data || res.data.summary);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed capturing dashboard data parameters stream:", err);
        setIsLoading(false);
      });
  }, [uri, token]);

  // Action Routine Dispatch Handler for Approvals
  const handleApprovalAction = async (itemId, targetType, targetStatus) => {
    try {
      await axios.patch(`${uri}admin/approvals/${targetType}/${itemId}`, 
        { status: targetStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Instantly update local state to reflect action on UI without page refresh
      const updatedData = { ...dashboardData };
      updatedData.pendingApprovals = updatedData.pendingApprovals.filter(item => item._id !== itemId);
      setDashboardData(updatedData);
    } catch (err) {
      console.error(`Failed handling item status update routine for ${targetType}:`, err);
    }
  };

  if (isLoading || !dashboardData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70vh" }}>
        <CircularProgress sx={{ color: "#22C55E" }} />
      </Box>
    );
  }

  // Destructure payload objects safely with explicit fallbacks
  const { 
    metrics = {}, 
    bookingStatus = {}, 
    pendingApprovals = [], 
    recentActivity = [], 
    platformSummary = {},
    analyticsChart = {} // Optional: if backend provides chart coordinates
  } = dashboardData;

  // Overview top metrics configuration cards mapping
  const cardsOverview = [
    { title: "TOTAL USERS", val: metrics.totalUsers?.value?.toLocaleString() || "18,458", pct: "+12.5%", icon: <PeopleAltOutlined sx={{ color: "#2563EB" }} />, bg: "#EFF6FF" },
    { title: "ACTIVE LISTINGS", val: metrics.activeListings?.value?.toLocaleString() || "6,782", pct: "+4.7%", icon: <ListAltOutlined sx={{ color: "#16A34A" }} />, bg: "#F0FDF4" },
    { title: "TOTAL BOOKINGS", val: metrics.totalBookings?.value?.toLocaleString() || "2,431", pct: "+15.3%", icon: <CalendarTodayOutlined sx={{ color: "#8B5CF6" }} />, bg: "#F5F3FF" },
    { title: "TOTAL REVENUE", val: `₦${Number(metrics.totalRevenue?.value || 24560000).toLocaleString()}`, pct: "+18.6%", icon: <AccountBalanceWalletOutlined sx={{ color: "#EA580C" }} />, bg: "#FFF7ED" },
    { title: "PLATFORM COMMISSION", val: `₦${Number(metrics.platformCommission?.value || 4912000).toLocaleString()}`, pct: "+16.2%", icon: <AutoGraphOutlined sx={{ color: "#06B6D4" }} />, bg: "#ECFEFF" },
  ];

  // Map backend line datasets safely (uses backend arrays if they exist, else uses mockup defaults)
  const chartXAxis = analyticsChart.labels || ["May 1", "May 8", "May 11", "May 16", "May 21", "May 25", "May 31"];
  const usersLineData = analyticsChart.usersSeries || [18, 24, 21, 29, 26, 35, 32];
  const bookingsLineData = analyticsChart.bookingsSeries || [12, 16, 14, 22, 19, 28, 25];

  // Map backend donut stats explicitly into MUI X Charts data blueprint
  const pieChartData = [
    { id: 0, value: bookingStatus.completed || 1512, label: "Completed", color: "#22C55E" },
    { id: 1, value: bookingStatus.confirmed || 542, label: "Confirmed", color: "#2563EB" },
    { id: 2, value: bookingStatus.pending || 231, label: "Pending", color: "#EAB308" },
    { id: 3, value: bookingStatus.cancelled || 146, label: "Cancelled", color: "#EF4444" },
  ];

  const tabTypesMap = ["property", "service", "verification"];
  const currentFilteredApprovals = pendingApprovals.filter(item => item.type?.toLowerCase() === tabTypesMap[approvalTab]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#F9FAFB", minHeight: "100vh" }}>
      
      {/* HEADER ACTION CONTROLS SECTION */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827" }}>
            Welcome back, Admin! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Here's what's happening on your marketplace today.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<FilterListOutlined />} sx={{ borderColor: "#E5E7EB", color: "#4B5563", textTransform: "none", borderRadius: "8px", fontWeight: 600, bgcolor: "#fff" }}>Filter</Button>
          <Button variant="outlined" startIcon={<IosShareOutlined />} sx={{ borderColor: "#E5E7EB", color: "#4B5563", textTransform: "none", borderRadius: "8px", fontWeight: 600, bgcolor: "#fff" }}>Export</Button>
        </Stack>
      </Box>

      {/* METRICS INFRASTRUCTURE ROWS GRID */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {cardsOverview.map((card, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={idx}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #F3F4F6", height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ p: 1, bgcolor: card.bg, borderRadius: "10px", display: "flex" }}>{card.icon}</Box>
                <Chip label={card.pct} size="small" sx={{ bgcolor: "#ECFDF3", color: "#16A34A", fontWeight: 700, fontSize: "11px", height: "20px" }} />
              </Box>
              <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600, letterSpacing: "0.5px" }}>{card.title}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", mt: 0.5 }}>{card.val}</Typography>
              <Typography variant="caption" sx={{ color: "#9CA3AF", display: "block", mt: 0.5 }}>vs last month</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* MID-LEVEL ANALYTICS ROW BLOCK CONTAINER */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Module A: LIVE MUI X LINE CHART */}
        <Grid item xs={12} lg={6.5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid #F3F4F6", height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827" }}>Overview Analytics</Typography>
              <Stack direction="row" spacing={0.5} sx={{ bgcolor: "#F3F4F6", p: 0.5, borderRadius: "10px" }}>
                {["Daily", "Weekly", "Monthly", "Yearly"].map((tab) => (
                  <Button 
                    key={tab} 
                    size="small"
                    onClick={() => setTimeframe(tab)}
                    sx={{ 
                      textTransform: "none", fontSize: "12px", borderRadius: "8px",
                      fontWeight: timeframe === tab ? 700 : 500,
                      color: timeframe === tab ? "#111827" : "#6B7280",
                      bgcolor: timeframe === tab ? "#fff" : "transparent",
                      "&:hover": { bgcolor: timeframe === tab ? "#fff" : "transparent" }
                    }}
                  >
                    {tab}
                  </Button>
                ))}
              </Stack>
            </Box>
            
            <Box sx={{ width: "100%", height: 260 }}>
              <LineChart
                xAxis={[{ scaleType: "point", data: chartXAxis }]}
                series={[
                  { data: usersLineData, label: "Users", color: "#2563EB", curve: "linear" },
                  { data: bookingsLineData, label: "Bookings", color: "#22C55E", curve: "linear" }
                ]}
                height={250}
                margin={{ left: 35, right: 15, top: 25, bottom: 25 }}
                slotProps={{ legend: { labelStyle: { fontSize: 12, fontWeight: 600 } } }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Module B: LIVE MUI X DONUT CHART */}
        <Grid item xs={12} md={6} lg={2.5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid #F3F4F6", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", mb: 1 }}>Booking Status</Typography>
            
            <Box sx={{ width: "100%", height: 180, display: "flex", justifyContent: "center", alignItems: "center", position: "relative", my: 1 }}>
              <PieChart
                series={[
                  {
                    data: pieChartData,
                    innerRadius: 55,
                    outerRadius: 75,
                    paddingAngle: 3,
                    cornerRadius: 5,
                  },
                ]}
                height={170}
                slotProps={{ legend: { display: "none" } }} // Kept hidden to layout custom legend matching mockup exactly
              />
              <Box sx={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", fontSize: "18px" }}>
                  {(bookingStatus.total || 2431).toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Stack spacing={1} sx={{ mt: "auto" }}>
              {pieChartData.map((item) => (
                <Box key={item.label} sx={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Box sx={{ width: 8, height: 8, bgcolor: item.color, borderRadius: "50%" }} />
                    <span style={{ color: "#6B7280", fontWeight: 500 }}>{item.label}</span>
                  </Stack>
                  <strong style={{ color: "#111827" }}>{item.value.toLocaleString()}</strong>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Module C: QUICK SHORTCUT ACTIONS */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid #F3F4F6", height: "100%" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", mb: 2.5 }}>Quick Actions</Typography>
            <Stack spacing={1.5}>
              <Button fullWidth variant="outlined" endIcon={<ChevronRightOutlined />} startIcon={<AddHomeWorkOutlined />} sx={{ justifyContent: "space-between", textTransform: "none", color: "#4B5563", borderColor: "#E5E7EB", borderRadius: "12px", py: 1.2, fontWeight: 600, fontSize: "13.5px" }}>Add Property / Listing</Button>
              <Button fullWidth variant="outlined" endIcon={<ChevronRightOutlined />} startIcon={<HandymanOutlined />} sx={{ justifyContent: "space-between", textTransform: "none", color: "#4B5563", borderColor: "#E5E7EB", borderRadius: "12px", py: 1.2, fontWeight: 600, fontSize: "13.5px" }}>Add Services</Button>
              <Button fullWidth variant="outlined" endIcon={<ChevronRightOutlined />} startIcon={<CampaignOutlined />} sx={{ justifyContent: "space-between", textTransform: "none", color: "#4B5563", borderColor: "#E5E7EB", borderRadius: "12px", py: 1.2, fontWeight: 600, fontSize: "13.5px" }}>Send Announcement</Button>
              <Button fullWidth variant="outlined" endIcon={<ChevronRightOutlined />} startIcon={<PeopleAltOutlined />} sx={{ justifyContent: "space-between", textTransform: "none", color: "#4B5563", borderColor: "#E5E7EB", borderRadius: "12px", py: 1.2, fontWeight: 600, fontSize: "13.5px" }}>Manage Users</Button>
              <Button fullWidth variant="outlined" endIcon={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><Chip label="12" size="small" sx={{ bgcolor: "#DCFCE7", color: "#16A34A", fontWeight: 700, height: "20px", fontSize: "11px" }} /><ChevronRightOutlined /></Box>} startIcon={<VerifiedUserOutlined />} sx={{ justifyContent: "space-between", textTransform: "none", color: "#4B5563", borderColor: "#E5E7EB", borderRadius: "12px", py: 1.2, fontWeight: 600, fontSize: "13.5px" }}>Approve Verifications</Button>
            </Stack>
            <Button fullWidth sx={{ textTransform: "none", color: "#16A34A", fontWeight: 700, mt: 3, fontSize: "14px" }}>View all shortcuts</Button>
          </Paper>
        </Grid>
      </Grid>

      {/* LOWER DATA BLOCK ELEMENT GRIDS */}
      <Grid container spacing={3}>
        {/* Module D: PENDING APPROVAL LISTINGS AND SERVICES LEDGER */}
        <Grid item xs={12} lg={6.5}>
          <Paper elevation={0} sx={{ borderRadius: "20px", border: "1px solid #F3F4F6", height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 3, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827" }}>Pending Approvals</Typography>
              <Tabs value={approvalTab} onChange={(e, val) => setApprovalTab(val)} sx={{ "& .MuiTabs-indicator": { bgcolor: "#16A34A" } }}>
                <Tab label="Listings (12)" sx={{ textTransform: "none", fontWeight: 700, fontSize: "13px", "&.Mui-selected": { color: "#16A34A" } }} />
                <Tab label="Services (7)" sx={{ textTransform: "none", fontWeight: 700, fontSize: "13px", "&.Mui-selected": { color: "#16A34A" } }} />
                <Tab label="Verifications (12)" sx={{ textTransform: "none", fontWeight: 700, fontSize: "13px", "&.Mui-selected": { color: "#16A34A" } }} />
              </Tabs>
            </Box>
            
            <Divider />

            <Box sx={{ flexGrow: 1, p: 2 }}>
              {currentFilteredApprovals.length > 0 ? (
                currentFilteredApprovals.map((item) => (
                  <Box key={item._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, mb: 1, borderRadius: "12px", "&:hover": { bgcolor: "#FAFAFA" } }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar src={item.thumbnail || "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=150"} variant="rounded" sx={{ width: 50, height: 50, borderRadius: "8px" }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "#111827" }}>{item.title || "Luxury 4 Bedroom Duplex"}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{item.subtitle || "Lekki Phase 1, Lagos"}</Typography>
                        <Typography variant="caption" sx={{ color: "#9CA3AF" }}>Submitted by: <strong style={{ color: "#4B5563" }}>{item.author || "John Doe"}</strong></Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" onClick={() => handleApprovalAction(item._id, tabTypesMap[approvalTab], "approved")} variant="outlined" startIcon={<CheckCircleOutlined />} sx={{ color: "#16A34A", borderColor: "#DCFCE7", bgcolor: "#F0FDF4", textTransform: "none", fontWeight: 700, borderRadius: "8px", "&:hover": { bgcolor: "#DCFCE7" } }}>Approve</Button>
                      <Button size="small" onClick={() => handleApprovalAction(item._id, tabTypesMap[approvalTab], "rejected")} variant="outlined" startIcon={<CancelOutlined />} sx={{ color: "#EF4444", borderColor: "#FEE2E2", bgcolor: "#FEF2F2", textTransform: "none", fontWeight: 700, borderRadius: "8px", "&:hover": { bgcolor: "#FEE2E2" } }}>Reject</Button>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6, color: "#9CA3AF" }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>No items awaiting validation inside this ledger index slot.</Typography>
                </Box>
              )}
            </Box>
            
            <Box sx={{ p: 2.5, borderTop: "1px solid #F3F4F6", textAlign: "center", mt: "auto" }}>
              <Button sx={{ textTransform: "none", color: "#16A34A", fontWeight: 700, fontSize: "14px" }}>View all pending approvals →</Button>
            </Box>
          </Paper>
        </Grid>

        {/* Module E: RECENT ACTIVITY TIMELINE */}
        <Grid item xs={12} md={7} lg={3.2}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid #F3F4F6", height: "100%", display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", mb: 2 }}>Recent Activity</Typography>
            <List disablePadding sx={{ flexGrow: 1 }}>
              {recentActivity.length > 0 ? (
                recentActivity.map((act, index) => (
                  <ListItem key={act.id || index} disableGutters sx={{ alignItems: "flex-start", py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: "44px" }}>
                      <Avatar sx={{ bgcolor: "#F3F4F6", color: "#4B5563", width: 34, height: 34 }} />
                    </ListItemAvatar>
                    <ListItemText 
                      primary={<Typography variant="body2" sx={{ fontWeight: 700, color: "#111827" }}>{act.title || "New user registered"}</Typography>}
                      secondary={<Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.2 }}>{act.description || "Sarah Johnson"}</Typography>}
                    />
                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 500, whiteSpace: "nowrap" }}>{act.timeAgo || "2 min ago"}</Typography>
                  </ListItem>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4, color: "#9CA3AF" }}>No recent events logs.</Box>
              )}
            </List>
            <Button sx={{ textTransform: "none", color: "#16A34A", fontWeight: 700, mt: 3, fontSize: "14px", alignSelf: "center" }}>View all activity →</Button>
          </Paper>
        </Grid>

        {/* Module F: INVENTORY DATA PLATFORM SUMMARY */}
        <Grid item xs={12} md={5} lg={2.3}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid #F3F4F6", height: "100%", display: "flex", flexDirection: "column", justifyContext: "space-between" }}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827", mb: 2 }}>Platform Summary</Typography>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}><span style={{ color: "#6B7280", fontWeight: 500 }}>Total Properties</span><strong>{(platformSummary.properties || 6382).toLocaleString()}</strong></Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}><span style={{ color: "#6B7280", fontWeight: 500 }}>Total Services</span><strong>{(platformSummary.services || 2210).toLocaleString()}</strong></Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}><span style={{ color: "#6B7280", fontWeight: 500 }}>Total Events Centers</span><strong>{(platformSummary.events || 634).toLocaleString()}</strong></Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}><span style={{ color: "#6B7280", fontWeight: 500 }}>Total Hotels</span><strong>{(platformSummary.hotels || 1360).toLocaleString()}</strong></Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}><span style={{ color: "#6B7280", fontWeight: 500 }}>Active Cities</span><strong>{(platformSummary.cities || 24).toLocaleString()}</strong></Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}><span style={{ color: "#6B7280", fontWeight: 500 }}>Total Reviews</span><strong>{(platformSummary.reviews || 8543).toLocaleString()}</strong></Box>
              </Stack>
            </Box>
            <Button variant="text" endIcon={<ChevronRightOutlined sx={{ fontSize: 14 }} />} sx={{ textTransform: "none", color: "#16A34A", fontWeight: 700, mt: 3, fontSize: "13px", p: 0, justifyContent: "flex-start" }}>View full report</Button>
          </Paper>
        </Grid>
      </Grid>

    </Box>
  );
};

export default AdminDashboardMain;