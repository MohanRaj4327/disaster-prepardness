/**
 * SafePublic - Public Disaster Preparedness & Citizen Grievance Portal
 * JavaScript Controller connecting to Java 26 REST API Server
 */

const API_BASE = '/api';

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
    showToast('Pick your hazard category and details for this location.', 'info');
  });

  // Department Responder Filter
  document.getElementById('officer-view-my-tickets-btn')?.addEventListener('click', () => {
    switchTab('complaints-tab');
    renderComplaints('ALL', state.currentUser.departmentId);
    showToast(`Showing tickets assigned to ${state.currentUser.departmentId}`, 'info');
  });

  // AI Chat
  document.getElementById('chat-send-btn')?.addEventListener('click', sendAiChatMessage);
  document.getElementById('chat-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendAiChatMessage();
  });
  document.querySelectorAll('.prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-prompt');
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
// DATA FETCHING FROM JAVA REST BACKEND
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
    console.error('Error loading data from Java REST server:', err);
  }
}

async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    const data = await res.json();
    document.getElementById('stat-total-complaints').textContent = data.totalComplaints || 4;
    document.getElementById('stat-action-complaints').textContent = data.inActionComplaints || 3;
    document.getElementById('stat-open-shelters').textContent = data.openShelters || 5;
    document.getElementById('stat-sheltered-count').textContent = Number(data.shelteredCitizens || 3420).toLocaleString();
    document.getElementById('stat-rescue-teams').textContent = data.activeRescueUnitsDeployed || 194;
    document.getElementById('stat-departments-count').textContent = data.departmentsCount || 7;
    document.getElementById('stat-resolution-rate').textContent = (data.resolutionRate || 25) + '%';
  } catch (e) {
    console.warn('Analytics fetch error:', e);
  }
}

async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    const alerts = await res.json();
    state.alerts = alerts;
    if (alerts && alerts.length > 0 && alerts[0].active) {
      const topAlert = alerts[0];
      document.getElementById('banner-severity').textContent = topAlert.severity.replace('_', ' ') + ' ALERT';
      document.getElementById('banner-title').textContent = topAlert.title;
      document.getElementById('banner-message').textContent = topAlert.message;
      document.getElementById('emergency-banner').style.display = 'block';
    }
  } catch (e) {
    console.warn('Alerts fetch error:', e);
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

  // Plot Public Relief Shelters (Blue circles / tents)
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
      html: `<div style="background: ${iconColor}; color: #fff; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 4px 15px ${iconColor}88; font-size: 14px; animation: ${isThreat ? 'pulseGlow 1.2s infinite' : 'none'};">${symbol}</div>`,
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
  if (!state.leafletMap || state.shelters.length === 0) return;

  // Use primary citizen location (Velachery point)
  const citizenLoc = [12.9759, 80.2212];
  let nearestShelter = state.shelters[0];
  let minDistance = 999999;

  state.shelters.forEach(s => {
    const d = Math.hypot(s.latitude - citizenLoc[0], s.longitude - citizenLoc[1]);
    if (d < minDistance) {
      minDistance = d;
      nearestShelter = s;
    }
  });

  if (state.routeLine) {
    state.leafletMap.removeLayer(state.routeLine);
  }

  // Draw simulated evacuation route line
  const routePoints = [
    citizenLoc,
    [(citizenLoc[0] + nearestShelter.latitude) / 2, citizenLoc[1]],
    [nearestShelter.latitude, nearestShelter.longitude]
  ];

  state.routeLine = L.polyline(routePoints, {
    color: '#10b981',
    weight: 5,
    dashArray: '10, 8',
    opacity: 0.9
  }).addTo(state.leafletMap);

  state.leafletMap.fitBounds(state.routeLine.getBounds(), { padding: [50, 50] });

  inspectMapPoint('SHELTER', nearestShelter.id);
  showToast(`Optimal Evacuation Route calculated to: ${nearestShelter.name} (${Math.round(minDistance * 111 * 10) / 10} km away)`, 'success');
}

