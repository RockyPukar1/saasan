import { useState, useEffect } from "react";
import type { IParty } from "@/types/politics";

// Mock data for parties (since backend API might not be ready)
const mockParties: IParty[] = [
  {
    id: "695cae7d268ac8b1b6351b27",
    name: "Nepali Congress",
    abbreviation: "NC",
    ideology: "Social Democracy",
    foundedIn: new Date("1950-01-01"),
    color: "#0066CC",
    count: 45,
  },
  {
    id: "695cae7d268ac8b1b6351b28",
    name: "Communist Party of Nepal (Unified Marxist-Leninist)",
    abbreviation: "CPN-UML",
    ideology: "Communism",
    foundedIn: new Date("2021-01-01"),
    color: "#FF0000",
    count: 38,
  },
  {
    id: "695cae7d268ac8b1b6351b29",
    name: "Maoist Center",
    abbreviation: "MC",
    ideology: "Maoism",
    foundedIn: new Date("1994-01-01"),
    color: "#FF6600",
    count: 25,
  },
  {
    id: "695cae7d268ac8b1b6351b2a",
    name: "Rastriya Prajatantra Party",
    abbreviation: "RPP",
    ideology: "Monarchism",
    foundedIn: new Date("1990-01-01"),
    color: "#FFD700",
    count: 15,
  },
];

export function useParties() {
  const [parties, setParties] = useState<IParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Use mock data for now
      setParties(mockParties);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/parties');
      // const data = await response.json();
      // setParties(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch parties");
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchParties();
  };

  useEffect(() => {
    fetchParties();
  }, []);

  return {
    parties,
    loading,
    error,
    refresh,
  };
}
