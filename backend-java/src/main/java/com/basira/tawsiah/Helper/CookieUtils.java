package com.basira.tawsiah.Helper;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Arrays;

public class CookieUtils {

    private static final String COOKIE_NAME = "tawsiah_city";
    private static final int SEVEN_DAYS = 7 * 24 * 60 * 60; // In seconds

    // Reads the cookie from the browser
    public static String getCityFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        return Arrays.stream(request.getCookies())
                .filter(cookie -> COOKIE_NAME.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    // Writes the city to the browser for 7 days
    public static void setCityCookie(HttpServletResponse response, String city) {
        Cookie cookie = new Cookie(COOKIE_NAME, city.toLowerCase()); 
        cookie.setPath("/"); // Available on all pages
        cookie.setMaxAge(SEVEN_DAYS);
        cookie.setHttpOnly(true); // Security: Prevents JS from stealing it
        response.addCookie(cookie);
    }
}
