package org.disaster.repository;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.disaster.model.*;
import org.disaster.server.SimpleJson;

public class DataStore {
    private static final DataStore INSTANCE = new DataStore();

    public static DataStore getInstance() {
        return INSTANCE;
    }

    private final Map<String, User> users = new ConcurrentHashMap<>();
    private final Map<String, Department> departments = new ConcurrentHashMap<>();
    private final Map<String, Shelter> shelters = new ConcurrentHashMap<>();
    private final Map<String, Complaint> complaints = new ConcurrentHashMap<>();
    private final Map<String, Feedback> feedbacks = new ConcurrentHashMap<>();
    private final Map<String, EmergencyAlert> alerts = new ConcurrentHashMap<>();
    private final Map<String, LearningModule> learningModules = new ConcurrentHashMap<>();
    private final Map<String, Drill> drills = new ConcurrentHashMap<>();
    private final Map<String, Quiz> quizzes = new ConcurrentHashMap<>();
    private final Map<String, QuizResult> quizResults = new ConcurrentHashMap<>();
    private final Map<String, String> userTokens = new ConcurrentHashMap<>();

    private final File dataDir = new File("data");
    private final File dbFile = new File("data/database.json");
    private final File uploadsDir = new File("uploads");

    private DataStore() {
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        if (!uploadsDir.exists()) {
            uploadsDir.mkdirs();
        }
        loadFromFile();
    }

    // --- Users ---
    public void saveUser(User user) {
        users.put(user.getId(), user);
        saveToFile();
    }

    public User getUserById(String id) {
        return users.get(id);
    }

    public User getUserByEmail(String email) {
        if (email == null) return null;
        for (User u : users.values()) {
            if (email.equalsIgnoreCase(u.getEmail())) return u;
        }
        return null;
    }

    public List<User> getAllUsers() {
        return new ArrayList<>(users.values());
    }

    // --- Tokens ---
    public String createToken(User user) {
        String token = "tok_" + UUID.randomUUID().toString().replace("-", "") + "_" + user.getId();
        userTokens.put(token, user.getId());
        return token;
    }

    public User getUserByToken(String token) {
        if (token == null) return null;
        String userId = userTokens.get(token);
        return userId != null ? users.get(userId) : null;
    }

    // --- Departments (Full CRUD) ---
    public void saveDepartment(Department dept) {
        departments.put(dept.getId(), dept);
        saveToFile();
    }

    public Department getDepartmentById(String id) {
        return departments.get(id);
    }

    public List<Department> getAllDepartments() {
        List<Department> list = new ArrayList<>(departments.values());
        list.sort(Comparator.comparing(Department::getName));
        return list;
    }

    public boolean deleteDepartment(String id) {
        boolean removed = departments.remove(id) != null;
        if (removed) saveToFile();
        return removed;
    }

    // --- Public Relief Shelters (Full CRUD) ---
    public void saveShelter(Shelter s) {
        shelters.put(s.getId(), s);
        saveToFile();
    }

    public Shelter getShelterById(String id) {
        return shelters.get(id);
    }

    public List<Shelter> getAllShelters() {
        List<Shelter> list = new ArrayList<>(shelters.values());
        list.sort(Comparator.comparing(Shelter::getName));
        return list;
    }

    public boolean deleteShelter(String id) {
        boolean removed = shelters.remove(id) != null;
        if (removed) saveToFile();
        return removed;
    }

    // --- Complaints / Grievances (Full CRUD) ---
    public void saveComplaint(Complaint c) {
        complaints.put(c.getId(), c);
        saveToFile();
    }

    public Complaint getComplaintById(String id) {
        if (id == null) return null;
        for (Complaint c : complaints.values()) {
            if (id.trim().equalsIgnoreCase(c.getId())) {
                return c;
            }
        }
        return null;
    }

    public List<Complaint> getAllComplaints() {
        List<Complaint> list = new ArrayList<>(complaints.values());
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list;
    }

    public List<Complaint> getComplaintsByDepartment(String deptId) {
        List<Complaint> list = new ArrayList<>();
        for (Complaint c : complaints.values()) {
            if (deptId != null && deptId.equalsIgnoreCase(c.getDepartmentId())) {
                list.add(c);
            }
        }
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list;
    }

    public boolean deleteComplaint(String id) {
        boolean removed = complaints.remove(id) != null;
        if (removed) saveToFile();
        return removed;
    }

    // --- Feedbacks ---
    public void saveFeedback(Feedback fb) {
        feedbacks.put(fb.getId(), fb);
        saveToFile();
    }

    public List<Feedback> getAllFeedbacks() {
        return new ArrayList<>(feedbacks.values());
    }

    // --- Alerts (Full CRUD) ---
    public void saveAlert(EmergencyAlert alert) {
        alerts.put(alert.getId(), alert);
        saveToFile();
    }