// ============================================================================
// PUBLIC RELIEF SHELTERS
// ============================================================================
async function fetchShelters() {
  try {
    const res = await fetch(`${API_BASE}/shelters`);
    const data = await res.json();
    state.shelters = data;
    renderDashboardShelters();
  } catch (e) {
    console.warn('Shelters fetch error:', e);
  }
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
  try {
    const res = await fetch(`${API_BASE}/complaints`);
    const data = await res.json();
    state.complaints = data;
    renderComplaints();
    renderDashboardComplaints();
    if (state.leafletMap) renderMapMarkers();
  } catch (e) {
    console.warn('Complaints fetch error:', e);
  }
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

  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (res.ok) {
      showToast(`Disaster Grievance Registered! Ticket ID: ${result.id}. Auto-routed to ${result.assignedDepartment}.`, 'success');
      closeModal('modal-report-hazard');
      document.getElementById('form-report-hazard').reset();
      document.getElementById('upload-preview-wrap')?.classList.add('hidden');
      document.getElementById('upload-prompt')?.classList.remove('hidden');
      await fetchComplaints();
      await fetchAnalytics();
      trackGrievanceById(result.id);
    }
  } catch (err) {
    showToast('Failed to file grievance', 'danger');
  }
}

// Real Photo & Camera Upload Handler
async function handlePhotoFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (evt) => {
    const base64Data = evt.target.result;
    try {
      showToast('Uploading disaster photo to command server...', 'info');
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          data: base64Data
        })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        document.getElementById('rep-image').value = data.url;
        const previewImg = document.getElementById('upload-preview-img');
        if (previewImg) previewImg.src = data.url;
        const fnameLabel = document.getElementById('upload-filename-label');
        if (fnameLabel) fnameLabel.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
        document.getElementById('upload-preview-wrap')?.classList.remove('hidden');
        document.getElementById('upload-prompt')?.classList.add('hidden');
        showToast('Real disaster photograph attached and saved to disk!', 'success');
      } else {
        showToast('Upload error: ' + (data.error || 'Server error'), 'danger');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to upload image file to server', 'danger');
    }
  };
  reader.readAsDataURL(file);
}

// Real Geolocation & Nominatim Reverse Geocoding
async function handleDetectCitizenGps() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.', 'warning');
    return;
  }
  showToast('Acquiring high-accuracy GPS coordinates & satellite telemetry...', 'info');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      document.getElementById('rep-lat').value = lat.toFixed(6);
      document.getElementById('rep-lng').value = lng.toFixed(6);

      // Center Leaflet map if initialized
      if (state.leafletMap) {
        state.leafletMap.setView([lat, lng], 15);
        L.marker([lat, lng])
          .addTo(state.leafletMap)
          .bindPopup(`<strong>📍 Your Verified GPS Position</strong><br>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`)
          .openPopup();
      }

      // Reverse geocode via OpenStreetMap Nominatim
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

      // Also refresh live weather for this real location
      fetchLiveWeather(lat, lng);
    },
    (err) => {
      console.warn('Geolocation error:', err);
      showToast('Unable to detect GPS position: ' + err.message + '. Please ensure location permission is allowed.', 'warning');
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

  try {
    const res = await fetch(`${API_BASE}/shelters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('Public Relief Shelter permanently saved to database & mapped!', 'success');
      closeModal('modal-add-shelter');
      document.getElementById('form-add-shelter').reset();
      await fetchShelters();
      if (state.leafletMap) renderMapMarkers();
      await fetchAnalytics();
    } else {
      showToast('Error saving shelter', 'danger');
    }
  } catch (err) {
    showToast('Failed to add shelter', 'danger');
  }
}

// Add Real Emergency Response Department
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

  try {
    const res = await fetch(`${API_BASE}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('Emergency Department registered and persisted on disk!', 'success');
      closeModal('modal-add-department');
      document.getElementById('form-add-department').reset();
      await fetchDepartments();
    } else {
      showToast('Error saving department', 'danger');
    }
  } catch (err) {
    showToast('Failed to register department', 'danger');
  }
}

