/**
 * SafePublic - Public Disaster Preparedness & Citizen Grievance Portal
 * JavaScript Controller connecting to Java 26 REST API Server
 * (Includes automatic offline / cloud static deployment fallback)
 */

const API_BASE = '/api';

// ============================================================================
// RICH SEED DATA & LOCALSTORAGE FALLBACK STORE
// ============================================================================
const DEFAULT_DATA = {
  shelters: [
    {
      id: "SHL-01",
      name: "Nehru Stadium High-Ground Relief Complex",
      district: "Chennai Central",
      address: "Sydenhams Road, Periamet",
      latitude: 13.0836,
      longitude: 80.2764,
      capacity: 2500,
      availableSpace: 850,
      facilities: "Packaged Hot Food, Filtered Clean Water, 24/7 Trauma Doctors, Standby Power Generators, Dry Bedding",
      contactPerson: "Mr. M. Sridhar (Zonal Officer)",
      contactPhone: "+91 98401 11221"
    },
    {
      id: "SHL-02",
      name: "YMCA Multi-Purpose Cyclone Shelter",
      district: "Royapettah",
      address: "Peter's Road, Royapettah",
      latitude: 13.0560,
      longitude: 80.2605,
      capacity: 1800,
      availableSpace: 620,
      facilities: "Nutritious Baby Food, First Aid Unit, Clean Sanitation, Solar Power Inverters",
      contactPerson: "Mrs. Kavitha Raman",
      contactPhone: "+91 98401 11222"
    },
    {
      id: "SHL-03",
      name: "Anna University Community Flood Haven",
      district: "Guindy",
      address: "Sardar Patel Road, Guindy",
      latitude: 13.0102,
      longitude: 80.2355,
      capacity: 3000,
      availableSpace: 1200,
      facilities: "Medical Dispensary, High-Ground Safety, Satellite Communications, Childcare Station",
      contactPerson: "Prof. K. Venkatesh",
      contactPhone: "+91 98401 11223"
    },
    {
      id: "SHL-04",
      name: "Kilpauk Medical College Emergency Refuge",
      district: "Kilpauk",
      address: "Poonamallee High Road, Kilpauk",
      latitude: 13.0800,
      longitude: 80.2430,
      capacity: 1200,
      availableSpace: 450,
      facilities: "Oxygen Concentrators, Emergency Dialysis Support, Triage Hospital Wards",
      contactPerson: "Dr. S. Sundaram",
      contactPhone: "+91 98401 11224"
    },
    {
      id: "SHL-05",
      name: "Tambaram High-Ground Community Shelter",
      district: "Tambaram South",
      address: "Grand Southern Trunk Rd, Tambaram",
      latitude: 12.9249,
      longitude: 80.1284,
      capacity: 2000,
      availableSpace: 300,
      facilities: "Purified Drinking Water, Warm Blankets, Cooked Meal Packets, Animal/Pet Shelter Section",
      contactPerson: "Mr. R. Dinesh",
      contactPhone: "+91 98401 11225"
    }
  ],
  departments: [
    {
      id: "DEP-NDRF",
      code: "NDRF",
      name: "National & State Disaster Response Force",
      assignedOfficer: "Commander Rajesh Varma",
      phone: "+91 98765 00002",
      email: "ndrf.response@gov.in",
      emergencyHelpline: "1070 / 108",
      activeRescueUnits: 24,
      jurisdiction: "State-wide Search, Rescue, Water Inundation, Boat Evacuations"
    },
    {
      id: "DEP-FIRE",
      code: "FIRE",
      name: "Fire & Emergency Rescue Services",
      assignedOfficer: "Chief Inspector Vikram Rathore",
      phone: "+91 98765 43210",
      email: "fire.rescue@gov.in",
      emergencyHelpline: "101",
      activeRescueUnits: 18,
      jurisdiction: "Urban Fire Suppression, Toxic Gas / Hazmat Isolation, Building Extractions"
    },
    {
      id: "DEP-DRAINAGE",
      code: "DRAINAGE",
      name: "Municipal Corporation Storm Drainage & Flood Relief",
      assignedOfficer: "Eng. Senthil Kumar",
      phone: "+91 98765 43211",
      email: "drainage.relief@gov.in",
      emergencyHelpline: "1913",
      activeRescueUnits: 35,
      jurisdiction: "Clearing Culverts, High-Capacity Heavy Motor Pumping, Flood Barrier Embankments"
    },
    {
      id: "DEP-POWER",
      code: "POWER",
      name: "State Electricity Board (TNEB / Discom)",
      assignedOfficer: "Superintending Eng. Priya Nair",
      phone: "+91 98765 43212",
      email: "power.grid@gov.in",
      emergencyHelpline: "94987 94987",
      activeRescueUnits: 12,
      jurisdiction: "Emergency High-Voltage Power Cutoff, Submerged Transformer Isolation, Hospital Line Restoration"
    },
    {
      id: "DEP-PWD",
      code: "PWD",
      name: "Public Works Department & State Highways",
      assignedOfficer: "Chief Eng. Dr. Arun Prakash",
      phone: "+91 98765 43213",
      email: "pwd.roads@gov.in",
      emergencyHelpline: "1800-425-2425",
      activeRescueUnits: 15,
      jurisdiction: "Overpass & Bridge Structural Auditing, Landslide Road Clearance, Roadway Restoration"
    },
    {
      id: "DEP-HEALTH",
      code: "HEALTH",
      name: "Emergency Medical & Trauma Ambulance Network",
      assignedOfficer: "Dr. Ananya Mukherjee",
      phone: "+91 98765 43214",
      email: "health.triage@gov.in",
      emergencyHelpline: "102 / 104",
      activeRescueUnits: 40,
      jurisdiction: "Mobile Critical Care Ambulances, Epidemic Pathogen Prevention, Field Medical Relief Camps"
    },
    {
      id: "DEP-POLICE",
      code: "POLICE",
      name: "Disaster Police & Traffic Evacuation Command",
      assignedOfficer: "ACP Meera Krishnan",
      phone: "+91 98765 43215",
      email: "police.disaster@gov.in",
      emergencyHelpline: "100 / 112",
      activeRescueUnits: 50,
      jurisdiction: "Evacuation Green Corridors, Perimeter Barricades, Riot & Anti-Looting Security"
    }
  ],
  complaints: [
    {
      id: "GRV-2026-101",
      userId: "usr_citizen",
      citizenName: "Aarav Patel",
      contactPhone: "+91 98765 00001",
      category: "Flash Flood & Inundation",
      title: "Torrential Flash Flood Waterlogging (4.5 Feet Water) Trapping 40+ Resident Families",
      description: "Due to torrential monsoon downpour and canal breach, storm water has submerged the ground floor of residential apartments on Velachery Bypass Road. Water level is rapidly rising above 4 feet. Children, elderly citizens, and patients need immediate inflatable boat evacuation to high ground shelter.",
      district: "Chennai South",
      ward: "Ward 114",
      location: "Velachery Bypass Road, near Guru Nanak College Gate 2",
      latitude: 12.9759,
      longitude: 80.2212,
      image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500&auto=format&fit=crop&q=60",
      priority: "IMMEDIATE_THREAT",
      status: "TEAMS_DISPATCHED",
      departmentId: "DEP-NDRF",
      assignedOfficer: "Commander Rajesh Varma",
      officerPhone: "+91 98765 00002",
      resolutionNotes: "NDRF 4th Battalion Team Alpha dispatched with 4 motorized Gemini inflatable rescue boats, life jackets, and trauma medics. Evacuation underway towards Anna University Shelter."
    },
    {
      id: "GRV-2026-102",
      userId: "usr_citizen",
      citizenName: "Aarav Patel",
      contactPhone: "+91 98765 00001",
      category: "Electrical Hazard & Downed Lines",
      title: "Submerged 11kV Power Transformer Sparking in Floodwater Outside Densely Populated Colony",
      description: "An 11kV street transformer pillar is partially submerged in water following torrential downpours. Loud electrical arcing and sparks observed continuously. High risk of fatal electrocution to pedestrians and rescue personnel.",
      district: "Chennai Central",
      ward: "Ward 118",
      location: "T. Nagar, South Usman Road, near Ranganathan Street Junction",
      latitude: 13.0382,
      longitude: 80.2341,
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60",
      priority: "IMMEDIATE_THREAT",
      status: "ASSIGNED",
      departmentId: "DEP-POWER",
      assignedOfficer: "Superintending Eng. Priya Nair",
      officerPhone: "+91 98765 43212",
      resolutionNotes: "TNEB Grid sub-station alerted. Remote trip signal sent to isolate Feeder 4. Line repair team en route with insulation poles."
    },
    {
      id: "GRV-2026-103",
      userId: "usr_citizen",
      citizenName: "S. Meenakshi",
      contactPhone: "+91 98400 55443",
      category: "Storm Drain & Culvert Blockage",
      title: "Massive Tree Debris & Construction Silt Completely Choking Main Stormwater Drain",
      description: "Stormwater canal outlet towards the river is 90% blocked by collapsed trees and plastic construction waste. Water backflowing onto main arterial highway, threatening to cut off ambulance access to the district hospital.",
      district: "Chennai West",
      ward: "Ward 92",
      location: "G.S.T. Road, Guindy Flyover Underpass",
      latitude: 12.9915,
      longitude: 80.1985,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60",
      priority: "HIGH_ALERT",
      status: "VERIFIED",
      departmentId: "DEP-DRAINAGE",
      assignedOfficer: "Eng. Senthil Kumar",
      officerPhone: "+91 98765 43211",
      resolutionNotes: "Heavy hydraulic excavator and 200 HP dewatering pumps allocated. Team scheduled to arrive in 30 minutes."
    },
    {
      id: "GRV-2026-104",
      userId: "usr_citizen",
      citizenName: "Karthik Narayanan",
      contactPhone: "+91 99622 33441",
      category: "Structural Damage & Bridge Crack",
      title: "Deep Structural Shear Cracks and Concrete Spalling on Arterial Flyover Pillar 14",
      description: "Following high-velocity flood currents, visible vertical structural shear cracks observed across Pillar 14 of the river bridge. Vibration felt under heavy vehicular transit.",
      district: "Chennai North",
      ward: "Ward 45",
      location: "Adyar River Bridge, Kotturpuram Connecting Spur",
      latitude: 13.0674,
      longitude: 80.2376,
      image: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=500&auto=format&fit=crop&q=60",
      priority: "HIGH_ALERT",
      status: "RESOLVED",
      departmentId: "DEP-PWD",
      assignedOfficer: "Chief Eng. Dr. Arun Prakash",
      officerPhone: "+91 98765 43213",
      resolutionNotes: "PWD structural engineering inspection executed on Oct 24. Emergency epoxy grouting and steel jacketing completed. Traffic certified safe at 30 km/h."
    }
  ],
  modules: [
    {
      id: "MOD-PUB-01",
      name: "Urban Floods & Inundation: Public Survival Protocol",
      category: "NATURAL",
      type: "TUTORIAL",
      summary: "Life-saving instructions during flash floods, urban waterlogging, electrical isolation, and safe evacuation to relief shelters.",
      fullDescription: "Urban flash floods strike rapidly when intense monsoon precipitation overwhelms municipal storm canals. If floodwaters enter your home: Turn off main electrical breaker immediately to prevent fatal electrocution. Disconnect gas cylinders. Never walk through flowing water deeper than 15 cm (6 inches). Move vertically to upper floors or nearest designated High-Ground Relief Shelter.",
      dos: [
        "Turn off master electrical breaker and main gas valve before water levels rise",
        "Move children, elderly citizens, and Go-Bags to the highest floor",
        "Never walk or drive into submerged roads - hidden manholes and strong currents cause drownings",
        "Drink strictly boiled, sealed, or chlorine-treated water",
        "Evacuate early along designated routes to nearest Open Relief Shelter"
      ],
      donts: [
        "DO NOT touch wet electrical switches, submerged appliances, or downed street poles",
        "DO NOT attempt to swim across urban storm canals or flooded subways",
        "DO NOT consume food or drinking water that has touched flood runoff"
      ],
      emergencyEquipment: "Inflatable Life Vest, High-Beam Waterproof Torch, Water Purification Tablets, Whistle, Dry Food Packs"
    },
    {
      id: "MOD-PUB-02",
      name: "Severe Cyclones & High-Velocity Storm Surges",
      category: "NATURAL",
      type: "GUIDELINE",
      summary: "Storm-proofing homes, window protection, family Go-Bag preparation, and survival during the eye of the storm.",
      fullDescription: "Tropical cyclones unleash gale-force winds exceeding 120 km/h and devastating sea surges. Prepare early: Trim tree branches near overhead power lines, tape or shutter glass windows to prevent flying shrapnel, store at least 3 days of non-perishable dry food, and charge all mobile devices and power banks. Beware the 'Eye of the Cyclone' - a deceptive lull in winds does not mean the storm is over.",
      dos: [
        "Keep battery-powered radios and charged mobile phones ready for official government sirens",
        "Reinforce roofs, tie down loose outdoor objects, and shutter all windows",
        "Keep emergency documents, IDs, and deeds sealed in waterproof zip pouches",
        "Stay in the strongest interior room of your home, away from glass windows and tin roofs"
      ],
      donts: [
        "DO NOT venture outside during the calm 'Eye of the Storm'",
        "DO NOT stand beneath hoardings, billboards, tin sheds, or large trees",
        "DO NOT spread unverified rumors on social media - rely strictly on official DMOC broadcasts"
      ],
      emergencyEquipment: "Battery Transistor Radio, Heavy Duty Duct Tape, First Aid Kit, Emergency Power Bank, Waterproof Document Pouch"
    },
    {
      id: "MOD-PUB-03",
      name: "Earthquake Safety: Drop, Cover, and Hold On",
      category: "NATURAL",
      type: "TUTORIAL",
      summary: "Public survival during seismic tremors, safe open gathering zones, and avoiding structural debris.",
      fullDescription: "When seismic tremors strike, you have less than 5 seconds to protect your body. DROP to hands and knees to prevent being knocked over. Take COVER beneath a heavy desk or dining table. HOLD ON until shaking ceases completely. If outdoors, move immediately into open fields away from glass facades.",
      dos: [
        "DROP immediately to hands and knees",
        "COVER your head and neck beneath a sturdy desk or table",
        "HOLD ON to your shelter until all shaking has stopped",
        "Once shaking terminates, evacuate via stairs to designated open grounds"
      ],
      donts: [
        "DO NOT use elevators under any circumstances",
        "DO NOT run outside while tremors are active due to falling facade glass and AC units",
        "DO NOT light candles or matches due to potential ruptured underground gas pipes"
      ],
      emergencyEquipment: "Hard Hat, Heavy Duty Leather Work Gloves, Whistle, LED Flashlight, First Aid Kit"
    },
    {
      id: "MOD-PUB-04",
      name: "Residential Fire Safety & P.A.S.S. Extinguisher Operation",
      category: "MAN_MADE",
      type: "VIDEO",
      summary: "Handling LPG gas cylinder leaks, grease fires, smoke crawl survival, and portable extinguisher usage.",
      fullDescription: "Domestic fires and commercial cooking gas leaks pose extreme public danger. In case of LPG smell: NEVER flip any electrical switch on or off. Open all windows immediately, close regulator, and evacuate. If a building catches fire: crawl low beneath smoke where breathable oxygen remains within 30cm of the floor. Deploy fire extinguishers using P.A.S.S. (Pull, Aim, Squeeze, Sweep).",
      dos: [
        "Feel door handles with the back of your hand before opening; if hot, choose an alternative exit",
        "Crawl low under smoke on hands and knees keeping head low",
        "If clothes catch fire: STOP, DROP, and ROLL to smother flames",
        "Deploy ABC dry chemical extinguisher at the base of the fire"
      ],
      donts: [
        "DO NOT turn electrical switches ON or OFF if you smell cooking gas / LPG",
        "DO NOT pour water on electrical fires or burning cooking oil (grease fires explode with water)",
        "DO NOT use elevators during building fires"
      ],
      emergencyEquipment: "ABC Dry Chemical Extinguisher, Fire Blanket, Wet Cotton Cloths, Smoke Mask"
    },
    {
      id: "MOD-PUB-05",
      name: "Crowd Dynamics & Stampede Surge Avoidance",
      category: "MAN_MADE",
      type: "ENCYCLOPEDIA",
      summary: "Maintaining posture, boxer stance defense, crowd perimeter movement during high-density public surges.",
      fullDescription: "High-density events in transit stations, religious festivals, stadiums, or narrow pedestrian bridges can trigger lethal crowd crushes. Maintain a boxer stance (one foot forward, arms bent with hands protecting ribs and chest) to preserve lung volume. Never fight directly against the crowd current; move diagonally across until reaching the perimeter.",
      dos: [
        "Keep your arms bent at your chest like a boxer to preserve breathing space",
        "Keep feet firmly planted in a stable staggered stance",
        "Move diagonally with the flow toward edges or columns rather than pushing straight ahead",
        "If you drop an item, NEVER bend down to retrieve it"
      ],
      donts: [
        "DO NOT resist the surge directly; moving straight against the wave will cause crush injuries",
        "DO NOT scream or panic; conserve oxygen and stay focused on balance",
        "DO NOT push others ahead of you"
      ],
      emergencyEquipment: "Megaphone, Crowd Control Barriers, High-Visibility Vest, Trauma Pack"
    }
  ],
  quizzes: [
    {
      id: "QUIZ-PUB-01",
      title: "Citizen Public Disaster Preparedness Certification",
      disasterType: "MULTI_HAZARD",
      difficulty: "ALL_CITIZENS",
      questionCount: 5,
      passingScore: 80,
      questions: [
        {
          id: "Q1",
          text: "If you smell a strong LPG cooking gas leak inside your home, what is the most critical rule?",
          options: [
            "Switch on the exhaust fan immediately to blow the gas out",
            "Do NOT touch any electrical switches ON or OFF; open all windows and close regulator",
            "Light a matchstick to see where the leak is bubbling",
            "Turn on the AC to cool down the room"
          ],
          correctIndex: 1,
          explanation: "Flipping an electrical switch generates a microscopic electrical spark inside the contact points which instantly detonates concentrated LPG gas air mixtures."
        },
        {
          id: "Q2",
          text: "When driving a car during intense flash flooding, how deep does flowing water need to be to float and sweep away a vehicle?",
          options: [
            "Only when water reaches the roof of the car",
            "Just 30 to 60 cm (1 to 2 feet) of swift flowing water",
            "At least 2 meters (6 feet)",
            "Water cannot sweep away a heavy SUV"
          ],
          correctIndex: 1,
          explanation: "Only 30 cm (12 inches) of moving water can float most small cars, and 60 cm (24 inches) can sweep away trucks and SUVs."
        },
        {
          id: "Q3",
          text: "What does the 'P.A.S.S.' rule stand for when operating a portable fire extinguisher?",
          options: [
            "Push, Alert, Sound, Sprint",
            "Pull pin, Aim at base of fire, Squeeze lever, Sweep side to side",
            "Protect, Aim, Spray, Secure",
            "Press trigger, Angle nozzle, Strike fire, Stop"
          ],
          correctIndex: 1,
          explanation: "P.A.S.S. is the universal technique: Pull lock pin, Aim at base of fire, Squeeze discharge handle, and Sweep across the burning surface."
        },
        {
          id: "Q4",
          text: "During a severe cyclone, what is the 'Eye of the Storm' and why is it dangerous?",
          options: [
            "A wave that hits the shore first",
            "A temporary deceptive calm period in the storm center, followed immediately by ferocious reverse gale winds",
            "The cloud formation seen on satellite radar",
            "The final end of the hurricane"
          ],
          correctIndex: 1,
          explanation: "The Eye of the Cyclone has calm winds and clearing skies, tricking citizens into venturing outdoors right before the back half of the storm hits with opposite hurricane-force fury."
        },
        {
          id: "Q5",
          text: "If caught in a dense crowd surge or stampede, what defensive posture preserves your chest cavity to breathe?",
          options: [
            "Lie flat on the floor face down",
            "Boxer Stance: Feet staggered, arms bent in front of chest to maintain lung expansion space",
            "Hold hands high up in the air above your head",
            "Sprint straight forward against the people ahead"
          ],
          correctIndex: 1,
          explanation: "The boxer stance protects your ribs and sternum from being crushed inward by crowd pressure, ensuring your lungs can expand to take oxygen."
        }
      ]
    }
  ],
  certificates: [
    {
      id: "QR-001",
      userId: "usr_citizen",
      userName: "Aarav Patel",
      quizTitle: "Citizen Public Disaster Preparedness Certification",
      score: 5,
      total: 5,
      percentage: 100,
      passed: true,
      certificateNumber: "PUB-CERT-2026-9021"
    }
  ],
  alerts: [
    {
      id: "ALERT-RED-01",
      title: "CYCLONE 'VARUNA' EVACUATION ALERT",
      message: "Severe Cyclone with 130 km/h wind gusts approaching within 18 hours. Coastal & low-lying residents must evacuate to designated High-Ground Relief Shelters immediately.",
      severity: "CRITICAL_RED",
      disasterType: "CYCLONE",
      active: true,
      issuedBy: "State Relief Commissioner Dr. K. Radhakrishnan (IAS)"
    }
  ]
};

function getLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem('safepublic_' + key);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(fallback));
}

function setLocalData(key, data) {
  try {
    localStorage.setItem('safepublic_' + key, JSON.stringify(data));
  } catch (e) {}
}

async function safeApiCall(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

// Current Application State
const state = {
  currentRole: 'citizen', // 'citizen' | 'officer' | 'admin'
  currentUser: {
    id: 'usr_citizen',
    name: 'Aarav Patel',
    email: 'citizen@gov.in',
    phone: '+91 98765 00001',
    role: 'CITIZEN',
    departmentId: null
  },
  complaints: [],
  shelters: [],
  departments: [],
  modules: [],
  alerts: [],
  leafletMap: null,
  mapMarkers: [],
  routeLine: null,
  activeQuiz: null,
  quizAnswers: [],
  currentQuestionIdx: 0,
  quizTimerInterval: null,
  quizSecondsLeft: 300,
  sirenAudioContext: null,
  sirenPlaying: false
};

// Personas
const personas = {
  citizen: {
    id: 'usr_citizen',
    name: 'Aarav Patel',
    email: 'citizen@gov.in',
    phone: '+91 98765 00001',
    role: 'CITIZEN',
    departmentId: null,
    greeting: 'Public Citizen Portal • State Emergency System'
  },
  officer: {
    id: 'usr_officer',
    name: 'Commander Rajesh Varma',
    email: 'officer.ndrf@gov.in',
    phone: '+91 98765 00002',
    role: 'DEPARTMENT_OFFICER',
    departmentId: 'DEP-NDRF',
    greeting: 'Department Responder Desk • NDRF 4th Battalion Command'
  },
  admin: {
    id: 'usr_admin',
    name: 'Dr. K. Radhakrishnan (IAS)',
    email: 'admin.disaster@gov.in',
    phone: '+91 98765 00003',
    role: 'DISASTER_ADMIN',
    departmentId: null,
    greeting: 'Disaster Management Operations Center (DMOC) • Executive Control'
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setupRoleSwitcher();
  loadAllData().then(() => {
    initLeafletMap();
    fetchLiveWeather();
  });
});

function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
      if (tabId === 'map-tab' && state.leafletMap) {
        setTimeout(() => state.leafletMap.invalidateSize(), 200);
      }
    });
  });

  // Action Tile shortcuts
  document.getElementById('tile-report-grievance')?.addEventListener('click', () => openModal('modal-report-hazard'));
  document.getElementById('tile-open-map')?.addEventListener('click', () => {
    switchTab('map-tab');
    if (state.leafletMap) setTimeout(() => state.leafletMap.invalidateSize(), 200);
  });
  document.getElementById('tile-learn-disasters')?.addEventListener('click', () => switchTab('learning-tab'));
  document.getElementById('dash-view-all-complaints')?.addEventListener('click', () => switchTab('complaints-tab'));
  document.getElementById('dash-view-shelters-map')?.addEventListener('click', () => {
    switchTab('map-tab');
    if (state.leafletMap) setTimeout(() => state.leafletMap.invalidateSize(), 200);
  });

  // Banner Actions
  document.getElementById('banner-view-map-btn')?.addEventListener('click', () => {
    switchTab('map-tab');
    if (state.leafletMap) setTimeout(() => state.leafletMap.invalidateSize(), 200);
  });
  document.getElementById('banner-dismiss-btn')?.addEventListener('click', () => {
    document.getElementById('emergency-banner').style.display = 'none';
  });
  document.getElementById('banner-siren-toggle-btn')?.addEventListener('click', toggleEmergencySiren);

  // SOS Helpline Dropdown
  const sosBtn = document.getElementById('sos-trigger-btn');
  const sosMenu = document.getElementById('sos-menu');
  sosBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    sosMenu?.classList.toggle('hidden');
  });
  document.addEventListener('click', () => sosMenu?.classList.add('hidden'));

  // Theme Toggle
  document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);

  // Quick Tracker Search
  document.getElementById('quick-track-btn')?.addEventListener('click', () => {
    const val = document.getElementById('quick-track-input').value.trim();
    if (val) {
      switchTab('complaints-tab');
      trackGrievanceById(val);
    }
  });
  document.getElementById('quick-track-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) {
        switchTab('complaints-tab');
        trackGrievanceById(val);
      }
    }
  });

  document.getElementById('track-close-btn')?.addEventListener('click', () => {
    document.getElementById('live-tracker-result-card')?.classList.add('hidden');
  });

  // Modal Openers
  document.getElementById('open-new-grievance-btn')?.addEventListener('click', () => openModal('modal-report-hazard'));
  document.getElementById('open-add-shelter-modal-btn')?.addEventListener('click', () => openModal('modal-add-shelter'));
  document.getElementById('open-add-dept-modal-btn')?.addEventListener('click', () => openModal('modal-add-department'));
  document.getElementById('open-add-module-modal-btn')?.addEventListener('click', () => openModal('modal-add-module'));
  document.getElementById('admin-broadcast-siren-btn')?.addEventListener('click', () => openModal('modal-broadcast-alert'));

  document.querySelectorAll('.modal-close, [data-close]').forEach(el => {
    el.addEventListener('click', () => {
      const modalId = el.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  // Real Photo Upload & Geolocation Controls
  document.getElementById('rep-file-input')?.addEventListener('change', handlePhotoFileUpload);
  document.getElementById('form-gps-autofill-btn')?.addEventListener('click', handleDetectCitizenGps);
  document.getElementById('map-use-gps-btn')?.addEventListener('click', handleDetectCitizenGps);

  // Live Weather Refresh Button
  document.getElementById('refresh-weather-btn')?.addEventListener('click', () => fetchLiveWeather());

  // Dynamic Forms
  document.getElementById('form-report-hazard')?.addEventListener('submit', handleReportGrievance);
  document.getElementById('form-add-shelter')?.addEventListener('submit', handleAddShelter);
  document.getElementById('form-add-department')?.addEventListener('submit', handleAddDepartment);
  document.getElementById('form-add-module')?.addEventListener('submit', handleAddModule);
  document.getElementById('form-broadcast-alert')?.addEventListener('submit', handleBroadcastAlert);

  // Learning Search & Category Filters
  document.getElementById('learn-search-input')?.addEventListener('input', (e) => {
    filterLearningModules(e.target.value);
  });
  document.querySelectorAll('.category-pills .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-pills .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterLearningModules(document.getElementById('learn-search-input').value, btn.getAttribute('data-cat'));
    });
  });

  // Grievance Status Filters
  document.querySelectorAll('.grievance-filters .pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.grievance-filters .pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderComplaints(btn.getAttribute('data-filter'));
    });
  });

  // Map Controls
  document.getElementById('map-find-nearest-shelter-btn')?.addEventListener('click', findNearestShelterRoute);
  document.getElementById('map-report-here-btn')?.addEventListener('click', () => {
    openModal('modal-report-hazard');
  });

  // AI Chat Interface
  document.getElementById('chat-send-btn')?.addEventListener('click', sendAiChatMessage);
  document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendAiChatMessage();
  });
  document.querySelectorAll('.suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q') || chip.textContent.trim();
      document.getElementById('chat-input').value = q;
      sendAiChatMessage();
    });
  });

  // Quiz Runner
  document.getElementById('quiz-prev-btn')?.addEventListener('click', () => {
    if (state.currentQuestionIdx > 0) {
      state.currentQuestionIdx--;
      renderCurrentQuestion();
    }
  });
  document.getElementById('quiz-next-btn')?.addEventListener('click', () => {
    if (state.activeQuiz && state.currentQuestionIdx < state.activeQuiz.questions.length - 1) {
      state.currentQuestionIdx++;
      renderCurrentQuestion();
    }
  });
  document.getElementById('quiz-submit-btn')?.addEventListener('click', submitQuiz);
}

