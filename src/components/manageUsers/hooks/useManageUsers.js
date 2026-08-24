import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const ROLE_MAPPING = {
  Client: "customer",
  Agent: "agent",
  Admin: "admin",
};

export const useManageUsers = (uri, token) => {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    total_users: { count: 0, change: 0 },
    clients: { count: 0, change: 0 },
    service_providers: { count: 0, change: 0 },
    agents: { count: 0, change: 0 },
    banned_users: { count: 0, change: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [limit, setLimit] = useState(10);

  const [search, setSearch] = useState("");
  const [userType, setUserType] = useState("All");
  const [status, setStatus] = useState("All");

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    userType: "All",
    status: "All",
  });

  const fetchUsersAndStats = useCallback(() => {
    if (!token) return;
    setLoading(true);

    const params = {
      page,
      limit,
      q: activeFilters.search ? activeFilters.search : undefined,
      role:
        activeFilters.userType !== "All"
          ? ROLE_MAPPING[activeFilters.userType] || activeFilters.userType.toLowerCase()
          : undefined,
      suspended:
        activeFilters.status === "Suspended"
          ? true
          : activeFilters.status === "Active"
          ? false
          : undefined,
    };

    axios
      .get(`${uri}admin/users`, {
        params,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalEntries(res.data.pagination.totalItems || 0);
        }
        if (res.data.metrics) {
          setMetrics(res.data.metrics);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user directory:", err);
        setLoading(false);
      });
  }, [uri, token, page, limit, activeFilters]);

  useEffect(() => {
    fetchUsersAndStats();
  }, [fetchUsersAndStats]);

  const applyFilters = () => {
    setPage(1);
    setActiveFilters({ search, userType, status });
  };

  const resetFilters = () => {
    setSearch("");
    setUserType("All");
    setStatus("All");
    setPage(1);
    setActiveFilters({ search: "", userType: "All", status: "All" });
  };

  return {
    users,
    metrics,
    loading,
    page,
    setPage,
    totalPages,
    totalEntries,
    limit,
    setLimit,
    search,
    setSearch,
    userType,
    setUserType,
    status,
    setStatus,
    applyFilters,
    resetFilters,
    fetchUsersAndStats,
  };
};