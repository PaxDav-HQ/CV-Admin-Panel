import React, { useState } from "react";
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
} from "@mui/icons-material";

import { STATE_COORDINATES, NIGERIAN_STATES } from "../constants/wizardConfig";
import { useAddressGeocoding } from "../hooks/useAddressGeocoding";
import AmenitiesSelector from "./AmenitiesSelector";
import HostelFields from "./categoryFields/HostelFields";
import EventCenterFields from "./categoryFields/EventCenterFields";
import HotelFields from "./categoryFields/HotelFields";

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

  return (
    <Box>
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
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, color: "#111827" }}
          >
            Basic Information
          </Typography>
        </div>

        <div className="mb-3">
          <label className="form-label small fw-bold text-muted">
            {typeConfig.nameLabel} *
          </label>
          <TextField
            fullWidth
            size="small"
            placeholder={typeConfig.namePlaceholder}
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {typeConfig.icon}
                </InputAdornment>
              ),
            }}
          />
        </div>

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
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter address, city or state"
                  InputProps={{
                    ...(params.InputProps || {}),
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnOutlined sx={{ color: "#9CA3AF", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {addressLoading ? (
                          <CircularProgress color="inherit" size={16} />
                        ) : null}
                        {params?.InputProps?.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </div>

          <div className="col-12 col-md-5">
            <label className="form-label small fw-bold text-muted">State *</label>
            <FormControl fullWidth size="small">
              <Select
                value={formData.location}
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

        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <label className="form-label small fw-bold text-muted">
              Short Description *
            </label>
            <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
              {formData.short_description.length}/120
            </Typography>
          </div>
          <TextField
            fullWidth
            size="small"
            inputProps={{ maxLength: 120 }}
            placeholder="A short summary about your property..."
            value={formData.short_description}
            onChange={(e) => onChange("short_description", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ChatBubbleOutlineOutlined sx={{ color: "#9CA3AF", fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <label className="form-label small fw-bold text-muted">
              Full Description *
            </label>
            <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
              {formData.description.length}/1000
            </Typography>
          </div>
          <TextField
            fullWidth
            multiline
            rows={3}
            inputProps={{ maxLength: 1000 }}
            placeholder="Describe your property, facilities, environment rules and what makes it a great place to stay..."
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  sx={{ alignSelf: "flex-start", mt: 1 }}
                >
                  <NotesOutlined sx={{ color: "#9CA3AF", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-bold text-muted">
              Category
            </label>
            <FormControl fullWidth size="small">
              <Select
                value={formData.category}
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
          {propertyType == 'property' && (
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">
                Property Type
              </label>
              <FormControl fullWidth size="small">
              <Select
                value={formData.type}
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

          {formData.type == 'Land' && (
            <div className="col-12 col-md-6">
              <label className="form-label small fw-bold text-muted">
                Land Size (in square meters)
              </label>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={formData.land_size}
                onChange={(e) => onFormattedChange("land_size", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ alignSelf: "flex-start", mt: 1 }}
                    >
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
                  value={formData.star_rating}
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
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#111827" }}
            >
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
        disabled={!formData.name || !formData.address}
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