import React from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputAdornment,
  Checkbox,
  ListItemText,
  Box,
  Chip
} from "@mui/material";
import {
  PeopleAltOutlined,
  CelebrationOutlined,
  EventSeatOutlined,
  HomeOutlined,
  DirectionsCarOutlined  
} from "@mui/icons-material";
import { formatDisplayNumber } from "../../utils/numberFormatters";

const EventCenterFields = ({ formData, onChange, onFormattedChange }) => {
  const EVENT_TYPE_OPTIONS = [
    { label: "Wedding", value: "wedding" },
    { label: "Birthday Party", value: "birthday" },
    { label: "Conference / Seminar", value: "conference" },
    { label: "Dinner / Gala", value: "party" },
    { label: "Exhibition", value: "exhibition" },
    { label: "Concert / Show", value: "concert" },
    { label: "Other", value: "other" },
  ];
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
              Event Types Supported *
            </label>
            <FormControl fullWidth size="small">
              <Select
                multiple
                displayEmpty
                value={formData.supported_events || []}
                onChange={(e) => {
                  const val = typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value;
                  onChange("supported_events", val);
                }}
                renderValue={(selected) => {
                  if (!selected || selected.length === 0) {
                    return <span style={{ color: "#9CA3AF" }}>Select event types</span>;
                  }
                  return (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((val) => {
                        const opt = EVENT_TYPE_OPTIONS.find((o) => o.value === val);
                        return (
                          <Chip
                            key={val}
                            label={opt ? opt.label : val}
                            size="small"
                            sx={{ height: 22, fontSize: "11px", bgcolor: "#ECFDF5", color: "#017E53", fontWeight: 700 }}
                          />
                        );
                      })}
                    </Box>
                  );
                }}
              >
                {EVENT_TYPE_OPTIONS.map((option) => {
                  const isChecked = (formData.supported_events || []).includes(option.value);
                  return (
                    <MenuItem key={option.value} value={option.value}>
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        sx={{ color: "#017E53", "&.Mui-checked": { color: "#017E53" } }}
                      />
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>

      <div className="row g-3">
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
              {["Indoor", "Outdoor"].map((io) => (
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
    </div>
  );
};

export default EventCenterFields;