package com.basira.tawsiah.ServiceImp;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeocodingService {

    private final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=%f&lon=%f&addressdetails=1&accept-language=%s";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Returns an array where [0] is English City and [1] is Arabic City.
     */
    public String[] getBilingualCity(double lat, double lon) {
        try {
            // Step 1: Get English (Contract Requirement)
            String cityEn = fetchFromNominatim(lat, lon, "en");
            
            // Step 2: Get Arabic (Team Requirement)
            String cityAr = fetchFromNominatim(lat, lon, "ar");

            return new String[]{cityEn.toLowerCase(), cityAr};
        } catch (Exception e) {
            // Step 3: Hard Fallback if API fails or blocks us
            return new String[]{"makkah", "مكة المكرمة"};
        }
    }

    private String fetchFromNominatim(double lat, double lon, String lang) throws Exception {
        String url = String.format(NOMINATIM_URL, lat, lon, lang);
        
        // Nominatim STRICTLY requires a User-Agent
        // We use RestTemplate to get the raw JSON string
        String response = restTemplate.getForObject(url, String.class);
        
        JsonNode root = mapper.readTree(response);
        JsonNode address = root.path("address");

        // Fallback Chain: Some places are 'towns' or 'villages' not 'cities'
        if (address.has("city")) return address.get("city").asText();
        if (address.has("town")) return address.get("town").asText();
        if (address.has("village")) return address.get("village").asText();
        if (address.has("state")) return address.get("state").asText();

        return "makkah"; // Ultimate default
    }
}