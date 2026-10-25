package org.disaster.model;

import java.util.List;

public class LearningModule {
    private String id;
    private String name;
    private String category; // NATURAL, MAN_MADE, BIOLOGICAL
    private String type; // VIDEO, TUTORIAL, GUIDELINE, ENCYCLOPEDIA
    private String summary;
    private String fullDescription;
    private List<String> dos;
    private List<String> donts;
    private List<String> keyActions;
    private String videoUrl;
    private String emergencyEquipment;

    public LearningModule() {}

    public LearningModule(String id, String name, String category, String type, 
                          String summary, String fullDescription, List<String> dos, 
                          List<String> donts, List<String> keyActions, String videoUrl, 
                          String emergencyEquipment) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.type = type;
        this.summary = summary;
        this.fullDescription = fullDescription;
        this.dos = dos;
        this.donts = donts;
        this.keyActions = keyActions;
        this.videoUrl = videoUrl;
        this.emergencyEquipment = emergencyEquipment;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getFullDescription() { return fullDescription; }
    public void setFullDescription(String fullDescription) { this.fullDescription = fullDescription; }

    public List<String> getDos() { return dos; }
    public void setDos(List<String> dos) { this.dos = dos; }

    public List<String> getDonts() { return donts; }
    public void setDonts(List<String> donts) { this.donts = donts; }

    public List<String> getKeyActions() { return keyActions; }
    public void setKeyActions(List<String> keyActions) { this.keyActions = keyActions; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getEmergencyEquipment() { return emergencyEquipment; }
    public void setEmergencyEquipment(String emergencyEquipment) { this.emergencyEquipment = emergencyEquipment; }
}
