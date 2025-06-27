import { useGetUserLocation } from "./hooks/useGetUserLocation";

export default function App() {
  const userLocation = useGetUserLocation();

  if (!userLocation) {
    return null;
  }

  return (
    <div>
      <code>{userLocation.lat}</code>
    </div>
  );
}