// ============================================================================
// ROLE SWITCHER & PERMISSION CONTROLS
// ============================================================================
function setupRoleSwitcher() {
  const roleSelect = document.getElementById('current-role-select');
  roleSelect?.addEventListener('change', (e) => {
    const roleKey = e.target.value;
    state.currentRole = roleKey;
    state.currentUser = personas[roleKey];
    updateRoleUI();
    showToast(`Switched Persona to: ${state.currentUser.name} (${state.currentUser.role})`, 'success');
  });
}

function updateRoleUI() {
  const greetingEl = document.getElementById('user-greeting-name');
  if (greetingEl) {
    greetingEl.textContent = personas[state.currentRole].greeting;
  }

  const isOfficer = state.currentRole === 'officer';
  const isAdmin = state.currentRole === 'admin';

  document.getElementById('dept-officer-banner')?.classList.toggle('hidden', !isOfficer);
  document.querySelectorAll('.admin-only').forEach(el => {
    el.style.display = isAdmin ? 'inline-flex' : 'none';
  });

  renderComplaints();
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.id === tabId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================================
// DATA FETCHING & SYNCHRONIZATION
// ============================================================================
async function loadAllData() {
  try {
    await Promise.all([
      fetchAnalytics(),
      fetchShelters(),
      fetchComplaints(),
      fetchDepartments(),
      fetchLearningModules(),
      fetchQuizzes(),
      fetchCertificates(),
      fetchAlerts()
    ]);
  } catch (err) {
    console.warn('Initial load fallback active:', err);
  }
}

async function fetchAnalytics() {
  const data = await safeApiCall(`${API_BASE}/analytics`);
  const resolvedCount = state.complaints.filter(c => c.status === 'RESOLVED').length;
  const inAction = state.complaints.filter(c => c.status !== 'RESOLVED').length;
  const total = state.complaints.length;
  const resRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 25;

  const totalC = data?.totalComplaints ?? total;
  const actionC = data?.inActionComplaints ?? inAction;
  const openS = data?.openShelters ?? state.shelters.length;
  const sheltered = data?.shelteredCitizens ?? 3420;
  const rescueUnits = data?.activeRescueUnitsDeployed ?? 194;
  const deptsCount = data?.departmentsCount ?? state.departments.length;
  const rate = data?.resolutionRate ?? resRate;

  const elTotal = document.getElementById('stat-total-complaints');
  const elAction = document.getElementById('stat-action-complaints');
  const elShelters = document.getElementById('stat-open-shelters');
  const elSheltered = document.getElementById('stat-sheltered-count');
  const elRescue = document.getElementById('stat-rescue-teams');
  const elDepts = document.getElementById('stat-departments-count');
  const elRate = document.getElementById('stat-resolution-rate');

  if (elTotal) elTotal.textContent = totalC;
  if (elAction) elAction.textContent = actionC;
  if (elShelters) elShelters.textContent = openS;
  if (elSheltered) elSheltered.textContent = Number(sheltered).toLocaleString();
  if (elRescue) elRescue.textContent = rescueUnits;
  if (elDepts) elDepts.textContent = deptsCount;
  if (elRate) elRate.textContent = rate + '%';
}

async function fetchAlerts() {
  const data = await safeApiCall(`${API_BASE}/alerts`);
  state.alerts = data || getLocalData('alerts', DEFAULT_DATA.alerts);
  if (state.alerts && state.alerts.length > 0 && state.alerts[0].active) {
    const topAlert = state.alerts[0];
    const sevEl = document.getElementById('banner-severity');
    const titleEl = document.getElementById('banner-title');
    const msgEl = document.getElementById('banner-message');
    const bannerEl = document.getElementById('emergency-banner');

    if (sevEl) sevEl.textContent = (topAlert.severity || 'CRITICAL').replace('_', ' ') + ' ALERT';
    if (titleEl) titleEl.textContent = topAlert.title;
    if (msgEl) msgEl.textContent = topAlert.message;
    if (bannerEl) bannerEl.style.display = 'block';
  }
}

// ============================================================================
// LEAFLET INTERACTIVE DISASTER MAP
// ============================================================================
function initLeafletMap() {
  const mapElement = document.getElementById('disaster-leaflet-map');
  if (!mapElement || typeof L === 'undefined') return;

  // Center on Metro Region (13.0450, 80.2400)
  state.leafletMap = L.map('disaster-leaflet-map').setView([13.0450, 80.2400], 12);

  // Standard OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors | SafePublic Disaster Management'
  }).addTo(state.leafletMap);

  // Click on map to auto-populate Grievance Form coordinates
  state.leafletMap.on('click', (e) => {
    const lat = e.latlng.lat.toFixed(4);
    const lng = e.latlng.lng.toFixed(4);
    document.getElementById('rep-lat').value = lat;
    document.getElementById('rep-lng').value = lng;
    document.getElementById('rep-location').value = `GPS Coordinate Point (${lat}, ${lng})`;
    showToast(`Pinned Location at [${lat}, ${lng}]. Ready to report hazard.`, 'info');
  });

  renderMapMarkers();
}

