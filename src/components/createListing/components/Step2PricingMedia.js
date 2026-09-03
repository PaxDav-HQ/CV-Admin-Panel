import React from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  ArrowForward,
  DeleteOutlined,
  PaymentsOutlined,
  ShieldOutlined,
  CalendarTodayOutlined,
  DriveFolderUploadOutlined,
  LightbulbOutlined,
  LockOutlined,
  Add,
  HotelOutlined,
  PersonOutlined,
  AddCircleOutlined,
} from "@mui/icons-material";
import { formatDisplayNumber } from "../utils/numberFormatters";

const DURATION_DAY_OPTIONS = [
  { label: "1 Day", days: 1 },
  { label: "1 Week", days: 7 },
  { label: "2 Weeks", days: 14 },
  { label: "1 Month", days: 30 },
  { label: "3 Months", days: 90 },
  { label: "6 Months", days: 180 },
  { label: "1 Year", days: 365 },
];

const BED_TYPES = ["Single Bed", "Double Bed", "Queen Bed", "King Bed", "Suite Bed"];

const resolveImageSrc = (img) => {
  if (!img) return "";
  if (img instanceof File || img instanceof Blob) {
    return URL.createObjectURL(img);
  }
  if (typeof img === "string") {
    return img;
  }
  return img?.url || "";
};

