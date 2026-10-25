package org.disaster.model;

import java.time.Instant;

public class EmergencyAlert {
    private String id;
    private String title;
    private String message;
    private String severity; // CRITICAL, HIGH, MODERATE, ADVISORY
    private String disasterType; // FIRE, EARTHQUAKE, FLOOD, CHEMICAL, WEATHER
    private String targetAudience; // ALL, STUDENTS, TEACHERS
    private String issuedBy;
    private boolean active;
    private String createdAt;

    public EmergencyAlert() {
        this.createdAt = Instant.now().toString();
        this.active = true;
    }

    public EmergencyAlert(String id, String title, String message, String severity, 
                          String disasterType, String targetAudience, String issuedBy) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.severity = severity != null ? severity : "HIGH";
        this.disasterType = disasterType != null ? disasterType : "GENERAL";
        this.targetAudience = targetAudience != null ? targetAudience : "ALL";
        this.issuedBy = issuedBy;
        this.active = true;
        this.createdAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getDisasterType() { return disasterType; }
    public void setDisasterType(String disasterType) { this.disasterType = disasterType; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public String getIssuedBy() { return issuedBy; }
    public void setIssuedBy(String issuedBy) { this.issuedBy = issuedBy; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