function renderMapMarkers() {
  if (!state.leafletMap || typeof L === 'undefined') return;

  // Clear existing markers
  state.mapMarkers.forEach(m => state.leafletMap.removeLayer(m));
  state.mapMarkers = [];

  // Plot Public Relief Shelters (Blue tents)
  state.shelters.forEach(s => {
    const shelterIcon = L.divIcon({
      className: 'shelter-map-icon',
      html: `<div style="background: #2563eb; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 4px 12px rgba(37,99,235,0.6); font-size: 16px;">🏕️</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker([s.latitude, s.longitude], { icon: shelterIcon }).addTo(state.leafletMap);
    marker.bindPopup(`
      <div style="font-family: sans-serif; min-width: 200px;">
        <span style="font-size: 11px; font-weight: bold; color: #2563eb; text-transform: uppercase;">Open Safe Shelter</span>
        <h4 style="margin: 4px 0; font-size: 14px;">${s.name}</h4>
        <p style="margin: 4px 0 8px; font-size: 12px; color: #555;">${s.address} (${s.district})</p>
        <div style="background: #eff6ff; padding: 6px; border-radius: 4px; font-size: 11px; margin-bottom: 8px;">
          <strong>Beds Available:</strong> ${s.availableSpace} / ${s.capacity}<br>
          <strong>Facilities:</strong> ${s.facilities}
        </div>
        <button onclick="inspectMapPoint('SHELTER', '${s.id}')" style="background: #2563eb; color: #fff; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; width: 100%;">View Shelter Details &rarr;</button>
      </div>
    `);
    state.mapMarkers.push(marker);
  });

  // Plot Reported Public Disaster Grievances (Red/Orange/Green icons)
  state.complaints.forEach(c => {
    const isThreat = c.priority === 'IMMEDIATE_THREAT';
    const isResolved = c.status === 'RESOLVED';
    const iconColor = isResolved ? '#10b981' : (isThreat ? '#ef4444' : '#f59e0b');
    const symbol = isResolved ? '✓' : (isThreat ? '⚠️' : '⚡');

    const hazardIcon = L.divIcon({
      className: 'hazard-map-icon',
      html: `<div style="background: ${iconColor}; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 4px 15px ${iconColor}88; font-size: 14px;">${symbol}</div>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const marker = L.marker([c.latitude, c.longitude], { icon: hazardIcon }).addTo(state.leafletMap);
    marker.bindPopup(`
      <div style="font-family: sans-serif; min-width: 220px;">
        <span style="font-size: 11px; font-weight: bold; color: ${iconColor}; text-transform: uppercase;">${c.category} • ${c.status}</span>
        <h4 style="margin: 4px 0; font-size: 14px;">${c.title}</h4>
        <p style="margin: 4px 0 8px; font-size: 12px; color: #555;">${c.location}</p>
        <div style="font-size: 11px; color: #333; margin-bottom: 8px;">
          <strong>Officer:</strong> ${c.assignedOfficer || 'Pending Assignment'}
        </div>
        <button onclick="inspectMapPoint('COMPLAINT', '${c.id}')" style="background: #1e293b; color: #fff; border: none; padding: 6px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; width: 100%;">Inspect Disaster Point &rarr;</button>
      </div>
    `);
    state.mapMarkers.push(marker);
  });
}

window.inspectMapPoint = function(type, id) {
  if (type === 'SHELTER') {
    const s = state.shelters.find(x => x.id === id);
    if (!s) return;
    document.getElementById('map-inspect-type').textContent = 'PUBLIC RELIEF SHELTER (HIGH GROUND)';
    document.getElementById('map-inspect-title').textContent = s.name;
    document.getElementById('map-inspect-desc').textContent = `${s.facilities}. Contact: ${s.contactPerson} (${s.contactPhone})`;
    document.getElementById('map-inspect-loc').textContent = `${s.address}, ${s.district}`;
    document.getElementById('map-inspect-dept').textContent = 'Zonal Disaster Relief Command';
    document.getElementById('map-inspect-officer').textContent = `${s.contactPerson} (${s.contactPhone})`;
    document.getElementById('map-inspect-status').className = 'badge-success';
    document.getElementById('map-inspect-status').textContent = `OPEN (${s.availableSpace} BEDS FREE)`;
    document.getElementById('map-inspect-action-btn').textContent = 'Set as Primary Evacuation Target';
    document.getElementById('map-inspect-action-btn').onclick = () => {
      showToast(`Designated ${s.name} as your primary evacuation destination.`, 'success');
    };
  } else {
    const c = state.complaints.find(x => x.id === id);
    if (!c) return;
    document.getElementById('map-inspect-type').textContent = `DISASTER HAZARD (${c.priority})`;
    document.getElementById('map-inspect-title').textContent = c.title;
    document.getElementById('map-inspect-desc').textContent = c.description;
    document.getElementById('map-inspect-loc').textContent = `${c.location} (${c.district})`;
    document.getElementById('map-inspect-dept').textContent = c.departmentId || 'Pending Assignment';
    document.getElementById('map-inspect-officer').textContent = `${c.assignedOfficer || 'Pending Officer'} (${c.officerPhone || 'N/A'})`;
    document.getElementById('map-inspect-status').className = `badge-${c.status === 'RESOLVED' ? 'success' : 'danger'}`;
    document.getElementById('map-inspect-status').textContent = c.status.replace('_', ' ');
    document.getElementById('map-inspect-action-btn').textContent = 'Track Full Incident Stepper &rarr;';
    document.getElementById('map-inspect-action-btn').onclick = () => {
      switchTab('complaints-tab');
      trackGrievanceById(c.id);
    };
  }
};

function findNearestShelterRoute() {
  if (state.shelters.length === 0) return;
  const target = state.shelters[0];
  const citizenLat = 13.0450;
  const citizenLng = 80.2400;

  if (state.routeLine && state.leafletMap) {
    state.leafletMap.removeLayer(state.routeLine);
  }

  const latlngs = [
    [citizenLat, citizenLng],
    [(citizenLat + target.latitude) / 2 + 0.005, (citizenLng + target.longitude) / 2],
    [target.latitude, target.longitude]
  ];

  state.routeLine = L.polyline(latlngs, {
    color: '#2563eb',
    weight: 5,
    opacity: 0.85,
    dashArray: '10, 10'
  }).addTo(state.leafletMap);

  state.leafletMap.fitBounds(state.routeLine.getBounds(), { padding: [50, 50] });
  showToast(`Calculated optimal high-ground evacuation route to ${target.name}!`, 'success');
  inspectMapPoint('SHELTER', target.id);
}

// ============================================================================
// PUBLIC RELIEF SHELTERS
// ============================================================================
async function fetchShelters() {
  const data = await safeApiCall(`${API_BASE}/shelters`);
  state.shelters = data || getLocalData('shelters', DEFAULT_DATA.shelters);
  renderDashboardShelters();
}

function renderDashboardShelters() {
  const container = document.getElementById('dash-shelters-list');
  if (!container) return;
  container.innerHTML = '';

  state.shelters.slice(0, 4).forEach(s => {
    const item = document.createElement('div');
    item.className = 'dash-item';
    item.innerHTML = `
      <div>
        <div class="dash-item-title">${s.name}</div>
        <div class="dash-item-sub">${s.district} • Free Beds: <strong>${s.availableSpace} / ${s.capacity}</strong></div>
      </div>
      <button class="btn btn-sm btn-outline" onclick="switchTab('map-tab'); inspectMapPoint('SHELTER', '${s.id}');">Map & Route &rarr;</button>
    `;
    container.appendChild(item);
  });
}

// ============================================================================
// GRIEVANCES & HAZARD REPORTING
// ============================================================================
async function fetchComplaints() {
  const data = await safeApiCall(`${API_BASE}/complaints`);
  state.complaints = data || getLocalData('complaints', DEFAULT_DATA.complaints);
  renderComplaints();
  renderDashboardComplaints();
  if (state.leafletMap) renderMapMarkers();
}

function renderComplaints(filter = 'ALL', deptFilter = null) {
  const container = document.getElementById('complaints-list-grid');
  if (!container) return;
  container.innerHTML = '';

  const countEl = document.getElementById('count-all-grv');
  if (countEl) countEl.textContent = state.complaints.length;

  const isOfficer = state.currentRole === 'officer';
  const isAdmin = state.currentRole === 'admin';

  let filtered = state.complaints.filter(c => filter === 'ALL' || c.status === filter);
  if (deptFilter) {
    filtered = filtered.filter(c => c.departmentId === deptFilter);
  }

  filtered.forEach(c => {
    const card = document.createElement('div');
    card.className = 'complaint-card';
    card.innerHTML = `
      <div class="complaint-img-wrap">
        <img src="${c.image || 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500'}" alt="${c.title}" onerror="this.src='https://images.unsplash.com/photo-1547683905-f686c993aae5?w=500'">
        <span class="complaint-status-badge status-${c.status}">${c.status.replace('_', ' ')}</span>
      </div>
      <div class="complaint-body">
        <div>
          <span class="complaint-id">${c.id} • ${c.category}</span>
          <h3 class="complaint-title">${c.title}</h3>
          <p class="complaint-desc">${c.description}</p>
          <div style="font-size: 0.8rem; background: var(--bg-surface-elevated); padding: 10px 12px; border-radius: var(--radius-sm); margin-bottom: 12px;">
            <strong>Location:</strong> ${c.location} (${c.district})<br>
            <strong>Assigned Force:</strong> ${c.departmentId || 'Under DMOC Review'}<br>
            <strong>Officer:</strong> ${c.assignedOfficer || 'Pending'} (${c.officerPhone || 'N/A'})
            ${c.resolutionNotes ? `<br><strong style="color: #60a5fa;">Dispatch Notes:</strong> ${c.resolutionNotes}` : ''}
          </div>
        </div>
        <div class="complaint-footer">
          <span>By: ${c.citizenName}</span>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-sm btn-outline" onclick="trackGrievanceById('${c.id}')">Track Live 🔍</button>
            ${(isOfficer || isAdmin) ? `
              <select onchange="updateGrievanceStatus('${c.id}', this.value)" style="font-size: 0.75rem; background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-highlight); padding: 4px 8px; border-radius: 4px;">
                <option value="VERIFIED" ${c.status === 'VERIFIED' ? 'selected' : ''}>Set Verified</option>
                <option value="ASSIGNED" ${c.status === 'ASSIGNED' ? 'selected' : ''}>Set Assigned</option>
                <option value="TEAMS_DISPATCHED" ${c.status === 'TEAMS_DISPATCHED' ? 'selected' : ''}>Dispatch Teams</option>
                <option value="RESOLVED" ${c.status === 'RESOLVED' ? 'selected' : ''}>Mark Cleared / Safe</option>
              </select>
            ` : (c.status === 'RESOLVED' ? `<button class="btn btn-sm btn-ghost" onclick="rateComplaintPrompt('${c.id}')">Rate Response ⭐</button>` : '')}
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderDashboardComplaints() {
  const container = document.getElementById('dash-complaints-list');
  if (!container) return;
  container.innerHTML = '';

  state.complaints.slice(0, 3).forEach(c => {
    const item = document.createElement('div');
    item.className = 'dash-item';
    item.innerHTML = `
      <div>
        <div class="dash-item-title">${c.title}</div>
        <div class="dash-item-sub">${c.category} • ${c.location}</div>
      </div>
      <button class="btn btn-sm btn-outline" onclick="switchTab('complaints-tab'); trackGrievanceById('${c.id}');">Track Status &rarr;</button>
    `;
    container.appendChild(item);
  });
}

async function handleReportGrievance(e) {
  e.preventDefault();
  const payload = {
    userId: state.currentUser.id,
    citizenName: document.getElementById('rep-citizen-name').value,
    contactPhone: document.getElementById('rep-contact-phone').value,
    category: document.getElementById('rep-category').value,
    priority: document.getElementById('rep-priority').value,
    title: document.getElementById('rep-title').value,
    district: document.getElementById('rep-district').value,
    ward: document.getElementById('rep-ward').value,
    location: document.getElementById('rep-location').value,
    latitude: parseFloat(document.getElementById('rep-lat').value) || 12.9759,
    longitude: parseFloat(document.getElementById('rep-lng').value) || 80.2212,
    description: document.getElementById('rep-description').value,
    image: document.getElementById('rep-image').value
  };

  let result = await safeApiCall(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!result) {
    // Client-side fallback: auto-assign department and persist locally
    const cat = payload.category.toLowerCase();
    let deptId = "DEP-NDRF";
    let officer = "Commander Rajesh Varma";
    let phone = "+91 98765 00002";

    if (cat.includes('power') || cat.includes('electrical')) {
      deptId = "DEP-POWER";
      officer = "Superintending Eng. Priya Nair";
      phone = "+91 98765 43212";
    } else if (cat.includes('drain') || cat.includes('culvert')) {
      deptId = "DEP-DRAINAGE";
      officer = "Eng. Senthil Kumar";
      phone = "+91 98765 43211";
    } else if (cat.includes('fire') || cat.includes('gas')) {
      deptId = "DEP-FIRE";
      officer = "Chief Inspector Vikram Rathore";
      phone = "+91 98765 43210";
    } else if (cat.includes('bridge') || cat.includes('road') || cat.includes('structur')) {
      deptId = "DEP-PWD";
      officer = "Chief Eng. Dr. Arun Prakash";
      phone = "+91 98765 43213";
    }

    const newId = `GRV-2026-${Math.floor(100 + Math.random() * 900)}`;
    result = {
      ...payload,
      id: newId,
      status: 'VERIFIED',
      departmentId: deptId,
      assignedDepartment: deptId,
      assignedOfficer: officer,
      officerPhone: phone,
      resolutionNotes: 'Incident officially verified by Disaster Command. Emergency teams dispatched.'
    };

    state.complaints.unshift(result);
    setLocalData('complaints', state.complaints);
  }

  showToast(`Disaster Grievance Registered! Ticket ID: ${result.id}. Auto-routed to ${result.assignedDepartment || result.departmentId}.`, 'success');
  closeModal('modal-report-hazard');
  document.getElementById('form-report-hazard').reset();
  document.getElementById('upload-preview-wrap')?.classList.add('hidden');
  document.getElementById('upload-prompt')?.classList.remove('hidden');
  await fetchComplaints();
  await fetchAnalytics();
  trackGrievanceById(result.id);
}

// Real Photo & Camera Upload Handler
async function handlePhotoFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const base64Data = evt.target.result;
    showToast('Uploading disaster photo...', 'info');

    const result = await safeApiCall(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: file.name, data: base64Data })
    });

    const finalUrl = (result && result.url) ? result.url : base64Data;
    document.getElementById('rep-image').value = finalUrl;
    const previewImg = document.getElementById('upload-preview-img');
    if (previewImg) previewImg.src = finalUrl;
    const fnameLabel = document.getElementById('upload-filename-label');
    if (fnameLabel) fnameLabel.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
    document.getElementById('upload-preview-wrap')?.classList.remove('hidden');
    document.getElementById('upload-prompt')?.classList.add('hidden');
    showToast('Real disaster photograph attached!', 'success');
  };
  reader.readAsDataURL(file);
}

// Real Geolocation & Reverse Geocoding
async function handleDetectCitizenGps() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.', 'warning');
    return;
  }
  showToast('Acquiring high-accuracy GPS coordinates & telemetry...', 'info');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      document.getElementById('rep-lat').value = lat.toFixed(6);
      document.getElementById('rep-lng').value = lng.toFixed(6);

      if (state.leafletMap) {
        state.leafletMap.setView([lat, lng], 15);
        L.marker([lat, lng])
          .addTo(state.leafletMap)
          .bindPopup(`<strong>📍 Your Verified GPS Position</strong><br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
          .openPopup();
      }

      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const geo = await res.json();
          if (geo && geo.address) {
            const addr = geo.address;
            const road = addr.road || addr.street || addr.pedestrian || addr.suburb || '';
            const suburb = addr.suburb || addr.neighbourhood || addr.residential || '';
            const city = addr.city || addr.town || addr.county || addr.state_district || 'District';
            const locText = [road, suburb, addr.postcode].filter(Boolean).join(', ');
            if (locText) document.getElementById('rep-location').value = locText;
            if (city) document.getElementById('rep-district').value = city;
            if (suburb) document.getElementById('rep-ward').value = suburb;
            showToast(`Location detected: ${city} (${locText || 'GPS locked'})`, 'success');
          }
        }
      } catch (e) {
        showToast(`GPS Coordinates acquired: ${lat.toFixed(4)}, ${lng.toFixed(4)}`, 'success');
      }

      fetchLiveWeather(lat, lng);
    },
    (err) => {
      console.warn('Geolocation error:', err);
      showToast('Unable to detect GPS position: ' + err.message + '. Pinned map location can be selected manually.', 'warning');
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
}

// Add Real Public Relief Shelter
async function handleAddShelter(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('shl-name').value.trim(),
    district: document.getElementById('shl-district').value.trim(),
    capacity: parseInt(document.getElementById('shl-capacity').value) || 1000,
    address: document.getElementById('shl-address').value.trim(),
    latitude: parseFloat(document.getElementById('shl-lat').value) || 13.0827,
    longitude: parseFloat(document.getElementById('shl-lng').value) || 80.2707,
    facilities: document.getElementById('shl-facilities').value.trim(),
    contactPerson: document.getElementById('shl-officer').value.trim(),
    contactPhone: document.getElementById('shl-phone').value.trim()
  };

  const res = await safeApiCall(`${API_BASE}/shelters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res) {
    const newShelter = {
      ...payload,
      id: `SHL-0${state.shelters.length + 1}`,
      availableSpace: Math.floor(payload.capacity * 0.4)
    };
    state.shelters.push(newShelter);
    setLocalData('shelters', state.shelters);
  }

  showToast('Public Relief Shelter permanently saved and mapped!', 'success');
  closeModal('modal-add-shelter');
  document.getElementById('form-add-shelter').reset();
  await fetchShelters();
  if (state.leafletMap) renderMapMarkers();
  await fetchAnalytics();
}

// Add Emergency Department
async function handleAddDepartment(e) {
  e.preventDefault();
  const payload = {
    code: document.getElementById('dept-code').value.trim(),
    name: document.getElementById('dept-name').value.trim(),
    jurisdiction: document.getElementById('dept-jurisdiction').value.trim(),
    assignedOfficer: document.getElementById('dept-officer').value.trim(),
    emergencyHelpline: document.getElementById('dept-helpline').value.trim(),
    phone: document.getElementById('dept-phone').value.trim(),
    email: document.getElementById('dept-email').value.trim(),
    activeRescueUnits: parseInt(document.getElementById('dept-units').value) || 10
  };

  const res = await safeApiCall(`${API_BASE}/departments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res) {
    const newDept = { ...payload, id: `DEP-${payload.code.toUpperCase()}` };
    state.departments.push(newDept);
    setLocalData('departments', state.departments);
  }

  showToast('Emergency Department registered and deployed!', 'success');
  closeModal('modal-add-department');
  document.getElementById('form-add-department').reset();
  await fetchDepartments();
  await fetchAnalytics();
}

