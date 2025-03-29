import { useEffect, useRef, useState } from 'react';

const MumbaiMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMap = () => {
      try {
        if (!window.google || !window.google.maps) {
          throw new Error('Google Maps API not loaded');
        }

        // Mumbai coordinates
        const mumbai = { lat: 19.0760, lng: 72.8777 };

        // Initialize map
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: mumbai,
          zoom: 12,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          mapTypeId: 'roadmap',
          gestureHandling: 'greedy',
          zoomControl: true,
          scrollwheel: true,
          draggable: true,
          disableDefaultUI: false
        });

        setMap(mapInstance);

        // Initialize services
        const directionsServiceInstance = new window.google.maps.DirectionsService();
        const directionsRendererInstance = new window.google.maps.DirectionsRenderer({
          map: mapInstance,
          suppressMarkers: true
        });

        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);

        // Create info window
        const infoWindowInstance = new window.google.maps.InfoWindow({
          maxWidth: 300,
          pixelOffset: new window.google.maps.Size(0, -20)
        });
        setInfoWindow(infoWindowInstance);

        // Initialize search box
        const searchBoxInput = document.getElementById('search-box');
        if (searchBoxInput) {
          const searchBoxInstance = new window.google.maps.places.SearchBox(searchBoxInput);
          setSearchBox(searchBoxInstance);
        }

        // Add marker for Mumbai
        const mumbaiMarker = new window.google.maps.Marker({
          position: mumbai,
          map: mapInstance,
          title: 'Mumbai',
          animation: window.google.maps.Animation.DROP,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
          }
        });

        // Add click listener for Mumbai marker
        mumbaiMarker.addListener('click', () => {
          infoWindowInstance.setContent(`
            <div class="p-2">
              <h3 class="font-bold">Mumbai</h3>
              <p>Financial Capital of India</p>
              <button onclick="window.calculateRoute(${mumbai.lat}, ${mumbai.lng})" 
                      class="mt-2 bg-primary text-white px-3 py-1 rounded hover:bg-opacity-90">
                Get Directions
              </button>
            </div>
          `);
          infoWindowInstance.open(mapInstance, mumbaiMarker);
          setSelectedLocation(mumbai);
        });

        // Add cold storage locations
        const coldStorages = [
          { 
            lat: 19.0760, 
            lng: 72.8777, 
            title: 'Agro Cold Storage',
            details: {
              capacity: '1000 tons',
              available: '500 tons',
              temperature: '4°C',
              price: '₹100/ton/day'
            }
          },
          { 
            lat: 19.0825, 
            lng: 72.8757, 
            title: 'Farm Fresh Storage',
            details: {
              capacity: '800 tons',
              available: '300 tons',
              temperature: '2°C',
              price: '₹120/ton/day'
            }
          },
          { 
            lat: 19.0695, 
            lng: 72.8807, 
            title: 'Rural Cold Chain',
            details: {
              capacity: '500 tons',
              available: '200 tons',
              temperature: '0°C',
              price: '₹90/ton/day'
            }
          }
        ];

        // Add markers for cold storage locations
        const storageMarkers = coldStorages.map(storage => {
          const marker = new window.google.maps.Marker({
            position: { lat: storage.lat, lng: storage.lng },
            map: mapInstance,
            title: storage.title,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
          });

          marker.addListener('click', () => {
            infoWindowInstance.setContent(`
              <div class="p-2">
                <h3 class="font-bold">${storage.title}</h3>
                <p>Capacity: ${storage.details.capacity}</p>
                <p>Available: ${storage.details.available}</p>
                <p>Temperature: ${storage.details.temperature}</p>
                <p>Price: ${storage.details.price}</p>
                <button onclick="window.calculateRoute(${storage.lat}, ${storage.lng})" 
                        class="mt-2 bg-primary text-white px-3 py-1 rounded hover:bg-opacity-90">
                  Get Directions
                </button>
              </div>
            `);
            infoWindowInstance.open(mapInstance, marker);
            setSelectedLocation({ lat: storage.lat, lng: storage.lng });
          });

          return marker;
        });

        setMarkers([mumbaiMarker, ...storageMarkers]);
        setIsLoading(false);

        // Add global function for route calculation
        window.calculateRoute = (lat, lng) => {
          if (!selectedLocation) return;

          const request = {
            origin: new window.google.maps.LatLng(selectedLocation.lat, selectedLocation.lng),
            destination: new window.google.maps.LatLng(lat, lng),
            travelMode: 'DRIVING'
          };

          directionsServiceInstance.route(request, (result, status) => {
            if (status === 'OK') {
              directionsRendererInstance.setDirections(result);
            } else {
              console.error('Directions request failed:', status);
            }
          });
        };

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load map. Please try again later.');
        setIsLoading(false);
      }
    };

    // Initialize map when Google Maps API is loaded
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      window.initMap = initializeMap;
    }

    // Cleanup function
    return () => {
      if (markers) {
        markers.forEach(marker => marker.setMap(null));
      }
      if (infoWindow) {
        infoWindow.close();
      }
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
      if (window.calculateRoute) {
        delete window.calculateRoute;
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-gray-600">Loading map...</div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-lg shadow-lg bg-gray-100"
      />
      <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md z-20">
        <input
          id="search-box"
          type="text"
          placeholder="Search location..."
          className="p-2 border rounded w-64"
        />
      </div>
    </div>
  );
};

export default MumbaiMap; 