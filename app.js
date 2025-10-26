// Decoster Home Systems - Main Application Logic

// Initialize system state
let systemState = {
    rooms: [
        { id: 1, name: 'Living Room', temperature: 72, targetTemp: 72, lights: true, brightness: 80, devices: ['TV', 'Sound System'] },
        { id: 2, name: 'Master Bedroom', temperature: 68, targetTemp: 68, lights: false, brightness: 50, devices: ['Ceiling Fan'] },
        { id: 3, name: 'Kitchen', temperature: 70, targetTemp: 70, lights: true, brightness: 100, devices: ['Refrigerator', 'Coffee Maker'] },
        { id: 4, name: 'Home Office', temperature: 71, targetTemp: 71, lights: true, brightness: 90, devices: ['Computer', 'Printer'] },
        { id: 5, name: 'Guest Bedroom', temperature: 69, targetTemp: 69, lights: false, brightness: 60, devices: [] },
        { id: 6, name: 'Garage', temperature: 65, targetTemp: 65, lights: false, brightness: 100, devices: ['Door Opener'] }
    ],
    security: {
        armed: true,
        sensors: [
            { id: 1, name: 'Front Door', type: 'door', status: 'closed', location: 'Entry' },
            { id: 2, name: 'Back Door', type: 'door', status: 'closed', location: 'Kitchen' },
            { id: 3, name: 'Garage Door', type: 'door', status: 'closed', location: 'Garage' },
            { id: 4, name: 'Living Room Window', type: 'window', status: 'closed', location: 'Living Room' },
            { id: 5, name: 'Bedroom Window', type: 'window', status: 'closed', location: 'Master Bedroom' },
            { id: 6, name: 'Motion Sensor 1', type: 'motion', status: 'inactive', location: 'Hallway' }
        ]
    },
    energy: {
        current: 0,
        today: 0,
        monthly: 0,
        history: []
    },
    activityLog: []
};

// Load state from localStorage
function loadState() {
    const saved = localStorage.getItem('decosterHomeState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            systemState = { ...systemState, ...parsed };
        } catch (e) {
            console.error('Error loading state:', e);
        }
    }
}

// Save state to localStorage
function saveState() {
    try {
        localStorage.setItem('decosterHomeState', JSON.stringify(systemState));
    } catch (e) {
        console.error('Error saving state:', e);
    }
}

// Add activity to log
function addActivity(message, type = 'info') {
    const activity = {
        message,
        type,
        timestamp: new Date().toLocaleTimeString()
    };
    systemState.activityLog.unshift(activity);
    if (systemState.activityLog.length > 10) {
        systemState.activityLog.pop();
    }
    saveState();
    updateActivityLog();
}

