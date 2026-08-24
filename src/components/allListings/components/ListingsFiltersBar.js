import React from "react";
import {
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { Search, TuneOutlined, RefreshOutlined } from "@mui/icons-material";

const PROPERTY_TYPES = ["property", "hostel", "hotel", "event_center", "service"];

const ListingsFiltersBar = ({
  searchTerm,
  setSearchTerm,
  propertyType,
  setPropertyType,
  status,
  setStatus,
  onApply,
  onReset,
}) => {
  return (
    <Paper
      elevation={0}
      className="p-3 p-sm-4 border mb-4"
      sx={{ borderRadius: "16px", width: "100%", minWidth: 0 }}
    >
      <div className="row g-3 align-items-end mx-0">
        <div className="col-12 col-lg-3 px-1">
          <label className="form-label text-muted small text-uppercase fw-bold mb-1">
            Search
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by title, location, user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#9CA3AF" }} />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-2 px-1">
          <label className="form-label text-muted small text-uppercase fw-bold mb-1">
            Property Type
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="All">All Types</MenuItem>
              {PROPERTY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.replace("_", " ").toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="col-12 col-sm-6 col-lg-2 px-1">
          <label className="form-label text-muted small text-uppercase fw-bold mb-1">
            Status
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="All">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Rejected">Rejected</MenuItem>
              <MenuItem value="Reported">Reported</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="col-12 col-lg-5 d-flex justify-content-lg-end gap-2 mt-3 px-1">
          <Button
            variant="text"
            startIcon={<TuneOutlined />}
            sx={{ textTransform: "none", color: "#374151", fontWeight: 600 }}
          >
            More Filters
          </Button>
          <Button
            variant="text"
            startIcon={<RefreshOutlined />}
            onClick={onReset}
            sx={{ textTransform: "none", color: "#6B7280", fontWeight: 600 }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={onApply}
            sx={{
              textTransform: "none",
              bgcolor: "#111827",
              color: "#fff",
              fontWeight: 600,
              borderRadius: "10px",
              py: 1,
              px: 4,
              "&:hover": { bgcolor: "#1F2937" },
            }}
          >
            Filter
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default ListingsFiltersBar;