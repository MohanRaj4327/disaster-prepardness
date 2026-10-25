package org.disaster.repository;

import java.util.*;
import org.disaster.model.*;

public class InitialDataSeeder {

    public static void seed(DataStore ds) {
        if (!ds.getAllUsers().isEmpty()) {
            return;
        }

        // 1. Users (Public / Citizen, Department Responder, Disaster Admin)
        User citizen = new User("usr_citizen", "Aarav Patel", "citizen@gov.in", "pass123", "+91 98765 00001", Role.CITIZEN, null, "Chennai Metro", "Plot 14, Velachery Bypass Road, Ward 114");
        User officer = new User("usr_officer", "Commander Rajesh Varma", "officer.ndrf@gov.in", "pass123", "+91 98765 00002", Role.DEPARTMENT_OFFICER, "DEP-NDRF", "State Disaster Control", "4th Battalion NDRF Base, Regional Command");
        User admin = new User("usr_admin", "Dr. K. Radhakrishnan (IAS)", "admin.disaster@gov.in", "pass123", "+91 98765 00003", Role.DISASTER_ADMIN, null, "State Emergency Operations Center", "Disaster Management Operations Center (DMOC), Secretariat");
        ds.saveUser(citizen);
        ds.saveUser(officer);
        ds.saveUser(admin);

        // 2. Specialized Disaster Response Departments
        Department depNdrf = new Department(
            "DEP-NDRF", "NDRF", "National & State Disaster Response Force",
            "Commander Rajesh Varma", "+91 98765 00002", "ndrf.response@gov.in",
            "1070 / 108", 24, "State-wide Search, Rescue, Water Inundation, Boat Evacuations"
        );

        Department depFire = new Department(
            "DEP-FIRE", "FIRE", "Fire & Emergency Rescue Services",
            "Chief Inspector Vikram Rathore", "+91 98765 43210", "fire.rescue@gov.in",
            "101", 18, "Urban Fire Suppression, Toxic Gas / Hazmat Isolation, Building Extractions"
        );

        Department depDrain = new Department(
            "DEP-DRAINAGE", "DRAINAGE", "Municipal Corporation Storm Drainage & Flood Relief",
            "Eng. Senthil Kumar", "+91 98765 43211", "drainage.relief@gov.in",
            "1913", 35, "Clearing Culverts, High-Capacity Heavy Motor Pumping, Flood Barrier Embankments"
        );

        Department depPower = new Department(
            "DEP-POWER", "POWER", "State Electricity Board (TNEB / Discom)",
            "Superintending Eng. Priya Nair", "+91 98765 43212", "power.grid@gov.in",
            "94987 94987", 12, "Emergency High-Voltage Power Cutoff, Submerged Transformer Isolation, Hospital Line Restoration"
        );

        Department depPwd = new Department(
            "DEP-PWD", "PWD", "Public Works Department & State Highways",
            "Chief Eng. Dr. Arun Prakash", "+91 98765 43213", "pwd.roads@gov.in",
            "1800-425-2425", 15, "Overpass & Bridge Structural Auditing, Landslide Road Clearance, Roadway Restoration"
        );

        Department depMed = new Department(
            "DEP-HEALTH", "HEALTH", "Emergency Medical & Trauma Ambulance Network",
            "Dr. Ananya Mukherjee", "+91 98765 43214", "health.triage@gov.in",
            "102 / 104", 40, "Mobile Critical Care Ambulances, Epidemic Pathogen Prevention, Field Medical Relief Camps"
        );

        Department depPolice = new Department(
            "DEP-POLICE", "POLICE", "Disaster Police & Traffic Evacuation Command",
            "ACP Meera Krishnan", "+91 98765 43215", "police.disaster@gov.in",
            "100 / 112", 50, "Evacuation Green Corridors, Perimeter Barricades, Riot & Anti-Looting Security"
        );

        ds.saveDepartment(depNdrf);
        ds.saveDepartment(depFire);
        ds.saveDepartment(depDrain);
        ds.saveDepartment(depPower);
        ds.saveDepartment(depPwd);
        ds.saveDepartment(depMed);
        ds.saveDepartment(depPolice);

        // 3. Public Relief Shelters & Safe Camps (High Ground)
        Shelter s1 = new Shelter(
            "SHL-01", "Nehru Stadium High-Ground Relief Complex", "Chennai Central",
            "Sydenhams Road, Periamet", 13.0836, 80.2764, 2500, 850,
            "Packaged Hot Food, Filtered Clean Water, 24/7 Trauma Doctors, Standby Power Generators, Dry Bedding",
            "Mr. M. Sridhar (Zonal Officer)", "+91 98401 11221"
        );

        Shelter s2 = new Shelter(
            "SHL-02", "YMCA Multi-Purpose Cyclone Shelter", "Royapettah",
            "Peter's Road, Royapettah", 13.0560, 80.2605, 1800, 620,
            "Nutritious Baby Food, First Aid Unit, Clean Sanitation, Solar Power Inverters",
            "Mrs. Kavitha Raman", "+91 98401 11222"
        );

        Shelter s3 = new Shelter(
            "SHL-03", "Anna University Community Flood Haven", "Guindy",
            "Sardar Patel Road, Guindy", 13.0102, 80.2355, 3000, 1200,
            "Medical Dispensary, High-Ground Safety, Satellite Communications, Childcare Station",
            "Prof. K. Venkatesh", "+91 98401 11223"
        );

        Shelter s4 = new Shelter(
            "SHL-04", "Kilpauk Medical College Emergency Refuge", "Kilpauk",
            "Poonamallee High Road, Kilpauk", 13.0800, 80.2430, 1200, 450,
            "Oxygen Concentrators, Emergency Dialysis Support, Triage Hospital Wards",
            "Dr. S. Sundaram", "+91 98401 11224"
        );

        Shelter s5 = new Shelter(
            "SHL-05", "Tambaram High-Ground Community Shelter", "Tambaram South",
            "Grand Southern Trunk Rd, Tambaram", 12.9249, 80.1284, 2000, 300,
            "Purified Drinking Water, Warm Blankets, Cooked Meal Packets, Animal/Pet Shelter Section",
            "Mr. R. Dinesh", "+91 98401 11225"
        );

        ds.saveShelter(s1);
        ds.saveShelter(s2);
        ds.saveShelter(s3);
        ds.saveShelter(s4);
        ds.saveShelter(s5);

        // 4. Public Disaster Grievances / Hazard Reports
        Complaint c1 = new Complaint(
            "GRV-2026-101",
            "usr_citizen",
            "Aarav Patel",
            "+91 98765 00001",
            "Flash Flood & Inundation",
            "Torrential Flash Flood Waterlogging (4.5 Feet Water) Trapping 40+ Resident Families",
            "Due to torrential monsoon downpour and canal breach, storm water has submerged the ground floor of residential apartments on Velachery Bypass Road. Water level is rapidly rising above 4 feet. Children, elderly citizens, and patients need immediate inflatable boat evacuation to high ground shelter.",
            "Chennai South",
            "Ward 114",
            "Velachery Bypass Road, near Guru Nanak College Gate 2",
            12.9759,
            80.2212,
            "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop&q=60",
            "IMMEDIATE_THREAT"
        );
        c1.setStatus("TEAMS_DISPATCHED");
        c1.setDepartmentId("DEP-NDRF");
        c1.setAssignedOfficer("Commander Rajesh Varma");
        c1.setOfficerPhone("+91 98765 00002");
        c1.setResolutionNotes("NDRF 4th Battalion Team Alpha dispatched with 4 motorized Gemini inflatable rescue boats, life jackets, and trauma medics. Evacuation underway towards Anna University Shelter.");

        Complaint c2 = new Complaint(
            "GRV-2026-102",
            "usr_citizen",
            "Aarav Patel",
            "+91 98765 00001",
            "Electrical Hazard & Downed Lines",
            "Submerged 11kV Power Transformer Sparking in Floodwater Outside Densely Populated Colony",
            "An 11kV street transformer pillar is partially submerged in water following torrential downpours. Loud electrical arcing and sparks observed continuously. High risk of fatal electrocution to pedestrians and rescue personnel.",
            "Chennai Central",
            "Ward 118",
            "T. Nagar, South Usman Road, near Ranganathan Street Junction",
            13.0382,
            80.2341,
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60",
            "IMMEDIATE_THREAT"
        );
        c2.setStatus("ASSIGNED");
        c2.setDepartmentId("DEP-POWER");
        c2.setAssignedOfficer("Superintending Eng. Priya Nair");
        c2.setOfficerPhone("+91 98765 43212");
        c2.setResolutionNotes("TNEB Grid sub-station alerted. Remote trip signal sent to isolate Feeder 4. Line repair team en route with insulation poles.");

        Complaint c3 = new Complaint(
            "GRV-2026-103",
            "usr_citizen",
            "S. Meenakshi",
            "+91 98400 55443",
            "Storm Drain & Culvert Blockage",
            "Massive Tree Debris & Construction Silt Completely Choking Main Stormwater Drain",
            "Stormwater canal outlet towards the river is 90% blocked by collapsed trees and plastic construction waste. Water backflowing onto main arterial highway, threatening to cut off ambulance access to the district hospital.",
            "Chennai West",
            "Ward 92",
            "G.S.T. Road, Guindy Flyover Underpass",
            12.9915,
            80.1985,
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60",
            "HIGH_ALERT"
        );
        c3.setStatus("VERIFIED");
        c3.setDepartmentId("DEP-DRAINAGE");
        c3.setAssignedOfficer("Eng. Senthil Kumar");
        c3.setOfficerPhone("+91 98765 43211");
        c3.setResolutionNotes("Heavy hydraulic excavator and 200 HP dewatering pumps allocated. Team scheduled to arrive in 30 minutes.");

        Complaint c4 = new Complaint(
            "GRV-2026-104",
            "usr_citizen",
            "Karthik Narayanan",
            "+91 99622 33441",
            "Structural Damage & Bridge Crack",
            "Deep Structural Shear Cracks and Concrete Spalling on Arterial Flyover Pillar 14",
            "Following high-velocity flood currents, visible vertical structural shear cracks observed across Pillar 14 of the river bridge. Vibration felt under heavy vehicular transit.",
            "Chennai North",
            "Ward 45",
            "Adyar River Bridge, Kotturpuram Connecting Spur",
            13.0674,
            80.2376,
            "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=500&auto=format&fit=crop&q=60",
            "HIGH_ALERT"
        );
        c4.setStatus("RESOLVED");
        c4.setDepartmentId("DEP-PWD");
        c4.setAssignedOfficer("Chief Eng. Dr. Arun Prakash");
        c4.setOfficerPhone("+91 98765 43213");
        c4.setResolutionNotes("PWD structural engineering inspection executed on Oct 24. Emergency epoxy grouting and steel jacketing completed. Traffic certified safe at 30 km/h.");
        c4.setFeedbackRating(5);
        c4.setFeedbackComments("Incredible speed by PWD engineers. Inspected within 2 hours and completed stabilization before the cyclone made landfall.");

        ds.saveComplaint(c1);
        ds.saveComplaint(c2);
        ds.saveComplaint(c3);
        ds.saveComplaint(c4);

        // Feedback
        Feedback fb1 = new Feedback("FB-01", "GRV-2026-104", "usr_citizen", "Karthik Narayanan", 5, "Incredible speed by PWD engineers. Inspected within 2 hours and completed stabilization before the cyclone made landfall.");
        ds.saveFeedback(fb1);

        // 5. Public Disaster Learning Modules
        LearningModule mFlood = new LearningModule(
            "MOD-PUB-01",
            "Urban Floods & Inundation: Public Survival Protocol",
            "NATURAL",
            "TUTORIAL",
            "Life-saving instructions during flash floods, urban waterlogging, electrical isolation, and safe evacuation to relief shelters.",
            "Urban flash floods strike rapidly when intense monsoon precipitation overwhelms municipal storm canals. If floodwaters enter your home: Turn off main electrical breaker immediately to prevent fatal electrocution. Disconnect gas cylinders. Never walk through flowing water deeper than 15 cm (6 inches) as swift currents easily knock adults off balance. Move vertically to upper floors or nearest designated High-Ground Relief Shelter. Drink only boiled or chlorine-purified water to prevent cholera and leptospirosis.",
            Arrays.asList(
                "Turn off the master electrical power breaker and main gas valve before water levels rise",
                "Move children, senior citizens, emergency Go-Bags, and essentials up to the highest floor",
                "Never walk or drive into submerged roads - hidden manholes and strong undercurrents cause drownings",
                "Drink strictly boiled, sealed, or chlorine-treated water",
                "Evacuate early along designated evacuation routes to nearest Open Relief Shelter"
            ),
            Arrays.asList(
                "DO NOT touch wet electrical switches, submerged appliances, or downed street poles",
                "DO NOT attempt to swim across urban storm canals or flooded subways",
                "DO NOT consume food or drinking water that has touched flood runoff"
            ),
            Arrays.asList("Kill master power breaker", "Pack Go-Bag", "Move to upper level", "Locate nearest safe shelter on Live Map"),
            "https://www.youtube.com/embed/5F2oN6S2_6A",
            "Inflatable Life Vest, High-Beam Waterproof Torch, Water Purification Tablets, Whistle, Dry Food Packs"
        );

        LearningModule mCyclone = new LearningModule(
            "MOD-PUB-02",
            "Severe Cyclones & High-Velocity Storm Surges",
            "NATURAL",
            "GUIDELINE",
            "Storm-proofing homes, window protection, family Go-Bag preparation, and survival during the eye of the storm.",
            "Tropical cyclones unleash gale-force winds exceeding 120 km/h and devastating sea surges. Prepare early: Trim tree branches near overhead power lines, tape or shutter glass windows to prevent flying shrapnel, store at least 3 days of non-perishable dry food, and charge all mobile devices and power banks. Beware the 'Eye of the Cyclone' - a deceptive lull in winds does not mean the storm is over; catastrophic reverse winds follow immediately.",
            Arrays.asList(
                "Keep battery-powered radios and charged mobile phones ready for official government sirens",
                "Reinforce roofs, tie down loose outdoor objects, and shutter all windows",
                "Keep emergency documents, IDs, and deeds sealed in waterproof zip pouches",
                "Stay in the strongest interior room of your home, away from glass windows and tin roofs"
            ),
            Arrays.asList(
                "DO NOT venture outside during the calm 'Eye of the Storm' - ferocious reverse winds hit within minutes",
                "DO NOT stand beneath hoardings, bill-boards, tin sheds, or large trees",
                "DO NOT spread unverified rumors on social media - rely strictly on official DMOC broadcasts"
            ),
            Arrays.asList("Board up windows", "Assemble 72-hour family Go-Bag", "Disconnect outdoor antennas", "Relocate to cyclone shelter if in coastal zone"),
            "https://www.youtube.com/embed/b0Vz7ZcZ6y4",
            "Battery Transistor Radio, Heavy Duty Duct Tape, First Aid Kit, Emergency Power Bank, Waterproof Document Pouch"
        );

        LearningModule mEarthquake = new LearningModule(
            "MOD-PUB-03",
            "Earthquake Safety: Drop, Cover, and Hold On",
            "NATURAL",
            "TUTORIAL",
            "Public survival during seismic tremors, safe open gathering zones, and avoiding structural debris.",
            "When seismic tremors strike, you have less than 5 seconds to protect your body. DROP to hands and knees to prevent being knocked over. Take COVER beneath a heavy desk or dining table. HOLD ON until shaking ceases completely. If outdoors, move immediately into open fields away from glass facades, electrical wires, and overpasses. Never use elevators during or after tremors.",
            Arrays.asList(
                "DROP immediately to hands and knees",
                "COVER your head and neck beneath a sturdy desk or table",
                "HOLD ON to your shelter until all shaking has stopped",
                "Once shaking terminates, evacuate via stairs to designated open grounds"
            ),
            Arrays.asList(
                "DO NOT use elevators under any circumstances",
                "DO NOT run outside while tremors are active due to falling facade glass and AC units",
                "DO NOT light candles or matches due to potential ruptured underground gas pipes"
            ),
            Arrays.asList("Drop to ground", "Take shelter beneath sturdy table", "Protect head & neck", "Check for gas leaks once tremors stop"),
            "https://www.youtube.com/embed/BLEPakj1Yv4",
            "Hard Hat, Heavy Duty Leather Work Gloves, Whistle, LED Flashlight, First Aid Kit"
        );

        LearningModule mFire = new LearningModule(
            "MOD-PUB-04",
            "Residential Fire Safety & P.A.S.S. Extinguisher Operation",
            "MAN_MADE",
            "VIDEO",
            "Handling LPG gas cylinder leaks, grease fires, smoke crawl survival, and portable extinguisher usage.",
            "Domestic fires and commercial cooking gas leaks pose extreme public danger. In case of LPG smell: NEVER flip any electrical switch on or off (the microscopic switch spark causes catastrophic explosion). Open all windows immediately, close regulator, and evacuate. If a building catches fire: crawl low beneath smoke where breathable oxygen remains within 30cm of the floor. Deploy fire extinguishers using P.A.S.S. (Pull, Aim, Squeeze, Sweep).",
            Arrays.asList(
                "Feel door handles with the back of your hand before opening; if hot, choose an alternative exit",
                "Crawl low under smoke on hands and knees keeping head low",
                "If clothes catch fire: STOP, DROP, and ROLL to smother flames",
                "Deploy ABC dry chemical extinguisher at the base of the fire"
            ),
            Arrays.asList(
                "DO NOT turn electrical switches ON or OFF if you smell cooking gas / LPG",
                "DO NOT pour water on electrical fires or burning cooking oil (grease fire explodes with water)",
                "DO NOT use elevators during building fires"
            ),
            Arrays.asList("Close gas regulator valve", "Crawl under smoke layer", "Pull fire alarm", "Evacuate upwind to assembly field"),
            "https://www.youtube.com/embed/fire_safety",
            "ABC Dry Chemical Extinguisher, Fire Blanket, Wet Cotton Cloths, Smoke Mask"
        );

        LearningModule mStampede = new LearningModule(
            "MOD-PUB-05",
            "Crowd Dynamics & Stampede Surge Avoidance",
            "MAN_MADE",
            "ENCYCLOPEDIA",
            "Maintaining posture, boxer stance defense, crowd perimeter movement during high-density public surges.",
            "High-density events in transit stations, religious festivals, stadiums, or narrow pedestrian bridges can trigger lethal crowd crushes. Maintain a boxer stance (one foot forward, arms bent with hands protecting ribs and chest) to preserve lung volume. Never fight directly against the crowd current; move diagonally across until reaching the perimeter.",
            Arrays.asList(
                "Keep your arms bent at your chest like a boxer to preserve breathing space",
                "Keep feet firmly planted in a stable staggered stance",
                "Move diagonally with the flow toward edges or columns rather than pushing straight ahead",
                "If you drop an item, NEVER bend down to retrieve it"
            ),
            Arrays.asList(
                "DO NOT resist the surge directly; moving straight against the wave will cause crush injuries",
                "DO NOT scream or panic; conserve oxygen and stay focused on balance",
                "DO NOT push others ahead of you"
            ),
            Arrays.asList("Adopt boxer stance", "Navigate diagonally to perimeter", "Assist fallen individuals immediately", "Reach open outdoor space"),
            "https://www.youtube.com/embed/crowd_safety",
            "Megaphone, Crowd Control Barriers, High-Visibility Vest, Trauma Pack"
        );

        ds.saveLearningModule(mFlood);
        ds.saveLearningModule(mCyclone);
        ds.saveLearningModule(mEarthquake);
        ds.saveLearningModule(mFire);
        ds.saveLearningModule(mStampede);

        // 6. Quizzes
        List<Quiz.Question> publicQuizQuestions = Arrays.asList(
            new Quiz.Question("Q1", "If you smell a strong LPG cooking gas leak inside your home, what is the most critical rule?",
                Arrays.asList(
                    "Switch on the exhaust fan immediately to blow the gas out",
                    "Do NOT touch any electrical switches ON or OFF; open all windows and close regulator",
                    "Light a matchstick to see where the leak is bubbling",
                    "Turn on the AC to cool down the room"
                ), 1, "Flipping an electrical switch generates a microscopic electrical spark inside the contact points which instantly detonates concentrated LPG gas air mixtures."),
            new Quiz.Question("Q2", "When driving a car during intense flash flooding, how deep does flowing water need to be to float and sweep away a vehicle?",
                Arrays.asList(
                    "Only when water reaches the roof of the car",
                    "Just 30 to 60 cm (1 to 2 feet) of swift flowing water",
                    "At least 2 meters (6 feet)",
                    "Water cannot sweep away a heavy SUV"
                ), 1, "Only 30 cm (12 inches) of moving water can float most small cars, and 60 cm (24 inches) can sweep away trucks and SUVs."),
            new Quiz.Question("Q3", "What does the 'P.A.S.S.' rule stand for when operating a portable fire extinguisher?",
                Arrays.asList(
                    "Push, Alert, Sound, Sprint",
                    "Pull pin, Aim at base of fire, Squeeze lever, Sweep side to side",
                    "Protect, Aim, Spray, Secure",
                    "Press trigger, Angle nozzle, Strike fire, Stop"
                ), 1, "P.A.S.S. is the universal technique: Pull lock pin, Aim at base of fire, Squeeze discharge handle, and Sweep across the burning surface."),
            new Quiz.Question("Q4", "During a severe cyclone, what is the 'Eye of the Storm' and why is it dangerous?",
                Arrays.asList(
                    "A wave that hits the shore first",
                    "A temporary deceptive calm period in the storm center, followed immediately by ferocious reverse gale winds",
                    "The cloud formation seen on satellite radar",
                    "The final end of the hurricane"
                ), 1, "The Eye of the Cyclone has calm winds and clearing skies, tricking citizens into venturing outdoors right before the back half of the storm hits with opposite hurricane-force fury."),
            new Quiz.Question("Q5", "If caught in a dense crowd surge or stampede, what defensive posture preserves your chest cavity to breathe?",
                Arrays.asList(
                    "Lie flat on the floor face down",
                    "Boxer Stance: Feet staggered, arms bent in front of chest to maintain lung expansion space",
                    "Hold hands high up in the air above your head",
                    "Sprint straight forward against the people ahead"
                ), 1, "The boxer stance protects your ribs and sternum from being crushed inward by crowd pressure, ensuring your lungs can expand to take oxygen.")
        );

        Quiz qPublic = new Quiz("QUIZ-PUB-01", "Citizen Public Disaster Preparedness Certification", "MULTI_HAZARD", "ALL_CITIZENS", 80, publicQuizQuestions);
        ds.saveQuiz(qPublic);

        QuizResult qr = new QuizResult("QR-001", "usr_citizen", "Aarav Patel", "QUIZ-PUB-01", "Citizen Public Disaster Preparedness Certification", 5, 5, true, "PUB-CERT-2026-9021");
        ds.saveQuizResult(qr);

        // 7. Active Emergency Siren Alert
        EmergencyAlert redAlert = new EmergencyAlert(
            "ALERT-RED-01",
            "RED ALERT: SEVERE CYCLONIC STORM 'VARUNA' APPROACHING COAST",
            "IMD & Disaster Management Authority Alert: Severe Cyclone 'VARUNA' will make landfall within 18 hours with 130 km/h wind gusts and heavy storm surges. Public in coastal and low-lying zones must evacuate immediately to designated High-Ground Relief Shelters (Nehru Stadium, YMCA, Anna University). Avoid travel, keep emergency kits ready.",
            "CRITICAL",
            "CYCLONE",
            "ALL_CITIZENS",
            "State Relief Commissioner Dr. K. Radhakrishnan (IAS)"
        );
        ds.saveAlert(redAlert);
    }
}