// Update activity log display
function updateActivityLog() {
    const logContainer = document.getElementById('activity-log');
    if (!logContainer) return;

    logContainer.innerHTML = systemState.activityLog.map(activity => {
        const iconColors = {
            info: 'text-blue-500',
            success: 'text-green-500',
            warning: 'text-yellow-500',
            error: 'text-red-500'
        };
        return `
            <div class="flex items-start space-x-3 p-3 bg-dark-bg rounded-lg">
                <svg class="w-5 h-5 ${iconColors[activity.type]} flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">
                    <div class="text-sm">${activity.message}</div>
                    <div class="text-xs text-gray-400 mt-1">${activity.timestamp}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Update current time
function updateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        });
    }
}

// Navigation
function setupNavigation() {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            
            // Update active link
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Show selected page
            document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
            document.getElementById(`${page}-page`).classList.remove('hidden');
        });
    });
}

// Overview Page Updates
function updateOverview() {
    // Average temperature
    const avgTemp = systemState.rooms.reduce((sum, room) => sum + room.temperature, 0) / systemState.rooms.length;
    document.getElementById('avg-temperature').textContent = `${avgTemp.toFixed(1)}°F`;
    
    // Lights count
    const lightsOn = systemState.rooms.filter(r => r.lights).length;
    document.getElementById('lights-count').textContent = lightsOn;
    document.getElementById('total-lights').textContent = systemState.rooms.length;
    
    // Energy usage
    document.getElementById('energy-usage').textContent = systemState.energy.today.toFixed(1);
    
    // Security status
    const securityEl = document.getElementById('security-status');
    securityEl.textContent = systemState.security.armed ? 'Armed' : 'Disarmed';
    securityEl.className = systemState.security.armed ? 'text-3xl font-bold text-green-500' : 'text-3xl font-bold text-yellow-500';
}

// Rooms Page
function renderRooms() {
    const container = document.getElementById('rooms-grid');
    if (!container) return;
    
    container.innerHTML = systemState.rooms.map(room => `
        <div class="bg-dark-card border border-dark-border rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-semibold">${room.name}</h3>
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
            </div>
            
            <div class="space-y-4">
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-400 text-sm">Temperature</span>
                        <span class="text-lg font-bold">${room.temperature}°F</span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <button class="px-2 py-1 bg-dark-bg rounded hover:bg-slate-700 transition" onclick="adjustTemp(${room.id}, -1)">-</button>
                        <input type="range" min="60" max="80" value="${room.targetTemp}" class="flex-1" onchange="setTargetTemp(${room.id}, this.value)">
                        <button class="px-2 py-1 bg-dark-bg rounded hover:bg-slate-700 transition" onclick="adjustTemp(${room.id}, 1)">+</button>
                        <span class="text-sm text-gray-400">${room.targetTemp}°F</span>
                    </div>
                </div>
                
                <div>
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-gray-400 text-sm">Lighting</span>
                        <label class="toggle-switch">
                            <input type="checkbox" ${room.lights ? 'checked' : ''} onchange="toggleRoomLight(${room.id})">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    ${room.lights ? `
                        <div class="flex items-center space-x-2">
                            <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"></path>
                            </svg>
                            <input type="range" min="0" max="100" value="${room.brightness}" class="flex-1" onchange="setBrightness(${room.id}, this.value)">
                            <span class="text-sm text-gray-400">${room.brightness}%</span>
                        </div>
                    ` : ''}
                </div>
                
                ${room.devices.length > 0 ? `
                    <div>
                        <div class="text-gray-400 text-sm mb-2">Devices</div>
                        <div class="flex flex-wrap gap-2">
                            ${room.devices.map(device => `
                                <span class="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">${device}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Room control functions
function toggleRoomLight(roomId) {
    const room = systemState.rooms.find(r => r.id === roomId);
    if (room) {
        room.lights = !room.lights;
        addActivity(`${room.name} lights ${room.lights ? 'turned on' : 'turned off'}`, 'info');
        saveState();
        renderRooms();
        updateOverview();
    }
}

function adjustTemp(roomId, delta) {
    const room = systemState.rooms.find(r => r.id === roomId);
    if (room) {
        room.targetTemp = Math.max(60, Math.min(80, room.targetTemp + delta));
        addActivity(`${room.name} temperature set to ${room.targetTemp}°F`, 'info');
        saveState();
        renderRooms();
    }
}

function setTargetTemp(roomId, temp) {
    const room = systemState.rooms.find(r => r.id === roomId);
    if (room) {
        room.targetTemp = parseInt(temp);
        addActivity(`${room.name} temperature set to ${room.targetTemp}°F`, 'info');
        saveState();
        renderRooms();
    }
}

function setBrightness(roomId, brightness) {
    const room = systemState.rooms.find(r => r.id === roomId);
    if (room) {
        room.brightness = parseInt(brightness);
        saveState();
        renderRooms();
    }
}

// Security Page
function renderSecurity() {
    const container = document.getElementById('sensors-grid');
    if (!container) return;
    
    container.innerHTML = systemState.security.sensors.map(sensor => {
        const statusColors = {
            closed: 'text-green-500',
            open: 'text-red-500',
            inactive: 'text-green-500',
            active: 'text-yellow-500'
        };
        
        return `
            <div class="bg-dark-bg rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium">${sensor.name}</span>
                    <span class="text-xs px-2 py-1 bg-dark-card rounded ${statusColors[sensor.status]}">${sensor.status.toUpperCase()}</span>
                </div>
                <div class="text-sm text-gray-400">${sensor.location}</div>
            </div>
        `;
    }).join('');
    
    // Update alarm status
    const alarmStatus = document.getElementById('alarm-status');
    if (alarmStatus) {
        alarmStatus.textContent = systemState.security.armed ? 'ARMED' : 'DISARMED';
        alarmStatus.className = systemState.security.armed 
            ? 'px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm font-semibold'
            : 'px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm font-semibold';
    }
}

function armSecurity() {
    systemState.security.armed = true;
    addActivity('Security system armed', 'success');
    saveState();
    renderSecurity();
    updateOverview();
}

function disarmSecurity() {
    systemState.security.armed = false;
    addActivity('Security system disarmed', 'warning');
    saveState();
    renderSecurity();
    updateOverview();
}

function panicAlarm() {
    addActivity('🚨 PANIC ALARM ACTIVATED! Emergency services notified.', 'error');
}

// Energy Page
function updateEnergyPage() {
    document.getElementById('today-energy').textContent = `${systemState.energy.today.toFixed(1)} kWh`;
    document.getElementById('month-energy').textContent = `${systemState.energy.monthly.toFixed(1)} kWh`;
    document.getElementById('energy-cost').textContent = `$${(systemState.energy.monthly * 0.12).toFixed(2)}`;
}

function initEnergyChart() {
    const ctx = document.getElementById('energy-chart');
    if (!ctx) return;
    
    // Generate 24 hours of data
    const labels = [];
    const data = [];
    for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`);
        // Simulate usage pattern (higher during day, lower at night)
        const baseUsage = i >= 6 && i <= 22 ? 2.5 : 1.0;
        data.push(baseUsage + Math.random() * 1.5);
    }
    
    systemState.energy.history = data;
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: data,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: 'rgb(148, 163, 184)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(148, 163, 184, 0.1)'
                    },
                    ticks: {
                        color: 'rgb(148, 163, 184)',
                        maxRotation: 0
                    }
                }
            }
        }
    });
}

// Settings Page
function updateSettingsPage() {
    const lastUpdate = document.getElementById('last-update');
    if (lastUpdate) {
        lastUpdate.textContent = new Date().toLocaleDateString();
    }
    
    const storageInfo = document.getElementById('storage-info');
    if (storageInfo) {
        const stateSize = new Blob([JSON.stringify(systemState)]).size;
        storageInfo.textContent = `${(stateSize / 1024).toFixed(2)} KB`;
    }
}

// Quick Actions
function toggleAllLights() {
    const anyOn = systemState.rooms.some(r => r.lights);
    systemState.rooms.forEach(room => {
        room.lights = !anyOn;
    });
    addActivity(`All lights ${anyOn ? 'turned off' : 'turned on'}`, 'info');
    saveState();
    renderRooms();
    updateOverview();
}

function setAwayMode() {
    systemState.rooms.forEach(room => {
        room.lights = false;
        room.targetTemp = 68;
    });
    systemState.security.armed = true;
    addActivity('Away mode activated - lights off, security armed', 'success');
    saveState();
    renderRooms();
    renderSecurity();
    updateOverview();
}

function setNightMode() {
    systemState.rooms.forEach(room => {
        if (room.name !== 'Master Bedroom') {
            room.lights = false;
        } else {
            room.lights = true;
            room.brightness = 20;
        }
        room.targetTemp = 68;
    });
    addActivity('Night mode activated', 'info');
    saveState();
    renderRooms();
    updateOverview();
}

function emergencyAlert() {
    addActivity('🚨 Emergency alert triggered! Please check all systems.', 'error');
}

function exportData() {
    const dataStr = JSON.stringify(systemState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decoster-home-data.json';
    link.click();
    addActivity('Data exported successfully', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
        localStorage.removeItem('decosterHomeState');
        location.reload();
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}

// Simulate sensor data updates
function simulateSensorUpdates() {
    // Randomly update temperatures
    systemState.rooms.forEach(room => {
        // Gradually move temperature towards target
        if (room.temperature < room.targetTemp) {
            room.temperature = Math.min(room.targetTemp, room.temperature + 0.5);
        } else if (room.temperature > room.targetTemp) {
            room.temperature = Math.max(room.targetTemp, room.temperature - 0.5);
        }
        // Add small random fluctuation
        room.temperature += (Math.random() - 0.5) * 0.2;
    });
    
    // Update energy usage
    const currentUsage = systemState.rooms.reduce((sum, room) => {
        let usage = room.lights ? room.brightness * 0.001 : 0;
        usage += Math.abs(room.temperature - room.targetTemp) * 0.05;
        usage += room.devices.length * 0.1;
        return sum + usage;
    }, 0);
    
    systemState.energy.current = currentUsage;
    systemState.energy.today += currentUsage / 3600; // Convert to kWh (assuming 1 sec updates)
    systemState.energy.monthly = systemState.energy.today * 30;
    
    // Occasionally trigger sensor events
    if (Math.random() < 0.01) {
        const sensor = systemState.security.sensors[Math.floor(Math.random() * systemState.security.sensors.length)];
        if (sensor.type === 'motion') {
            sensor.status = sensor.status === 'active' ? 'inactive' : 'active';
            if (sensor.status === 'active') {
                addActivity(`Motion detected: ${sensor.location}`, 'warning');
            }
        }
    }
    
    saveState();
    updateOverview();
    updateEnergyPage();
}

// Initialize application
function init() {
    loadState();
    setupNavigation();
    updateTime();
    updateOverview();
    renderRooms();
    renderSecurity();
    updateEnergyPage();
    updateSettingsPage();
    updateActivityLog();
    
    // Initialize energy chart
    setTimeout(initEnergyChart, 100);
    
    // Update time every second
    setInterval(updateTime, 1000);
    
    // Simulate sensor updates
    setInterval(simulateSensorUpdates, 5000);
    
    // Add initial activity
    if (systemState.activityLog.length === 0) {
        addActivity('System initialized successfully', 'success');
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
