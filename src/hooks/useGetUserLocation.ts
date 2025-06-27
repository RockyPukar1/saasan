import { useEffect, useState } from "react";
import axios from "axios";
import type { IUserLocation } from "@/types/IUserLocation";

export function useGetUserLocation(): IUserLocation | null {
  const [userLocationData, setUserLocationData] = useState(null);

  useEffect(() => {
    async function getLocation() {
      const res = await axios.get("http://ip-api.com/json");
      if (res.status === 200) {
        setUserLocationData(res.data);
      }
    }

    getLocation();
  }, []);

  if (!userLocationData) {
    return null;
  }

  return userLocationData;
}
