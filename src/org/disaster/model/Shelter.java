package org.disaster.model;

public class Shelter {
    private String id;
    private String name;
    private String district;
    private String address;
    private double latitude;
    private double longitude;
    private int capacity;
    private int currentOccupancy;
    private String facilities; // Food, Clean Water, Medical Care, Power Generators
    private String contactPerson;
    private String contactPhone;
    private String status; // OPEN, FULL, STANDBY

    public Shelter() {
        this.status = "OPEN";
    }

    public Shelter(String id, String name, String district, String address, 
                   double latitude, double longitude, int capacity, int currentOccupancy, 
                   String facilities, String contactPerson, String contactPhone) {
        this.id = id;
        this.name = name;
        this.district = district;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.capacity = capacity;
        this.currentOccupancy = currentOccupancy;
        this.facilities = facilities;
        this.contactPerson = contactPerson;
        this.contactPhone = contactPhone;
        this.status = currentOccupancy >= capacity ? "FULL" : "OPEN";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }

    public int getCurrentOccupancy() { return currentOccupancy; }
    public void setCurrentOccupancy(int currentOccupancy) { 
        this.currentOccupancy = currentOccupancy; 
        this.status = currentOccupancy >= capacity ? "FULL" : "OPEN";
    }

    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }

    public String getContactPerson() { return contactPerson; }
    public void setContactPerson(String contactPerson) { this.contactPerson = contactPerson; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
