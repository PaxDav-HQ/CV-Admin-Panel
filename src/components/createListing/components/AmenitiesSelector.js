import React, { useState } from "react";
import { Box, Typography, Paper, Chip, Button } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

const AmenitiesSelector = ({ availableAmenities, selectedAmenities, onToggle, propertyType }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleAmenities = showAll
    ? availableAmenities
    : availableAmenities.slice(0, 10);

  return (
    <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
      <div className="d-flex justify-content-between align-items-center mb-1">
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#017E53" }}>
          Facilities & Amenities
        </Typography>
        <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>
          {selectedAmenities.length} selected
        </Typography>
      </div>
      <Typography variant="caption" className="text-muted d-block mb-3">
        Select all facilities available in your {propertyType.replace("_", " ")}.
      </Typography>

      <Box sx={{ maxHeight: showAll ? "300px" : "140px", overflowY: "auto", p: 0.5 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {visibleAmenities.map((amenity) => {
            const id = amenity.id || amenity._id || amenity.name;
            const isSelected = selectedAmenities.includes(id);
            return (
              <Chip
                key={id}
                label={amenity.name || amenity.title}
                onClick={() => onToggle(id)}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "12px",
                  cursor: "pointer",
                  bgcolor: isSelected ? "#017E53" : "#F3F4F6",
                  color: isSelected ? "#FFFFFF" : "#374151",
                  "&:hover": { bgcolor: isSelected ? "#016744" : "#E5E7EB" },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {availableAmenities.length > 10 && (
        <Button
          size="small"
          onClick={() => setShowAll(!showAll)}
          endIcon={showAll ? <ExpandLess /> : <ExpandMore />}
          sx={{ mt: 1.5, textTransform: "none", color: "#017E53", fontWeight: 700, fontSize: "12px" }}
        >
          {showAll ? "Show Less" : "+ More Amenities"}
        </Button>
      )}
    </Paper>
  );
};

export default AmenitiesSelector;