import React from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  Button,
  InputAdornment,
} from "@mui/material";
import {
  PeopleAltOutlined,
  BedOutlined,
  BathtubOutlined,
  ChairOutlined,
  MeetingRoomOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { formatDisplayNumber } from "../../utils/numberFormatters";

const HostelFields = ({ formData, onChange, onFormattedChange }) => {
  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Capacity (Max People) *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 120"
            value={formatDisplayNumber(formData.capacity)}
            onChange={(e) => onFormattedChange("capacity", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PeopleAltOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        {/* <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">Room Type *</label>
          <FormControl fullWidth size="small">
            <Select
              value={formData.room_type}
              onChange={(e) => onChange("room_type", e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <BedOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              }
            >
              {[
                "Shared Room",
                "Single Room",
                "Self Contain",
                "Studio Apartment",
              ].map((rt) => (
                <MenuItem key={rt} value={rt}>
                  {rt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div> */}
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Gender Preference *
          </label>
          <div className="d-flex gap-1">
            {["Male", "Female", "Mixed"].map((g) => (
              <Button                
                key={g}
                size="small"
                onClick={() => onChange("gender_preference", g)}
                sx={{
                  flex: 1,
                  textTransform: "none",
                  fontSize: "12px",
                  fontWeight: 700,
                  borderRadius: "8px",
                  bgcolor:
                    formData.gender_preference.toLowerCase() === g.toLowerCase() ? "#ECFDF5" : "#F9FAFB",
                  color:
                    formData.gender_preference.toLowerCase() === g.toLowerCase() ? "#017E53" : "#6B7280",
                  border:
                    formData.gender_preference.toLowerCase() === g.toLowerCase()
                      ? "1.5px solid #017E53"
                      : "1px solid #E5E7EB",
                }}
              >
                {g}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Bathroom Type *
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={formData.bathroom_type}
              onChange={(e) => onChange("bathroom_type", e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <BathtubOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              }
            >
              {["En-suite", "Shared Bathroom", "Private Outside"].map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Furnishing Level *
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={formData.furnishing_level}
              onChange={(e) => onChange("furnishing_level", e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <ChairOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              }
            >
              {["Fully Furnished", "Semi Furnished", "Unfurnished"].map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Number of Rooms *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 25"
            value={formatDisplayNumber(formData.number_of_rooms)}
            onChange={(e) =>
              onFormattedChange("number_of_rooms", e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MeetingRoomOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Available Units *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 10"
            value={formatDisplayNumber(formData.available_units)}
            onChange={(e) =>
              onFormattedChange("available_units", e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default HostelFields;