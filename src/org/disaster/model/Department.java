package org.disaster.model;

public class Department {
    private String id;
    private String code; // NDRF, FIRE, DRAINAGE, POWER, PWD, HEALTH, POLICE
    private String name;
    private String assignedOfficer;
    private String phone;
    private String email;
    private String emergencyHelpline;
    private int activeRescueUnits;
    private String jurisdiction;

    public Department() {}

    public Department(String id, String code, String name, String assignedOfficer, 
                      String phone, String email, String emergencyHelpline, 
                      int activeRescueUnits, String jurisdiction) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.assignedOfficer = assignedOfficer;
        this.phone = phone;
        this.email = email;
        this.emergencyHelpline = emergencyHelpline;
        this.activeRescueUnits = activeRescueUnits;
        this.jurisdiction = jurisdiction;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAssignedOfficer() { return assignedOfficer; }
    public void setAssignedOfficer(String assignedOfficer) { this.assignedOfficer = assignedOfficer; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmergencyHelpline() { return emergencyHelpline; }
    public void setEmergencyHelpline(String emergencyHelpline) { this.emergencyHelpline = emergencyHelpline; }

    public int getActiveRescueUnits() { return activeRescueUnits; }
    public void setActiveRescueUnits(int activeRescueUnits) { this.activeRescueUnits = activeRescueUnits; }

    public String getJurisdiction() { return jurisdiction; }
    public void setJurisdiction(String jurisdiction) { this.jurisdiction = jurisdiction; }
}