    public List<EmergencyAlert> getAllAlerts() {
        List<EmergencyAlert> list = new ArrayList<>(alerts.values());
        list.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));
        return list;
    }

    public boolean deleteAlert(String id) {
        boolean removed = alerts.remove(id) != null;
        if (removed) saveToFile();
        return removed;
    }

    // --- Learning Modules (Full CRUD) ---
    public void saveLearningModule(LearningModule mod) {
        learningModules.put(mod.getId(), mod);
        saveToFile();
    }

    public LearningModule getLearningModuleById(String id) {
        return learningModules.get(id);
    }

    public List<LearningModule> getAllLearningModules() {
        return new ArrayList<>(learningModules.values());
    }

    public boolean deleteLearningModule(String id) {
        boolean removed = learningModules.remove(id) != null;
        if (removed) saveToFile();
        return removed;
    }

    // --- Quizzes & Results ---
    public void saveQuiz(Quiz q) {
        quizzes.put(q.getId(), q);
        saveToFile();
    }

    public Quiz getQuizById(String id) {
        return quizzes.get(id);
    }

    public List<Quiz> getAllQuizzes() {
        return new ArrayList<>(quizzes.values());
    }

    public void saveQuizResult(QuizResult qr) {
        quizResults.put(qr.getId(), qr);
        saveToFile();
    }

    public List<QuizResult> getAllQuizResults() {
        List<QuizResult> list = new ArrayList<>(quizResults.values());
        list.sort((a, b) -> b.getCompletedAt().compareTo(a.getCompletedAt()));
        return list;
    }

    // --- REAL PERSISTENCE ENGINE (JSON Database on Disk) ---
    public synchronized void saveToFile() {
        try {
            Map<String, Object> root = new LinkedHashMap<>();

            // Complaints
            List<Map<String, Object>> complaintList = new ArrayList<>();
            for (Complaint c : complaints.values()) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", c.getId());
                m.put("userId", c.getUserId());
                m.put("citizenName", c.getCitizenName());
                m.put("contactPhone", c.getContactPhone());
                m.put("category", c.getCategory());
                m.put("title", c.getTitle());
                m.put("description", c.getDescription());
                m.put("district", c.getDistrict());
                m.put("ward", c.getWard());
                m.put("location", c.getLocation());
                m.put("latitude", c.getLatitude());
                m.put("longitude", c.getLongitude());
                m.put("image", c.getImage());
                m.put("priority", c.getPriority());
                m.put("status", c.getStatus());
                m.put("departmentId", c.getDepartmentId());
                m.put("assignedOfficer", c.getAssignedOfficer());
                m.put("officerPhone", c.getOfficerPhone());
                m.put("resolutionNotes", c.getResolutionNotes());
                m.put("feedbackRating", c.getFeedbackRating());
                m.put("feedbackComments", c.getFeedbackComments());
                m.put("createdAt", c.getCreatedAt());
                m.put("updatedAt", c.getUpdatedAt());
                complaintList.add(m);
            }
            root.put("complaints", complaintList);

            // Shelters
            List<Map<String, Object>> shelterList = new ArrayList<>();
            for (Shelter s : shelters.values()) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", s.getId());
                m.put("name", s.getName());
                m.put("district", s.getDistrict());
                m.put("address", s.getAddress());
                m.put("latitude", s.getLatitude());
                m.put("longitude", s.getLongitude());
                m.put("capacity", s.getCapacity());
                m.put("currentOccupancy", s.getCurrentOccupancy());
                m.put("facilities", s.getFacilities());
                m.put("contactPerson", s.getContactPerson());
                m.put("contactPhone", s.getContactPhone());
                m.put("status", s.getStatus());
                shelterList.add(m);
            }
            root.put("shelters", shelterList);

            // Departments
            List<Map<String, Object>> deptList = new ArrayList<>();
            for (Department d : departments.values()) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", d.getId());
                m.put("code", d.getCode());
                m.put("name", d.getName());
                m.put("assignedOfficer", d.getAssignedOfficer());
                m.put("phone", d.getPhone());
                m.put("email", d.getEmail());
                m.put("emergencyHelpline", d.getEmergencyHelpline());
                m.put("activeRescueUnits", d.getActiveRescueUnits());
                m.put("jurisdiction", d.getJurisdiction());
                deptList.add(m);
            }
            root.put("departments", deptList);

            // Alerts
            List<Map<String, Object>> alertList = new ArrayList<>();
            for (EmergencyAlert a : alerts.values()) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", a.getId());
                m.put("title", a.getTitle());
                m.put("message", a.getMessage());
                m.put("severity", a.getSeverity());
                m.put("disasterType", a.getDisasterType());
                m.put("targetAudience", a.getTargetAudience());
                m.put("issuedBy", a.getIssuedBy());
                m.put("active", a.isActive());
                m.put("createdAt", a.getCreatedAt());
                alertList.add(m);
            }
            root.put("alerts", alertList);

            // Write formatted JSON to database.json
            String json = SimpleJson.toJson(root);
            try (PrintWriter pw = new PrintWriter(dbFile, StandardCharsets.UTF_8)) {
                pw.write(json);
            }
        } catch (Exception e) {
            System.err.println("Error saving database to file: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    public synchronized void loadFromFile() {
        if (!dbFile.exists() || dbFile.length() == 0) {
            return;
        }
        try {
            String content = Files.readString(dbFile.toPath(), StandardCharsets.UTF_8);
            Map<String, Object> root = SimpleJson.parseObject(content);

            // Load Complaints
            if (root.containsKey("complaints")) {
                List<Object> list = (List<Object>) root.get("complaints");
                for (Object o : list) {
                    Map<String, Object> m = (Map<String, Object>) o;
                    Complaint c = new Complaint();
                    c.setId((String) m.get("id"));
                    c.setUserId((String) m.get("userId"));
                    c.setCitizenName((String) m.get("citizenName"));
                    c.setContactPhone((String) m.get("contactPhone"));
                    c.setCategory((String) m.get("category"));
                    c.setTitle((String) m.get("title"));
                    c.setDescription((String) m.get("description"));
                    c.setDistrict((String) m.get("district"));
                    c.setWard((String) m.get("ward"));
                    c.setLocation((String) m.get("location"));
                    if (m.get("latitude") != null) c.setLatitude(((Number) m.get("latitude")).doubleValue());
                    if (m.get("longitude") != null) c.setLongitude(((Number) m.get("longitude")).doubleValue());
                    c.setImage((String) m.get("image"));
                    c.setPriority((String) m.get("priority"));
                    c.setStatus((String) m.get("status"));
                    c.setDepartmentId((String) m.get("departmentId"));
                    c.setAssignedOfficer((String) m.get("assignedOfficer"));
                    c.setOfficerPhone((String) m.get("officerPhone"));
                    c.setResolutionNotes((String) m.get("resolutionNotes"));
                    if (m.get("feedbackRating") != null) c.setFeedbackRating(((Number) m.get("feedbackRating")).intValue());
                    c.setFeedbackComments((String) m.get("feedbackComments"));
                    if (m.get("createdAt") != null) c.setCreatedAt((String) m.get("createdAt"));
                    if (m.get("updatedAt") != null) c.setUpdatedAt((String) m.get("updatedAt"));
                    complaints.put(c.getId(), c);
                }
            }

            // Load Shelters
            if (root.containsKey("shelters")) {
                List<Object> list = (List<Object>) root.get("shelters");
                for (Object o : list) {
                    Map<String, Object> m = (Map<String, Object>) o;
                    Shelter s = new Shelter();
                    s.setId((String) m.get("id"));
                    s.setName((String) m.get("name"));
                    s.setDistrict((String) m.get("district"));
                    s.setAddress((String) m.get("address"));
                    if (m.get("latitude") != null) s.setLatitude(((Number) m.get("latitude")).doubleValue());
                    if (m.get("longitude") != null) s.setLongitude(((Number) m.get("longitude")).doubleValue());
                    if (m.get("capacity") != null) s.setCapacity(((Number) m.get("capacity")).intValue());
                    if (m.get("currentOccupancy") != null) s.setCurrentOccupancy(((Number) m.get("currentOccupancy")).intValue());
                    s.setFacilities((String) m.get("facilities"));
                    s.setContactPerson((String) m.get("contactPerson"));
                    s.setContactPhone((String) m.get("contactPhone"));
                    s.setStatus((String) m.get("status"));
                    shelters.put(s.getId(), s);
                }
            }

            // Load Departments
            if (root.containsKey("departments")) {
                List<Object> list = (List<Object>) root.get("departments");
                for (Object o : list) {
                    Map<String, Object> m = (Map<String, Object>) o;
                    Department d = new Department();
                    d.setId((String) m.get("id"));
                    d.setCode((String) m.get("code"));
                    d.setName((String) m.get("name"));
                    d.setAssignedOfficer((String) m.get("assignedOfficer"));
                    d.setPhone((String) m.get("phone"));
                    d.setEmail((String) m.get("email"));
                    d.setEmergencyHelpline((String) m.get("emergencyHelpline"));
                    if (m.get("activeRescueUnits") != null) d.setActiveRescueUnits(((Number) m.get("activeRescueUnits")).intValue());
                    d.setJurisdiction((String) m.get("jurisdiction"));
                    departments.put(d.getId(), d);
                }
            }

            // Load Alerts
            if (root.containsKey("alerts")) {
                List<Object> list = (List<Object>) root.get("alerts");
                for (Object o : list) {
                    Map<String, Object> m = (Map<String, Object>) o;
                    EmergencyAlert a = new EmergencyAlert();
                    a.setId((String) m.get("id"));
                    a.setTitle((String) m.get("title"));
                    a.setMessage((String) m.get("message"));
                    a.setSeverity((String) m.get("severity"));
                    a.setDisasterType((String) m.get("disasterType"));
                    a.setTargetAudience((String) m.get("targetAudience"));
                    a.setIssuedBy((String) m.get("issuedBy"));
                    if (m.get("active") != null) a.setActive((Boolean) m.get("active"));
                    if (m.get("createdAt") != null) a.setCreatedAt((String) m.get("createdAt"));
                    alerts.put(a.getId(), a);
                }
            }

            System.out.println("Restored state from disk: " + complaints.size() + " complaints, " 
                + shelters.size() + " shelters, " + departments.size() + " departments.");
        } catch (Exception e) {
            System.err.println("Could not load database file (starting clean): " + e.getMessage());
        }
    }
}
