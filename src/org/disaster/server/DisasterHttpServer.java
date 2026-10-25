package org.disaster.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.Executors;
import org.disaster.model.*;
import org.disaster.repository.DataStore;
import org.disaster.service.AiChatbotService;

public class DisasterHttpServer {
    private final int port;
    private final DataStore dataStore;
    private HttpServer server;

    public DisasterHttpServer(int port, DataStore dataStore) {
        this.port = port;
        this.dataStore = dataStore;
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);
        server.setExecutor(Executors.newVirtualThreadPerTaskExecutor());

        // API Router
        server.createContext("/api/", new ApiHandler());

        // Real Uploads Static File Handler
        server.createContext("/uploads/", new UploadsHandler());

        // Web Client Static Handler
        server.createContext("/", new StaticFileHandler());

        server.start();
        System.out.println("=================================================================");
        System.out.println(" SafePublic - Disaster Preparedness & Citizen Grievance Portal");
        System.out.println(" Java 26 Enterprise Server active on: http://localhost:" + port);
        System.out.println(" Full disk database & camera photo uploads active.");
        System.out.println("=================================================================");
    }

    public void stop() {
        if (server != null) {
            server.stop(0);
        }
    }

    private class ApiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            String path = exchange.getRequestURI().getPath();
            String query = exchange.getRequestURI().getQuery();
            String method = exchange.getRequestMethod().toUpperCase();

            try {
                if (path.equals("/api/auth/login") && method.equals("POST")) {
                    handleLogin(exchange);
                } else if (path.equals("/api/auth/register") && method.equals("POST")) {
                    handleRegister(exchange);
                } else if (path.equals("/api/upload") && method.equals("POST")) {
                    handleUpload(exchange);
                } else if (path.equals("/api/shelters") && method.equals("GET")) {
                    handleGetShelters(exchange);
                } else if (path.equals("/api/shelters") && method.equals("POST")) {
                    handleCreateShelter(exchange);
                } else if (path.startsWith("/api/shelters/") && method.equals("PUT")) {
                    String sid = path.substring("/api/shelters/".length());
                    handleUpdateShelter(exchange, sid);
                } else if (path.startsWith("/api/shelters/") && method.equals("DELETE")) {
                    String sid = path.substring("/api/shelters/".length());
                    handleDeleteShelter(exchange, sid);
                } else if (path.startsWith("/api/complaints/track/")) {
                    String cid = path.substring("/api/complaints/track/".length());
                    handleTrackComplaint(exchange, cid);
                } else if (path.startsWith("/api/complaints") && method.equals("GET")) {
                    handleGetComplaints(exchange, query);
                } else if (path.equals("/api/complaints") && method.equals("POST")) {
                    handleCreateComplaint(exchange);
                } else if (path.startsWith("/api/complaints/") && method.equals("PUT")) {
                    String id = path.substring("/api/complaints/".length());
                    handleUpdateComplaint(exchange, id);
                } else if (path.startsWith("/api/complaints/") && method.equals("DELETE")) {
                    String id = path.substring("/api/complaints/".length());
                    handleDeleteComplaint(exchange, id);
                } else if (path.equals("/api/departments") && method.equals("GET")) {
                    handleGetDepartments(exchange);
                } else if (path.equals("/api/departments") && method.equals("POST")) {
                    handleCreateDepartment(exchange);
                } else if (path.startsWith("/api/departments/") && method.equals("PUT")) {
                    String did = path.substring("/api/departments/".length());
                    handleUpdateDepartment(exchange, did);
                } else if (path.startsWith("/api/departments/") && method.equals("DELETE")) {
                    String did = path.substring("/api/departments/".length());
                    handleDeleteDepartment(exchange, did);
                } else if (path.equals("/api/learn") && method.equals("GET")) {
                    handleGetLearn(exchange);
                } else if (path.equals("/api/learn") && method.equals("POST")) {
                    handleCreateLearn(exchange);
                } else if (path.startsWith("/api/learn/") && method.equals("DELETE")) {
                    String lid = path.substring("/api/learn/".length());
                    handleDeleteLearn(exchange, lid);
                } else if (path.equals("/api/quizzes") && method.equals("GET")) {
                    handleGetQuizzes(exchange);
                } else if (path.startsWith("/api/quizzes/detail/") && method.equals("GET")) {
                    String qid = path.substring("/api/quizzes/detail/".length());
                    handleGetQuizDetail(exchange, qid);
                } else if (path.equals("/api/quizzes/submit") && method.equals("POST")) {
                    handleQuizSubmit(exchange);
                } else if (path.equals("/api/quizzes/certificates") && method.equals("GET")) {
                    handleGetCertificates(exchange);
                } else if (path.startsWith("/api/alerts") && method.equals("GET")) {
                    handleGetAlerts(exchange);
                } else if (path.equals("/api/alerts") && method.equals("POST")) {
                    handleBroadcastAlert(exchange);
                } else if (path.startsWith("/api/alerts/") && method.equals("DELETE")) {
                    String aid = path.substring("/api/alerts/".length());
                    handleDeleteAlert(exchange, aid);
                } else if (path.equals("/api/feedback") && method.equals("POST")) {
                    handleFeedback(exchange);
                } else if (path.equals("/api/ai/ask") && method.equals("POST")) {
                    handleAiAsk(exchange);
                } else if (path.equals("/api/analytics") && method.equals("GET")) {
                    handleAnalytics(exchange);
                } else {
                    sendJson(exchange, 404, Map.of("error", "Endpoint not found: " + path));
                }
            } catch (Exception e) {
                e.printStackTrace();
                sendJson(exchange, 500, Map.of("error", "Internal Server Error: " + e.getMessage()));
            }
        }

        // --- REAL PHOTO / FILE UPLOAD ---
        private void handleUpload(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String base64Data = (String) req.get("base64Data");
            if (base64Data == null) base64Data = (String) req.get("data");
            String fileName = (String) req.get("fileName");
            if (fileName == null) fileName = (String) req.get("filename");

            if (base64Data == null || base64Data.isEmpty()) {
                sendJson(exchange, 400, Map.of("error", "Missing base64Data"));
                return;
            }

            // Strip data:image/...;base64, header if present
            String rawBase64 = base64Data;
            int commaIdx = base64Data.indexOf(",");
            if (commaIdx != -1) {
                rawBase64 = base64Data.substring(commaIdx + 1);
            }

            byte[] imageBytes = Base64.getDecoder().decode(rawBase64);

            String ext = ".jpg";
            if (fileName != null && fileName.contains(".")) {
                ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
            }

            String savedName = "img_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 6) + ext;
            File targetFile = new File("uploads", savedName);
            Files.write(targetFile.toPath(), imageBytes);

            String fileUrl = "/uploads/" + savedName;
            sendJson(exchange, 201, Map.of("url", fileUrl, "fileName", savedName, "sizeBytes", imageBytes.length));
        }

        private void handleLogin(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String email = (String) req.get("email");
            String password = (String) req.get("password");

            User user = dataStore.getUserByEmail(email);
            if (user != null && user.getPassword().equals(password)) {
                String token = dataStore.createToken(user);
                Map<String, Object> res = new LinkedHashMap<>();
                res.put("token", token);
                res.put("user", userToMap(user));
                sendJson(exchange, 200, res);
            } else {
                sendJson(exchange, 401, Map.of("error", "Invalid credentials"));
            }
        }

        private void handleRegister(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String name = (String) req.get("name");
            String email = (String) req.get("email");
            String password = (String) req.get("password");
            String phone = (String) req.get("phone");
            String roleStr = (String) req.get("role");
            String deptId = (String) req.get("departmentId");
            String district = (String) req.get("district");
            String address = (String) req.get("address");

            if (dataStore.getUserByEmail(email) != null) {
                sendJson(exchange, 400, Map.of("error", "Email already registered"));
                return;
            }

            String id = "usr_" + UUID.randomUUID().toString().substring(0, 8);
            Role role = Role.fromString(roleStr);
            User u = new User(id, name, email, password, phone, role, deptId, district, address);
            dataStore.saveUser(u);

            String token = dataStore.createToken(u);
            Map<String, Object> res = new LinkedHashMap<>();
            res.put("token", token);
            res.put("user", userToMap(u));
            sendJson(exchange, 201, res);
        }

        // --- Shelters CRUD ---
        private void handleGetShelters(HttpExchange exchange) throws IOException {
            List<Shelter> list = dataStore.getAllShelters();
            List<Map<String, Object>> out = new ArrayList<>();
            for (Shelter s : list) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", s.getId());
                m.put("name", s.getName());
                m.put("district", s.getDistrict());
                m.put("address", s.getAddress());
                m.put("latitude", s.getLatitude());
                m.put("longitude", s.getLongitude());
                m.put("capacity", s.getCapacity());
                m.put("currentOccupancy", s.getCurrentOccupancy());
                m.put("availableSpace", Math.max(0, s.getCapacity() - s.getCurrentOccupancy()));
                m.put("facilities", s.getFacilities());
                m.put("contactPerson", s.getContactPerson());
                m.put("contactPhone", s.getContactPhone());
                m.put("status", s.getStatus());
                out.add(m);
            }
            sendJson(exchange, 200, out);
        }

        private void handleCreateShelter(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String id = "SHL-" + (100 + dataStore.getAllShelters().size() + 1);
            String name = (String) req.get("name");
            String district = (String) req.get("district");
            String address = (String) req.get("address");
            double lat = req.get("latitude") != null ? ((Number) req.get("latitude")).doubleValue() : 13.0827;
            double lng = req.get("longitude") != null ? ((Number) req.get("longitude")).doubleValue() : 80.2707;
            int cap = req.get("capacity") != null ? ((Number) req.get("capacity")).intValue() : 1000;
            int occ = req.get("currentOccupancy") != null ? ((Number) req.get("currentOccupancy")).intValue() : 0;
            String fac = (String) req.get("facilities");
            String person = (String) req.get("contactPerson");
            String phone = (String) req.get("contactPhone");

            Shelter s = new Shelter(id, name, district, address, lat, lng, cap, occ, fac, person, phone);
            dataStore.saveShelter(s);
            sendJson(exchange, 201, Map.of("message", "Relief shelter created and added to map!", "id", id));
        }

        private void handleUpdateShelter(HttpExchange exchange, String sid) throws IOException {
            Shelter s = dataStore.getShelterById(sid);
            if (s == null) {
                sendJson(exchange, 404, Map.of("error", "Shelter not found"));
                return;
            }
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);

            if (req.containsKey("name")) s.setName((String) req.get("name"));
            if (req.containsKey("capacity")) s.setCapacity(((Number) req.get("capacity")).intValue());
            if (req.containsKey("currentOccupancy")) s.setCurrentOccupancy(((Number) req.get("currentOccupancy")).intValue());
            if (req.containsKey("status")) s.setStatus((String) req.get("status"));
            if (req.containsKey("facilities")) s.setFacilities((String) req.get("facilities"));

            dataStore.saveShelter(s);
            sendJson(exchange, 200, Map.of("message", "Shelter updated successfully"));
        }

        private void handleDeleteShelter(HttpExchange exchange, String sid) throws IOException {
            boolean ok = dataStore.deleteShelter(sid);
            if (ok) {
                sendJson(exchange, 200, Map.of("message", "Shelter removed"));
            } else {
                sendJson(exchange, 404, Map.of("error", "Shelter not found"));
            }
        }

        // --- Complaint Tracking & CRUD ---
        private void handleTrackComplaint(HttpExchange exchange, String complaintId) throws IOException {
            Complaint c = dataStore.getComplaintById(complaintId);
            if (c != null) {
                sendJson(exchange, 200, complaintToMap(c));
            } else {
                sendJson(exchange, 404, Map.of("error", "No disaster grievance found with ID: " + complaintId));
            }
        }

        private void handleGetComplaints(HttpExchange exchange, String query) throws IOException {
            String deptFilter = null;
            if (query != null && query.contains("deptId=")) {
                for (String part : query.split("&")) {
                    if (part.startsWith("deptId=")) {
                        deptFilter = part.substring("deptId=".length());
                    }
                }
            }

            List<Complaint> list = deptFilter != null && !deptFilter.isEmpty()
                ? dataStore.getComplaintsByDepartment(deptFilter)
                : dataStore.getAllComplaints();

            List<Map<String, Object>> out = new ArrayList<>();
            for (Complaint c : list) {
                out.add(complaintToMap(c));
            }
            sendJson(exchange, 200, out);
        }

        private void handleCreateComplaint(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);

            String id = "GRV-2026-" + (100 + dataStore.getAllComplaints().size() + 1);
            String userId = (String) req.get("userId");
            String citizenName = (String) req.get("citizenName");
            String contactPhone = (String) req.get("contactPhone");
            String category = (String) req.get("category");
            String title = (String) req.get("title");
            String desc = (String) req.get("description");
            String district = (String) req.get("district");
            String ward = (String) req.get("ward");
            String location = (String) req.get("location");
            double lat = req.get("latitude") != null ? ((Number) req.get("latitude")).doubleValue() : 13.0827;
            double lng = req.get("longitude") != null ? ((Number) req.get("longitude")).doubleValue() : 80.2707;
            String image = (String) req.get("image");
            String priority = (String) req.get("priority");

            Complaint c = new Complaint(id, userId, citizenName, contactPhone, category, title, desc, district, ward, location, lat, lng, image, priority);

            // Auto-assign department based on disaster category
            if (category != null) {
                String catLower = category.toLowerCase();
                if (catLower.contains("flood") || catLower.contains("water") || catLower.contains("submerged") || catLower.contains("rescue")) {
                    c.setDepartmentId("DEP-NDRF");
                    c.setAssignedOfficer("Commander Rajesh Varma");
                    c.setOfficerPhone("+91 98765 00002");
                    c.setStatus("ASSIGNED");
                } else if (catLower.contains("fire") || catLower.contains("gas") || catLower.contains("cylinder") || catLower.contains("chemical")) {
                    c.setDepartmentId("DEP-FIRE");
                    c.setAssignedOfficer("Chief Inspector Vikram Rathore");
                    c.setOfficerPhone("+91 98765 43210");
                    c.setStatus("ASSIGNED");
                } else if (catLower.contains("drain") || catLower.contains("sewer") || catLower.contains("canal")) {
                    c.setDepartmentId("DEP-DRAINAGE");
                    c.setAssignedOfficer("Eng. Senthil Kumar");
                    c.setOfficerPhone("+91 98765 43211");
                    c.setStatus("ASSIGNED");
                } else if (catLower.contains("electric") || catLower.contains("power") || catLower.contains("wire") || catLower.contains("transformer")) {
                    c.setDepartmentId("DEP-POWER");
                    c.setAssignedOfficer("Superintending Eng. Priya Nair");
                    c.setOfficerPhone("+91 98765 43212");
                    c.setStatus("ASSIGNED");
                } else if (catLower.contains("bridge") || catLower.contains("road") || catLower.contains("structural") || catLower.contains("landslide")) {
                    c.setDepartmentId("DEP-PWD");
                    c.setAssignedOfficer("Chief Eng. Dr. Arun Prakash");
                    c.setOfficerPhone("+91 98765 43213");
                    c.setStatus("ASSIGNED");
                }
            }

            dataStore.saveComplaint(c);
            sendJson(exchange, 201, Map.of(
                "message", "Disaster grievance registered successfully and saved to permanent disk database!",
                "id", id,
                "assignedDepartment", c.getDepartmentId() != null ? c.getDepartmentId() : "Pending DMOC Review"
            ));
        }

        private void handleUpdateComplaint(HttpExchange exchange, String id) throws IOException {
            Complaint c = dataStore.getComplaintById(id);
            if (c == null) {
                sendJson(exchange, 404, Map.of("error", "Complaint not found"));
                return;
            }

            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);

            if (req.containsKey("status")) c.setStatus((String) req.get("status"));
            if (req.containsKey("departmentId")) c.setDepartmentId((String) req.get("departmentId"));
            if (req.containsKey("assignedOfficer")) c.setAssignedOfficer((String) req.get("assignedOfficer"));
            if (req.containsKey("officerPhone")) c.setOfficerPhone((String) req.get("officerPhone"));
            if (req.containsKey("resolutionNotes")) c.setResolutionNotes((String) req.get("resolutionNotes"));
            if (req.containsKey("priority")) c.setPriority((String) req.get("priority"));
            if (req.containsKey("feedbackRating")) c.setFeedbackRating(((Number) req.get("feedbackRating")).intValue());
            if (req.containsKey("feedbackComments")) c.setFeedbackComments((String) req.get("feedbackComments"));

            dataStore.saveComplaint(c);
            sendJson(exchange, 200, Map.of("message", "Grievance status updated on disk", "complaint", complaintToMap(c)));
        }

        private void handleDeleteComplaint(HttpExchange exchange, String id) throws IOException {
            boolean ok = dataStore.deleteComplaint(id);
            if (ok) {
                sendJson(exchange, 200, Map.of("message", "Grievance removed"));
            } else {
                sendJson(exchange, 404, Map.of("error", "Complaint not found"));
            }
        }

        // --- Departments CRUD ---
        private void handleGetDepartments(HttpExchange exchange) throws IOException {
            List<Department> list = dataStore.getAllDepartments();
            List<Map<String, Object>> out = new ArrayList<>();
            for (Department d : list) {
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
                out.add(m);
            }
            sendJson(exchange, 200, out);
        }

        private void handleCreateDepartment(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String id = "DEP-" + System.currentTimeMillis();
            String code = (String) req.get("code");
            String name = (String) req.get("name");
            String officer = (String) req.get("assignedOfficer");
            String phone = (String) req.get("phone");
            String email = (String) req.get("email");
            String helpline = (String) req.get("emergencyHelpline");
            int units = req.get("activeRescueUnits") != null ? ((Number) req.get("activeRescueUnits")).intValue() : 10;
            String jur = (String) req.get("jurisdiction");

            Department d = new Department(id, code, name, officer, phone, email, helpline, units, jur);
            dataStore.saveDepartment(d);
            sendJson(exchange, 201, Map.of("message", "Department registered successfully", "id", id));
        }

        private void handleUpdateDepartment(HttpExchange exchange, String did) throws IOException {
            Department d = dataStore.getDepartmentById(did);
            if (d == null) {
                sendJson(exchange, 404, Map.of("error", "Department not found"));
                return;
            }
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            if (req.containsKey("assignedOfficer")) d.setAssignedOfficer((String) req.get("assignedOfficer"));
            if (req.containsKey("phone")) d.setPhone((String) req.get("phone"));
            if (req.containsKey("emergencyHelpline")) d.setEmergencyHelpline((String) req.get("emergencyHelpline"));
            if (req.containsKey("activeRescueUnits")) d.setActiveRescueUnits(((Number) req.get("activeRescueUnits")).intValue());
            if (req.containsKey("jurisdiction")) d.setJurisdiction((String) req.get("jurisdiction"));

            dataStore.saveDepartment(d);
            sendJson(exchange, 200, Map.of("message", "Department updated"));
        }

        private void handleDeleteDepartment(HttpExchange exchange, String did) throws IOException {
            boolean ok = dataStore.deleteDepartment(did);
            if (ok) {
                sendJson(exchange, 200, Map.of("message", "Department deleted"));
            } else {
                sendJson(exchange, 404, Map.of("error", "Department not found"));
            }
        }

        // --- Learning Modules CRUD ---
        private void handleGetLearn(HttpExchange exchange) throws IOException {
            List<LearningModule> list = dataStore.getAllLearningModules();
            List<Map<String, Object>> out = new ArrayList<>();
            for (LearningModule m : list) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", m.getId());
                map.put("name", m.getName());
                map.put("category", m.getCategory());
                map.put("type", m.getType());
                map.put("summary", m.getSummary());
                map.put("fullDescription", m.getFullDescription());
                map.put("dos", m.getDos());
                map.put("donts", m.getDonts());
                map.put("keyActions", m.getKeyActions());
                map.put("videoUrl", m.getVideoUrl());
                map.put("emergencyEquipment", m.getEmergencyEquipment());
                out.add(map);
            }
            sendJson(exchange, 200, out);
        }

        private void handleCreateLearn(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String id = "MOD-" + System.currentTimeMillis();
            String name = (String) req.get("name");
            String cat = (String) req.get("category");
            String type = (String) req.get("type");
            String summary = (String) req.get("summary");
            String desc = (String) req.get("fullDescription");
            List<String> dos = toStringList(req.get("dos"));
            List<String> donts = toStringList(req.get("donts"));
            List<String> actions = toStringList(req.get("keyActions"));
            String video = (String) req.get("videoUrl");
            String equip = (String) req.get("emergencyEquipment");

            LearningModule mod = new LearningModule(id, name, cat, type, summary, desc, dos, donts, actions, video, equip);
            dataStore.saveLearningModule(mod);
            sendJson(exchange, 201, Map.of("message", "Disaster guide published to public portal!", "id", id));
        }

        private void handleDeleteLearn(HttpExchange exchange, String lid) throws IOException {
            boolean ok = dataStore.deleteLearningModule(lid);
            if (ok) {
                sendJson(exchange, 200, Map.of("message", "Module removed"));
            } else {
                sendJson(exchange, 404, Map.of("error", "Module not found"));
            }
        }

        // --- Quizzes ---
        private void handleGetQuizzes(HttpExchange exchange) throws IOException {
            List<Quiz> quizzes = dataStore.getAllQuizzes();
            List<Map<String, Object>> list = new ArrayList<>();
            for (Quiz q : quizzes) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", q.getId());
                map.put("title", q.getTitle());
                map.put("disasterType", q.getDisasterType());
                map.put("difficulty", q.getDifficulty());
                map.put("passingScore", q.getPassingScore());
                map.put("questionCount", q.getQuestions().size());
                list.add(map);
            }
            sendJson(exchange, 200, list);
        }

        private void handleGetQuizDetail(HttpExchange exchange, String qid) throws IOException {
            Quiz q = dataStore.getQuizById(qid);
            if (q != null) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", q.getId());
                map.put("title", q.getTitle());
                map.put("disasterType", q.getDisasterType());
                map.put("difficulty", q.getDifficulty());
                map.put("passingScore", q.getPassingScore());

                List<Map<String, Object>> qList = new ArrayList<>();
                for (Quiz.Question ques : q.getQuestions()) {
                    Map<String, Object> qm = new LinkedHashMap<>();
                    qm.put("id", ques.getId());
                    qm.put("text", ques.getText());
                    qm.put("options", ques.getOptions());
                    qm.put("correctIndex", ques.getCorrectIndex());
                    qm.put("explanation", ques.getExplanation());
                    qList.add(qm);
                }
                map.put("questions", qList);
                sendJson(exchange, 200, map);
            } else {
                sendJson(exchange, 404, Map.of("error", "Quiz not found"));
            }
        }

        private void handleQuizSubmit(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String quizId = (String) req.get("quizId");
            String userId = (String) req.get("userId");
            String userName = (String) req.get("userName");
            List<Object> userAnswers = (List<Object>) req.get("answers");

            Quiz q = dataStore.getQuizById(quizId);
            if (q == null) {
                sendJson(exchange, 404, Map.of("error", "Quiz not found"));
                return;
            }

            int score = 0;
            int maxScore = q.getQuestions().size();
            for (int i = 0; i < maxScore && i < userAnswers.size(); i++) {
                int selected = ((Number) userAnswers.get(i)).intValue();
                if (selected == q.getQuestions().get(i).getCorrectIndex()) {
                    score++;
                }
            }

            double percentage = maxScore > 0 ? ((double) score / maxScore) * 100.0 : 0.0;
            boolean passed = percentage >= q.getPassingScore();
            String certId = passed ? "PUB-CERT-2026-" + (100000 + new Random().nextInt(900000)) : null;

            String resultId = "QR-" + System.currentTimeMillis();
            QuizResult qr = new QuizResult(resultId, userId, userName, quizId, q.getTitle(), score, maxScore, passed, certId);
            dataStore.saveQuizResult(qr);

            Map<String, Object> res = new LinkedHashMap<>();
            res.put("score", score);
            res.put("maxScore", maxScore);
            res.put("percentage", Math.round(percentage));
            res.put("passed", passed);
            res.put("certificateNumber", certId);
            sendJson(exchange, 200, res);
        }

        private void handleGetCertificates(HttpExchange exchange) throws IOException {
            List<QuizResult> list = dataStore.getAllQuizResults();
            List<Map<String, Object>> certs = new ArrayList<>();
            for (QuizResult qr : list) {
                if (qr.isPassed() && qr.getCertificateNumber() != null) {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("certificateNumber", qr.getCertificateNumber());
                    m.put("userName", qr.getUserName());
                    m.put("quizTitle", qr.getQuizTitle());
                    m.put("percentage", qr.getPercentage());
                    m.put("completedAt", qr.getCompletedAt());
                    certs.add(m);
                }
            }
            sendJson(exchange, 200, certs);
        }

        // --- Alerts CRUD ---
        private void handleGetAlerts(HttpExchange exchange) throws IOException {
            List<EmergencyAlert> list = dataStore.getAllAlerts();
            List<Map<String, Object>> out = new ArrayList<>();
            for (EmergencyAlert a : list) {
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
                out.add(m);
            }
            sendJson(exchange, 200, out);
        }

        private void handleBroadcastAlert(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String id = "ALERT-" + System.currentTimeMillis();
            String title = (String) req.get("title");
            String message = (String) req.get("message");
            String severity = (String) req.get("severity");
            String disasterType = (String) req.get("disasterType");
            String target = (String) req.get("targetAudience");
            String issuedBy = (String) req.get("issuedBy");

            EmergencyAlert a = new EmergencyAlert(id, title, message, severity, disasterType, target, issuedBy);
            dataStore.saveAlert(a);
            sendJson(exchange, 201, Map.of("message", "Disaster alert siren broadcasted to public!", "id", id));
        }

        private void handleDeleteAlert(HttpExchange exchange, String aid) throws IOException {
            boolean ok = dataStore.deleteAlert(aid);
            if (ok) {
                sendJson(exchange, 200, Map.of("message", "Alert dismissed"));
            } else {
                sendJson(exchange, 404, Map.of("error", "Alert not found"));
            }
        }

        private void handleFeedback(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String complaintId = (String) req.get("complaintId");
            int rating = req.get("rating") != null ? ((Number) req.get("rating")).intValue() : 5;
            String comments = (String) req.get("comments");

            Complaint c = dataStore.getComplaintById(complaintId);
            if (c != null) {
                c.setFeedbackRating(rating);
                c.setFeedbackComments(comments);
                dataStore.saveComplaint(c);
            }
            sendJson(exchange, 201, Map.of("message", "Citizen feedback saved!"));
        }

        private void handleAiAsk(HttpExchange exchange) throws IOException {
            String body = readBody(exchange);
            Map<String, Object> req = SimpleJson.parseObject(body);
            String question = (String) req.get("question");

            AiChatbotService.ChatResponse resp = AiChatbotService.ask(question);
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("reply", resp.reply);
            map.put("category", resp.category);
            map.put("emergencyActions", resp.emergencyActions);
            map.put("suggestedHotlines", resp.suggestedHotlines);
            sendJson(exchange, 200, map);
        }

        private void handleAnalytics(HttpExchange exchange) throws IOException {
            List<Complaint> complaints = dataStore.getAllComplaints();
            int total = complaints.size();
            int resolved = 0;
            int inAction = 0;
            int immediateThreats = 0;
            for (Complaint c : complaints) {
                if ("RESOLVED".equalsIgnoreCase(c.getStatus())) resolved++;
                else if ("TEAMS_DISPATCHED".equalsIgnoreCase(c.getStatus()) || "ASSIGNED".equalsIgnoreCase(c.getStatus())) inAction++;
                if ("IMMEDIATE_THREAT".equalsIgnoreCase(c.getPriority()) || "CRITICAL".equalsIgnoreCase(c.getPriority())) immediateThreats++;
            }

            List<Shelter> shelters = dataStore.getAllShelters();
            int totalCapacity = 0;
            int shelteredCitizens = 0;
            int openShelters = 0;
            for (Shelter s : shelters) {
                totalCapacity += s.getCapacity();
                shelteredCitizens += s.getCurrentOccupancy();
                if ("OPEN".equalsIgnoreCase(s.getStatus())) openShelters++;
            }

            int totalRescueUnits = 0;
            for (Department d : dataStore.getAllDepartments()) {
                totalRescueUnits += d.getActiveRescueUnits();
            }

            Map<String, Object> stats = new LinkedHashMap<>();
            stats.put("totalComplaints", total);
            stats.put("resolvedComplaints", resolved);
            stats.put("inActionComplaints", inAction);
            stats.put("immediateThreats", immediateThreats);
            stats.put("resolutionRate", total > 0 ? Math.round(((double) resolved / total) * 100) : 100);
            stats.put("shelteredCitizens", shelteredCitizens);
            stats.put("totalShelterCapacity", totalCapacity);
            stats.put("openShelters", openShelters);
            stats.put("activeRescueUnitsDeployed", totalRescueUnits);
            stats.put("departmentsCount", dataStore.getAllDepartments().size());

            sendJson(exchange, 200, stats);
        }

        private Map<String, Object> userToMap(User u) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("name", u.getName());
            m.put("email", u.getEmail());
            m.put("phone", u.getPhone());
            m.put("role", u.getRole().name());
            m.put("departmentId", u.getDepartmentId());
            m.put("district", u.getDistrict());
            m.put("address", u.getAddress());
            return m;
        }

        private Map<String, Object> complaintToMap(Complaint c) {
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
            return m;
        }

        private List<String> toStringList(Object obj) {
            List<String> list = new ArrayList<>();
            if (obj instanceof List<?>) {
                for (Object item : (List<?>) obj) {
                    if (item != null) list.add(item.toString());
                }
            }
            return list;
        }
    }

    // --- STATIC UPLOADS HANDLER ---
    private static class UploadsHandler implements HttpHandler {
        private final File uploadsDir = new File("uploads");

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            String filename = path.substring("/uploads/".length());
            File file = new File(uploadsDir, filename).getCanonicalFile();

            if (!file.exists() || !file.getPath().startsWith(uploadsDir.getCanonicalPath())) {
                exchange.sendResponseHeaders(404, -1);
                return;
            }

            String mimeType = "image/jpeg";
            String lower = filename.toLowerCase();
            if (lower.endsWith(".png")) mimeType = "image/png";
            else if (lower.endsWith(".svg")) mimeType = "image/svg+xml";
            else if (lower.endsWith(".webp")) mimeType = "image/webp";

            byte[] bytes = Files.readAllBytes(file.toPath());
            exchange.getResponseHeaders().set("Content-Type", mimeType);
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }

    // --- STATIC WEB ASSETS HANDLER ---
    private static class StaticFileHandler implements HttpHandler {
        private final File webRoot = new File("web");

        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/")) {
                path = "/index.html";
            }

            File file = new File(webRoot, path.startsWith("/") ? path.substring(1) : path).getCanonicalFile();
            if (!file.exists() || file.isDirectory() || !file.getPath().startsWith(webRoot.getCanonicalPath())) {
                file = new File(webRoot, "index.html");
            }

            if (!file.exists()) {
                String notFound = "<h1>404 Not Found</h1>";
                exchange.getResponseHeaders().set("Content-Type", "text/html; charset=UTF-8");
                exchange.sendResponseHeaders(404, notFound.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(notFound.getBytes(StandardCharsets.UTF_8));
                }
                return;
            }

            String mimeType = getMimeType(file.getName());
            byte[] fileBytes = Files.readAllBytes(file.toPath());
            exchange.getResponseHeaders().set("Content-Type", mimeType);
            exchange.sendResponseHeaders(200, fileBytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(fileBytes);
            }
        }

        private String getMimeType(String filename) {
            String lower = filename.toLowerCase();
            if (lower.endsWith(".html")) return "text/html; charset=UTF-8";
            if (lower.endsWith(".css")) return "text/css; charset=UTF-8";
            if (lower.endsWith(".js")) return "application/javascript; charset=UTF-8";
            if (lower.endsWith(".json")) return "application/json; charset=UTF-8";
            if (lower.endsWith(".png")) return "image/png";
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
            if (lower.endsWith(".svg")) return "image/svg+xml";
            if (lower.endsWith(".ico")) return "image/x-icon";
            return "application/octet-stream";
        }
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (InputStream is = exchange.getRequestBody();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int read;
            while ((read = is.read(buffer)) != -1) {
                baos.write(buffer, 0, read);
            }
            return baos.toString(StandardCharsets.UTF_8);
        }
    }

    private static void sendJson(HttpExchange exchange, int statusCode, Object data) throws IOException {
        String json = SimpleJson.toJson(data);
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }
}
