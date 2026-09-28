import al_ula from "../assets/images/places/al_ula.jpg";
import rjal_alma from "../assets/images/places/rjal_alma.jpg";
import albalad from "../assets/images/places/albalad.jpg";


export const events = [
  {
    id: 1,
    eventName: "Saudi Coastal Experience",
    eventDescription: "Discover the breathtaking beaches and crystal-clear waters along Saudi Arabia's Red Sea coast.",
    places: [
      {
        id: 1,
        name: "Umluj Beach",
        description: "A beautiful beach with crystal clear water where you can swim and enjoy marine activities.",
        category: "beach",
        price: "free",
        city: "Umluj",
        latitude: 25.0667,
        longitude: 37.2667,
        schedule: {
          date: "2030/1/1",
          startAt: "8 am",
          endAt: "6 pm",
        },
        rate: 5.0,
        imageUrl: al_ula,
      },
    ],
  },
  {
    id: 2,
    eventName: "Saudi Heritage Tour",
    eventDescription: "Journey through Saudi Arabia's rich cultural heritage and historic landmarks.",
    places: [
      {
        id: 2,
        name: "Rijal Almaa",
        description: "A heritage village known for its unique stone buildings and rich cultural history.",
        category: "historical",
        price: "free",
        city: "Asir",
        latitude: 18.1963,
        longitude: 42.3373,
        schedule: {
          date: "",
          startAt: "",
          endAt: "",
        },
        rate: 4.8,
        imageUrl: rjal_alma,
      },
      {
        id: 3,
        name: "Al-Balad (Historic Jeddah)",
        description: "The historic center of Jeddah featuring traditional buildings and cultural heritage.",
        category: "historical",
        price: "free",
        city: "Jeddah",
        latitude: 21.4858,
        longitude: 39.1925,
        schedule: {
          date: "",
          startAt: "",
          endAt: "",
        },
        rate: 4.9,
        imageUrl: albalad,
      },
    ],
  },
];

// Helper — flat list of all places across all events (used by context and components)
export const allPlaces = events.flatMap((event) => event.places);

export default events;
