import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Button,
  CircularProgress,
  Autocomplete,
  InputAdornment,
  Rating,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowForward,
  LocationOnOutlined,
  NotesOutlined,
  MapOutlined,
  ChatBubbleOutlineOutlined,
  LockOutlined,
  StarBorderOutlined,
  DomainOutlined,
  CategoryOutlined,
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  InsertLink,
  FormatClear,
} from "@mui/icons-material";

import { STATE_COORDINATES, NIGERIAN_STATES } from "../constants/wizardConfig";
import { useAddressGeocoding } from "../hooks/useAddressGeocoding";
import AmenitiesSelector from "./AmenitiesSelector";
import HostelFields from "./categoryFields/HostelFields";
import EventCenterFields from "./categoryFields/EventCenterFields";
import HotelFields from "./categoryFields/HotelFields";

// Embedded lightweight Rich Text Editor component
const RichTextEditor = ({ value = "", onChange, maxLength = 2500 }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      const textLength = editorRef.current.innerText?.length || 0;
      if (textLength <= maxLength) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  const currentLength = editorRef.current?.innerText?.length || 0;

  return (
    <Box
      sx={{
        border: "1px solid #E5E7EB",
        borderRadius: "12px",
        overflow: "hidden",
        bgcolor: "#FFFFFF",
        "&:focus-within": { borderColor: "#017E53", boxShadow: "0 0 0 1px #017E53" },
      }}
    >
      {/* Editor Action Toolbar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          p: 1,
          borderBottom: "1px solid #F3F4F6",
          bgcolor: "#F9FAFB",
          flexWrap: "wrap",
        }}
      >
        <Tooltip title="Bold">
          <IconButton size="small" onClick={() => executeCommand("bold")}>
            <FormatBold sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => executeCommand("italic")}>
            <FormatItalic sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bullet List">
          <IconButton size="small" onClick={() => executeCommand("insertUnorderedList")}>
            <FormatListBulleted sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton size="small" onClick={() => executeCommand("insertOrderedList")}>
            <FormatListNumbered sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add Link">
          <IconButton
            size="small"
            onClick={() => {
              const url = prompt("Enter link URL:");
              if (url) executeCommand("createLink", url);
            }}
          >
            <InsertLink sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Clear Formatting">
          <IconButton size="small" onClick={() => executeCommand("removeFormat")}>
            <FormatClear sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Box sx={{ ml: "auto", pr: 1 }}>
          <Typography variant="caption" sx={{ color: "#9CA3AF", fontSize: "11px" }}>
            {currentLength}/{maxLength}
          </Typography>
        </Box>
      </Box>

      {/* Editable Canvas */}
      <Box
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        sx={{
          minHeight: "150px",
          maxHeight: "340px",
          overflowY: "auto",
          p: 2,
          outline: "none",
          fontSize: "13.5px",
          lineHeight: 1.6,
          color: "#1F2937",
          "&:empty:before": {
            content:
              '"Describe your property, rules, facilities, environment, and what makes it special..."',
            color: "#9CA3AF",
            pointerEvents: "none",
          },
          "& ul, & ol": { pl: 3 },
          "& a": { color: "#017E53", textDecoration: "underline" },
        }}
      />
    </Box>
  );
};

