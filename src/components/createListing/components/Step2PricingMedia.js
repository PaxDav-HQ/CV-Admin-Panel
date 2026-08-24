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
  PlayCircleOutlineOutlined,
  LightbulbOutlined,
  LockOutlined,
  Add,
} from "@mui/icons-material";
import { formatDisplayNumber } from "../utils/numberFormatters";

const Step2PricingMedia = ({
  typeConfig,
  formData,
  propertyType,
  onChange,
  onFormattedChange,
  onMainPhotoSelect,
  onGallerySelect,
  onRemoveGalleryImage,
  onNext,
}) => {
  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontWeight: 800, color: "#111827", mb: 0.5 }}
      >
        Set your price & showcase your {propertyType.replace("_", " ")}
      </Typography>
      <Typography variant="body2" sx={{ color: "#6B7280", mb: 4 }}>
        Add pricing details and high-quality photos to attract more bookings.
      </Typography>

      {/* PRICING SECTION */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <PaymentsOutlined sx={{ color: "#017E53", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "#111827" }}
          >
            Pricing Information
          </Typography>
        </div>

        <label className="form-label small fw-bold text-muted mb-2">
          Pricing Type *
        </label>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {typeConfig.pricingTypes.map((pt) => (
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
              onChange={(e) =>
                onFormattedChange("security_deposit", e.target.value)
              }
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
            <label className="form-label small fw-bold text-muted">
              Minimum Stay / Duration *
            </label>
            <FormControl fullWidth size="small">
              <Select
                value={formData.min_booking}
                onChange={(e) => onChange("min_booking", e.target.value)}
              >
                {["1 Day", "1 Week", "1 Month", "3 Months", "6 Months", "1 Year"].map(
                  (d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted">
              Additional Charges (Optional)
            </label>
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

      {/* AVAILABILITY SECTION */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <CalendarTodayOutlined sx={{ color: "#017E53", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "#111827" }}
          >
            Availability
          </Typography>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted">
              Available From *
            </label>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={formData.available_from}
              onChange={(e) => onChange("available_from", e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted">
              Vacancy Status *
            </label>
            <div className="d-flex gap-2">
              {["Available Now", "Fully Occupied"].map((v) => (
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
                    bgcolor:
                      formData.vacancy_status === v ? "#ECFDF5" : "#F9FAFB",
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
        </div>
      </Paper>

      {/* MEDIA SECTION */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <DriveFolderUploadOutlined sx={{ color: "#017E53", fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "#111827" }}
          >
            Media
          </Typography>
        </div>
        <Typography variant="caption" className="text-muted d-block mb-3">
          Add photos of your property. Minimum 5 photos recommended.
        </Typography>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {formData.images.map((file, idx) => (
            <Box
              key={idx}
              sx={{
                position: "relative",
                width: 85,
                height: 75,
                borderRadius: "10px",
                overflow: "hidden",
                border: "1px solid #E5E7EB",
              }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
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
                }}
              >
                <DeleteOutlined sx={{ fontSize: 13 }} />
              </IconButton>
            </Box>
          ))}

          <label style={{ cursor: "pointer" }}>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={onGallerySelect}
            />
            <Box
              sx={{
                width: 85,
                height: 75,
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
                Add More
              </Typography>
            </Box>
          </label>
        </div>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: "12px",
            border: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            "&:hover": { bgcolor: "#F9FAFB" },
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <PlayCircleOutlineOutlined sx={{ color: "#017E53", fontSize: 24 }} />
            <div>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#111827", fontSize: "13px" }}
              >
                Add Video (Optional)
              </Typography>
              <Typography variant="caption" sx={{ color: "#6B7280" }}>
                Showcase your listing with a short walkthrough video
              </Typography>
            </div>
          </div>
          <ArrowForward sx={{ color: "#9CA3AF", fontSize: 18 }} />
        </Paper>
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
            Listings with more photos and videos get up to 3x more inquiries.
          </Typography>
        </div>
      </Paper>

      <Button
        fullWidth
        variant="contained"
        endIcon={<ArrowForward />}
        disabled={
          !formData.total_price ||
          (formData.images.length === 0 && !formData.main_photo)
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