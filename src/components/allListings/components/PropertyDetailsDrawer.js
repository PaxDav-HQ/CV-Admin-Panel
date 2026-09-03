import React from "react";
import {
  SwipeableDrawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Paper,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Close,
  LocationOnOutlined,
  BedOutlined,
  BathtubOutlined,
  CropFreeOutlined,
  EditOutlined,
  VerifiedOutlined,
  BlockOutlined,
  PersonOffOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { formatListingDateTime } from "../utils/listingFormatters";
import { getTypeChip, getCategoryChip, getStatusChip } from "../utils/listingBadges";

const PropertyDetailsDrawer = ({
  open,
  onClose,
  listing,
  onAction,
}) => {
  const theme = useTheme();
  // Strictly target mobile phones below 600px width
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const currentUser = useSelector((state) => state.UserReducer?.userInfo);

  if (!listing) return null;

  const mainPhoto =
    listing.metadata?.main_photo ||
    listing.image ||
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600";
  const galleryImages = listing.images || listing.metadata?.images || [];
  const price = listing.metadata?.price || listing.total_price || 0;
  const { date: listedDate, time: listedTime } = formatListingDateTime(listing.created_at);

  const isPublicized = Boolean(listing.publicized);

  const currentUserId = currentUser?.id ?? currentUser?.userId ?? currentUser?._id;
  const isOwner = String(listing.owner_id) === String(currentUserId);
  const canBanAgent = !isOwner;

  return (
    <SwipeableDrawer
      anchor={isMobile ? "bottom" : "right"}
      open={Boolean(open)}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen={true}
      swipeAreaWidth={isMobile ? 30 : 0}
      sx={{
        zIndex: 1300,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          // FIXED WIDTH ON DESKTOP - IMPOSSIBLE TO BE FULL WIDTH
          width: isMobile ? "100vw !important" : "500px !important",
          maxWidth: isMobile ? "100vw !important" : "500px !important",
          minWidth: isMobile ? "auto" : "400px",
          height: isMobile ? "85vh !important" : "100vh !important",
          maxHeight: isMobile ? "85vh !important" : "100vh !important",
          position: "fixed",
          right: 0,
          top: isMobile ? "auto" : 0,
          bottom: 0,
          bgcolor: "#FFFFFF",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.12)",
          overflowY: "auto",
          borderTopLeftRadius: isMobile ? "20px" : 0,
          borderTopRightRadius: isMobile ? "20px" : 0,
        },
      }}
    >
      {/* MOBILE DRAG DOWN GESTURE HANDLE */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 1.5,
            cursor: "grab",
            touchAction: "none",
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 5,
              bgcolor: "#CBD5E1",
              borderRadius: "4px",
            }}
          />
        </Box>
      )}

      {/* HEADER */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <div>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
            Property Details
          </Typography>
          <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
            ID: LIS-{String(listing.id).padStart(5, "0")}
          </Typography>
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ border: "1px solid #E5E7EB", borderRadius: "8px" }}
        >
          <Close sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* CONTENT BODY */}
      <Box sx={{ p: 3 }}>
        {/* MAIN PHOTO BANNER */}
        <Box
          component="img"
          src={mainPhoto}
          alt={listing.name || "Property preview"}
          sx={{
            width: "100%",
            height: 220,
            borderRadius: "14px",
            objectFit: "cover",
            bgcolor: "#F3F4F6",
            mb: 2,
          }}
        />

        {/* GALLERY STRIP */}
        {galleryImages.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, overflowX: "auto", mb: 2.5, pb: 0.5 }}>
            {galleryImages.map((imgUrl, i) => (
              <Box
                key={i}
                component="img"
                src={typeof imgUrl === "string" ? imgUrl : URL.createObjectURL(imgUrl)}
                alt="thumbnail"
                sx={{
                  width: 70,
                  height: 50,
                  borderRadius: "8px",
                  objectFit: "cover",
                  flexShrink: 0,
                  border: "1px solid #E5E7EB",
                }}
              />
            ))}
          </Box>
        )}

        {/* TITLE & STATUS */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2, mb: 1 }}>
          <div>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
              {listing.name || "Untitled Listing"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#4B5563",
                display: "flex",
                alignItems: "flex-start",
                gap: 0.8,
                mt: 0.8,
                fontSize: "13px",
                lineHeight: 1.4,
              }}
            >
              <LocationOnOutlined sx={{ fontSize: 16, color: "#017E53", mt: 0.2, flexShrink: 0 }} />
              <span>{listing.address || listing.location || "No address provided"}</span>
            </Typography>
          </div>
          <Box sx={{ flexShrink: 0 }}>{getStatusChip(listing.status)}</Box>
        </Box>

        {/* PRICING CARD */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "12px", my: 2 }}>
          <Typography variant="caption" sx={{ color: "#047857", fontWeight: 700, textTransform: "uppercase" }}>
            Total Price
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#065F46" }}>
            ₦{Number(price).toLocaleString()}{" "}
            <Typography component="span" variant="caption" sx={{ color: "#047857", fontWeight: 600 }}>
              / {listing.pricing_type || "Year"}
            </Typography>
          </Typography>
        </Paper>

        {/* SPECIFICATION CHIPS */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {getTypeChip(listing.type || listing.listing_type)}
          {getCategoryChip(listing.category)}
          {listing.capacity && (
            <Chip
              icon={<CropFreeOutlined sx={{ fontSize: "14px !important" }} />}
              label={`Capacity: ${listing.capacity} people`}
              size="small"
              sx={{ bgcolor: "#F3F4F6", fontWeight: 600, fontSize: "11px" }}
            />
          )}
          {listing.bedrooms && (
            <Chip
              icon={<BedOutlined sx={{ fontSize: "14px !important" }} />}
              label={`${listing.bedrooms} Beds`}
              size="small"
              sx={{ bgcolor: "#F3F4F6", fontWeight: 600, fontSize: "11px" }}
            />
          )}
          {listing.bathrooms && (
            <Chip
              icon={<BathtubOutlined sx={{ fontSize: "14px !important" }} />}
              label={`${listing.bathrooms} Baths`}
              size="small"
              sx={{ bgcolor: "#F3F4F6", fontWeight: 600, fontSize: "11px" }}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* DESCRIPTION */}
        <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.5px" }}>
          DESCRIPTION
        </Typography>
        {/* NEW CODE: Parses and displays HTML without showing literal tags */}
        <Box
          sx={{
            color: "#4B5563",
            fontSize: "13px",
            lineHeight: 1.6,
            mt: 0.5,
            mb: 3,
            "& p": { m: 0, mb: 1 },
            "& ul, & ol": { pl: 2.5, my: 1 },
            "& strong": { color: "#111827" },
          }}
          dangerouslySetInnerHTML={{
            __html:
              listing.metadata?.description ||
              listing.description ||
              listing.about ||
              "No full description provided.",
          }}
        />

        {/* LISTED BY AGENT */}
        <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.5px", display: "block", mb: 1 }}>
          LISTED BY
        </Typography>
        <Paper elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <div className="d-flex align-items-center gap-2.5">
            <Avatar src={listing.owner_avatar || ""} sx={{ bgcolor: "#017E53", color: "#fff", width: 38, height: 38, fontSize: "14px", fontWeight: 700 }}>
              {listing.owner_name?.charAt(0) || "A"}
            </Avatar>
            <div>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#111827", fontSize: "13px" }}>
                {listing.owner_name || "Agent"} {isOwner && "(You)"}
              </Typography>
              <Typography variant="caption" sx={{ color: "#9CA3AF" }}>
                {listing.owner_email || "No email available"} • Listed on {listedDate}
              </Typography>
            </div>
          </div>
        </Paper>

        <Divider sx={{ my: 2 }} />

        {/* ACTION BUTTONS */}
        <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, letterSpacing: "0.5px", display: "block", mb: 1.5 }}>
          MANAGE LISTING
        </Typography>

        <div className="row g-2 mb-2">
          <div className={`col-12 ${!isPublicized || canBanAgent ? "col-sm-6" : "col-sm-12"}`}>
            <Button
              fullWidth
              variant="outlined"              
              startIcon={<EditOutlined />}
              onClick={() => onAction("edit", listing)}
              sx={{
                borderRadius: "10px",
                borderColor: "#D1D5DB",
                color: "#374151",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "12.5px",
                py: 1,
              }}
            >
              Edit Property
            </Button>
          </div>

          {!isPublicized && canBanAgent && (
            <>
              <div className="col-12 col-sm-6">
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<VerifiedOutlined />}
                  onClick={() => onAction("approve", listing)}
                  sx={{
                    borderRadius: "10px",
                    bgcolor: "#017E53",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "12.5px",
                    py: 1,
                    "&:hover": { bgcolor: "#016744" },
                  }}
                >
                  Approve Listing
                </Button>
              </div>

              <div className="col-12 col-sm-6">
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<BlockOutlined />}
                  onClick={() => onAction("reject", listing)}
                  sx={{
                    borderRadius: "10px",
                    borderColor: "#FDE68A",
                    bgcolor: "#FFFBEB",
                    color: "#D97706",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "12.5px",
                    py: 1,
                    "&:hover": { bgcolor: "#FEF3C7", borderColor: "#F59E0B" },
                  }}
                >
                  Reject Listing
                </Button>
              </div>
            </>
          )}

          {canBanAgent && (
            <div className={`col-12 ${!isPublicized ? "col-sm-6" : "col-sm-12"}`}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonOffOutlined />}
                onClick={() => onAction("ban", listing)}
                sx={{
                  borderRadius: "10px",
                  borderColor: "#FEE2E2",
                  bgcolor: "#FEF2F2",
                  color: "#EF4444",
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "12.5px",
                  py: 1,
                  "&:hover": { bgcolor: "#FEE2E2", borderColor: "#DC2626" },
                }}
              >
                Ban Agent
              </Button>
            </div>
          )}
        </div>

        <Button
          fullWidth
          variant="contained"
          startIcon={<DeleteOutlineOutlined />}
          onClick={() => onAction("delete", listing)}
          sx={{
            borderRadius: "10px",
            bgcolor: "#EF4444",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
            fontSize: "12.5px",
            py: 1.1,
            mt: 1,
            "&:hover": { bgcolor: "#DC2626" },
          }}
        >
          Delete Listing
        </Button>
      </Box>
    </SwipeableDrawer>
  );
};

export default PropertyDetailsDrawer;