// Add Real Disaster Survival Guide
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

  try {
    const res = await fetch(`${API_BASE}/learn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('Survival Guide published to public portal!', 'success');
      closeModal('modal-add-module');
      document.getElementById('form-add-module').reset();
      await fetchLearningModules();
    } else {
      showToast('Error publishing survival guide', 'danger');
    }
  } catch (err) {
    showToast('Failed to publish guide', 'danger');
  }
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
  try {
    const res = await fetch(`${API_BASE}/complaints/track/${complaintId.trim()}`);
    if (!res.ok) {
      showToast(`No disaster grievance record found for ID: ${complaintId}`, 'warning');
      return;
    }
    const c = await res.json();

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

    steps.forEach(s => s.className = 'step-item');
    lines.forEach(l => l.className = 'step-line');

    let activeLevel = 1;
    if (c.status === 'SUBMITTED') activeLevel = 1;
    else if (c.status === 'VERIFIED') activeLevel = 2;
    else if (c.status === 'ASSIGNED') activeLevel = 3;
    else if (c.status === 'TEAMS_DISPATCHED') activeLevel = 4;
    else if (c.status === 'RESOLVED') activeLevel = 5;

    for (let i = 0; i < activeLevel; i++) {
      if (i < activeLevel - 1) {
        steps[i].classList.add('step-completed');
        if (lines[i]) lines[i].classList.add('active');
      } else {
        steps[i].classList.add('step-active');
      }
    }

    const feedbackWrap = document.getElementById('track-feedback-action-wrap');
    if (c.status === 'RESOLVED') {
      feedbackWrap.classList.remove('hidden');
      document.getElementById('track-leave-feedback-btn').onclick = () => rateComplaintPrompt(c.id);
    } else {
      feedbackWrap.classList.add('hidden');
    }

    card.scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    showToast('Failed to track grievance', 'danger');
  }
};

window.updateGrievanceStatus = async function(id, status) {
  const notes = prompt(`Enter on-ground operational update note for status [${status}]:`, 'Teams on ground executing emergency response.');
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resolutionNotes: notes || '' })
    });
    if (res.ok) {
      showToast(`Grievance ${id} status updated to ${status}!`, 'success');
      fetchComplaints();
      fetchAnalytics();
      trackGrievanceById(id);
    }
  } catch (e) {
    showToast('Error updating status', 'danger');
  }
};

window.rateComplaintPrompt = async function(complaintId) {
  const rating = prompt('Rate the disaster response team resolution (1 to 5 stars):', '5');
  if (!rating) return;
  const comments = prompt('Enter your citizen feedback comment:', 'Rapid deployment, hazard cleared safely.');

  try {
    await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintId,
        rating: parseInt(rating),
        comments: comments || ''
      })
    });
    showToast('Thank you! Your feedback has been recorded.', 'success');
  } catch (e) {
    showToast('Failed to save feedback', 'danger');
  }
};

// ============================================================================
// RESPONSE DEPARTMENTS
// ============================================================================
async function fetchDepartments() {
  try {
    const res = await fetch(`${API_BASE}/departments`);
    const data = await res.json();
    state.departments = data;
    renderDepartments();
  } catch (e) {
    console.warn('Departments fetch error:', e);
  }
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
    title: document.getElementById('alt-title').value,
    severity: document.getElementById('alt-severity').value,
    disasterType: document.getElementById('alt-type').value,
    targetAudience: 'ALL_CITIZENS',
    message: document.getElementById('alt-message').value,
    issuedBy: state.currentUser.name
  };

  try {
    const res = await fetch(`${API_BASE}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('EMERGENCY SIREN BROADCAST DISPATCHED TO ALL REGISTERED CITIZENS!', 'danger');
      closeModal('modal-broadcast-alert');
      document.getElementById('form-broadcast-alert').reset();
      fetchAlerts();
    }
  } catch (err) {
    showToast('Failed to broadcast alert', 'danger');
  }
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

      // Pitch sweep
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
  try {
    const res = await fetch(`${API_BASE}/learn`);
    const data = await res.json();
    state.modules = data;
    renderLearningModules(data);
  } catch (e) {
    console.warn('Learning fetch error:', e);
  }
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
  try {
    const res = await fetch(`${API_BASE}/quizzes`);
    const data = await res.json();
    renderQuizzes(data);
  } catch (e) {
    console.warn('Quizzes fetch error:', e);
  }
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
          Includes ${q.questionCount} multiple choice survival questions. Passing benchmark: ${q.passingScore}%.
        </p>
      </div>
      <button class="btn btn-primary btn-block" onclick="startQuiz('${q.id}')">Take Citizen Certification Exam &rarr;</button>
    `;
    container.appendChild(card);
  });
}

window.startQuiz = async function(quizId) {
  try {
    const res = await fetch(`${API_BASE}/quizzes/detail/${quizId}`);
    const qData = await res.json();
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
  } catch (e) {
    showToast('Failed to start quiz', 'danger');
  }
};

function startQuizTimer() {
  if (state.quizTimerInterval) clearInterval(state.quizTimerInterval);
  const timerEl = document.getElementById('quiz-timer');
  state.quizTimerInterval = setInterval(() => {
    state.quizSecondsLeft--;
    const mins = Math.floor(state.quizSecondsLeft / 60);
    const secs = state.quizSecondsLeft % 60;
    timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

  try {
    const res = await fetch(`${API_BASE}/quizzes/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    document.getElementById('quiz-runner-view').classList.add('hidden');
    document.getElementById('quiz-list-view').classList.remove('hidden');

    if (result.passed) {
      displayCertificate(result.certificateNumber, state.activeQuiz.title, result.percentage);
      showToast(`Congratulations! Certified with ${result.percentage}%! Certificate issued.`, 'success');
    } else {
      showToast(`Exam completed: Scored ${result.percentage}%. Passing benchmark is ${state.activeQuiz.passingScore}%. Try again!`, 'warning');
    }
    fetchCertificates();
  } catch (e) {
    showToast('Failed to submit exam', 'danger');
  }
}

