package com.basira.tawsiah.Config;

import com.basira.tawsiah.Model.Entities.Event;
import com.basira.tawsiah.Model.Entities.Place;
import com.basira.tawsiah.Model.Entities.User;
import com.basira.tawsiah.Model.Entities.interest;
import com.basira.tawsiah.Model.valueObjects.Location;
import com.basira.tawsiah.Model.valueObjects.Schedule;
import com.basira.tawsiah.Repository.EventRepository;
import com.basira.tawsiah.Repository.InterestRepository;
import com.basira.tawsiah.Repository.PlaceRepository;
import com.basira.tawsiah.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterestRepository interestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        System.out.println("=== DataInitializer START ===");
        try {
            seedAdminUser();
            seedCategories();
            seedCityInterests();

            long eventCount = eventRepository.count();
            System.out.println("Current event count: " + eventCount);

            if (eventCount > 0) {
                System.out.println("Database already seeded — skipping events/places.");
            } else {
                seedData();
                System.out.println("Total events: " + eventRepository.count());
                System.out.println("Total places: " + placeRepository.count());
            }

            System.out.println("=== DataInitializer DONE ===");
        } catch (Exception e) {
            System.err.println("=== DataInitializer FAILED ===");
            e.printStackTrace();
        }
    }

    private void seedAdminUser() {
        String adminEmail = "admin@tawsiah.com";
        if (userRepository.findByEmail(adminEmail).isPresent()) {
            System.out.println("Admin user already exists — skipping.");
            return;
        }

        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setName("Admin");
        admin.setPassword(passwordEncoder.encode("AdminPass123!"));
        admin.setRole(User.UserRole.ADMIN);
        admin.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(admin);
        System.out.println("Admin user created: " + adminEmail);
    }

    private void seedCategories() {
        String[] categoryNames = {
            "Beach", "Nature", "Mountains", "Historical",
            "Festivals", "Entertainment", "Adventure", "Cultural",
            "Museum", "Shopping", "Religious", "Other"
        };
        int created = 0;
        for (String name : categoryNames) {
            if (interestRepository.findByName(name).isEmpty()) {
                interest cat = new interest();
                cat.setName(name);
                cat.setType("category");
                interestRepository.save(cat);
                created++;
            }
        }
        if (created > 0) {
            System.out.println("Created " + created + " category interests.");
        } else {
            System.out.println("Category interests already exist — skipping.");
        }
    }

    private void seedCityInterests() {
        String[] cityNames = {
            "Riyadh", "Jeddah", "Mecca", "Medina",
            "Dammam", "Khobar", "Abha", "Taif",
            "Tabuk", "AlUla", "Jizan", "Hail",
            "Najran", "Al Ahsa"
        };
        int created = 0;
        for (String name : cityNames) {
            if (interestRepository.findByName(name).isEmpty()) {
                interest city = new interest();
                city.setName(name);
                city.setType("city");
                interestRepository.save(city);
                created++;
            }
        }
        if (created > 0) {
            System.out.println("Created " + created + " city interests.");
        } else {
            System.out.println("City interests already exist — skipping.");
        }
    }

    private void seedData() {
        // ========== 1. Create and save Events first ==========
        List<Event> events = createEvents();
        List<Event> savedEvents = eventRepository.saveAll(events);
        System.out.println("Saved " + savedEvents.size() + " events.");

        // ========== 2. Create Places linked to each Event ==========
        int totalPlaces = 0;
        for (Event event : savedEvents) {
            List<Place> places = createPlacesForEvent(event);
            for (Place place : places) {
                try {
                    place.setEvent(event);
                    placeRepository.save(place);
                    totalPlaces++;
                    System.out.println("Saved place: " + place.getName());
                } catch (Exception e) {
                    System.err.println("Failed to save place: " + place.getName());
                    e.printStackTrace();
                }
            }
        }
        System.out.println("Saved " + totalPlaces + " places total.");
    }

    // ========== Events ==========
    private List<Event> createEvents() {
        List<Event> events = new ArrayList<>();
        events.add(buildEvent("Riyadh Season Opening", "Entertainment", "Grand opening ceremony of Riyadh Season with spectacular fireworks and performances.", "Riyadh", "Free", "https://images.unsplash.com/photo-1514525253440-b393452e3383", 24.7111, 46.6753, "2025-12-01", "18:00", "23:00", 4.8));
        events.add(buildEvent("Jeddah Summer Festival", "Entertainment", "Coastal festival featuring concerts, water sports, and family activities along the Red Sea.", "Jeddah", "Free", "https://images.unsplash.com/photo-1513883049090-d0b7439799bf", 21.4858, 39.1925, "2025-07-15", "16:00", "00:00", 4.6));
        events.add(buildEvent("Mecca Cultural Week", "Cultural", "Week-long celebration of Islamic heritage with lectures, exhibitions, and guided tours.", "Mecca", "Free", "https://images.unsplash.com/photo-1564769625905-50e93615e769", 21.4225, 39.8262, "2025-11-20", "09:00", "21:00", 4.9));
        events.add(buildEvent("Medina Heritage Festival", "Cultural", "Festival showcasing the rich history and traditions of Medina with cultural performances.", "Medina", "Free", "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f", 24.4672, 39.6111, "2025-09-10", "09:00", "22:00", 4.7));
        events.add(buildEvent("Dammam Sea Festival", "Entertainment", "Beach festival with seafood markets, water activities, and live music by the Arabian Gulf.", "Dammam", "Free", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", 26.4344, 50.1033, "2025-08-05", "16:00", "23:00", 4.5));
        events.add(buildEvent("Khobar Tech Expo", "Entertainment", "Technology exhibition featuring innovations, startups, and interactive digital experiences.", "Khobar", "50", "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7", 26.2840, 50.2170, "2025-10-12", "10:00", "20:00", 4.6));
        events.add(buildEvent("Abha Summer Festival", "Entertainment", "Mountain festival celebrating cool summer weather with concerts, markets, and outdoor adventures.", "Abha", "Free", "https://images.unsplash.com/photo-1469474968028-56623f02e42e", 18.2000, 42.5000, "2025-08-20", "14:00", "23:00", 4.7));
        events.add(buildEvent("Taif Rose Festival", "Cultural", "Annual celebration of Taif's famous rose harvest with perfume workshops and floral displays.", "Taif", "20", "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", 21.2883, 40.4158, "2025-04-10", "09:00", "21:00", 4.8));
        events.add(buildEvent("Tabuk Adventure Rally", "Adventure", "Off-road racing event through the stunning desert and mountain terrain of Tabuk.", "Tabuk", "100", "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", 27.9167, 36.4667, "2025-11-01", "06:00", "18:00", 4.5));
        events.add(buildEvent("AlUla Arts Festival", "Cultural", "World-class arts festival set amidst ancient Nabataean tombs and desert landscapes.", "AlUla", "150", "https://images.unsplash.com/photo-1514525253440-b393452e3383", 26.6278, 37.9106, "2025-02-15", "18:00", "23:00", 4.9));
        return events;
    }

    private Event buildEvent(String name, String category, String description, String city,
                             String price, String imageUrl, double lat, double lon,
                             String date, String start, String end, double rate) {
        Event event = new Event();
        event.setName(name);
        event.setCategory(category);
        event.setDescription(description);
        event.setCity(city);
        event.setPrice(price);
        event.setImageUrl(imageUrl);
        event.setLocation(new Location(lat, lon, city));
        event.setSchedule(new Schedule(date, start, end));
        event.setRate(rate);
        return event;
    }

    // ========== Places per Event ==========
    private List<Place> createPlacesForEvent(Event event) {
        List<Place> places = new ArrayList<>();
        String eName = event.getName();

        if (eName.contains("Riyadh")) {
            places.add(buildPlace("Kingdom Centre Tower", "Iconic skyscraper with a sky bridge offering panoramic views of Riyadh.", "Entertainment", "Riyadh", 24.7111, 46.6753, 150.0, "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6", "2025-06-01", "09:00", "23:00", 4.7));
            places.add(buildPlace("Al Masmak Fortress", "Historic clay and mud-brick fort that played a major role in the unification of Saudi Arabia.", "Historic", "Riyadh", 24.6314, 46.7111, 0.0, "https://images.unsplash.com/photo-1598965671982-6b44ba98f61b", "2025-06-01", "08:00", "21:00", 4.6));
            places.add(buildPlace("National Museum", "Comprehensive museum showcasing Saudi history, culture, and heritage across eight galleries.", "Museum", "Riyadh", 24.6473, 46.7109, 20.0, "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7", "2025-06-01", "08:00", "20:00", 4.5));
            places.add(buildPlace("Diriyah At-Turaif", "UNESCO World Heritage Site and birthplace of the Saudi state with restored mud-brick architecture.", "Historic", "Riyadh", 24.7333, 46.5667, 50.0, "https://images.unsplash.com/photo-1627398242454-45a1465c2479", "2025-06-01", "10:00", "22:00", 4.8));
            places.add(buildPlace("King Abdullah Park", "Sprawling urban park featuring dancing fountains, walking paths, and lush green spaces.", "Nature", "Riyadh", 24.6686, 46.7383, 10.0, "https://images.unsplash.com/photo-1519331379826-f9be8e71f3a7", "2025-06-01", "04:00", "23:00", 4.4));
            places.add(buildPlace("Edge of the World", "Dramatic cliff formation offering breathtaking desert views and hiking trails.", "Adventure", "Riyadh", 24.9333, 46.3167, 0.0, "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", "2025-06-01", "06:00", "18:00", 4.9));
            places.add(buildPlace("Boulevard Riyadh City", "Vibrant entertainment zone with restaurants, shops, concerts, and seasonal events.", "Entertainment", "Riyadh", 24.7572, 46.6256, 0.0, "https://images.unsplash.com/photo-1514525253440-b393452e3383", "2025-06-01", "16:00", "02:00", 4.6));
            places.add(buildPlace("Souq Al Zal", "Traditional marketplace known for antiques, carpets, and authentic Saudi crafts.", "Shopping", "Riyadh", 24.6289, 46.7133, 0.0, "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d", "2025-06-01", "08:00", "22:00", 4.2));
            places.add(buildPlace("Wadi Hanifah", "Natural valley stretching through Riyadh with walking trails and scenic desert landscapes.", "Nature", "Riyadh", 24.5500, 46.7000, 0.0, "https://images.unsplash.com/photo-1469474968028-56623f02e42e", "2025-06-01", "05:00", "19:00", 4.3));
            places.add(buildPlace("Riyadh Front", "Modern lifestyle destination featuring luxury retail, dining, and entertainment options.", "Shopping", "Riyadh", 24.7631, 46.6408, 0.0, "https://images.unsplash.com/photo-1441986300917-64674bd600d8", "2025-06-01", "10:00", "23:00", 4.5));
        } else if (eName.contains("Jeddah")) {
            places.add(buildPlace("King Fahd Fountain", "World's tallest choreographed fountain shooting water up to 312 meters into the air.", "Entertainment", "Jeddah", 21.6167, 39.1167, 0.0, "https://images.unsplash.com/photo-1518998053901-5348d3961a04", "2025-06-01", "18:00", "00:00", 4.7));
            places.add(buildPlace("Al-Balad Historic District", "Historic area with coral-stone buildings, traditional souks, and ancient architecture.", "Historic", "Jeddah", 21.4858, 39.1925, 0.0, "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216", "2025-06-01", "08:00", "22:00", 4.6));
            places.add(buildPlace("Jeddah Corniche", "Coastal promenade stretching along the Red Sea with parks, sculptures, and beaches.", "Nature", "Jeddah", 21.5833, 39.1167, 0.0, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "2025-06-01", "05:00", "23:00", 4.5));
            places.add(buildPlace("Fakieh Aquarium", "One of the few aquariums in Saudi Arabia featuring marine life from the Red Sea.", "Entertainment", "Jeddah", 21.5931, 39.1089, 80.0, "https://images.unsplash.com/photo-1582967788606-a171f1080ca8", "2025-06-01", "10:00", "23:00", 4.3));
            places.add(buildPlace("Red Sea Mall", "Major shopping destination with international brands, restaurants, and entertainment.", "Shopping", "Jeddah", 21.6283, 39.1167, 0.0, "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a", "2025-06-01", "10:00", "23:00", 4.4));
            places.add(buildPlace("Floating Mosque", "Stunning mosque built on pillars over the Red Sea with spectacular coastal views.", "Religious", "Jeddah", 21.6167, 39.1000, 0.0, "https://images.unsplash.com/photo-1542751371-adc38448a05e", "2025-06-01", "00:00", "23:59", 4.8));
            places.add(buildPlace("Silver Sands Beach", "Pristine private beach with clear turquoise waters and excellent snorkeling spots.", "Beach", "Jeddah", 21.5833, 39.1333, 200.0, "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", "2025-06-01", "08:00", "18:00", 4.5));
            places.add(buildPlace("Al Shallal Theme Park", "Popular amusement park featuring roller coasters, ice skating, and family rides.", "Entertainment", "Jeddah", 21.5833, 39.1167, 100.0, "https://images.unsplash.com/photo-1513883049090-d0b7439799bf", "2025-06-01", "16:00", "00:00", 4.2));
            places.add(buildPlace("Jeddah Art Promenade", "Outdoor cultural venue showcasing contemporary art installations and sculptures.", "Cultural", "Jeddah", 21.6000, 39.1000, 0.0, "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b", "2025-06-01", "10:00", "22:00", 4.3));
            places.add(buildPlace("Durrat Al Arous", "Luxury coastal resort with private beaches, golf courses, and waterfront villas.", "Beach", "Jeddah", 21.7833, 39.1167, 500.0, "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", "2025-06-01", "00:00", "23:59", 4.6));
        } else if (eName.contains("Mecca")) {
            places.add(buildPlace("Masjid al-Haram", "The Grand Mosque surrounding the Kaaba, Islam's holiest site and largest mosque in the world.", "Religious", "Mecca", 21.4225, 39.8262, 0.0, "https://images.unsplash.com/photo-1564769625905-50e93615e769", "2025-06-01", "00:00", "23:59", 5.0));
            places.add(buildPlace("Abraj Al Bait Clock Tower", "Iconic hotel and shopping complex towering over the Masjid al-Haram with the world's largest clock face.", "Religious", "Mecca", 21.4189, 39.8258, 0.0, "https://images.unsplash.com/photo-1575106003127-43f46a4d7d8c", "2025-06-01", "00:00", "23:59", 4.7));
            places.add(buildPlace("Jabal al-Nour", "Mountain housing the Hira Cave where Prophet Muhammad received the first revelation.", "Adventure", "Mecca", 21.4575, 39.8592, 0.0, "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", "2025-06-01", "05:00", "18:00", 4.8));
            places.add(buildPlace("Jabal Thawr", "Historic mountain containing the cave where Prophet Muhammad and Abu Bakr hid during Hijra.", "Adventure", "Mecca", 21.5167, 39.8000, 0.0, "https://images.unsplash.com/photo-1454496522488-7a8e488e8606", "2025-06-01", "05:00", "18:00", 4.6));
            places.add(buildPlace("Cave of Hira", "Sacred cave at the summit of Jabal al-Nour where the first verses of the Quran were revealed.", "Religious", "Mecca", 21.4578, 39.8594, 0.0, "https://images.unsplash.com/photo-1519681393784-d120267933ba", "2025-06-01", "05:00", "18:00", 4.9));
            places.add(buildPlace("Mina", "Tent city where pilgrims perform the Stoning of the Devil ritual during Hajj.", "Religious", "Mecca", 21.4133, 39.8933, 0.0, "https://images.unsplash.com/photo-1500382017468-9049fed747ef", "2025-06-01", "00:00", "23:59", 4.5));
            places.add(buildPlace("Mount Arafat", "Granite hill east of Mecca where Prophet Muhammad delivered his Farewell Sermon.", "Religious", "Mecca", 21.3547, 39.9842, 0.0, "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", "2025-06-01", "05:00", "18:00", 4.8));
            places.add(buildPlace("Muzdalifah", "Open plain where pilgrims gather and collect pebbles for the Stoning of the Devil.", "Religious", "Mecca", 21.3928, 39.9361, 0.0, "https://images.unsplash.com/photo-1500534623283-312aade485b7", "2025-06-01", "00:00", "23:59", 4.4));
            places.add(buildPlace("Masjid Aisha", "Mosque marking the Miqat boundary where pilgrims enter the state of Ihram for Umrah.", "Religious", "Mecca", 21.4230, 39.8270, 0.0, "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f", "2025-06-01", "00:00", "23:59", 4.6));
            places.add(buildPlace("Zamzam Well", "Historic well within Masjid al-Haram providing holy water believed to have miraculous origins.", "Religious", "Mecca", 21.4226, 39.8261, 0.0, "https://images.unsplash.com/photo-1542751371-adc38448a05e", "2025-06-01", "00:00", "23:59", 4.9));
        } else if (eName.contains("Medina")) {
            places.add(buildPlace("Al-Masjid an-Nabawi", "The Prophet's Mosque, second holiest site in Islam and final resting place of Prophet Muhammad.", "Religious", "Medina", 24.4672, 39.6111, 0.0, "https://images.unsplash.com/photo-1564769625905-50e93615e769", "2025-06-01", "00:00", "23:59", 5.0));
            places.add(buildPlace("Quba Mosque", "First mosque in Islam, built by Prophet Muhammad upon his arrival in Medina.", "Religious", "Medina", 24.4392, 39.6172, 0.0, "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f", "2025-06-01", "00:00", "23:59", 4.8));
            places.add(buildPlace("Mount Uhud", "Historic battlefield site of the Battle of Uhud with a beautiful mountain backdrop.", "Historic", "Medina", 24.5111, 39.6125, 0.0, "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", "2025-06-01", "06:00", "18:00", 4.5));
            places.add(buildPlace("Jannat al-Baqi", "Ancient cemetery in Medina where many companions and family members of the Prophet are buried.", "Religious", "Medina", 24.4678, 39.6155, 0.0, "https://images.unsplash.com/photo-1500382017468-9049fed747ef", "2025-06-01", "00:00", "23:59", 4.7));
            places.add(buildPlace("Mosque of the Two Qiblas", "Mosque where the Qibla direction was changed from Jerusalem to Mecca during prayer.", "Religious", "Medina", 24.4667, 39.6167, 0.0, "https://images.unsplash.com/photo-1542751371-adc38448a05e", "2025-06-01", "00:00", "23:59", 4.6));
            places.add(buildPlace("Hejaz Railway Museum", "Museum housed in historic Ottoman railway station showcasing the Hijaz Railway history.", "Museum", "Medina", 24.4668, 39.6168, 10.0, "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7", "2025-06-01", "09:00", "17:00", 4.3));
            places.add(buildPlace("Al Noor Mall", "Modern shopping center offering retail, dining, and family entertainment in Medina.", "Shopping", "Medina", 24.4700, 39.6000, 0.0, "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a", "2025-06-01", "10:00", "23:00", 4.2));
            places.add(buildPlace("Qiblatayn Mosque", "Historic mosque known as the Mosque of the Two Qiblas with distinctive architecture.", "Religious", "Medina", 24.4633, 39.6150, 0.0, "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f", "2025-06-01", "00:00", "23:59", 4.5));
            places.add(buildPlace("Seven Mosques", "Complex of small mosques marking the positions of archers during the Battle of the Trench.", "Religious", "Medina", 24.4650, 39.6180, 0.0, "https://images.unsplash.com/photo-1542751371-adc38448a05e", "2025-06-01", "00:00", "23:59", 4.4));
            places.add(buildPlace("Uhud Martyrs Cemetery", "Burial site of martyrs from the Battle of Uhud including Prophet Muhammad's uncle Hamza.", "Historic", "Medina", 24.5110, 39.6120, 0.0, "https://images.unsplash.com/photo-1500382017468-9049fed747ef", "2025-06-01", "06:00", "18:00", 4.7));
        } else if (eName.contains("Dammam")) {
            places.add(buildPlace("Dammam Corniche", "Beautiful waterfront promenade along the Arabian Gulf with parks and playgrounds.", "Nature", "Dammam", 26.4344, 50.1033, 0.0, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "2025-06-01", "05:00", "23:00", 4.4));
            places.add(buildPlace("King Fahd Park", "One of the largest parks in Saudi Arabia with lakes, gardens, and amusement rides.", "Nature", "Dammam", 26.4167, 50.1000, 10.0, "https://images.unsplash.com/photo-1519331379826-f9be8e71f3a7", "2025-06-01", "08:00", "22:00", 4.5));
            places.add(buildPlace("Al Marjan Island", "Artificial island connected by bridge, popular for fishing, walking, and scenic sunsets.", "Nature", "Dammam", 26.4667, 50.1167, 0.0, "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", "2025-06-01", "05:00", "23:00", 4.3));
            places.add(buildPlace("Dareen Mall", "Popular shopping destination with diverse retail stores and family entertainment.", "Shopping", "Dammam", 26.4333, 50.1167, 0.0, "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a", "2025-06-01", "10:00", "23:00", 4.2));
            places.add(buildPlace("Half Moon Bay", "Crescent-shaped beach with calm waters, camping areas, and water sports activities.", "Beach", "Dammam", 26.9167, 50.0167, 0.0, "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", "2025-06-01", "06:00", "19:00", 4.6));
            places.add(buildPlace("Coral Island", "Small island accessible by boat known for snorkeling and marine life exploration.", "Nature", "Dammam", 26.4500, 50.1167, 50.0, "https://images.unsplash.com/photo-1582967788606-a171f1080ca8", "2025-06-01", "08:00", "17:00", 4.4));
            places.add(buildPlace("Dammam Regional Museum", "Museum featuring archaeological finds, traditional crafts, and regional heritage exhibits.", "Museum", "Dammam", 26.4167, 50.0833, 5.0, "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7", "2025-06-01", "09:00", "17:00", 4.1));
            places.add(buildPlace("Prince Mohammad Stadium", "Major sports venue hosting football matches and large-scale entertainment events.", "Entertainment", "Dammam", 26.4333, 50.1000, 30.0, "https://images.unsplash.com/photo-1513883049090-d0b7439799bf", "2025-06-01", "16:00", "23:00", 4.3));
        } else if (eName.contains("Khobar")) {
            places.add(buildPlace("Khobar Corniche", "Stunning seaside promenade with landscaped gardens, sculptures, and waterfront dining.", "Nature", "Khobar", 26.2833, 50.2000, 0.0, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e", "2025-06-01", "05:00", "23:00", 4.5));
            places.add(buildPlace("Al Rashid Mall", "Large upscale shopping complex with international brands, cafes, and a family arcade.", "Shopping", "Khobar", 26.3000, 50.2000, 0.0, "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a", "2025-06-01", "10:00", "23:00", 4.4));
            places.add(buildPlace("Scitech Technology Center", "Interactive science museum with an IMAX theater and hands-on exhibits for all ages.", "Museum", "Khobar", 26.2840, 50.2170, 25.0, "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7", "2025-06-01", "09:00", "22:00", 4.6));
            places.add(buildPlace("Venicia Mall", "Elegant shopping destination featuring luxury brands, restaurants, and entertainment.", "Shopping", "Khobar", 26.3167, 50.2167, 0.0, "https://images.unsplash.com/photo-1441986300917-64674bd600d8", "2025-06-01", "10:00", "23:00", 4.3));
            places.add(buildPlace("Desert Designs", "Cultural gallery and store showcasing Saudi heritage art, crafts, and traditional designs.", "Cultural", "Khobar", 26.2850, 50.2180, 0.0, "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b", "2025-06-01", "09:00", "21:00", 4.4));
            places.add(buildPlace("Al Khobar Waterfront", "Modern waterfront area with walking paths, restaurants, and stunning sea views.", "Nature", "Khobar", 26.2860, 50.2190, 0.0, "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", "2025-06-01", "05:00", "23:00", 4.5));
            places.add(buildPlace("Ajdan Walk", "Outdoor lifestyle destination with dining, shopping, and entertainment by the waterfront.", "Entertainment", "Khobar", 26.3010, 50.1840, 0.0, "https://images.unsplash.com/photo-1514525253440-b393452e3383", "2025-06-01", "16:00", "00:00", 4.5));
        } else if (eName.contains("Abha")) {
            places.add(buildPlace("Asir National Park", "Lush mountain park with hiking trails, wildlife, and cool temperatures year-round.", "Nature", "Abha", 18.2000, 42.5000, 15.0, "https://images.unsplash.com/photo-1469474968028-56623f02e42e", "2025-06-01", "06:00", "18:00", 4.7));
            places.add(buildPlace("Soudah Peak", "Highest point in Saudi Arabia at 3,000 meters with breathtaking mountain scenery.", "Adventure", "Abha", 18.2667, 42.3667, 0.0, "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", "2025-06-01", "06:00", "18:00", 4.8));
            places.add(buildPlace("Habala Village", "Ancient cliffside village once accessible only by rope, now a heritage attraction.", "Historic", "Abha", 18.0333, 42.5667, 10.0, "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216", "2025-06-01", "08:00", "17:00", 4.5));
            places.add(buildPlace("Al Muftaha Village", "Cultural village featuring traditional Asiri architecture, museums, and art galleries.", "Cultural", "Abha", 18.2167, 42.5000, 5.0, "https://images.unsplash.com/photo-1519681393784-d120267933ba", "2025-06-01", "09:00", "20:00", 4.4));
            places.add(buildPlace("Abha Dam Lake", "Serene artificial lake surrounded by mountains, perfect for picnics and photography.", "Nature", "Abha", 18.2167, 42.4833, 0.0, "https://images.unsplash.com/photo-1500534623283-312aade485b7", "2025-06-01", "06:00", "18:00", 4.3));
            places.add(buildPlace("Green Mountain", "Famous mountain illuminated in green with a restaurant offering panoramic city views.", "Nature", "Abha", 18.2170, 42.5010, 20.0, "https://images.unsplash.com/photo-1519331379826-f9be8e71f3a7", "2025-06-01", "10:00", "23:00", 4.6));
            places.add(buildPlace("Rijal Almaa Heritage Village", "UNESCO-listed village with distinctive stone towers and rich cultural heritage.", "Historic", "Abha", 18.2167, 42.2667, 10.0, "https://images.unsplash.com/photo-1627398242454-45a1465c2479", "2025-06-01", "08:00", "18:00", 4.7));
            places.add(buildPlace("Al Soudah Viewpoint", "Scenic overlook providing stunning vistas of the Sarawat mountain range.", "Nature", "Abha", 18.2670, 42.3670, 0.0, "https://images.unsplash.com/photo-1454496522488-7a8e488e8606", "2025-06-01", "06:00", "18:00", 4.6));
        } else if (eName.contains("Taif")) {
            places.add(buildPlace("Shubra Palace", "Historic royal palace built in 1905 featuring Hijazi architecture and beautiful gardens.", "Historic", "Taif", 21.2883, 40.4158, 10.0, "https://images.unsplash.com/photo-1598965671982-6b44ba98f61b", "2025-06-01", "08:00", "20:00", 4.5));
            places.add(buildPlace("Al Hada Mountain", "Mountain resort area with switchback roads, cable cars, and cool weather retreats.", "Nature", "Taif", 21.3667, 40.2667, 0.0, "https://images.unsplash.com/photo-1469474968028-56623f02e42e", "2025-06-01", "06:00", "18:00", 4.6));
            places.add(buildPlace("Al Faisaliah Garden", "Beautiful public garden with flower beds, fountains, and family picnic areas.", "Nature", "Taif", 21.2833, 40.4167, 0.0, "https://images.unsplash.com/photo-1519331379826-f9be8e71f3a7", "2025-06-01", "08:00", "22:00", 4.3));
            places.add(buildPlace("Wadi Mitna", "Picturesque valley with seasonal streams, palm groves, and traditional farming landscapes.", "Nature", "Taif", 21.3167, 40.3667, 0.0, "https://images.unsplash.com/photo-1500534623283-312aade485b7", "2025-06-01", "06:00", "18:00", 4.2));
            places.add(buildPlace("Al Kar Tourist Village", "Family entertainment destination with parks, pools, and resort-style amenities.", "Entertainment", "Taif", 21.3170, 40.3670, 100.0, "https://images.unsplash.com/photo-1513883049090-d0b7439799bf", "2025-06-01", "10:00", "22:00", 4.4));
            places.add(buildPlace("Jouri Mall Taif", "Modern shopping mall offering retail, dining, and cinema experiences.", "Shopping", "Taif", 21.2840, 40.4170, 0.0, "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a", "2025-06-01", "10:00", "23:00", 4.3));
            places.add(buildPlace("Taif Rose Factory", "Working rose distillery where traditional Taif rose oil and perfumes are produced.", "Cultural", "Taif", 21.2850, 40.4100, 15.0, "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", "2025-06-01", "09:00", "17:00", 4.5));
        } else if (eName.contains("Tabuk")) {
            places.add(buildPlace("Tabuk Castle", "Ottoman-era fortress built in 1559 with historic significance and panoramic views.", "Historic", "Tabuk", 28.3833, 36.5667, 0.0, "https://images.unsplash.com/photo-1598965671982-6b44ba98f61b", "2025-06-01", "08:00", "20:00", 4.4));
            places.add(buildPlace("Al Disah Valley", "Stunning valley with dramatic red sandstone cliffs, palm groves, and camping sites.", "Nature", "Tabuk", 27.9167, 36.4667, 0.0, "https://images.unsplash.com/photo-1469474968028-56623f02e42e", "2025-06-01", "06:00", "18:00", 4.7));
            places.add(buildPlace("Tayeb Al Ism", "Coastal valley where mountains meet the Red Sea, creating spectacular natural scenery.", "Nature", "Tabuk", 28.3833, 34.7333, 0.0, "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9", "2025-06-01", "06:00", "18:00", 4.6));
            places.add(buildPlace("Maghaer Shuaib", "Ancient Nabataean tombs carved into sandstone cliffs, similar to Madain Saleh.", "Historic", "Tabuk", 25.9500, 37.2500, 0.0, "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216", "2025-06-01", "08:00", "18:00", 4.5));
            places.add(buildPlace("Tabuk Regional Museum", "Museum displaying archaeological artifacts from the Tabuk region's long history.", "Museum", "Tabuk", 28.3840, 36.5670, 5.0, "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7", "2025-06-01", "09:00", "17:00", 4.2));
        } else if (eName.contains("AlUla")) {
            places.add(buildPlace("Hegra (Madain Saleh)", "UNESCO World Heritage Site with 131 well-preserved Nabataean tombs carved in rock.", "Historic", "AlUla", 26.8106, 37.9431, 80.0, "https://images.unsplash.com/photo-1627398242454-45a1465c2479", "2025-06-01", "08:00", "18:00", 4.9));
            places.add(buildPlace("Elephant Rock", "Iconic natural rock formation resembling an elephant, popular for sunset viewing and stargazing.", "Nature", "AlUla", 26.6314, 37.9239, 0.0, "https://images.unsplash.com/photo-1454496522488-7a8e488e8606", "2025-06-01", "10:00", "22:00", 4.8));
            places.add(buildPlace("AlUla Old Town", "Ancient walled town with labyrinthine streets, recently restored for visitors.", "Historic", "AlUla", 26.6097, 37.9292, 0.0, "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216", "2025-06-01", "10:00", "22:00", 4.6));
            places.add(buildPlace("Dadan", "Archaeological site of the ancient Dadanite and Lihyanite kingdoms with lion sculptures.", "Historic", "AlUla", 26.8167, 37.9500, 40.0, "https://images.unsplash.com/photo-1598965671982-6b44ba98f61b", "2025-06-01", "08:00", "18:00", 4.7));
            places.add(buildPlace("Jabal Ikmah", "Open library of hundreds of ancient inscriptions and rock art from multiple civilizations.", "Historic", "AlUla", 26.7833, 37.9333, 40.0, "https://images.unsplash.com/photo-1519681393784-d120267933ba", "2025-06-01", "08:00", "18:00", 4.7));
            places.add(buildPlace("Maraya Concert Hall", "Mirrored architectural marvel reflecting the desert landscape, hosting world-class events.", "Entertainment", "AlUla", 26.6278, 37.9106, 200.0, "https://images.unsplash.com/photo-1514525253440-b393452e3383", "2025-06-01", "18:00", "23:00", 4.9));
            places.add(buildPlace("AlUla Oasis", "Lush date palm oasis stretching for miles with ancient agricultural heritage.", "Nature", "AlUla", 26.6167, 37.9167, 0.0, "https://images.unsplash.com/photo-1500534623283-312aade485b7", "2025-06-01", "06:00", "18:00", 4.5));
            places.add(buildPlace("Harrat Viewpoint", "Volcanic lava field overlook offering dramatic views of black basalt landscapes.", "Nature", "AlUla", 26.6000, 37.9000, 0.0, "https://images.unsplash.com/photo-1469474968028-56623f02e42e", "2025-06-01", "06:00", "18:00", 4.4));
            places.add(buildPlace("Rainbow Rock", "Colorful rock formation with layered mineral deposits creating vibrant natural patterns.", "Nature", "AlUla", 26.6400, 37.9300, 0.0, "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", "2025-06-01", "08:00", "18:00", 4.5));
            places.add(buildPlace("AlUla Visitor Center", "Gateway to AlUla's attractions with exhibits, maps, and guided tour services.", "Museum", "AlUla", 26.6150, 37.9150, 0.0, "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7", "2025-06-01", "08:00", "20:00", 4.6));
        }
        return places;
    }

    private Place buildPlace(String name, String description, String category, String city,
                             double lat, double lon, double price, String imageUrl,
                             String date, String start, String end, double rate) {
        Place place = new Place();
        place.setName(name);
        place.setDescription(description);
        place.setCategory(category);
        place.setCity(city);
        place.setPrice(price);
        Location location = new Location();
        location.setLatitude(lat);
        location.setLongitude(lon);
        location.setAddressDetails(city);
        place.setLocation(location);
        Schedule schedule = new Schedule();
        schedule.setDate(date);
        schedule.setStartAt(start);
        schedule.setEndAt(end);
        place.setSchedule(schedule);
        place.setImageURL(imageUrl);
        place.setRate(rate);
        place.setCurrentCrowdDensity(2);
        return place;
    }
}
