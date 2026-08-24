import React from "react";
import {
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Button,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";

const UserFiltersBar = ({
  search,
  setSearch,
  userType,
  setUserType,
  status,
  setStatus,
  onApply,
  onReset,
}) => {
  return (
    <Paper elevation={0} className="p-3 p-sm-4 border mb-4" sx={{ borderRadius: "16px", width: "100%", minWidth: 0 }}>
      <div className="row g-3 align-items-end mx-0">
        <div className="col-12 col-md-4 px-1">
          <label className="form-label fw-bold text-muted small text-uppercase">
            Search User
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder="Name, email, phone or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <div className="col-12 col-sm-6 col-md-2 px-1">
          <label className="form-label fw-bold text-muted small text-uppercase">
            User Type
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="All">All Types</MenuItem>
              <MenuItem value="Client">Client</MenuItem>
              <MenuItem value="Agent">Agent</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-12 col-sm-6 col-md-2 px-1">
          <label className="form-label fw-bold text-muted small text-uppercase">
            Status
          </label>
          <FormControl fullWidth size="small">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ borderRadius: "10px" }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="col-12 col-md-4 d-flex justify-content-md-end gap-2 mt-3 px-1">
          <Button
            variant="outlined"
            onClick={onReset}
            sx={{
              flex: { xs: 1, sm: "initial" },
              textTransform: "none",
              borderColor: "#D1D5DB",
              color: "#374151",
              fontWeight: 600,
              borderRadius: "10px",
              py: 1,
              px: 3,
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={onApply}
            sx={{
              flex: { xs: 1, sm: "initial" },
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

export default UserFiltersBar;