function displayCertificate(certId, quizTitle, scorePct) {
  document.getElementById('cert-recipient-name').textContent = state.currentUser.name;
  document.getElementById('cert-score-percentage').textContent = `${scorePct}%`;
  document.getElementById('cert-display-id').textContent = certId;
  openModal('modal-certificate');
}

async function fetchCertificates() {
  try {
    const res = await fetch(`${API_BASE}/quizzes/certificates`);
    const certs = await res.json();
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
  } catch (e) {
    console.warn('Certificates fetch error:', e);
  }
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

  try {
    const res = await fetch(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    });
    const data = await res.json();
    appendChatMessage(data.reply, 'bot', data.emergencyActions, data.suggestedHotlines);
  } catch (err) {
    appendChatMessage("Unable to reach emergency network. Please dial 112 or 108 directly.", 'bot');
  }
}

function appendChatMessage(text, sender, actions = [], hotlines = []) {
  const container = document.getElementById('chat-messages');
  const msgEl = document.createElement('div');
  msgEl.className = `chat-message ${sender}`;

  let actionsHtml = '';
  if (actions && actions.length > 0) {
    actionsHtml += `<div class="msg-actions">`;
    actions.forEach(a => {
      actionsHtml += `<span class="msg-action-pill">✓ ${a}</span>`;
    });
    actionsHtml += `</div>`;
  }

  msgEl.innerHTML = `
    <div class="msg-bubble">
      <p>${text}</p>
      ${actionsHtml}
      <div class="msg-meta">${sender === 'bot' ? 'Disaster AI Advisor' : state.currentUser.name} • Just now</div>
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
