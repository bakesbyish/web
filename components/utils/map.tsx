import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useTheme } from "next-themes";
import { memo, useCallback, useEffect, useState } from "react";

// Center of the map;
const center = {
  lat: 6.843398387887634,
  lng: 80.00345951762147,
};

// Landmark position
const position = {
  lat: 6.8433,
  lng: 80.00345951762147,
};

const GeoLocation = () => {
  const { systemTheme, theme } = useTheme();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API,
  });

  const [map, setMap] = useState<any | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  const styles = currentTheme === "dark"
    ? [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#242f3e" }],
      },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ]
    : [];

  return isLoaded
    ? (
      <div className="flex flex-col justify-center items-center mt-10 mb-10 w-full">
        <GoogleMap
          mapContainerStyle={{
            width: "90%",
            height: "400px",
          }}
          center={center}
          zoom={19}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: styles,
          }}
        >
          <Marker
            animation={google.maps.Animation.BOUNCE}
            onLoad={onLoad}
            position={position}
          />
        </GoogleMap>
      </div>
    )
    : <></>;
};

export default memo(GeoLocation);