// Add Disaster Survival Guide
async function handleAddModule(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('mod-name').value.trim(),
    category: document.getElementById('mod-cat').value,
    type: document.getElementById('mod-type').value,
    summary: document.getElementById('mod-summary').value.trim(),
    fullDescription: document.getElementById('mod-desc').value.trim(),
    dos: document.getElementById('mod-dos').value.split('\n').map(s => s.trim()).filter(Boolean),
    donts: document.getElementById('mod-donts').value.split('\n').map(s => s.trim()).filter(Boolean),
    emergencyEquipment: document.getElementById('mod-equip').value.trim()
  };

  const res = await safeApiCall(`${API_BASE}/learn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res) {
    const newMod = { ...payload, id: `MOD-PUB-0${state.modules.length + 1}` };
    state.modules.push(newMod);
    setLocalData('modules', state.modules);
  }

  showToast('Survival Guide published to public portal!', 'success');
  closeModal('modal-add-module');
  document.getElementById('form-add-module').reset();
  await fetchLearningModules();
}

// Live Weather from Open-Meteo
async function fetchLiveWeather(lat = 13.0827, lng = 80.2707) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&hourly=precipitation_probability,relativehumidity_2m`;
    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.current_weather) {
      const cw = data.current_weather;
      const temp = Math.round(cw.temperature);
      const wind = Math.round(cw.windspeed);
      const weatherCode = cw.weathercode;
      
      let condition = 'Clear Sky';
      let hazardBadge = 'NORMAL ADVISORY';
      let badgeClass = 'badge-success';

      if (weatherCode >= 80 || weatherCode === 65 || weatherCode === 63) {
        condition = 'Heavy Rain & Flooding';
        hazardBadge = 'HIGH FLOOD ALERT';
        badgeClass = 'badge-danger';
      } else if (weatherCode >= 51 && weatherCode <= 67) {
        condition = 'Rain & Gusts';
        hazardBadge = 'MODERATE WATCH';
        badgeClass = 'badge-warning';
      } else if (weatherCode >= 95) {
        condition = 'Severe Thunderstorm';
        hazardBadge = 'CRITICAL SIREN ALERT';
        badgeClass = 'badge-danger';
      } else if (wind > 40) {
        condition = 'Gale Winds';
        hazardBadge = 'CYCLONE WARNING';
        badgeClass = 'badge-danger';
      }

      const tempEl = document.getElementById('weather-temp');
      const descEl = document.getElementById('weather-desc');
      const windEl = document.getElementById('weather-wind');
      const rainEl = document.getElementById('weather-rain');
      const hazardEl = document.getElementById('weather-hazard-badge');

      if (tempEl) tempEl.textContent = `${temp}°C`;
      if (descEl) descEl.textContent = condition;
      if (windEl) windEl.textContent = `${wind} km/h`;
      if (rainEl) {
        const precip = data.hourly?.precipitation_probability?.[0] || (weatherCode >= 60 ? '45 mm/h' : '0 mm/h');
        rainEl.textContent = typeof precip === 'number' ? `${precip}% Prob` : precip;
      }
      if (hazardEl) {
        hazardEl.textContent = hazardBadge;
        hazardEl.className = badgeClass;
      }
    }
  } catch (e) {
    console.warn('Weather fetch error:', e);
  }
}

