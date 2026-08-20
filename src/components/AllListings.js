import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Box, Typography, Button, Stack, Paper, TextField, InputAdornment,
  MenuItem, Select, FormControl, Chip, Avatar, IconButton,
  Menu, MenuItem as MuiMenuItem, Pagination, PaginationItem, CircularProgress
} from '@mui/material';
import {
  Add, FileDownloadOutlined, Search, TuneOutlined, RefreshOutlined, LocationOnOutlined,
  MoreHorizOutlined, VisibilityOutlined, EditOutlined, VerifiedOutlined,
  BlockOutlined, PersonOffOutlined, LockResetOutlined, DeleteOutlineOutlined,
  ArrowBack, ArrowForward, CheckCircleOutlined, HourglassEmptyOutlined, 
  CancelOutlined, ReportProblemOutlined
} from '@mui/icons-material';

const PLACEHOLDER_METRICS = [
  { key: 'total', label: 'Total Listings', count: 4562, change: 12.4, trend: 'up', color: '#3B82F6', icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' },
  { key: 'active', label: 'Active Listings', count: 3120, change: 8.7, trend: 'up', color: '#10B981', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' },
  { key: 'pending', label: 'Pending Approval', count: 235, change: 4.3, trend: 'down', color: '#F59E0B', icon: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z' },
  { key: 'rejected', label: 'Rejected Listings', count: 67, change: 2.1, trend: 'down', color: '#EC4899', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z' },
  { key: 'reported', label: 'Reported Listings', count: 38, change: 1.3, trend: 'up', color: '#EF4444', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
];

const PROPERTY_TYPES = ['property', 'hostel', 'hotel', 'event_center', 'service'];

const AllListings = () => {
  const uri = useSelector((state) => state.UriReducer.uri);
  const token = sessionStorage.getItem('userToken');

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('All');
  const [status, setStatus] = useState('All');
  const [activeFilters, setActiveFilters] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  const axiosConfig = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }), [token]);

  const fetchListings = useCallback(() => {
    setLoading(true);

    const params = {
      page,
      limit,
      q: activeFilters.q || undefined,
      listing_type: activeFilters.listing_type !== 'All' ? activeFilters.listing_type : undefined,
      status: activeFilters.status !== 'All' ? activeFilters.status?.toLowerCase() : undefined,
    };

    // Removed "api/" from the request endpoint
    axios.get(`${uri}admin/listings`, { params, ...axiosConfig })
      .then((res) => {
        setListings(res.data.data || []);
        
        const total = res.data.total ?? res.data.pagination?.total ?? res.data.pagination?.totalItems ?? 0;
        const computedTotalPages = res.data.pagination?.totalPages ?? Math.ceil(total / limit) ?? 1;

        setTotalEntries(total);
        setTotalPages(computedTotalPages > 0 ? computedTotalPages : 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching listings directory:', err);
        setLoading(false);
      });
  }, [uri, axiosConfig, page, limit, activeFilters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleApplyFilters = () => {
    setPage(1);
    setActiveFilters({ q: searchTerm, listing_type: propertyType, status });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPropertyType('All');
    setStatus('All');
    setPage(1);
    setActiveFilters({});
  };

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

  const getTypeChip = (type) => {
    const config = {
      property: { bg: '#F9FAFB', color: '#6B7280', label: 'House' },
      house: { bg: '#F9FAFB', color: '#6B7280', label: 'House' },
      hostel: { bg: '#EFF6FF', color: '#1D4ED8', label: 'Hostel' },
      hotel: { bg: '#FFFBEB', color: '#D97706', label: 'Hotel' },
      event_center: { bg: '#FAF5FF', color: '#9333EA', label: 'Event Center' },
      service: { bg: '#FFF1F2', color: '#E11D48', label: 'Service' },
    };
    const style = config[type?.toLowerCase()] || { bg: '#F9FAFB', color: '#6B7280', label: type };
    return <Chip label={style.label} size="small" sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: '6px' }} />;
  };

  const getCategoryChip = (category) => {
    const config = {
      shortlet: { bg: '#ECFDF5', color: '#047857', label: 'Shortlet' },
      'for sale': { bg: '#E0F2FE', color: '#0369A1', label: 'For Sale' },
      'for rent': { bg: '#EFF6FF', color: '#1D4ED8', label: 'For Rent' },
    };
    const style = config[category?.toLowerCase()] || { bg: '#F9FAFB', color: '#6B7280', label: category };
    return <Chip label={style.label} size="small" sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: '6px' }} />;
  };

  const getStatusChip = (status) => {
    const config = {
      active: { bg: '#ECFDF5', color: '#047857', label: 'Active', icon: <CheckCircleOutlined /> },
      draft: { bg: '#F3F4F6', color: '#6B7280', label: 'Draft', icon: <HourglassEmptyOutlined /> },
      pending: { bg: '#FFFBEB', color: '#D97706', label: 'Pending', icon: <HourglassEmptyOutlined /> },
      rejected: { bg: '#FEF2F2', color: '#B91C1C', label: 'Rejected', icon: <CancelOutlined /> },
      reported: { bg: '#FFF1F2', color: '#E11D48', label: 'Reported', icon: <ReportProblemOutlined /> },
    };
    const style = config[status?.toLowerCase()] || { bg: '#F9FAFB', color: '#6B7280', label: status };
    return <Chip label={style.label} icon={style.icon} size="small" sx={{ bgcolor: style.bg, color: style.color, fontWeight: 700, borderRadius: '10px', fontSize: '12px' }} />;
  };

  return (
    <Box className="container-fluid py-4" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 gap-3">
        <div>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827', letterSpacing: '-0.5px' }}>
            Listings
          </Typography>
          <Typography variant="body2" color="text.secondary">Dashboard &gt; Listings &gt; All Listings</Typography>
        </div>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlined />}
            sx={{ textTransform: 'none', color: '#374151', borderColor: '#D1D5DB', fontWeight: 600, borderRadius: '10px', px: 3 }}
          >
            Export Listings
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ textTransform: 'none', bgcolor: '#111827', color: '#fff', fontWeight: 600, borderRadius: '10px', px: 3, '&:hover': { bgcolor: '#1F2937' } }}
          >
            Add New Listing
          </Button>
        </Stack>
      </div>

      {/* METRICS ROW CARDS */}
      <div className="row g-3 mb-4">
        {PLACEHOLDER_METRICS.map((item) => {
          const isNeg = item.trend === 'down';
          return (
            <div key={item.key} className="col-12 col-sm-6 col-lg-2.4 col-xl">
              <Paper elevation={0} className="p-3 border" sx={{ borderRadius: '16px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Box sx={{ p: 1, borderRadius: '50%', bgcolor: `${item.color}15`, color: item.color, display: 'flex' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path fill="currentColor" d={item.icon} />
                    </svg>
                  </Box>
                  <Typography variant="caption" sx={{ color: isNeg ? '#EF4444' : '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {isNeg ? '▼' : '▲'} {Math.abs(item.change)}% <span style={{ color: '#6B7280', fontWeight: 400 }}>vs last month</span>
                  </Typography>
                </div>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{item.count.toLocaleString()}</Typography>
                <Typography variant="body2" className="text-muted fw-medium d-block mb-1">{item.label}</Typography>
              </Paper>
            </div>
          );
        })}
      </div>

      {/* FILTERS BOX */}
      <Paper elevation={0} className="p-3 border mb-4" sx={{ borderRadius: '16px' }}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-3">
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title, location, user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#9CA3AF' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <label className="form-label text-muted small text-uppercase fw-bold mb-1">Property Type</label>
            <FormControl fullWidth size="small">
              <Select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} sx={{ borderRadius: '10px' }}>
                <MenuItem value="All">All Types</MenuItem>
                {PROPERTY_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ').toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-sm-6 col-lg-2">
            <label className="form-label text-muted small text-uppercase fw-bold mb-1">Status</label>
            <FormControl fullWidth size="small">
              <Select value={status} onChange={(e) => setStatus(e.target.value)} sx={{ borderRadius: '10px' }}>
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
                <MenuItem value="Reported">Reported</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="col-12 col-lg-5 d-flex justify-content-lg-end gap-2 mt-3">
            <Button
              variant="text"
              startIcon={<TuneOutlined />}
              sx={{ textTransform: 'none', color: '#374151', fontWeight: 600 }}
            >
              More Filters
            </Button>
            <Button
              variant="text"
              startIcon={<RefreshOutlined />}
              onClick={handleResetFilters}
              sx={{ textTransform: 'none', color: '#6B7280', fontWeight: 600 }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{ textTransform: 'none', bgcolor: '#111827', color: '#fff', fontWeight: 600, borderRadius: '10px', py: 1, px: 4, '&:hover': { bgcolor: '#1F2937' } }}
            >
              Filter
            </Button>
          </div>
        </div>
      </Paper>

      {/* LISTINGS DIRECTORY TABLE */}
      <Paper elevation={0} className="border" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-white">
          <Typography variant="body2" className="text-muted fw-bold">
            Showing {totalEntries > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, totalEntries)} of {totalEntries} listings
          </Typography>
        </div>

        <div className="table-responsive" style={{ width: '100%', overflowX: 'auto' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <CircularProgress sx={{ color: "#22C55E" }} />
            </div>
          ) : (
            <table className="table align-middle mb-0 text-nowrap" style={{ minWidth: '1200px' }}>
              <thead className="table-light">
                <tr className="text-muted fw-bold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th className="py-3 px-4">Listing</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Category</th>
                  <th className="py-3">Location</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Listed By</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Listed Date</th>
                  <th className="py-3 text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted fw-medium">No matching records found.</td>
                  </tr>
                ) : (
                  listings.map((listing) => {
                    const mainPhoto = listing.metadata?.main_photo || '';
                    const price = listing.metadata?.price || 0;
                    
                    const createdAtRaw = listing.created_at || '';
                    const dateObj = new Date(createdAtRaw.replace(' ', 'T'));
                    let listedDate = '—', listedTime = '';
                    if (!isNaN(dateObj.getTime())) {
                      listedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                      listedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                    }

                    return (
                      <tr key={listing.id} className="hover-row">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <Box component="img" src={mainPhoto} sx={{ width: 60, height: 40, borderRadius: '8px', objectFit: 'cover', bgcolor: '#F3F4F6' }} />
                            <div>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>
                                {listing.name}
                              </Typography>
                              <Typography variant="caption" className="text-muted">
                                ID: LIS-{String(listing.id).padStart(5, '0')}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td>{getTypeChip(listing.type || listing.listing_type)}</td>
                        <td>{getCategoryChip(listing.category)}</td>
                        <td>
                          <div className="d-flex align-items-center gap-1 small text-muted">
                            <LocationOnOutlined sx={{ fontSize: 16, color: '#9CA3AF' }} />
                            {listing.address}
                          </div>
                        </td>
                        <td>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827' }}>
                            ₦{Number(price).toLocaleString()}
                          </Typography>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <Avatar src="" sx={{ width: 32, height: 32 }}>
                              {listing.owner_name?.charAt(0)}
                            </Avatar>
                            <div>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#111827', fontSize: '13px' }}>
                                {listing.owner_name}
                              </Typography>
                              <Typography variant="caption" className="text-muted" style={{ fontSize: '11px' }}>Agent</Typography>
                            </div>
                          </div>
                        </td>
                        <td>{getStatusChip(listing.status)}</td>
                        <td>
                          <div className="small">
                            <div className="fw-semibold text-dark">{listedDate}</div>
                            <div className="text-muted" style={{ fontSize: '11px' }}>{listedTime}</div>
                          </div>
                        </td>
                        <td className="text-end px-4">
                          <IconButton size="small" onClick={(e) => handleOpenMenu(e, listing)}>
                            <MoreHorizOutlined />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION CONTROLS */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top bg-white gap-3">
          <div className="d-flex align-items-center gap-2">
            <Typography variant="caption" className="text-muted fw-bold">SHOW</Typography>
            <Select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              size="small"
              sx={{ height: '32px', borderRadius: '8px', fontWeight: 700, fontSize: '12px' }}
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
            <Typography variant="caption" className="text-muted fw-bold">ENTRIES</Typography>
          </div>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            shape="rounded"
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBack, next: ArrowForward }}
                {...item}
                sx={{
                  fontWeight: 700, fontSize: '13px', border: '1px solid #D1D5DB', borderRadius: '8px', mx: '2px', minWidth: '32px', height: '32px',
                  '&.Mui-selected': { bgcolor: '#017E53 !important', color: '#fff', border: 'none' },
                }}
              />
            )}
          />
        </div>
      </Paper>

      {/* ACTION DROPDOWN MENU */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              border: '1px solid #E5E7EB',
              minWidth: '180px',
              '& .MuiMenuItem-root': {
                py: 1,
                px: 2,
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                '& svg': { fontSize: '16px', color: '#9CA3AF' }
              }
            }
          }
        }}
      >
        <MuiMenuItem onClick={() => handleListingAction('view')}>
          <VisibilityOutlined /> View Property details
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleListingAction('edit')}>
          <EditOutlined /> Edit Property
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleListingAction('verify')}>
          <VerifiedOutlined sx={{ '&&': { color: '#10B981' } }} /> Verify / Approve
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleListingAction('reject')}>
          <BlockOutlined sx={{ '&&': { color: '#F59E0B' } }} /> Reject Property
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleListingAction('ban')}>
          <PersonOffOutlined sx={{ '&&': { color: '#EF4444' } }} /> Ban agent
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleListingAction('reset_password')}>
          <LockResetOutlined /> Reset Password
        </MuiMenuItem>
        <MuiMenuItem onClick={() => handleListingAction('delete')} sx={{ color: '#EF4444 !important' }}>
          <DeleteOutlineOutlined sx={{ '&&': { color: '#EF4444' } }} /> Delete Property
        </MuiMenuItem>
      </Menu>
    </Box>
  );
};

export default AllListings;