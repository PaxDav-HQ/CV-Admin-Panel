import React, { useState } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useAllListings } from "./hooks/useAllListings";
import ListingsHeader from "./components/ListingsHeader";
import ListingsMetricsCards from "./components/ListingsMetricsCards";
import ListingsFiltersBar from "./components/ListingsFiltersBar";
import ListingsDirectoryTable from "./components/ListingsDirectoryTable";
import ListingsActionMenu from "./components/ListingsActionMenu";

const AllListings = () => {
  const navigate = useNavigate();
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem("userToken");

  const {
    listings,
    analytics,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalEntries,
    searchTerm,
    setSearchTerm,
    propertyType,
    setPropertyType,
    status,
    setStatus,
    applyFilters,
    resetFilters,
  } = useAllListings(uri, token);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  const handleOpenMenu = (event, listing) => {
    setAnchorEl(event.currentTarget);
    setSelectedListing(listing);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedListing(null);
  };

  const handleListingAction = (actionType) => {
    handleCloseMenu();
  };

  return (
    <Box
      sx={{
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        py: 4,
        px: { xs: 1.5, sm: 3, md: 4 },
        boxSizing: "border-box",
      }}
    >
      {/* 1. Header with Breadcrumbs & Actions */}
      <ListingsHeader onAddNew={() => navigate("/admin/listings/create")} />

      {/* 2. Overview Metrics Cards */}
      <ListingsMetricsCards cards={analytics?.cards} analytics={analytics} />

      {/* 3. Search & Filter Bar */}
      <ListingsFiltersBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        status={status}
        setStatus={setStatus}
        onApply={applyFilters}
        onReset={resetFilters}
      />

      {/* 4. Contained Responsive Directory Table */}
      <ListingsDirectoryTable
        listings={listings}
        loading={loading}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
        totalEntries={totalEntries}
        onOpenMenu={handleOpenMenu}
      />

      {/* 5. Floating Action Context Menu */}
      <ListingsActionMenu
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        onAction={handleListingAction}
      />
    </Box>
  );
};

export default AllListings;