import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Typography, Paper, IconButton, 
  Button, Stepper, Step, StepLabel, Container 
} from "@mui/material";
import { 
  ArrowBackIosNew, HelpOutlined, ArrowForward, 
  HomeOutlined, BedOutlined, NotificationsNoneOutlined, 
  CelebrationOutlined, ShieldOutlined
} from "@mui/icons-material";

const propertyCategories = [
  {
    id: "property",
    title: "Housing Properties",
    description: "Houses, apartments, flats and other residential homes.",
    icon: <HomeOutlined sx={{ color: "#10B981" }} />,
    iconBg: "#ECFDF5",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "hostel",
    title: "Hostels",
    description: "Student hostels, shortlets, shared or private rooms.",
    icon: <BedOutlined sx={{ color: "#8B5CF6" }} />,
    iconBg: "#F5F3FF",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "hotel",
    title: "Hotels",
    description: "Hotels, lodges, resorts and other hospitality spaces.",
    icon: <NotificationsNoneOutlined sx={{ color: "#F59E0B" }} />,
    iconBg: "#FFFBEB",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "event_center",
    title: "Event Centers",
    description: "Event halls, venues and spaces for occasions and gatherings.",
    icon: <CelebrationOutlined sx={{ color: "#10B981" }} />,
    iconBg: "#ECFDF5",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80"
  }
];

const ListPropertyType = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("property");

  // Route Authentication Guard
  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const handleSelectType = (id) => {
    setSelectedType(id);
    // Proceed to Step 2 passing the selected listing_type
    navigate(`/list-property/details?type=${id}`);
  };

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", pb: 6 }}>
      
      {/* TOP NAVIGATION BAR */}
      <Box sx={{ px: { xs: 2, md: 5 }, py: 2.5, borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <IconButton 
          onClick={() => navigate(-1)} 
          size="small"
          sx={{ border: "1px solid #E5E7EB", borderRadius: "10px", p: 1 }}
        >
          <ArrowBackIosNew sx={{ fontSize: 16, color: "#374151" }} />
        </IconButton>
        
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", fontSize: "17px" }}>
          List a Property
        </Typography>

        <IconButton size="small" sx={{ border: "1px solid #E5E7EB", borderRadius: "10px", p: 1 }}>
          <HelpOutlined sx={{ fontSize: 18, color: "#374151" }} />
        </IconButton>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        
        {/* STEPPER PROGRESS INDICATOR */}
        <Box sx={{ maxWidth: "600px", mx: "auto", mb: { xs: 4, md: 6 } }}>
          <div className="d-flex justify-content-between align-items-center position-relative">
            
            {/* Step 1 */}
            <div className="d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#017E53", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>
                1
              </Box>
              <Typography variant="caption" sx={{ mt: 1, fontWeight: 700, color: "#017E53", fontSize: "12px" }}>
                Select Type
              </Typography>
            </div>

            {/* Connecting Line 1 */}
            <Box sx={{ position: "absolute", top: "16px", left: "15%", right: "50%", height: "2px", bgcolor: "#E5E7EB", zIndex: 1 }} />

            {/* Step 2 */}
            <div className="d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#F3F4F6", color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>
                2
              </Box>
              <Typography variant="caption" sx={{ mt: 1, fontWeight: 600, color: "#9CA3AF", fontSize: "12px" }}>
                Property Details
              </Typography>
            </div>

            {/* Connecting Line 2 */}
            <Box sx={{ position: "absolute", top: "16px", left: "50%", right: "15%", height: "2px", bgcolor: "#E5E7EB", zIndex: 1 }} />

            {/* Step 3 */}
            <div className="d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
              <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#F3F4F6", color: "#9CA3AF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px" }}>
                3
              </Box>
              <Typography variant="caption" sx={{ mt: 1, fontWeight: 600, color: "#9CA3AF", fontSize: "12px" }}>
                Review & Submit
              </Typography>
            </div>

          </div>
        </Box>

        {/* MAIN SELECTION SECTION */}
        <div className="row g-4 align-items-start mb-5">
          
          {/* Left Column: Heading & Graphic Placeholder */}
          <div className="col-12 col-lg-4">
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
              What type of property are you listing?
            </Typography>
            <Typography variant="body2" sx={{ color: "#6B7280", mt: 1.5, mb: 3 }}>
              Choose the option that best describes your property.
            </Typography>
            
            <Box 
              sx={{ 
                width: "100%", 
                borderRadius: "20px", 
                overflow: "hidden", 
                border: "1px solid #F3F4F6",
                display: { xs: "none", lg: "block" }
              }}
            >
              <Box 
                component="img" 
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=700&auto=format&fit=crop&q=80" 
                alt="Property Illustration"
                sx={{ width: "100%", height: "300px", objectFit: "cover" }}
              />
            </Box>
          </div>

          {/* Right Column: Interactive Category Cards */}
          <div className="col-12 col-lg-8">
            <div className="row g-3">
              {propertyCategories.map((item) => {
                const isSelected = selectedType === item.id;
                return (
                  <div key={item.id} className="col-12 col-sm-6">
                    <Paper
                      elevation={0}
                      onClick={() => handleSelectType(item.id)}
                      sx={{
                        p: 3,
                        borderRadius: "20px",
                        border: isSelected ? "2px solid #017E53" : "1px solid #E5E7EB",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out",
                        bgcolor: "#FFFFFF",
                        "&:hover": {
                          borderColor: "#017E53",
                          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06)"
                        }
                      }}
                    >
                      <Box sx={{ width: 36, height: 36, borderRadius: "10px", bgcolor: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
                        {item.icon}
                      </Box>

                      <Box 
                        component="img" 
                        src={item.image} 
                        alt={item.title}
                        sx={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "14px", mb: 2 }}
                      />

                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", mb: 0.5 }}>
                        {item.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: "#6B7280", fontSize: "12.5px", lineHeight: 1.4, mb: 2, minHeight: "35px" }}>
                        {item.description}
                      </Typography>

                      <div className="d-flex justify-content-end">
                        <Box sx={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981" }}>
                          <ArrowForward sx={{ fontSize: 16 }} />
                        </Box>
                      </div>
                    </Paper>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* BOTTOM VERIFIED TRUST BANNER */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "16px",
            bgcolor: "#F0FDF4",
            border: "1px solid #DCFCE7",
            display: "flex",
            alignItems: "center",
            gap: 2
          }}
        >
          <Box sx={{ width: 44, height: 44, borderRadius: "12px", bgcolor: "#017E53", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
            <ShieldOutlined sx={{ fontSize: 24 }} />
          </Box>
          <div>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827" }}>
              Verified listings get more trust and visibility
            </Typography>
            <Typography variant="caption" sx={{ color: "#4B5563", fontSize: "12px" }}>
              All properties are reviewed to ensure a safe experience for everyone.
            </Typography>
          </div>
        </Paper>

      </Container>
    </Box>
  );
};

export default ListPropertyType;