const Step1PropertyDetails = ({
  typeConfig,
  formData,
  propertyType,
  availableAmenities,
  onChange,
  onFormattedChange,
  onToggleAmenity,
  onNext,
}) => {
  const [addressInput, setAddressInput] = useState("");
  const [isPreciseAddressCoord, setIsPreciseAddressCoord] = useState(false);
  const { addressOptions, addressLoading } = useAddressGeocoding(addressInput);

  const hasCategoryDetails =
    typeConfig.hasHostelDetails ||
    typeConfig.hasEventDetails ||
    typeConfig.hasHotelDetails;

  const isTitleOverLimit = (formData.name?.length || 0) > 50;

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.5px",
            }}
          >
            {typeConfig.step1Heading}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6B7280", mt: 0.5 }}>
            {typeConfig.subtitle}
          </Typography>
        </div>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200&auto=format&fit=crop&q=80"
          alt="isometric visual"
          sx={{
            width: 80,
            height: 60,
            borderRadius: "10px",
            objectFit: "cover",
            display: { xs: "none", sm: "block" },
          }}
        />
      </div>

      {/* BASIC INFORMATION */}
      <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
        <div className="d-flex align-items-center gap-2 mb-3">
          <NotesOutlined sx={{ color: "#017E53", fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
            Basic Information
          </Typography>
        </div>

        {/* PROPERTY TITLE (MAX 50 CHARACTERS ENFORCED) */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-bold text-muted mb-0">
              {typeConfig.nameLabel} *
            </label>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isTitleOverLimit ? "#EF4444" : "#9CA3AF",
                fontSize: "11px",
              }}
            >
              {formData.name?.length || 0}/50
            </Typography>
          </div>
          <TextField
            fullWidth
            size="small"
            placeholder={typeConfig.namePlaceholder}
            value={formData.name || ""}
            inputProps={{ maxLength: 50 }}
            error={isTitleOverLimit}
            helperText={isTitleOverLimit ? "Property title cannot exceed 50 characters" : ""}
            onChange={(e) => onChange("name", e.target.value.slice(0, 50))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {typeConfig.icon}
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* LOCATION & STATE */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-7">
            <label className="form-label small fw-bold text-muted">Location *</label>
            <Autocomplete
              freeSolo
              fullWidth
              size="small"
              options={addressOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.display_name || ""
              }
              filterOptions={(x) => x}
              loading={addressLoading}
              inputValue={addressInput}
              onInputChange={(event, newInputValue) => {
                setAddressInput(newInputValue);
                onChange("address", newInputValue);
              }}
              onChange={(event, selectedPlace) => {
                if (typeof selectedPlace === "string") {
                  setIsPreciseAddressCoord(false);
                  onChange("address", selectedPlace);
                } else if (selectedPlace) {
                  setIsPreciseAddressCoord(true);
                  const lat = parseFloat(selectedPlace.lat);
                  const lon = parseFloat(selectedPlace.lon);
                  const detectedState =
                    selectedPlace.address?.state ||
                    selectedPlace.address?.city ||
                    "";
                  const matchedState = NIGERIAN_STATES.find((s) =>
                    detectedState.toLowerCase().includes(s.toLowerCase())
                  );

                  onChange("address", selectedPlace.display_name);
                  if (matchedState) onChange("location", matchedState);
                  onChange("latitude", lat);
                  onChange("longitude", lon);
                }
              }}
              renderInput={(params) => {
                const inputProps = params.InputProps || params.slotProps?.input || {};
                return (
                  <TextField
                    {...params}
                    placeholder="Enter address, city or state"
                    InputProps={{
                      ...inputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlined sx={{ color: "#9CA3AF", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {addressLoading ? (
                            <CircularProgress color="inherit" size={16} sx={{ mr: 1 }} />
                          ) : null}
                          {inputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                );
              }}
            />
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label small fw-bold text-muted">State *</label>
            <FormControl fullWidth size="small">
              <Select
                value={formData.location || ""}
                onChange={(e) => {
                  const selectedState = e.target.value;
                  const fallback = STATE_COORDINATES[selectedState];
                  onChange("location", selectedState);
                  if (!isPreciseAddressCoord) {
                    onChange("latitude", fallback?.lat ?? 6.5244);
                    onChange("longitude", fallback?.lon ?? 3.3792);
                  }
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <MapOutlined sx={{ color: "#9CA3AF", fontSize: 20 }} />
                  </InputAdornment>
                }
                MenuProps={{
                  PaperProps: { sx: { maxHeight: 240, borderRadius: "10px" } },
                }}
              >
                {NIGERIAN_STATES.map((stateName) => (
                  <MenuItem key={stateName} value={stateName}>
                    {stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        {/* SHORT DESCRIPTION (EXPANDABLE TEXTAREA - NO HORIZONTAL SCROLL) */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <label className="form-label small fw-bold text-muted mb-0">
              Short Description *
            </label>
            <Typography variant="caption" sx={{ color: "#9CA3AF", fontSize: "11px" }}>
              {formData.short_description?.length || 0}/120
            </Typography>
          </div>
          <TextField
            fullWidth
            multiline
            minRows={3}
            maxRows={4}
            inputProps={{ maxLength: 120 }}
            placeholder="A clear and brief summary about your property..."
            value={formData.short_description || ""}
            onChange={(e) => onChange("short_description", e.target.value.slice(0, 120))}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                alignItems: "flex-start",
              },
              "& textarea": {
                lineHeight: 1.5,
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ mt: 1 }}>
                  <ChatBubbleOutlineOutlined sx={{ color: "#9CA3AF", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* FULL DESCRIPTION (RICH TEXT EDITOR CANVAS) */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-muted mb-1 d-block">
            Full Description *
          </label>
          <RichTextEditor
            value={formData.description || ""}
            onChange={(htmlContent) => onChange("description", htmlContent)}
            maxLength={1000}
          />
        </div>

        {/* CATEGORY & PROPERTY TYPE */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted">Category</label>
            <FormControl fullWidth size="small">
              <Select
                value={formData.category || ""}
                onChange={(e) => onChange("category", e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryOutlined sx={{ color: "#9CA3AF", fontSize: 18 }} />
                  </InputAdornment>
                }
              >
                {["Sale", "Rent", "Shortlet"].map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {propertyType === "property" && (
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">Property Type</label>
              <FormControl fullWidth size="small">
                <Select
                  value={formData.type || ""}
                  onChange={(e) => onChange("type", e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <CategoryOutlined sx={{ color: "#9CA3AF", fontSize: 18 }} />
                    </InputAdornment>
                  }
                >
                  {["Land", "Apartment"].map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          {formData.type === "Land" && (
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">
                Land Size (in square meters)
              </label>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={formData.land_size || ""}
                onChange={(e) => onFormattedChange("land_size", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NotesOutlined sx={{ color: "#9CA3AF", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          )}

          {typeConfig.hasHotelDetails && (
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">
                Star Rating (Optional)
              </label>
              <Box sx={{ display: "flex", alignItems: "center", height: "40px" }}>
                <Rating
                  value={Number(formData.star_rating) || 0}
                  onChange={(e, val) => onChange("star_rating", val)}
                  emptyIcon={
                    <StarBorderOutlined sx={{ fontSize: 24, color: "#D1D5DB" }} />
                  }
                />
              </Box>
            </div>
          )}
        </div>
      </Paper>

      {/* CATEGORY SPECIFIC SPECS */}
      {hasCategoryDetails && (
        <Paper elevation={0} className="p-4 border mb-4" sx={{ borderRadius: "16px" }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <DomainOutlined sx={{ color: "#017E53", fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827" }}>
              {propertyType === "hostel"
                ? "Hostel Details"
                : propertyType === "hotel"
                ? "Hotel Details"
                : "Event Center Details"}
            </Typography>
          </div>

          {typeConfig.hasHostelDetails && (
            <HostelFields
              formData={formData}
              onChange={onChange}
              onFormattedChange={onFormattedChange}
            />
          )}

          {typeConfig.hasEventDetails && (
            <EventCenterFields
              formData={formData}
              onChange={onChange}
              onFormattedChange={onFormattedChange}
            />
          )}

          {typeConfig.hasHotelDetails && (
            <HotelFields
              formData={formData}
              onChange={onChange}
              onFormattedChange={onFormattedChange}
            />
          )}
        </Paper>
      )}

      {/* AMENITIES */}
      <AmenitiesSelector
        availableAmenities={availableAmenities}
        selectedAmenities={formData.amenities}
        onToggle={onToggleAmenity}
        propertyType={propertyType}
      />

      <Button
        fullWidth
        variant="contained"
        endIcon={<ArrowForward />}
        disabled={!formData.name || isTitleOverLimit || !formData.address}
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
          You can save your progress and continue later
        </Typography>
      </div>
    </Box>
  );
};

export default Step1PropertyDetails;