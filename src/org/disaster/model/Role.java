package org.disaster.model;

public enum Role {
    CITIZEN,
    DEPARTMENT_OFFICER,
    DISASTER_ADMIN;

    public static Role fromString(String roleStr) {
        if (roleStr == null) return CITIZEN;
        String normalized = roleStr.trim().toUpperCase();
        if (normalized.equals("STUDENT") || normalized.equals("PUBLIC") || normalized.equals("CITIZEN")) {
            return CITIZEN;
        }
        if (normalized.equals("TEACHER") || normalized.equals("OFFICER") || normalized.equals("DEPARTMENT_OFFICER")) {
            return DEPARTMENT_OFFICER;
        }
        if (normalized.equals("ADMIN") || normalized.equals("DISASTER_ADMIN")) {
            return DISASTER_ADMIN;
        }
        try {
            return Role.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            return CITIZEN;
        }
    }
}
