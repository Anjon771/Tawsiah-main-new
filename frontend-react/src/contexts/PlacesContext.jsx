import { createContext, useState, useEffect, useContext, useCallback } from "react";
import {
  getAllEvents,
  createEvent as createEventService,
  updateEvent as updateEventService,
  deleteEvent as deleteEventService,
} from "../services/eventService";
import {
  getAllPlaces,
  createPlace as createPlaceService,
  updatePlace as updatePlaceService,
  deletePlace as deletePlaceService,
} from "../services/placeService";

export const PlacesContext = createContext();

function transformEventFromBackend(event) {
  if (!event) return null;
  return {
    id: event.id,
    eventName: event.name || event.eventName,
    eventDescription: event.description || event.eventDescription,
    name: event.name || event.eventName,
    description: event.description || event.eventDescription,
    category: event.category || "",
    city: event.city || "",
    price: event.price != null ? String(event.price) : "",
    rate: event.rate || 0,
    imageUrl: event.imageUrl || event.imageURL || "",
    eventImage: event.imageUrl || event.imageURL || "",
    latitude: event.location?.latitude || 0,
    longitude: event.location?.longitude || 0,
    schedule: {
      date: event.schedule?.date || "",
      startAt: event.schedule?.startAt || "",
      endAt: event.schedule?.endAt || "",
    },
    type: 'event',
  };
}

function transformEventToBackend(event) {
  return {
    name: event.eventName || event.name || "",
    description: event.eventDescription || event.description || "",
    category: event.category || "",
    city: event.city || "",
    price: event.price ? parseFloat(event.price) : 0,
    rate: event.rate || 0,
    imageUrl: event.imageUrl || event.eventImage || "",
    location: {
      latitude: parseFloat(event.latitude) || 0,
      longitude: parseFloat(event.longitude) || 0,
      addressDetails: event.city || "",
    },
    schedule: {
      date: event.schedule?.date || null,
      startAt: event.schedule?.startAt || null,
      endAt: event.schedule?.endAt || null,
    },
  };
}

function transformPlaceFromBackend(place) {
  if (!place) return null;
  return {
    id: place.id,
    name: place.name,
    description: place.description || "",
    category: place.category || "",
    city: place.city || "",
    price: place.price != null ? String(place.price) : "",
    rate: place.rate || 0,
    imageUrl: place.imageURL || place.imageUrl || "",
    latitude: place.location?.latitude || 0,
    longitude: place.location?.longitude || 0,
    schedule: {
      date: place.schedule?.date || "",
      startAt: place.schedule?.startAt || "",
      endAt: place.schedule?.endAt || "",
    },
    type: 'place',
  };
}

function transformPlaceToBackend(place) {
  return {
    name: place.name || "",
    description: place.description || "",
    category: place.category || "",
    city: place.city || "",

    // backend expects imageURL not imageUrl
    imageURL: place.imageUrl || place.imageURL || "https://placehold.co/400x300",

    // rate is @NotNull — always send a number
    rate: place.rate != null ? Number(place.rate) : 0.0,

    // location — latitude and longitude must be numbers
    location: {
      latitude: parseFloat(place.latitude) || 0,
      longitude: parseFloat(place.longitude) || 0,
      addressDetails: place.city || "",
    },

    // schedule fields must be null if empty — never send ""
    schedule: {
      date: place.schedule?.date || null,
      startAt: place.schedule?.startAt || null,
      endAt: place.schedule?.endAt || null,
    },
  };
}

const validatePlace = (data) => {
  if (!data.name?.trim()) return 'Place name is required';
  if (!data.description?.trim()) return 'Description is required';
  if (!data.category?.trim()) return 'Category is required';
  if (!data.city?.trim()) return 'City is required';
  // image validation removed temporarily
  return null;
};

export function PlacesProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [eventsRes, placesRes] = await Promise.all([
          getAllEvents(),
          getAllPlaces(),
        ]);
        const transformedEvents = Array.isArray(eventsRes.data)
          ? eventsRes.data.map(transformEventFromBackend)
          : [];
        const transformedPlaces = Array.isArray(placesRes.data)
          ? placesRes.data.map(transformPlaceFromBackend)
          : [];
        setEvents(transformedEvents);
        setPlaces(transformedPlaces);
      } catch (err) {
        console.error("Failed to load data from Spring Boot:", err);
        setError("Failed to connect to server. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addPlace = useCallback(async (data) => {
    const validationError = validatePlace(data);
    if (validationError) {
      throw new Error(validationError);
    }
    try {
      const payload = transformPlaceToBackend(data);

      // ADD THIS LINE — shows exact payload sent to backend
      console.log("PAYLOAD SENT TO BACKEND:", JSON.stringify(payload, null, 2));

      const res = await createPlaceService(payload);
      const transformed = transformPlaceFromBackend(res.data);
      setPlaces((prev) => [...prev, transformed]);
      return transformed;
    } catch (err) {
      // ADD THIS LINE — shows exact error from backend
      console.error("Error adding place:", err.response?.data || err);
      throw err;
    }
  }, []);

  const editPlace = useCallback(async (id, data) => {
    const validationError = validatePlace(data);
    if (validationError) {
      throw new Error(validationError);
    }
    try {
      const payload = transformPlaceToBackend(data);
      const res = await updatePlaceService(id, payload);
      const transformed = transformPlaceFromBackend(res.data);
      setPlaces((prev) => prev.map((p) => (p.id === id ? transformed : p)));
      return transformed;
    } catch (err) {
      console.error("Error updating place:", err);
      throw err;
    }
  }, []);

  const removePlace = useCallback(async (id) => {
    try {
      await deletePlaceService(id);
      setPlaces((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting place:", err);
      throw err;
    }
  }, []);

  const addEvent = useCallback(async (data) => {
    try {
      const payload = transformEventToBackend(data);
      const res = await createEventService(payload);
      const transformed = transformEventFromBackend(res.data);
      setEvents((prev) => [...prev, transformed]);
      return transformed;
    } catch (err) {
      console.error("Error adding event:", err);
      throw err;
    }
  }, []);

  const editEvent = useCallback(async (id, data) => {
    try {
      const payload = transformEventToBackend(data);
      const res = await updateEventService(id, payload);
      const transformed = transformEventFromBackend(res.data);
      setEvents((prev) => prev.map((e) => (e.id === id ? transformed : e)));
      return transformed;
    } catch (err) {
      console.error("Error updating event:", err);
      throw err;
    }
  }, []);

  const removeEvent = useCallback(async (id) => {
    try {
      await deleteEventService(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting event:", err);
      throw err;
    }
  }, []);

  const value = {
    events,
    places,
    loading,
    error,
    addPlace,
    editPlace,
    removePlace,
    deletePlace: removePlace,
    addEvent,
    editEvent,
    removeEvent,
    deleteEvent: removeEvent,
  };

  return (
    <PlacesContext.Provider value={value}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) {
    throw new Error("usePlaces must be used within a PlacesProvider");
  }
  return context;
}
