import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Send,
  LocationOnOutlined,
  EditOutlined,
  LockOutlined,
  DomainOutlined,
  BedOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import { formatDisplayNumber } from "../utils/numberFormatters";

const resolveImageSrc = (img) => {
  if (!img) return "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300";
  if (img instanceof File || img instanceof Blob) {
    return URL.createObjectURL(img);
  }
  if (typeof img === "string") return img;
  return img?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300";
};

const Step3ReviewSubmit = ({
  typeConfig,
  formData,
  propertyType,
  availableAmenities,
  loading,
  onEdit,
  onChange,
  onSubmit,
}) => {
  const isHotel = propertyType === "hotel";

  // Calculate Hotel Price Range for header badge
  const hotelPricing = useMemo(() => {
    if (!isHotel || !formData.room_types || formData.room_types.length === 0) {
      return null;
    }
    const prices = formData.room_types
      .map((r) => Number(r.price_per_night) || 0)
      .filter((p) => p > 0);

    if (prices.length === 0) return "Price on request";
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return min === max
      ? `₦${formatDisplayNumber(min)} / Night`
      : `₦${formatDisplayNumber(min)} – ₦${formatDisplayNumber(max)} / Night`;
  }, [isHotel, formData.room_types]);

  const selectedAmenityNames = useMemo(() => {
    return (formData.amenities || []).map((id) => {
      const match = (availableAmenities || []).find(
        (item) =>
          String(item.id || item._id) === String(id) || item.name === id
      );
      return match ? match.name || match.title : id;
    });
  }, [formData.amenities, availableAmenities]);

  // Primary cover image is always the first image in formData.images
  const coverImage = useMemo(() => {
    if (formData.images && formData.images.length > 0) {
      return formData.images[0];
    }
    return formData.main_photo || null;
  }, [formData.images, formData.main_photo]);

  return (
    <Box>
      <div className="mb-4">
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827" }}>
          Review your listing & Submit
        </Typography>
        <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
          This is required to publish your listing on your platform.
        </Typography>
      </div>

      {/* REVIEW CARD */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <DomainOutlined sx={{ color: "#017E53", fontSize: 20 }} />
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#111827" }}
            >
              Review Your Listing
            </Typography>
          </div>
          <Button
            size="small"
            onClick={onEdit}
            startIcon={<EditOutlined />}
            sx={{ textTransform: "none", color: "#017E53", fontWeight: 700 }}
          >
            Edit
          </Button>
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
          <Box
            component="img"
            src={resolveImageSrc(coverImage)}
            alt="listing thumbnail"
            sx={{
              width: { xs: "100%", sm: 120 },
              height: 90,
              borderRadius: "10px",
              objectFit: "cover",
              bgcolor: "#F3F4F6",
            }}
          />
          <div>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: "#111827" }}
            >
              {formData.name || "Property Title"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "#6B7280",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                mt: 0.5,
              }}
            >
              <LocationOnOutlined sx={{ fontSize: 14 }} /> {formData.address},{" "}
              {formData.location}
            </Typography>

            <div className="d-flex flex-wrap gap-2 mt-2">
              {formData.capacity && (
                <Chip
                  label={`Capacity: ${formatDisplayNumber(formData.capacity)} People`}
                  size="small"
                  sx={{ bgcolor: "#F3F4F6", fontWeight: 600, fontSize: "11px" }}
                />
              )}
              <Chip
                label={`Type: ${
                  propertyType === "property"
                    ? (formData.type || "").toUpperCase()
                    : (propertyType || "").toUpperCase()
                }`}
                size="small"
                sx={{ bgcolor: "#F3F4F6", fontWeight: 600, fontSize: "11px" }}
              />

              {/* DYNAMIC PRICING CHIP */}
              <Chip
                label={
                  isHotel
                    ? hotelPricing
                    : `₦${formatDisplayNumber(formData.total_price)} / ${formData.pricing_type}`
                }
                size="small"
                sx={{
                  bgcolor: "#ECFDF5",
                  color: "#017E53",
                  fontWeight: 700,
                  fontSize: "11px",
                }}
              />
            </div>
          </div>
        </div>

        {/* HOTEL SPECIFIC: ROOM TYPES REVIEW LIST */}
        {isHotel && formData.room_types && formData.room_types.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography
              variant="caption"
              className="text-muted fw-bold d-block mb-2"
              sx={{ letterSpacing: "0.5px" }}
            >
              ROOM TYPES & RATES ({formData.room_types.length})
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
              {formData.room_types.map((room, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 1.8,
                    bgcolor: "#F9FAFB",
                    border: "1px solid #E5E7EB",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#111827", fontSize: "13px" }}
                    >
                      {room.name || `Room #${idx + 1}`}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 0.3,
                        color: "#6B7280",
                        fontSize: "11.5px",
                      }}
                    >
                      <span className="d-flex align-items-center gap-1">
                        <BedOutlined sx={{ fontSize: 14 }} /> {room.bed_type}
                      </span>
                      <span className="d-flex align-items-center gap-1">
                        <PersonOutlined sx={{ fontSize: 14 }} />{" "}
                        {room.max_occupancy || "2 Guests"}
                      </span>
                      {room.available_rooms && (
                        <span>• {room.available_rooms} Available</span>
                      )}
                    </Box>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 800, color: "#017E53", fontSize: "13px" }}
                  >
                    ₦{formatDisplayNumber(room.price_per_night)} / night
                  </Typography>
                </Paper>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" className="text-muted fw-bold d-block mb-1">
          DESCRIPTION
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#4B5563",
            fontSize: "12.5px",
            lineHeight: 1.5,
            mb: 2,
          }}
        >
          {formData.description ||
            formData.short_description ||
            "No description provided."}
        </Typography>

        <Typography variant="caption" className="text-muted fw-bold d-block mb-1">
          FACILITIES & AMENITIES
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {selectedAmenityNames.length > 0 ? (
            selectedAmenityNames.map((name, i) => (
              <Chip
                key={i}
                label={name}
                size="small"
                sx={{
                  bgcolor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              />
            ))
          ) : (
            <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
              No amenities selected.
            </Typography>
          )}
        </Box>
      </Paper>

      <FormControlLabel
        control={
          <Checkbox
            checked={Boolean(formData.agree_terms)}
            onChange={(e) => onChange("agree_terms", e.target.checked)}
            sx={{
              color: "#017E53",
              "&.Mui-checked": { color: "#017E53" },
            }}
          />
        }
        label={
          <Typography variant="caption" sx={{ color: "#4B5563" }}>
            By submitting, you agree to our Terms of Service and confirm that the
            information provided is accurate.
          </Typography>
        }
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        variant="contained"
        endIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <Send />
          )
        }
        disabled={loading || !formData.agree_terms}
        onClick={onSubmit}
        sx={{
          bgcolor: "#017E53",
          color: "#fff",
          py: 1.6,
          borderRadius: "12px",
          fontWeight: 700,
          textTransform: "none",
          "&:hover": { bgcolor: "#016744" },
        }}
      >
        {typeConfig.buttonText || "Submit Listing"}
      </Button>

      <div className="d-flex justify-content-center align-items-center gap-1 mt-3 text-muted">
        <LockOutlined sx={{ fontSize: 14 }} />
        <Typography variant="caption">
          Your listing will be reviewed before going live
        </Typography>
      </div>
    </Box>
  );
};

export default Step3ReviewSubmit;