import React from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
} from "@mui/material";
import {
  PeopleAltOutlined,
  CelebrationOutlined,
  EventSeatOutlined,
  HomeOutlined,
  DirectionsCarOutlined,
} from "@mui/icons-material";
import { formatDisplayNumber } from "../../utils/numberFormatters";

const EventCenterFields = ({ formData, onChange, onFormattedChange }) => {
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
            placeholder="e.g. 1,500"
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
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">Hall Type *</label>
          <FormControl fullWidth size="small">
            <Select
              value={formData.hall_type}
              onChange={(e) => onChange("hall_type", e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <CelebrationOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              }
            >
              {[
                "Banquet Hall",
                "Auditorium",
                "Conference Room",
                "Open Field / Marquee",
              ].map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Setting Arrangement *
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={formData.seating_arrangement}
              onChange={(e) => onChange("seating_arrangement", e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <EventSeatOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              }
            >
              {["Banquet", "Theater", "Classroom", "U-Shape"].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Indoor / Outdoor *
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={formData.indoor_outdoor}
              onChange={(e) => onChange("indoor_outdoor", e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <HomeOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              }
            >
              {["Indoor", "Outdoor", "Both Available"].map((io) => (
                <MenuItem key={io} value={io}>
                  {io}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-bold text-muted">
            Parking Space *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="e.g. 50"
            value={formatDisplayNumber(formData.parking_spaces)}
            onChange={(e) => onFormattedChange("parking_spaces", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DirectionsCarOutlined sx={{ fontSize: 18, color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventCenterFields;