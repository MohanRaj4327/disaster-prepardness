package org.disaster.model;

import java.time.Instant;

public class Complaint {
    private String id;
    private String userId;
    private String citizenName;
    private String contactPhone;
    private String category; // Flash Flood, Fire & Gas, Structural Collapse, Downed Power Line, Blocked Drain, Landslide
    private String title;
    private String description;
    private String district;
    private String ward;
    private String location; // Detailed street / landmark address
    private double latitude;
    private double longitude;
    private String image;
    private String priority; // IMMEDIATE_THREAT, HIGH_ALERT, ADVISORY
    private String status; // SUBMITTED, VERIFIED, ASSIGNED, TEAMS_DISPATCHED, RESOLVED, REJECTED
    private String departmentId;
    private String assignedOfficer;
    private String officerPhone;
    private String resolutionNotes;
    private int feedbackRating; // 1-5 stars
    private String feedbackComments;
    private String createdAt;
    private String updatedAt;

    public Complaint() {
        this.createdAt = Instant.now().toString();
        this.updatedAt = this.createdAt;
        this.status = "SUBMITTED";
        this.priority = "HIGH_ALERT";
    }

    public Complaint(String id, String userId, String citizenName, String contactPhone, 
                     String category, String title, String description, String district, 
                     String ward, String location, double latitude, double longitude, 
                     String image, String priority) {
        this.id = id;
        this.userId = userId;
        this.citizenName = citizenName;
        this.contactPhone = contactPhone;
        this.category = category;
        this.title = title;
        this.description = description;
        this.district = district;
        this.ward = ward;
        this.location = location;
        this.latitude = latitude;
        this.longitude = longitude;
        this.image = image;
        this.priority = priority != null ? priority : "HIGH_ALERT";
        this.status = "SUBMITTED";
        this.createdAt = Instant.now().toString();
        this.updatedAt = this.createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { 
        this.status = status; 
        this.updatedAt = Instant.now().toString();
    }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getOfficerPhone() { return officerPhone; }
    public void setOfficerPhone(String officerPhone) { this.officerPhone = officerPhone; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }

    public int getFeedbackRating() { return feedbackRating; }
    public void setFeedbackRating(int feedbackRating) { this.feedbackRating = feedbackRating; }

    public String getFeedbackComments() { return feedbackComments; }
    public void setFeedbackComments(String feedbackComments) { this.feedbackComments = feedbackComments; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
