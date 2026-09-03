import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Container, Snackbar, Alert } from "@mui/material";
import { extractErrorMessage } from "../../utils/errorParser";
import {
  CONFIG_BY_TYPE,
  STATE_COORDINATES,
} from "./constants/wizardConfig";
import { sanitizeNumericInput } from "./utils/numberFormatters";
import WizardHeader from "./components/WizardHeader";
import WizardStepper from "./components/WizardStepper";
import Step1PropertyDetails from "./components/Step1PropertyDetails";
import Step2PricingMedia from "./components/Step2PricingMedia";
import Step3ReviewSubmit from "./components/Step3ReviewSubmit";

const CreateListingWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();

  const searchParams = new URLSearchParams(location.search);
  const listingId = paramId || searchParams.get("id");
  const isEditMode = Boolean(listingId);

  const uri = useSelector((state) => state.UriReducer?.uri);
  const token = sessionStorage.getItem("userToken");

  const [activePropertyType, setActivePropertyType] = useState(
    searchParams.get("type") || "hostel"
  );
  const typeConfig = CONFIG_BY_TYPE[activePropertyType] || CONFIG_BY_TYPE.hostel;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableAmenities, setAvailableAmenities] = useState([]);

  // Toast State
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    location: "Lagos",
    address: "",
    latitude: STATE_COORDINATES["Lagos"].lat,
    longitude: STATE_COORDINATES["Lagos"].lon,
    category: "Sale",
    type: "Apartment",
    land_size: 0,

    capacity: "",
    room_type: "Shared Room",
    gender_preference: "Male",
    bathroom_type: "En-suite",
    furnishing_level: "Fully Furnished",
    number_of_rooms: "",
    available_units: "",
    hall_type: "Banquet Hall",
    seating_arrangement: "Banquet",
    indoor_outdoor: "Indoor",
    parking_spaces: "",
    star_rating: 4,
    total_rooms: "",
    check_in_time: "14:00",
    check_out_time: "12:00",
    floor_numbers: 0,
    bedrooms: "",
    bathrooms: "",

    // Hotel Room Types
    room_types: [
      {
        name: "Deluxe Room",
        bed_type: "King Bed",
        max_occupancy: "2 Guests",
        price_per_night: "",
        available_rooms: "",
      },
    ],

    pricing_type: typeConfig.defaultPriceType,
    total_price: "",
    security_deposit: "",
    min_booking: activePropertyType === "hotel" ? 1 : 30,
    additional_charges: "",
    available_from: new Date().toISOString().split("T")[0],
    vacancy_status: "Available Now",
    supportedEvent: ["wedding", "birthday"],

    amenities: [],
    images: [],
    video_file: null,

    agree_terms: true,
  });

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // Fetch Amenities
  useEffect(() => {
    axios
      .get(`${uri}property/amenities`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAvailableAmenities(res.data?.data || res.data || []);
      })
      .catch((err) => {
        console.error("Failed fetching amenities:", err);
      });
  }, [uri, token]);

  // Fetch Listing Details in Edit Mode
  useEffect(() => {
    if (!isEditMode || !listingId || !token) return;

    setLoading(true);
    axios
      .get(`${uri}property/update/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const item = res.data?.data || res.data;
        if (!item) return;

        const incomingType = item.listing_type || item.type || searchParams.get("type") || "property/update";
        if (CONFIG_BY_TYPE[incomingType]) {
          setActivePropertyType(incomingType);
        }

        let parsedRooms = [];
        if (item.room_types) {
          try {
            parsedRooms =
              typeof item.room_types === "string"
                ? JSON.parse(item.room_types)
                : item.room_types;
          } catch (e) {
            console.error("Failed parsing room_types:", e);
          }
        }

        let parsedEvents = [];
        if (item.supported_events) {
          try {
            parsedEvents =
              typeof item.supported_events === "string"
                ? JSON.parse(item.supported_events)
                : item.supported_events;
          } catch (e) {
            console.error("Failed parsing supported_events:", e);
          }
        }

        const mappedAmenities = Array.isArray(item.amenities)
          ? item.amenities.map((a) => (typeof a === "object" ? a.id || a._id : a))
          : [];

        // Consolidate Images: Unify main cover photo into index 0 of images array
        const rawImageList = Array.isArray(item.resources)
          ? [...item.resources]          
          : [];

        const mainCover = item.main_photo
        let consolidatedImages = [...rawImageList];

        if (mainCover) {
          consolidatedImages = consolidatedImages.filter(
            (img) => (typeof img === "string" ? img : img?.url) !== mainCover
          );
          consolidatedImages.unshift(mainCover);
        }

        setFormData((prev) => ({
          ...prev,
          name: item.name || "",
          short_description: item.about || item.short_description || "",
          description: item.description || "",
          location: item.location || "Lagos",
          address: item.address || "",
          latitude: item.latitude ?? (STATE_COORDINATES[item.location]?.lat || prev.latitude),
          longitude: item.longitude ?? (STATE_COORDINATES[item.location]?.lon || prev.longitude),
          category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          type: item.type || "Apartment",
          land_size: item.land_size || 0,
          capacity: item.capacity || "",
          number_of_rooms: item.number_of_rooms || "",
          available_units: item.available_units || "",
          hall_type: item.hall_type || prev.hall_type,
          seating_arrangement: item.seating_arrangement || prev.seating_arrangement,
          indoor_outdoor: item.indoor ? "Indoor" : item.indoor_outdoor || "Indoor",
          parking_spaces: item.parking_spaces || "",
          star_rating: item.star_rating || 4,
          total_rooms: item.total_rooms || "",
          check_in_time: item.check_in_time || "14:00",
          check_out_time: item.check_out_time || "12:00",
          floor_numbers: item.floor_numbers || 0,
          bedrooms: item.bedrooms || "",
          bathrooms: item.bathrooms || "",
          gender_preference: item.gender_preference || "",
          bathroom_type: item.bathroom_type || "",
          furnishing_level: item.furnishing_level || "",

          room_types: parsedRooms.length > 0 ? parsedRooms : prev.room_types,
          pricing_type: item.pricing_type || prev.pricing_type,
          total_price: item.total_price || "",
          security_deposit: item.security_deposit || "",
          min_booking: item.min_booking || (incomingType === "hotel" ? 1 : 30),
          additional_charges: item.additional_charges || "",
          available_from: item.available_from
            ? new Date(item.available_from).toISOString().split("T")[0]
            : prev.available_from,
          vacancy_status: item.vacancy_status || "Available Now",
          supportedEvent: parsedEvents.length > 0 ? parsedEvents : prev.supportedEvent,

          amenities: mappedAmenities,
          images: consolidatedImages,
        }));
      })
      .catch((err) => {
        console.error("Failed fetching listing to edit:", err);
        setToast({
          open: true,
          message: extractErrorMessage(err, "Failed to load listing for edit."),
          severity: "error",
        });
      })
      .finally(() => setLoading(false));
  }, [isEditMode, listingId, uri, token]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormattedNumberChange = (field, rawValue) => {
    const cleanNumber = sanitizeNumericInput(rawValue);
    setFormData((prev) => ({ ...prev, [field]: cleanNumber }));
  };

  // Hotel Room Type Handlers
  const handleAddRoomType = () => {
    setFormData((prev) => ({
      ...prev,
      room_types: [
        ...prev.room_types,
        {
          name: "",
          bed_type: "King Bed",
          max_occupancy: "2 Guests",
          price_per_night: "",
          available_rooms: "",
        },
      ],
    }));
  };

  const handleRemoveRoomType = (index) => {
    setFormData((prev) => ({
      ...prev,
      room_types: prev.room_types.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateRoomType = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.room_types];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, room_types: updated };
    });
  };

  const toggleAmenity = (amenityId) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenityId);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((id) => id !== amenityId)
          : [...prev.amenities, amenityId],
      };
    });
  };

  const handleGalleryPhotosSelect = (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesArr],
      }));
    }
  };

  const removeGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleSubmitListing = async () => {
    setLoading(true);

    const lat =
      formData.latitude ??
      STATE_COORDINATES[formData.location]?.lat ??
      6.5244;
    const lon =
      formData.longitude ??
      STATE_COORDINATES[formData.location]?.lon ??
      3.3792;

    const postData = new FormData();

    postData.append("name", formData.name);
    postData.append("description", formData.description);
    postData.append("about", formData.short_description);
    postData.append("location", formData.location);
    postData.append("address", formData.address);
    postData.append("category", formData.category?.toLowerCase());
    postData.append(
      "type",
      activePropertyType === "property/update" ? formData.type.toLowerCase() : activePropertyType
    );

    // Base Price
    const basePrice =
      activePropertyType === "hotel"
        ? Number(formData.room_types[0]?.price_per_night) || 0
        : Number(formData.total_price) || 0;

    postData.append("total_price", basePrice);
    postData.append(
      "pricing_type",
      activePropertyType === "hotel" ? "night" : formData.pricing_type
    );
    postData.append("available_from", formData.available_from);

    if (formData.type === "Land") {
      postData.append("land_size", Number(formData.land_size) || 0);
    }

    if (activePropertyType === "event_center") {
      postData.append("indoor", formData.indoor_outdoor === "Indoor");
      formData.supportedEvent.forEach((evt) => postData.append("supported_events[]", evt));
    }

    if (formData.floor_numbers !== 0) {
      postData.append("floor_numbers", Number(formData.floor_numbers));
    }

    postData.append("latitude", Number(lat));
    postData.append("longitude", Number(lon));

    // Security Deposit: Strictly Positive Integer (never zero)
    const depositInt = parseInt(String(formData.security_deposit).replace(/[^0-9]/g, ""), 10);
    if (!isNaN(depositInt) && depositInt > 0) {
      postData.append("security_deposit", depositInt);
    }

    postData.append("min_booking", Number(formData.min_booking) || 1);
    postData.append("vacancy_status", formData.vacancy_status);

    if (formData.capacity) postData.append("capacity", Number(formData.capacity));
    if (formData.number_of_rooms) postData.append("number_of_rooms", Number(formData.number_of_rooms));
    if (formData.bedrooms) postData.append("bedrooms", Number(formData.bedrooms));
    if (formData.bathrooms) postData.append("bathrooms", Number(formData.bathrooms));

    // Stringified Room Types
    if (activePropertyType === "hotel" && formData.room_types?.length > 0) {
      const sanitizedRooms = formData.room_types.map((room) => ({
        name: room.name,
        bed_type: room.bed_type,
        max_occupancy: room.max_occupancy,
        price_per_night: Number(room.price_per_night) || 0,
        available_rooms: Number(room.available_rooms) || 1,
      }));
      postData.append("room_types", JSON.stringify(sanitizedRooms));
    }

    formData.amenities.forEach((id) => postData.append("amenities[]", id));

    // Upload newly added files only
    formData.images.forEach((imgFile) => {
      if (imgFile instanceof File) {
        postData.append("images", imgFile);
      }
    });

    try {
      const endpoint = isEditMode
        ? `${uri}property/update/${listingId}`
        : `${uri}property/create`;
      const method = isEditMode ? "patch" : "post";

      await axios[method](endpoint, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      setToast({
        open: true,
        message: isEditMode ? "Listing updated successfully!" : "Listing published successfully!",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/admin/listings/all");
      }, 1200);
    } catch (err) {
      console.error("Failed to submit property listing:", err.response);
      setLoading(false);

      const errorMsg = extractErrorMessage(
        err,
        isEditMode
          ? "Failed to update listing. Please verify your inputs and try again."
          : "Failed to submit listing. Please verify your inputs and try again."
      );

      setToast({
        open: true,
        message: errorMsg,
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", pb: 8 }}>
      <WizardHeader
        title={isEditMode ? `Edit ${formData.name || "Listing"}` : typeConfig.title}
        currentStep={currentStep}
        onBack={() =>
          currentStep > 1 ? setCurrentStep((s) => s - 1) : navigate(-1)
        }
      />

      <Container maxWidth="md" sx={{ pt: 4 }}>
        <WizardStepper currentStep={currentStep} />

        {currentStep === 1 && (
          <Step1PropertyDetails
            typeConfig={typeConfig}
            formData={formData}
            propertyType={activePropertyType}
            availableAmenities={availableAmenities}
            onChange={handleInputChange}
            onFormattedChange={handleFormattedNumberChange}
            onToggleAmenity={toggleAmenity}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2PricingMedia
            typeConfig={typeConfig}
            formData={formData}
            propertyType={activePropertyType}
            onChange={handleInputChange}
            onFormattedChange={handleFormattedNumberChange}
            onGallerySelect={handleGalleryPhotosSelect}
            onRemoveGalleryImage={removeGalleryImage}
            onAddRoomType={handleAddRoomType}
            onRemoveRoomType={handleRemoveRoomType}
            onUpdateRoomType={handleUpdateRoomType}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3ReviewSubmit
            typeConfig={{
              ...typeConfig,
              buttonText: isEditMode ? "Update Listing" : typeConfig.buttonText,
            }}
            formData={formData}
            propertyType={activePropertyType}
            availableAmenities={availableAmenities}
            loading={loading}
            errorMessage={toast.severity === "error" && toast.open ? toast.message : ""}
            onEdit={() => setCurrentStep(1)}
            onChange={handleInputChange}
            onSubmit={handleSubmitListing}
          />
        )}
      </Container>

      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ mt: 7 }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "13px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            bgcolor: toast.severity === "success" ? "#017E53" : "#EF4444",
            color: "#FFFFFF",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateListingWizard;