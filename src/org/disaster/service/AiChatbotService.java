package org.disaster.service;

import java.util.*;

/**
 * AI Disaster Awareness Assistant Service
 * Fulfills SRS FR-6: AI Chatbot for conversational emergency guidance and FAQ.
 */
public class AiChatbotService {

    public static class ChatResponse {
        public String reply;
        public String category;
        public List<String> emergencyActions;
        public List<String> suggestedHotlines;

        public ChatResponse(String reply, String category, List<String> emergencyActions, List<String> suggestedHotlines) {
            this.reply = reply;
            this.category = category;
            this.emergencyActions = emergencyActions;
            this.suggestedHotlines = suggestedHotlines;
        }
    }

    public static ChatResponse ask(String query) {
        if (query == null || query.trim().isEmpty()) {
            return new ChatResponse(
                "Hello! I am the Campus Emergency AI Assistant. You can ask me about Earthquake, Fire, Flood, Chemical Spills, First Aid, Evacuation routes, or reporting campus safety hazards.",
                "GENERAL",
                Arrays.asList("Ask about Fire Safety", "Ask about Earthquake Protocol", "Ask about Evacuation Maps"),
                Arrays.asList("National Emergency: 112", "Fire Service: 101", "Ambulance: 102")
            );
        }

        String q = query.toLowerCase();

        if (q.contains("earthquake") || q.contains("shake") || q.contains("tremor")) {
            return new ChatResponse(
                "DURING AN EARTHQUAKE: Execute DROP, COVER, and HOLD ON immediately! Drop to your knees, take cover under a sturdy desk or table, and protect your head. Stay away from glass windows and heavy overhead fixtures. NEVER use elevators. Once tremors stop, evacuate calmly to the North Lawn assembly point.",
                "EARTHQUAKE",
                Arrays.asList("Drop to knees", "Cover under sturdy desk", "Hold on until tremors cease", "Evacuate via stairs to North Lawn"),
                Arrays.asList("Disaster Management: 108", "Campus Safety: +91 98765 00001")
            );
        }

        if (q.contains("fire") || q.contains("smoke") || q.contains("burn") || q.contains("extinguisher")) {
            return new ChatResponse(
                "FIRE EMERGENCY DETECTED: Follow R.A.C.E. (Rescue, Alarm, Confine, Evacuate). Crawl low on hands and knees beneath the toxic smoke layer (breathable air is within 30cm of the floor). If trained and the fire is small, use extinguisher via P.A.S.S. (Pull pin, Aim at base of fire, Squeeze trigger, Sweep side-to-side). Assemble at Ground A.",
                "FIRE",
                Arrays.asList("Pull nearest red manual fire alarm", "Crawl low beneath smoke", "Feel doors with back of hand before opening", "Evacuate to Main Ground A"),
                Arrays.asList("Fire Brigade: 101", "Fire Officer Capt. Vikram: +91 98765 43210")
            );
        }

        if (q.contains("flood") || q.contains("water") || q.contains("monsoon") || q.contains("drown")) {
            return new ChatResponse(
                "FLASH FLOOD / WATERLOGGING PROTOCOL: Turn off the main electrical breaker in low-lying zones immediately to prevent fatal electrocution. Move yourself and valuable lab equipment to the 2nd floor or higher. Never walk through moving water deeper than ankle height.",
                "FLOOD",
                Arrays.asList("Shut off main power breakers", "Move to 2nd Floor or higher", "Never step into swift flowing water", "Boil or purify drinking water"),
                Arrays.asList("Disaster Helpline: 108", "Utilities Dept: +91 98765 43211")
            );
        }

        if (q.contains("chemical") || q.contains("spill") || q.contains("gas") || q.contains("acid") || q.contains("toxic")) {
            return new ChatResponse(
                "HAZMAT / CHEMICAL SPILL ALERT: Evacuate the laboratory immediately. If chemical touches eyes or skin, flush with the emergency eyewash station for 15 unbroken minutes. Close and seal doors. Notify Hazmat and Utilities Department immediately.",
                "CHEMICAL",
                Arrays.asList("Flush eyes/skin with eyewash for 15 mins", "Evacuate and seal room doors", "Do not inhale fumes", "Notify Hazmat Officer Priya Nair"),
                Arrays.asList("Chemical Emergency: +91 98765 43211", "Medical Triage: +91 98765 43213")
            );
        }

        if (q.contains("first aid") || q.contains("cpr") || q.contains("bleed") || q.contains("injury") || q.contains("faint")) {
            return new ChatResponse(
                "FIRST AID & MEDICAL EMERGENCY: Follow DRABC (Danger, Response, Airway, Breathing, Circulation). For heavy bleeding, apply firm direct pressure with a clean cloth. For cardiac arrest, begin CPR: 30 chest compressions at 100-120 bpm followed by 2 rescue breaths. Fetch the automated AED from Library reception.",
                "FIRST_AID",
                Arrays.asList("Check scene danger", "Apply direct pressure to severe bleeding", "Perform CPR 30:2 if unresponsive", "Call Medical Triage"),
                Arrays.asList("Ambulance: 102", "Campus Medical Officer Dr. Ananya: +91 98765 43213")
            );
        }

        if (q.contains("complaint") || q.contains("grievance") || q.contains("report") || q.contains("hazard")) {
            return new ChatResponse(
                "INCIDENT & GRIEVANCE REPORTING: You can submit any campus hazard (such as blocked fire exits, exposed live wires, structural wall cracks, or gas leaks) in the 'Grievance Reporting' tab. Your report generates a tracked Complaint ID, triggers officer assignment, and notifies you when resolved.",
                "REPORTING",
                Arrays.asList("Go to 'Report Grievance' tab", "Select hazard category", "Attach description & photo", "Track live status"),
                Arrays.asList("Crisis Command: +91 98765 43214")
            );
        }

        if (q.contains("drill") || q.contains("attendance") || q.contains("mock")) {
            return new ChatResponse(
                "MOCK DRILL SYSTEM: Teachers schedule regular disaster mock drills (Fire, Earthquake, Chemical). Attendance is recorded in real time, and evacuation durations are measured to evaluate campus readiness scores. Check the 'Mock Drills' tab for upcoming sessions.",
                "DRILLS",
                Arrays.asList("View upcoming drills calendar", "Mark drill attendance", "Review evacuation time benchmarks"),
                Arrays.asList("Drill Coordinator Prof. Sunita: +91 98765 00002")
            );
        }

        if (q.contains("certificate") || q.contains("quiz") || q.contains("exam")) {
            return new ChatResponse(
                "SAFETY CERTIFICATION: Complete any disaster preparedness quiz with an 80% or higher score to instantly earn an official 'Disaster Preparedness Safety Certificate' verified with a unique certification ID.",
                "QUIZ",
                Arrays.asList("Take Fire Safety Quiz", "Take Earthquake Preparedness Quiz", "Download & Print Safety Certificate"),
                Arrays.asList("Academic Office: +91 98765 00003")
            );
        }

        return new ChatResponse(
            "I'm here to assist with campus disaster preparedness. You can ask me specific questions like: 'What is the P.A.S.S. rule for fire extinguishers?', 'What should I do during an earthquake?', 'How do I report a blocked fire exit?', or 'How can I get my safety certificate?'.",
            "ASSISTANCE",
            Arrays.asList("Earthquake Safety", "Fire Evacuation & P.A.S.S.", "Grievance Incident Reporting", "First Aid Guidance"),
            Arrays.asList("National Emergency: 112", "Disaster Helpline: 108")
        );
    }
}
