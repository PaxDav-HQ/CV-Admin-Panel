// hooks/useAddressGeocoding.js
import { useState, useEffect } from "react";

export const useAddressGeocoding = (addressInput) => {
  const [addressOptions, setAddressOptions] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    if (!addressInput || addressInput.trim().length < 3) {
      setAddressOptions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const query = encodeURIComponent(`${addressInput}, Nigeria`);
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&addressdetails=1&limit=5`);
        const data = await res.json();
        setAddressOptions(data || []);
      } catch (err) {
        console.error("Geocoding lookup failed:", err);
      } finally {
        setAddressLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [addressInput]);

  return { addressOptions, addressLoading };
};