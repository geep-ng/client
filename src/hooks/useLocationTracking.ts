'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

const LOCATION_STORAGE_KEY = 'userLocation';
const LOCATION_EXPIRY_DAYS = 20;

const useLocationTracking = () => {
  const [location, setLocation] = useState<{
    country: string;
    city: string;
  } | null>(null); // Initialize to null — don’t read localStorage here

  useEffect(() => {
    const isClient = typeof window !== 'undefined';
    if (!isClient) return;

    const getStoredLocation = () => {
      const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (!storedLocation) return null;

      try {
        const parsedData = JSON.parse(storedLocation);
        const isExpiryTime = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        const isExpired = Date.now() - parsedData.timestamp > isExpiryTime;
        return isExpired ? null : parsedData;
      } catch (err) {
        console.warn('Failed to parse stored location:', err);
        return null;
      }
    };

    const stored = getStoredLocation();
    if (stored) {
      setLocation(stored);
      return;
    }

    const fetchLocation = async () => {
      try {
        const res = await axios.get('/api/get-location');
        if (!res.data || !res.data.country || !res.data.city) {
          throw new Error('Failed to fetch location');
        }

        const newLocation = {
          country: res.data.country,
          city: res.data.city,
          timestamp: Date.now(),
        };
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLocation));
        setLocation(newLocation);
      } catch (error) {
        console.error('Location fetch error:', error);
      }
    };

    fetchLocation();
  }, []);

  return { location };
};

export default useLocationTracking;
