import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import {
  MeetingRoomOutlined,
  VpnKeyOutlined,
  DomainOutlined,
} from "@mui/icons-material";
import { formatDisplayNumber } from "../../utils/numberFormatters";

const HotelFields = ({ formData, onChange, onFormattedChange }) => {
  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">Total Rooms *</label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 80"
            value={formatDisplayNumber(formData.total_rooms)}
            onChange={(e) => onFormattedChange("total_rooms", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MeetingRoomOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Available Rooms *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 20"
            value={formatDisplayNumber(formData.available_units)}
            onChange={(e) => onFormattedChange("available_units", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <VpnKeyOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Number of Floors *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 5"
            value={formatDisplayNumber(formData.floor_numbers)}
            onChange={(e) => onFormattedChange("floor_numbers", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DomainOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <label className="form-label small fw-bold text-muted">Check-in Time *</label>
          <TextField
            fullWidth
            size="small"
            type="time"
            value={formData.check_in_time}
            onChange={(e) => onChange("check_in_time", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label small fw-bold text-muted">Check-out Time *</label>
          <TextField
            fullWidth
            size="small"
            type="time"
            value={formData.check_out_time}
            onChange={(e) => onChange("check_out_time", e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default HotelFields;