const Step2PricingMedia = ({
  typeConfig,
  formData,
  propertyType,
  onChange,
  onFormattedChange,
  onGallerySelect,
  onRemoveGalleryImage,
  onNext,
  // Handlers for hotel room types
  onAddRoomType,
  onRemoveRoomType,
  onUpdateRoomType,
}) => {
  const isHotel = propertyType === "hotel";

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827", mb: 0.5 }}>
        Set your pricing & showcase your {propertyType.replace("_", " ")}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6B7280", mb: 4 }}>
        Add pricing details and high-quality photos to attract more {isHotel ? "guests" : "bookings"}.
      </Typography>

      {/* ===================== HOTEL SPECIFIC: ROOM TYPES & PRICING ===================== */}
      {isHotel ? (
        <Box sx={{ mb: 4 }}>
          <div className="d-flex align-items-center gap-2 mb-1">
            <HotelOutlined sx={{ color: "#017E53", fontSize: 22 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827" }}>
              Room Types & Pricing
            </Typography>
          </div>
          <Typography variant="caption" className="text-muted d-block mb-3">
            Add all the room types available in your hotel.
          </Typography>

          {(formData.room_types || []).map((room, index) => (
            <Paper
              key={index}
              elevation={0}
              className="p-3 border mb-3"
              sx={{ borderRadius: "16px", bgcolor: "#FFFFFF" }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#111827" }}>
                  {room.name || `Room Type #${index + 1}`}
                </Typography>
                {formData.room_types.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => onRemoveRoomType(index)}
                    sx={{ color: "#EF4444" }}
                  >
                    <DeleteOutlined sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </div>

              <div className="row g-3">
                {/* Room Name */}
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-bold text-muted">Room Name / Title *</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. Deluxe Room, Executive Suite"
                    value={room.name || ""}
                    onChange={(e) => onUpdateRoomType(index, "name", e.target.value)}
                  />
                </div>

                {/* Bed Type */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label className="form-label small fw-bold text-muted">Bed Type</label>
                  <FormControl fullWidth size="small">
                    <Select
                      value={room.bed_type || "King Bed"}
                      onChange={(e) => onUpdateRoomType(index, "bed_type", e.target.value)}
                    >
                      {BED_TYPES.map((b) => (
                        <MenuItem key={b} value={b}>{b}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {/* Max Occupancy */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label className="form-label small fw-bold text-muted">Max Occupancy</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="2 Guests"
                    value={room.max_occupancy || ""}
                    onChange={(e) => onUpdateRoomType(index, "max_occupancy", e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlined sx={{ fontSize: 16, color: "#9CA3AF" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Price per Night */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-muted">Price per Night (₦) *</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. 45,000"
                    value={formatDisplayNumber(room.price_per_night)}
                    onChange={(e) =>
                      onUpdateRoomType(
                        index,
                        "price_per_night",
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PaymentsOutlined sx={{ fontSize: 16, color: "#9CA3AF" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                {/* Available Rooms */}
                <div className="col-12 col-sm-6">
                  <label className="form-label small fw-bold text-muted">Available Rooms</label>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="e.g. 10"
                    value={room.available_rooms || ""}
                    onChange={(e) =>
                      onUpdateRoomType(
                        index,
                        "available_rooms",
                        e.target.value.replace(/[^0-9]/g, "")
                      )
                    }
                  />
                </div>
              </div>
            </Paper>
          ))}

          {/* Add Another Room Type Button */}
          <Button
            startIcon={<AddCircleOutlined sx={{ color: "#017E53" }} />}
            onClick={onAddRoomType}
            sx={{
              textTransform: "none",
              color: "#017E53",
              fontWeight: 700,
              fontSize: "13px",
              py: 1,
            }}
          >
            Add Another Room Type
          </Button>
        </Box>
      ) : (
        /* ===================== STANDARD PROPERTY PRICING ===================== */
        <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <PaymentsOutlined sx={{ color: "#017E53", fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
              Pricing Information
            </Typography>
          </div>

          <label className="form-label small fw-bold text-muted mb-2">Pricing Type *</label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {(typeConfig.pricingTypes || []).map((pt) => (
              <Button
                key={pt}
                onClick={() => onChange("pricing_type", pt)}
                sx={{
                  borderRadius: "8px",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "12.5px",
                  px: 2.5,
                  bgcolor: formData.pricing_type === pt ? "#ECFDF5" : "#F9FAFB",
                  borderColor: formData.pricing_type === pt ? "#017E53" : "#E5E7EB",
                  border:
                    formData.pricing_type === pt
                      ? "1.5px solid #017E53"
                      : "1px solid #E5E7EB",
                  color: formData.pricing_type === pt ? "#017E53" : "#4B5563",
                }}
              >
                {pt}
              </Button>
            ))}
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">Price (₦) *</label>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 150,000"
                value={formatDisplayNumber(formData.total_price)}
                onChange={(e) => onFormattedChange("total_price", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PaymentsOutlined sx={{ color: "#9CA3AF", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">
                Security Deposit (₦) (Optional)
              </label>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 50,000"
                value={formatDisplayNumber(formData.security_deposit)}
                onChange={(e) => onFormattedChange("security_deposit", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldOutlined sx={{ color: "#9CA3AF", fontSize: 18 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">Minimum Stay / Duration *</label>
              <FormControl fullWidth size="small">
                <Select
                  value={Number(formData.min_booking) || 30}
                  onChange={(e) => onChange("min_booking", Number(e.target.value))}
                >
                  {DURATION_DAY_OPTIONS.map((opt) => (
                    <MenuItem key={opt.days} value={opt.days}>
                      {opt.label} ({opt.days} {opt.days === 1 ? "day" : "days"})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">Additional Charges (Optional)</label>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g electricity, maintenance, cleaning fee"
                value={formData.additional_charges}
                onChange={(e) => onChange("additional_charges", e.target.value)}
              />
            </div>
          </div>
        </Paper>
      )}

      {/* ===================== ADDITIONAL PRICING (SECURITY DEPOSIT ONLY) ===================== */}
      {isHotel && (
        <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <ShieldOutlined sx={{ color: "#017E53", fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
              Additional Pricing
            </Typography>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">
                Security Deposit (₦) (Optional, Integer only)
              </label>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 10,000"
                value={formatDisplayNumber(formData.security_deposit)}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, "");
                  const sanitized = cleaned ? String(parseInt(cleaned, 10)) : "";
                  onChange("security_deposit", sanitized === "0" ? "" : sanitized);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ShieldOutlined sx={{ fontSize: 16, color: "#9CA3AF" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </Paper>
      )}

      {/* ===================== AVAILABILITY SECTION ===================== */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <CalendarTodayOutlined sx={{ color: "#017E53", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
            Availability
          </Typography>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted">Availability Status *</label>
            <div className="d-flex gap-2">
              {["Available Now", isHotel ? "Fully Booked" : "Fully Occupied"].map((v) => (
                <Button
                  key={v}
                  fullWidth
                  size="small"
                  onClick={() => onChange("vacancy_status", v)}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "12px",
                    py: 1,
                    bgcolor: formData.vacancy_status === v ? "#ECFDF5" : "#F9FAFB",
                    color: formData.vacancy_status === v ? "#017E53" : "#6B7280",
                    border:
                      formData.vacancy_status === v
                        ? "1.5px solid #017E53"
                        : "1px solid #E5E7EB",
                  }}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted">
              {isHotel ? "Minimum Stay (Optional)" : "Available From *"}
            </label>
            {isHotel ? (
              <FormControl fullWidth size="small">
                <Select
                  value={formData.min_booking || 1}
                  onChange={(e) => onChange("min_booking", Number(e.target.value))}
                  displayEmpty
                >
                  <MenuItem value={1}>1 Night</MenuItem>
                  <MenuItem value={2}>2 Nights</MenuItem>
                  <MenuItem value={7}>1 Week</MenuItem>
                  <MenuItem value={30}>1 Month</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                type="date"
                value={formData.available_from}
                onChange={(e) => onChange("available_from", e.target.value)}
              />
            )}
          </div>
        </div>
      </Paper>

      {/* ===================== MEDIA SECTION ===================== */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <DriveFolderUploadOutlined sx={{ color: "#017E53", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
            Media & Photos
          </Typography>
        </div>
        <Typography variant="caption" className="text-muted d-block mb-3">
          Add photos of your {propertyType}. The first photo will automatically serve as your listing's main cover photo.
        </Typography>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {(formData.images || []).map((file, idx) => (
            <Box
              key={idx}
              sx={{
                position: "relative",
                width: 95,
                height: 85,
                borderRadius: "10px",
                overflow: "hidden",
                border: idx === 0 ? "2px solid #017E53" : "1px solid #E5E7EB",
              }}
            >
              <img
                src={resolveImageSrc(file)}
                alt={`preview-${idx}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

              {/* COVER PHOTO LABEL */}
              {idx === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    bgcolor: "rgba(1, 126, 83, 0.9)",
                    color: "#fff",
                    fontSize: "9px",
                    fontWeight: 800,
                    textAlign: "center",
                    py: 0.3,
                    letterSpacing: "0.4px",
                    textTransform: "uppercase",
                  }}
                >
                  Cover
                </Box>
              )}

              <IconButton
                size="small"
                onClick={() => onRemoveGalleryImage(idx)}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  p: 0.2,
                  "&:hover": { bgcolor: "rgba(220,38,38,0.85)" },
                }}
              >
                <DeleteOutlined sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          ))}

          <label style={{ cursor: "pointer", margin: 0 }}>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={onGallerySelect}
            />
            <Box
              sx={{
                width: 95,
                height: 85,
                borderRadius: "10px",
                border: "2px dashed #D1D5DB",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#FAFAFA",
                color: "#6B7280",
                "&:hover": { borderColor: "#017E53", color: "#017E53" },
              }}
            >
              <Add sx={{ fontSize: 22 }} />
              <Typography variant="caption" sx={{ fontSize: "10.5px", fontWeight: 700 }}>
                Add Photos
              </Typography>
            </Box>
          </label>
        </div>
      </Paper>

      {/* TIPS CARD */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: "14px",
          bgcolor: "#F0FDF4",
          border: "1px solid #DCFCE7",
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            bgcolor: "#DCFCE7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#017E53",
          }}
        >
          <LightbulbOutlined sx={{ fontSize: 20 }} />
        </Box>
        <div>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#065F46" }}>
            Tips
          </Typography>
          <Typography variant="caption" sx={{ color: "#047857", fontSize: "11.5px" }}>
            Listings with clear pricing and high-res photos get up to 3x more bookings.
          </Typography>
        </div>
      </Paper>

      <Button
        fullWidth
        variant="contained"
        endIcon={<ArrowForward />}
        disabled={
          isHotel
            ? formData.room_types.length === 0 || !formData.room_types[0].price_per_night
            : !formData.total_price
        }
        onClick={onNext}
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
        Continue
      </Button>

      <div className="d-flex justify-content-center align-items-center gap-1 mt-3 text-muted">
        <LockOutlined sx={{ fontSize: 14 }} />
        <Typography variant="caption">
          Your progress is saved automatically
        </Typography>
      </div>
    </Box>
  );
};

export default Step2PricingMedia;