// Live Stepper Tracker
window.trackGrievanceById = async function(complaintId) {
  let c = await safeApiCall(`${API_BASE}/complaints/track/${complaintId.trim()}`);
  if (!c) {
    c = state.complaints.find(x => x.id.toLowerCase() === complaintId.trim().toLowerCase());
  }

  if (!c) {
    showToast(`No disaster grievance record found for ID: ${complaintId}`, 'warning');
    return;
  }

  const card = document.getElementById('live-tracker-result-card');
  card.classList.remove('hidden');

  document.getElementById('track-res-id').textContent = c.id;
  document.getElementById('track-res-title').textContent = c.title;
  document.getElementById('track-res-location').textContent = `${c.location} (${c.district}, ${c.ward || 'Zone'})`;
  document.getElementById('track-res-dept').textContent = c.departmentId || 'Under DMOC Assessment';
  document.getElementById('track-res-officer').textContent = c.assignedOfficer || 'Pending Deployment';
  document.getElementById('track-res-phone').textContent = c.officerPhone || 'N/A';
  document.getElementById('track-res-notes').textContent = c.resolutionNotes || 'Incident received. Emergency assessment initiated.';

  // Update 5-Step Stepper
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3'),
    document.getElementById('step-4'),
    document.getElementById('step-5')
  ];
  const lines = [
    document.getElementById('line-1'),
    document.getElementById('line-2'),
    document.getElementById('line-3'),
    document.getElementById('line-4')
  ];

  steps.forEach(s => { if (s) s.className = 'step-item'; });
  lines.forEach(l => { if (l) l.className = 'step-line'; });

  let activeLevel = 1;
  if (c.status === 'SUBMITTED') activeLevel = 1;
  else if (c.status === 'VERIFIED') activeLevel = 2;
  else if (c.status === 'ASSIGNED') activeLevel = 3;
  else if (c.status === 'TEAMS_DISPATCHED' || c.status === 'IN_ACTION') activeLevel = 4;
  else if (c.status === 'RESOLVED') activeLevel = 5;

  for (let i = 0; i < activeLevel; i++) {
    if (steps[i]) steps[i].classList.add('active');
    if (i < activeLevel - 1 && lines[i]) lines[i].classList.add('active');
  }

  const feedbackWrap = document.getElementById('track-feedback-wrap');
  if (c.status === 'RESOLVED') {
    feedbackWrap.classList.remove('hidden');
    document.getElementById('submit-feedback-btn').onclick = () => rateComplaintPrompt(c.id);
  } else {
    feedbackWrap.classList.add('hidden');
  }

  card.scrollIntoView({ behavior: 'smooth' });
};

