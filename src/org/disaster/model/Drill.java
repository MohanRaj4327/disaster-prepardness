package org.disaster.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Drill {
    private String id;
    private String title;
    private String disasterType; // FIRE, EARTHQUAKE, FLOOD, CHEMICAL, STAMPEDE
    private String building; // Science Block, Main Auditorium, Engineering Wing, Library
    private String assemblyPoint; // Ground A, North Lawn, Sports Complex
    private String scheduledDate;
    private String status; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    private int expectedParticipants;
    private List<String> attendedUserIds;
    private int evacuationTimeSeconds;
    private double safetyScore; // 0.0 to 100.0
    private String evaluatorTeacher;
    private String evaluationNotes;
    private String createdAt;

    public Drill() {
        this.attendedUserIds = new ArrayList<>();
        this.status = "SCHEDULED";
        this.createdAt = Instant.now().toString();
    }

    public Drill(String id, String title, String disasterType, String building, 
                 String assemblyPoint, String scheduledDate, int expectedParticipants, 
                 String evaluatorTeacher) {
        this.id = id;
        this.title = title;
        this.disasterType = disasterType;
        this.building = building;
        this.assemblyPoint = assemblyPoint;
        this.scheduledDate = scheduledDate;
        this.expectedParticipants = expectedParticipants;
        this.evaluatorTeacher = evaluatorTeacher;
        this.attendedUserIds = new ArrayList<>();
        this.status = "SCHEDULED";
        this.evacuationTimeSeconds = 0;
        this.safetyScore = 0.0;
        this.createdAt = Instant.now().toString();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDisasterType() { return disasterType; }
    public void setDisasterType(String disasterType) { this.disasterType = disasterType; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public String getAssemblyPoint() { return assemblyPoint; }
    public void setAssemblyPoint(String assemblyPoint) { this.assemblyPoint = assemblyPoint; }

    public String getScheduledDate() { return scheduledDate; }
    public void setScheduledDate(String scheduledDate) { this.scheduledDate = scheduledDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getExpectedParticipants() { return expectedParticipants; }
    public void setExpectedParticipants(int expectedParticipants) { this.expectedParticipants = expectedParticipants; }

    public List<String> getAttendedUserIds() { return attendedUserIds; }
    public void setAttendedUserIds(List<String> attendedUserIds) { this.attendedUserIds = attendedUserIds; }

    public int getEvacuationTimeSeconds() { return evacuationTimeSeconds; }
    public void setEvacuationTimeSeconds(int evacuationTimeSeconds) { this.evacuationTimeSeconds = evacuationTimeSeconds; }

    public double getSafetyScore() { return safetyScore; }
    public void setSafetyScore(double safetyScore) { this.safetyScore = safetyScore; }

    public String getEvaluatorTeacher() { return evaluatorTeacher; }
    public void setEvaluatorTeacher(String evaluatorTeacher) { this.evaluatorTeacher = evaluatorTeacher; }

    public String getEvaluationNotes() { return evaluationNotes; }
    public void setEvaluationNotes(String evaluationNotes) { this.evaluationNotes = evaluationNotes; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
