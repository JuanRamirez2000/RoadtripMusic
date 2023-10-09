"use client";

import { useEffect, useRef, useState } from "react";
import type { MapData } from "types/GoogleMaps";
import { useMapStore } from "contexts/mapStore";
import { useNightModeStore } from "contexts/themeStore";
//https://developers.google.com/maps/documentation/javascript/directions

export default function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    draggable: true,
  });
  const distanceMatrixService = new google.maps.DistanceMatrixService();
  const setDistanceData = useMapStore((state) => state.setTotalTime);
  const mapData = useMapStore((state) => state);
  const nightMode = useNightModeStore((state) => state.nightMode);

  useEffect(() => {
    //Make a new map
    if (ref.current && !map) {
      setMap(
        new google.maps.Map(ref.current, {
          center: new google.maps.LatLng(33.7455, -117.8677),
          zoom: 7,
          mapTypeControl: false,
          streetViewControl: false,
          //styles: mapsNightMode,
        })
      );
    }

    //Render Distance
    if (mapData.renderDirection && map) {
      directionsRenderer.setMap(map);
      calculateAndDisplayRoute(
        directionsService,
        directionsRenderer,
        distanceMatrixService,
        setDistanceData,
        mapData
      );
    }

    //Clear old map
    return () => {
      directionsRenderer.setMap(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ref,
    map,
    mapData.renderDirection,
    mapData.origin,
    mapData.destination,
    setDistanceData,
  ]);

  //This use effect only changes the way the map looks based on light and dark mode
  useEffect(() => {
    if (ref.current && map) {
      const mapOptions: google.maps.MapOptions = {
        center: map.getCenter(),
        zoom: map.getZoom(),
        mapTypeControl: false,
        streetViewControl: false,
      };

      if (nightMode) {
        setMap(
          new google.maps.Map(ref.current, {
            ...mapOptions,
            styles: mapsNightMode,
          })
        );
      } else {
        setMap(new google.maps.Map(ref.current, mapOptions));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nightMode]);

  useEffect(() => {
    const infoWindow = new google.maps.InfoWindow({
      content: mapData.origin.formatted_address,
    });

    const marker = new google.maps.Marker({
      position: mapData.origin.coordinates,
      animation: google.maps.Animation.DROP,
      map: map,
    });

    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map,
      });
    });

    return () => {
      marker.setMap(null);
      infoWindow.close();
    };
  }, [mapData.origin, map]);

  useEffect(() => {
    const infoWindow = new google.maps.InfoWindow({
      content: mapData.destination.formatted_address,
    });
    const marker = new google.maps.Marker({
      position: mapData.destination.coordinates,
      animation: google.maps.Animation.DROP,
      map: map,
    });
    marker.addListener("click", () => {
      infoWindow.open({
        anchor: marker,
        map,
      });
    });
    return () => {
      marker.setMap(null);
      infoWindow.close();
    };
  }, [mapData.destination, map]);

  return <div className="h-full" ref={ref} />;
}

function calculateAndDisplayRoute(
  directionsService: google.maps.DirectionsService,
  directionsRenderer: google.maps.DirectionsRenderer,
  distanceMatrixService: google.maps.DistanceMatrixService,
  setDistanceData: (duration: google.maps.Duration) => void,
  mapData: MapData
) {
  if (mapData.origin.coordinates && mapData.destination.coordinates) {
    directionsService
      .route({
        origin: mapData.origin.coordinates,
        destination: mapData.destination.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      })
      .then((res) => {
        directionsRenderer.setDirections(res);
      })
      .catch(() => window.alert("Directions failed"));
    distanceMatrixService
      .getDistanceMatrix({
        origins: [mapData.origin.coordinates],
        destinations: [mapData.destination.coordinates],
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((res) => {
        if (res.rows[0]?.elements[0]?.duration) {
          setDistanceData(res.rows[0].elements[0].duration);
        }
      })
      .catch(() => window.alert("Distance gathering failed"));
  }
}

const mapsNightMode = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#746855" }],
  },
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
];