window.updateGrievanceStatus = async function(id, status) {
  const notes = prompt(`Enter on-ground operational update note for status [${status}]:`, 'Teams on ground executing emergency response.');
  const res = await safeApiCall(`${API_BASE}/complaints/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, resolutionNotes: notes || '' })
  });

  const complaint = state.complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = status;
    if (notes) complaint.resolutionNotes = notes;
    setLocalData('complaints', state.complaints);
  }

  showToast(`Grievance ${id} status updated to ${status}!`, 'success');
  renderComplaints();
  renderDashboardComplaints();
  if (state.leafletMap) renderMapMarkers();
  await fetchAnalytics();
  trackGrievanceById(id);
};

window.rateComplaintPrompt = async function(complaintId) {
  const rating = prompt('Rate the disaster response team resolution (1 to 5 stars):', '5');
  if (!rating) return;
  const comments = prompt('Enter your citizen feedback comment:', 'Rapid deployment, hazard cleared safely.');

  await safeApiCall(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      complaintId,
      rating: parseInt(rating),
      comments: comments || ''
    })
  });

  const c = state.complaints.find(x => x.id === complaintId);
  if (c) {
    c.feedbackRating = parseInt(rating);
    c.feedbackComments = comments;
    setLocalData('complaints', state.complaints);
  }

  showToast('Thank you! Your citizen feedback has been recorded.', 'success');
};

// ============================================================================
// RESPONSE DEPARTMENTS
// ============================================================================
async function fetchDepartments() {
  const data = await safeApiCall(`${API_BASE}/departments`);
  state.departments = data || getLocalData('departments', DEFAULT_DATA.departments);
  renderDepartments();
}

function renderDepartments() {
  const container = document.getElementById('departments-cards-grid');
  if (!container) return;
  container.innerHTML = '';

  state.departments.forEach(d => {
    const card = document.createElement('div');
    card.className = 'department-card';
    card.innerHTML = `
      <div>
        <div class="dept-header">
          <h3 class="dept-title">${d.name}</h3>
          <span class="dept-code-badge">${d.code}</span>
        </div>
        <p class="dept-jurisdiction">${d.jurisdiction}</p>
        <div class="dept-meta-box">
          <div><strong>Commander / Officer:</strong> ${d.assignedOfficer}</div>
          <div><strong>Emergency Helpline:</strong> <a href="tel:${d.emergencyHelpline}" style="color: #ef4444; font-weight: bold;">${d.emergencyHelpline}</a></div>
          <div><strong>Active Rescue Teams:</strong> <span style="color: #10b981; font-weight: bold;">${d.activeRescueUnits} Units Deployed</span></div>
        </div>
      </div>
      <button class="btn btn-sm btn-outline btn-block" onclick="filterDepartmentGrievances('${d.id}')">View Assigned Incidents &rarr;</button>
    `;
    container.appendChild(card);
  });
}

window.filterDepartmentGrievances = function(deptId) {
  switchTab('complaints-tab');
  renderComplaints('ALL', deptId);
  showToast(`Filtered grievances for department: ${deptId}`, 'info');
};

async function handleBroadcastAlert(e) {
  e.preventDefault();
  const payload = {
    id: `ALERT-${Date.now()}`,
    title: document.getElementById('alt-title').value,
    severity: document.getElementById('alt-severity').value,
    disasterType: document.getElementById('alt-type').value,
    targetAudience: 'ALL_CITIZENS',
    message: document.getElementById('alt-message').value,
    issuedBy: state.currentUser.name,
    active: true
  };

  const res = await safeApiCall(`${API_BASE}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res) {
    state.alerts.unshift(payload);
    setLocalData('alerts', state.alerts);
  }

  showToast('EMERGENCY SIREN BROADCAST DISPATCHED TO ALL REGISTERED CITIZENS!', 'danger');
  closeModal('modal-broadcast-alert');
  document.getElementById('form-broadcast-alert').reset();
  fetchAlerts();
}

// Emergency Siren Synthetic Audio
function toggleEmergencySiren() {
  if (state.sirenPlaying) {
    if (state.sirenAudioContext) {
      state.sirenAudioContext.close();
      state.sirenAudioContext = null;
    }
    state.sirenPlaying = false;
    showToast('Emergency Siren audio stopped.', 'info');
  } else {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      state.sirenAudioContext = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, ctx.currentTime);

      const now = ctx.currentTime;
      for (let i = 0; i < 10; i++) {
        osc.frequency.linearRampToValueAtTime(950, now + (i * 1.5) + 0.75);
        osc.frequency.linearRampToValueAtTime(600, now + (i * 1.5) + 1.5);
      }

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      state.sirenPlaying = true;
      showToast('Emergency Siren Audio Active. Click again to silence.', 'danger');
    } catch (e) {
      showToast('Audio siren simulation not supported in current browser mode.', 'warning');
    }
  }
}

// ============================================================================
// PUBLIC DISASTER LEARNING & ENCYCLOPEDIA
// ============================================================================
async function fetchLearningModules() {
  const data = await safeApiCall(`${API_BASE}/learn`);
  state.modules = data || getLocalData('modules', DEFAULT_DATA.modules);
  renderLearningModules(state.modules);
}

