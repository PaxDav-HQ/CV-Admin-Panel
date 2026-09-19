import React from "react";
import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { Search, RestartAlt, FilterList } from "@mui/icons-material";

const ServiceFilterBar = ({ filters, onFilterChange, onReset }) => {
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        flexWrap: "wrap",
        borderBottom: "1px solid #F1F5F9",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Search Input */}
      <TextField
        size="small"
        placeholder="Search services..."
        value={filters.q}
        onChange={(e) => onFilterChange("q", e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ color: "#94A3B8", fontSize: 18, mr: 1 }} />,
        }}
        sx={{
          flex: { xs: "1 1 100%", sm: "1 1 200px" },
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            bgcolor: "#F8FAFC",
            fontSize: "13px",
          },
        }}
      />

      {/* Category */}
      <FormControl
        size="small"
        sx={{ flex: { xs: "1 1 calc(50% - 6px)", sm: "0 0 130px" } }}
      >
        <Select
          value={filters.category}
          onChange={(e) => onFilterChange("category", e.target.value)}
          sx={{ borderRadius: "10px", bgcolor: "#F8FAFC", fontSize: "12.5px" }}
        >
          <MenuItem value="all">Category</MenuItem>
          <MenuItem value="cleaning">Cleaning</MenuItem>
          <MenuItem value="repair">Repair</MenuItem>
          <MenuItem value="test">Test</MenuItem>
        </Select>
      </FormControl>

      {/* Type */}
      <FormControl
        size="small"
        sx={{ flex: { xs: "1 1 calc(50% - 6px)", sm: "0 0 120px" } }}
      >
        <Select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          sx={{ borderRadius: "10px", bgcolor: "#F8FAFC", fontSize: "12.5px" }}
        >
          <MenuItem value="all">Type</MenuItem>
          <MenuItem value="one-time">One-time</MenuItem>
          <MenuItem value="recurring">Recurring</MenuItem>
          <MenuItem value="fixed">Fixed</MenuItem>
          <MenuItem value="hourly">Hourly</MenuItem>
        </Select>
      </FormControl>

      {/* Status */}
      <FormControl
        size="small"
        sx={{ flex: { xs: "1 1 calc(50% - 6px)", sm: "0 0 120px" } }}
      >
        <Select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          sx={{ borderRadius: "10px", bgcolor: "#F8FAFC", fontSize: "12.5px" }}
        >
          <MenuItem value="all">Status</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="suspended">Suspended</MenuItem>
        </Select>
      </FormControl>

      {/* Reset */}
      <Button
        size="small"
        startIcon={<RestartAlt />}
        onClick={onReset}
        sx={{
          ml: { xs: 0, sm: "auto" },
          color: "#64748B",
          textTransform: "none",
          fontWeight: 700,
          fontSize: "12px",
        }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default ServiceFilterBar;