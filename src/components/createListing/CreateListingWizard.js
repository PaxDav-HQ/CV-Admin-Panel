import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Box, Container } from "@mui/material";

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
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem("userToken");

  const searchParams = new URLSearchParams(location.search);
  const propertyType = searchParams.get("type") || "hostel";
  const typeConfig = CONFIG_BY_TYPE[propertyType] || CONFIG_BY_TYPE.hostel;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableAmenities, setAvailableAmenities] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    location: "Lagos",
    address: "",
    latitude: STATE_COORDINATES["Lagos"].lat,
    longitude: STATE_COORDINATES["Lagos"].lon,
    year_established: "2020",

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
    number_of_floors: "",
    bedrooms: "",
    bathrooms: "",

    pricing_type: typeConfig.defaultPriceType,
    total_price: "",
    security_deposit: "",
    min_booking: "1 Month",
    additional_charges: "",
    available_from: new Date().toISOString().split("T")[0],
    vacancy_status: "Available Now",

    amenities: [],
    main_photo: null,
    images: [],
    video_file: null,

    id_card: null,
    selfie: null,
    agree_terms: true,
  });

  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormattedNumberChange = (field, rawValue) => {
    const cleanNumber = sanitizeNumericInput(rawValue);
    setFormData((prev) => ({ ...prev, [field]: cleanNumber }));
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

  const handleMainPhotoSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, main_photo: e.target.files[0] }));
    }
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
    postData.append("short_description", formData.short_description);
    postData.append("location", formData.location);
    postData.append("address", formData.address);
    postData.append("category", typeConfig.category);
    postData.append("type", propertyType);
    postData.append("total_price", Number(formData.total_price) || 0);
    postData.append("pricing_type", formData.pricing_type);
    postData.append("latitude", Number(lat));
    postData.append("longitude", Number(lon));
    postData.append(
      "security_deposit",
      Number(formData.security_deposit) || 0
    );
    postData.append("min_booking", formData.min_booking);
    postData.append("vacancy_status", formData.vacancy_status);

    if (formData.capacity)
      postData.append("capacity", Number(formData.capacity));
    if (formData.number_of_rooms)
      postData.append("number_of_rooms", Number(formData.number_of_rooms));
    if (formData.bedrooms)
      postData.append("bedrooms", Number(formData.bedrooms));
    if (formData.bathrooms)
      postData.append("bathrooms", Number(formData.bathrooms));

    formData.amenities.forEach((id) => postData.append("amenities[]", id));

    if (formData.main_photo) {
      postData.append("main_photo", formData.main_photo);
    } else if (formData.images.length > 0) {
      postData.append("main_photo", formData.images[0]);
    }

    formData.images.forEach((imgFile) => {
      postData.append("images", imgFile);
    });

    if (formData.id_card) postData.append("id_document", formData.id_card);
    if (formData.selfie) postData.append("selfie", formData.selfie);

    try {
      await axios.post(`${uri}property/create`, postData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      navigate("/admin/listings");
    } catch (err) {
      console.error("Failed to submit property listing:", err);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", pb: 8 }}>
      <WizardHeader
        title={typeConfig.title}
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
            propertyType={propertyType}
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
            propertyType={propertyType}
            onChange={handleInputChange}
            onFormattedChange={handleFormattedNumberChange}
            onMainPhotoSelect={handleMainPhotoSelect}
            onGallerySelect={handleGalleryPhotosSelect}
            onRemoveGalleryImage={removeGalleryImage}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <Step3ReviewSubmit
            typeConfig={typeConfig}
            formData={formData}
            propertyType={propertyType}
            availableAmenities={availableAmenities}
            loading={loading}
            onEdit={() => setCurrentStep(1)}
            onChange={handleInputChange}
            onSubmit={handleSubmitListing}
          />
        )}
      </Container>
    </Box>
  );
};

export default CreateListingWizard;