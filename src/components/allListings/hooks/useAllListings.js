import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

export const useAllListings = (uri, token) => {
  const [listings, setListings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("All");
  const [status, setStatus] = useState("All");
  const [activeFilters, setActiveFilters] = useState({});

  const axiosConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }),
    [token]
  );

  const fetchListings = useCallback(() => {
    if (!token) return;
    setLoading(true);

    const params = {
      page,
      limit,
      q: activeFilters.q || undefined,
      listing_type:
        activeFilters.listing_type !== "All"
          ? activeFilters.listing_type
          : undefined,
      status:
        activeFilters.status !== "All"
          ? activeFilters.status?.toLowerCase()
          : undefined,
    };

    axios
      .get(`${uri}admin/listings`, { params, ...axiosConfig })
      .then((res) => {
        setListings(res.data.data || []);
        if (res.data.analytics) {
          setAnalytics(res.data.analytics);
        }
        const total =
          res.data.total ??
          res.data.pagination?.total ??
          res.data.pagination?.totalItems ??
          0;
        const computedTotalPages =
          res.data.pagination?.totalPages ?? Math.ceil(total / limit) ?? 1;

        setTotalEntries(total);
        setTotalPages(computedTotalPages > 0 ? computedTotalPages : 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listings directory:", err);
        setLoading(false);
      });
  }, [uri, axiosConfig, page, limit, activeFilters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const applyFilters = () => {
    setPage(1);
    setActiveFilters({ q: searchTerm, listing_type: propertyType, status });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPropertyType("All");
    setStatus("All");
    setPage(1);
    setActiveFilters({});
  };

  return {
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
  };
};