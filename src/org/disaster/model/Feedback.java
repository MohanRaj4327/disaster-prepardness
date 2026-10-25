package org.disaster.model;

import java.time.Instant;

public class Feedback {
    private String id;
    private String complaintId;
    private String userId;
    private String userName;
    private int rating; // 1 to 5
    private String comments;
    private String createdAt;

    public Feedback() {
        this.createdAt = Instant.now().toString();
    }

    public Feedback(String id, String complaintId, String userId, String userName, int rating, String comments) {
        this.id = id;
        this.complaintId = complaintId;
        this.userId = userId;
        this.userName = userName;
        this.rating = rating;
        this.comments = comments;
        this.createdAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