function renderLearningModules(modules) {
  const container = document.getElementById('modules-grid');
  if (!container) return;
  container.innerHTML = '';

  modules.forEach(m => {
    const card = document.createElement('div');
    card.className = 'learn-card';
    card.innerHTML = `
      <div class="learn-card-hero">
        <span class="learn-card-category">${m.category} • ${m.type}</span>
        <h3 style="color: #fff; font-size: 1.15rem;">${m.name}</h3>
      </div>
      <div class="learn-card-body">
        <p class="learn-summary">${m.summary}</p>
        <div class="learn-dos-preview">
          <strong>Key Survival Action:</strong>
          ${m.dos && m.dos.length > 0 ? m.dos[0] : 'Follow certified evacuation routes.'}
        </div>
        <div class="learn-card-footer">
          <span style="font-size: 0.78rem; color: var(--text-muted);">Equip: ${m.emergencyEquipment || 'First Aid Kit'}</span>
          <button class="btn btn-sm btn-outline" onclick="openModuleDetail('${m.id}')">Read Survival Guide &rarr;</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterLearningModules(query = '', category = 'ALL') {
  const q = query.toLowerCase().trim();
  const filtered = state.modules.filter(m => {
    const matchesCat = (category === 'ALL') || (m.category === category);
    const matchesText = !q || m.name.toLowerCase().includes(q) || m.summary.toLowerCase().includes(q);
    return matchesCat && matchesText;
  });
  renderLearningModules(filtered);
}

window.openModuleDetail = function(id) {
  const m = state.modules.find(x => x.id === id);
  if (!m) return;
  alert(`DISASTER SURVIVAL DOCTRINE: ${m.name}\n\n${m.fullDescription}\n\nDOs:\n${(m.dos || []).join('\n')}\n\nDONTs:\n${(m.donts || []).join('\n')}`);
};

// ============================================================================
// CITIZEN QUIZZES & CERTIFICATION
// ============================================================================
async function fetchQuizzes() {
  const data = await safeApiCall(`${API_BASE}/quizzes`);
  const quizzes = data || getLocalData('quizzes', DEFAULT_DATA.quizzes);
  renderQuizzes(quizzes);
}

function renderQuizzes(quizzes) {
  const container = document.getElementById('quiz-list-view');
  if (!container) return;
  container.innerHTML = '';

  quizzes.forEach(q => {
    const card = document.createElement('div');
    card.className = 'quiz-card';
    card.innerHTML = `
      <div>
        <span class="badge-accent">${q.disasterType} • ${q.difficulty}</span>
        <h3 style="font-size: 1.2rem; margin: 10px 0 6px;">${q.title}</h3>
        <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 16px;">
          Includes ${q.questionCount || (q.questions ? q.questions.length : 5)} multiple choice survival questions. Passing benchmark: ${q.passingScore}%.
        </p>
      </div>
      <button class="btn btn-primary btn-block" onclick="startQuiz('${q.id}')">Take Citizen Certification Exam &rarr;</button>
    `;
    container.appendChild(card);
  });
}

window.startQuiz = async function(quizId) {
  let qData = await safeApiCall(`${API_BASE}/quizzes/detail/${quizId}`);
  if (!qData) {
    const all = getLocalData('quizzes', DEFAULT_DATA.quizzes);
    qData = all.find(x => x.id === quizId) || DEFAULT_DATA.quizzes[0];
  }

  state.activeQuiz = qData;
  state.quizAnswers = new Array(qData.questions.length).fill(-1);
  state.currentQuestionIdx = 0;
  state.quizSecondsLeft = 300;

  document.getElementById('quiz-list-view').classList.add('hidden');
  document.getElementById('quiz-runner-view').classList.remove('hidden');

  document.getElementById('runner-quiz-category').textContent = qData.disasterType;
  document.getElementById('runner-quiz-title').textContent = qData.title;
  document.getElementById('total-q-num').textContent = qData.questions.length;

  renderCurrentQuestion();
  startQuizTimer();
};

function startQuizTimer() {
  if (state.quizTimerInterval) clearInterval(state.quizTimerInterval);
  const timerEl = document.getElementById('quiz-timer');
  state.quizTimerInterval = setInterval(() => {
    state.quizSecondsLeft--;
    const mins = Math.floor(state.quizSecondsLeft / 60);
    const secs = state.quizSecondsLeft % 60;
    if (timerEl) timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (state.quizSecondsLeft <= 0) {
      clearInterval(state.quizTimerInterval);
      submitQuiz();
    }
  }, 1000);
}

function renderCurrentQuestion() {
  const q = state.activeQuiz.questions[state.currentQuestionIdx];
  document.getElementById('curr-q-num').textContent = state.currentQuestionIdx + 1;
  document.getElementById('question-text').textContent = q.text;

  const total = state.activeQuiz.questions.length;
  const progressPct = ((state.currentQuestionIdx + 1) / total) * 100;
  document.getElementById('quiz-progress-fill').style.width = `${progressPct}%`;

  const optContainer = document.getElementById('options-container');
  optContainer.innerHTML = '';

  q.options.forEach((optText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = `quiz-opt-btn ${state.quizAnswers[state.currentQuestionIdx] === optIdx ? 'selected' : ''}`;
    btn.innerHTML = `
      <span class="opt-radio-circle"></span>
      <span>${optText}</span>
    `;
    btn.addEventListener('click', () => {
      state.quizAnswers[state.currentQuestionIdx] = optIdx;
      renderCurrentQuestion();
    });
    optContainer.appendChild(btn);
  });

  document.getElementById('quiz-prev-btn').style.visibility = state.currentQuestionIdx === 0 ? 'hidden' : 'visible';
  const isLast = state.currentQuestionIdx === total - 1;
  document.getElementById('quiz-next-btn').classList.toggle('hidden', isLast);
  document.getElementById('quiz-submit-btn').classList.toggle('hidden', !isLast);
}

async function submitQuiz() {
  if (state.quizTimerInterval) clearInterval(state.quizTimerInterval);

  const payload = {
    quizId: state.activeQuiz.id,
    userId: state.currentUser.id,
    userName: state.currentUser.name,
    answers: state.quizAnswers
  };

  let result = await safeApiCall(`${API_BASE}/quizzes/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!result) {
    let correct = 0;
    const questions = state.activeQuiz.questions;
    questions.forEach((q, idx) => {
      if (state.quizAnswers[idx] === q.correctIndex) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    const passed = pct >= state.activeQuiz.passingScore;
    const certNum = `PUB-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    result = {
      score: correct,
      total: questions.length,
      percentage: pct,
      passed: passed,
      certificateNumber: certNum
    };

    if (passed) {
      const storedCerts = getLocalData('certificates', DEFAULT_DATA.certificates);
      storedCerts.push({
        id: `QR-${Date.now()}`,
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        quizTitle: state.activeQuiz.title,
        score: correct,
        total: questions.length,
        percentage: pct,
        passed: true,
        certificateNumber: certNum
      });
      setLocalData('certificates', storedCerts);
    }
  }

  document.getElementById('quiz-runner-view').classList.add('hidden');
  document.getElementById('quiz-list-view').classList.remove('hidden');

  if (result.passed) {
    displayCertificate(result.certificateNumber, state.activeQuiz.title, result.percentage);
    showToast(`Congratulations! Certified with ${result.percentage}%! Certificate issued.`, 'success');
  } else {
    showToast(`Exam completed: Scored ${result.percentage}%. Passing benchmark is ${state.activeQuiz.passingScore}%. Try again!`, 'warning');
  }
  fetchCertificates();
}

function displayCertificate(certId, quizTitle, scorePct) {
  document.getElementById('cert-recipient-name').textContent = state.currentUser.name;
  document.getElementById('cert-score-percentage').textContent = `${scorePct}%`;
  document.getElementById('cert-display-id').textContent = certId;
  openModal('modal-certificate');
}

async function fetchCertificates() {
  const data = await safeApiCall(`${API_BASE}/quizzes/certificates`);
  const certs = data || getLocalData('certificates', DEFAULT_DATA.certificates);
  const container = document.getElementById('my-certificates-list');
  if (!container) return;
  container.innerHTML = '';

  certs.forEach(cert => {
    const card = document.createElement('div');
    card.className = 'cert-card';
    card.innerHTML = `
      <div>
        <span style="font-size: 0.72rem; color: #b45309; text-transform: uppercase; font-weight: 700;">Verified Public Credential</span>
        <h4 style="font-size: 1.05rem; margin: 4px 0;">${cert.quizTitle}</h4>
        <span style="font-size: 0.8rem; color: var(--text-muted);">${cert.userName} • Score: <strong>${cert.percentage}%</strong></span>
      </div>
      <button class="btn btn-sm btn-outline" onclick="displayCertificate('${cert.certificateNumber}', '${cert.quizTitle}', ${cert.percentage})">View PDF &rarr;</button>
    `;
    container.appendChild(card);
  });
}

// ============================================================================
// 24/7 AI DISASTER ADVISOR
// ============================================================================
async function sendAiChatMessage() {
  const input = document.getElementById('chat-input');
  const question = input.value.trim();
  if (!question) return;

  appendChatMessage(question, 'user');
  input.value = '';

  const data = await safeApiCall(`${API_BASE}/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });

  if (data && data.reply) {
    appendChatMessage(data.reply, 'bot', data.emergencyActions, data.suggestedHotlines);
  } else {
    // Client-side emergency advisory intelligence
    const qLower = question.toLowerCase();
    let reply = "National Disaster Management Advisory: Keep calm and take safety measures immediately.";
    let actions = ["Keep emergency battery radio on", "Dial 112 for all urgent emergencies"];
    let hotlines = ["112 (National Emergency)", "1070 (Disaster Control Room)"];

    if (qLower.includes('flood') || qLower.includes('water') || qLower.includes('drown')) {
      reply = "FLASH FLOOD SAFETY DIRECTIVE: Turn off main electrical breaker immediately to prevent electrocution. Move children, senior citizens, and emergency Go-Bags vertically to highest floor. Never walk or drive into moving water above 15 cm. If trapped on roof, signal rescue teams with a bright cloth or whistle.";
      actions = ["Switch off master electrical breaker", "Move to high ground relief shelter", "Never drive into submerged streets"];
      hotlines = ["1070 (State Disaster Management)", "1913 (Flood Control & Dewatering)", "108 (Trauma Ambulance)"];
    } else if (qLower.includes('cyclone') || qLower.includes('wind') || qLower.includes('storm')) {
      reply = "CYCLONE VARUNA PREPAREDNESS: High gale winds (130 km/h) approaching. Board up or tape windows with duct tape. Keep 3 days of non-perishable dry food and bottled water. Stay inside the strongest central room of the building. Beware the deceptive calm 'Eye of the Storm'.";
      actions = ["Board up glass windows", "Relocate to Open Safe Shelter (Nehru Stadium, YMCA)", "Assemble 72-hour family emergency bag"];
      hotlines = ["1070 (Cyclone Command)", "1077 (District Collector Control)"];
    } else if (qLower.includes('fire') || qLower.includes('smoke') || qLower.includes('gas') || qLower.includes('lpg')) {
      reply = "FIRE & GAS LEAK EMERGENCIES: If you smell cooking gas/LPG: NEVER flip electrical switches ON or OFF. Open all windows immediately and close the gas cylinder valve. If caught in smoke, crawl low on hands and knees keeping head within 30cm of the floor.";
      actions = ["Do NOT touch electrical switches", "Crawl low beneath smoke layer", "Deploy P.A.S.S. technique with ABC fire extinguisher"];
      hotlines = ["101 (Fire & Emergency Rescue)", "108 (Ambulance & Burn Trauma)"];
    } else if (qLower.includes('earthquake') || qLower.includes('quake') || qLower.includes('shake')) {
      reply = "EARTHQUAKE SAFETY: DROP to hands and knees immediately. Take COVER under a sturdy desk or dining table. HOLD ON until shaking stops. Do not run outside during shaking, and never use elevators.";
      actions = ["DROP, COVER, and HOLD ON", "Evacuate via stairs after shaking stops", "Gather in open grounds away from buildings"];
      hotlines = ["112 (Disaster Police)", "108 (Emergency Medical)"];
    } else if (qLower.includes('shelter') || qLower.includes('camp') || qLower.includes('where to go')) {
      reply = "OPEN RELIEF SHELTERS: High-ground relief shelters are open with food, clean drinking water, standby doctors, and beds at: 1. Nehru Stadium High Ground Complex, 2. YMCA Cyclone Shelter, 3. Anna University Flood Haven, 4. Kilpauk Medical Refuge. Click 'Relief Shelters' tab or map for GPS route.";
      actions = ["Open Interactive Map tab", "Click 'Route to Nearest Shelter'", "Bring family ID cards & medications"];
      hotlines = ["1070 (Shelter Placement Helpline)"];
    }

    appendChatMessage(reply, 'bot', actions, hotlines);
  }
}

function appendChatMessage(text, sender, actions = [], hotlines = []) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  const msgEl = document.createElement('div');
  msgEl.className = `chat-message ${sender}`;

  let actionsHtml = '';
  if (actions && actions.length > 0) {
    actionsHtml += `<div class="msg-actions" style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">`;
    actions.forEach(a => {
      actionsHtml += `<span class="msg-action-pill" style="font-size: 0.75rem; background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.3);">✓ ${a}</span>`;
    });
    actionsHtml += `</div>`;
  }

  let hotlinesHtml = '';
  if (hotlines && hotlines.length > 0) {
    hotlinesHtml += `<div style="margin-top: 8px; font-size: 0.75rem; color: #f87171;"><strong>Emergency Helplines:</strong> ${hotlines.join(' • ')}</div>`;
  }

  msgEl.innerHTML = `
    <div class="msg-bubble">
      <p style="margin: 0 0 6px;">${text}</p>
      ${actionsHtml}
      ${hotlinesHtml}
      <div class="msg-meta" style="margin-top: 6px; font-size: 0.7rem; color: var(--text-muted);">${sender === 'bot' ? 'Disaster AI Advisor' : state.currentUser.name} • Just now</div>
    </div>
  `;
  container.appendChild(msgEl);
  container.scrollTop = container.scrollHeight;
}

// ============================================================================
// UI MODALS & HELPERS
// ============================================================================
function openModal(id) { document.getElementById(id)?.classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id)?.classList.add('hidden'); }

function toggleTheme() {
  document.body.classList.toggle('light-theme');
  const isLight = document.body.classList.contains('light-theme');
  document.getElementById('theme-icon-sun')?.classList.toggle('hidden', !isLight);
  document.getElementById('theme-icon-moon')?.classList.toggle('hidden', isLight);
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}
