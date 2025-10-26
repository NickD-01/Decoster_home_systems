# Decoster Home Systems

A modern, feature-rich smart home dashboard with live-updating mock sensor data, interactive controls, and a sleek dark-themed UI.

## Features

### 🏠 Overview Dashboard
- Real-time system status cards (temperature, lights, energy, security)
- Quick action buttons for common tasks
- Live activity log with recent events
- Dynamic time display

### 🏡 Room Control
- Individual room temperature control with adjustable thermostats
- Smart lighting controls with brightness adjustment
- Device monitoring for each room
- Interactive toggles for all controls

### 🔒 Security System
- Arm/disarm security system
- Real-time sensor status monitoring (doors, windows, motion)
- Live camera feed placeholders
- Panic alarm functionality

### ⚡ Energy Management
- 24-hour energy usage graph (Chart.js)
- Daily, monthly, and cost tracking
- Device breakdown by energy consumption
- Usage trends and comparisons

### ⚙️ Settings
- Temperature unit preferences (°F/°C)
- Auto-update toggle for sensor data
- Notification controls
- Automation settings (auto-lock, energy saving, smart scheduling)
- Data management (export, reset, clear)
- System information display

## Technology Stack

- **HTML5**: Semantic markup structure
- **Tailwind CSS**: Modern, responsive dark-theme UI via CDN
- **Chart.js**: Interactive energy usage graphs via CDN
- **Vanilla JavaScript**: No framework dependencies
- **LocalStorage**: Persistent state management

## Installation & Usage

### Quick Start

1. Clone the repository:
```bash
git clone https://github.com/NickD-01/Decoster_home_systems.git
cd Decoster_home_systems
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or simply double-click the `index.html` file.

### Using a Local Server (Optional)

For the best experience, you can serve the files using a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000` in your browser.

## Features in Detail

### Live Data Simulation
- Temperature sensors update every 5 seconds, gradually adjusting to target temperatures
- Random sensor events (motion detection, door/window status)
- Energy usage calculated based on active devices, lighting, and HVAC load
- Persistent state saved to browser localStorage

### Interactive Controls
- **Toggle Switches**: Custom CSS toggle switches for lights and settings
- **Sliders**: Range inputs for temperature and brightness control
- **Quick Actions**: One-click buttons for common scenarios (Away Mode, Night Mode)
- **Navigation**: Sidebar navigation with active state indicators

### Data Persistence
All settings and states are automatically saved to localStorage:
- Room configurations (temperature, lighting, devices)
- Security system status
- Energy usage history
- User preferences

### Responsive Design
- Mobile-friendly layout
- Adaptive grid system
- Touch-optimized controls

## File Structure

```
Decoster_home_systems/
├── index.html          # Main HTML structure
├── app.js              # Application logic and state management
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── LICENSE             # Project license
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

Requires a modern browser with ES6+ support and localStorage.

## Customization

### Adding New Rooms
Edit the `systemState.rooms` array in `app.js`:

```javascript
{ 
    id: 7, 
    name: 'New Room', 
    temperature: 72, 
    targetTemp: 72, 
    lights: false, 
    brightness: 50, 
    devices: ['Device 1', 'Device 2'] 
}
```

### Adding New Sensors
Edit the `systemState.security.sensors` array in `app.js`:

```javascript
{ 
    id: 7, 
    name: 'New Sensor', 
    type: 'door', // or 'window', 'motion'
    status: 'closed', 
    location: 'Location Name' 
}
```

### Modifying Colors
The project uses Tailwind CSS. To change the color scheme, modify the `tailwind.config` section in `index.html`.

## Development

### Local Storage Management
- **View**: Open browser DevTools → Application → Local Storage
- **Clear**: Settings page → Clear All Data
- **Export**: Settings page → Export Data (downloads JSON file)

### Adding New Features
1. Update the HTML structure in `index.html`
2. Add corresponding logic in `app.js`
3. Update state management in `saveState()` and `loadState()` if needed
4. Test data persistence by refreshing the page

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- **Tailwind CSS**: For the beautiful utility-first CSS framework
- **Chart.js**: For elegant data visualization
- **Heroicons**: SVG icons used throughout the interface

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/NickD-01/Decoster_home_systems).

---

**Made with ❤️ for smart home enthusiasts**