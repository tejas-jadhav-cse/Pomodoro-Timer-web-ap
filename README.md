# Pomodoro Timer Web App

A beautiful and feature-rich Pomodoro Timer web application built with HTML, CSS, and vanilla JavaScript. The app features an elegant design with glassmorphism/neumorphism styling, focused on helping users improve productivity through the Pomodoro Technique with integrated task management.

![Pomodoro Timer App Screenshot](images/favicon.png)

## Features

### Timer Functionality
- **25-minute focus and 5-minute break timers**
- **Beautiful circular progress animation with pulse effect**
- **Clean, minimalistic UI with glassmorphism/neumorphism design**
- **Toggle between light and dark themes**
- **Notification sound when timer completes**
- **Browser notifications support**
- **Session counter to track completed Pomodoro sessions**

### Task Management
- **Integrated task list to track work items**
- **Mark tasks as complete/incomplete**
- **Set active focus task for current Pomodoro session**
- **Automatic association of completed Pomodoros with tasks**
- **Clear completed tasks functionality**
- **Visual indicators for active and completed tasks**

### Statistics & Productivity Tools
- **Statistics dashboard with productivity metrics**
- **Export functionality for task and session data**
- **Recent tasks history with session counts**
- **Visualization of productivity patterns**

### User Experience
- **Motivational quotes that update after each session**
- **Optional background lofi music with volume control**
- **Fully responsive design for all devices**
- **Confetti celebration animation on completing focus sessions**
- **Extensive keyboard shortcuts for efficient workflow**
- **Session and task data saved in localStorage**
- **Progressive Web App (PWA) support for offline usage**

## Usage

### Timer Controls
1. Choose between Focus (25 minutes) and Break (5 minutes) modes
2. Click Start to begin the timer
3. Use Pause to temporarily stop the timer and Resume to continue
4. Click Reset to restart the current timer
5. Toggle the theme between light and dark mode
6. Enable or disable background music and adjust volume as desired

### Task Management
1. Add tasks using the input field below the timer
2. Mark a task as your current focus by clicking the play icon
3. Check off completed tasks by clicking the checkbox
4. Clear completed tasks with the "Clear Completed" button
5. Track remaining tasks with the task counter

### Statistics and Reports
1. View your productivity statistics by clicking "Export Stats"
2. See a summary of your completed Pomodoros and tasks
3. Export your productivity data in JSON format
4. Review your recent tasks and session counts

## Technical Details

- **HTML5**: Semantic markup for better accessibility and SEO
- **CSS3**: Modern styling with flexbox, CSS variables, and smooth transitions
- **JavaScript**: Clean, modular code with precise timer implementation
- **LocalStorage**: For persisting user preferences, task data, and session history
- **Custom Events**: For communication between modules
- **CSS Animations**: For visual feedback and engaging user experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **PWA Support**: Service worker for offline functionality
- **JSON Export**: For data portability and analysis

## Architecture

This project uses vanilla JavaScript without any external dependencies, making it lightweight and fast. The code is structured following best practices:

- **Modular JavaScript** with clear separation of concerns:
  - `script.js`: Core timer functionality and app initialization
  - `tasks.js`: Task management functionality
  - `statistics.js`: Data visualization and statistics
  - `export.js`: Data export functionality
  - `confetti.js`: Visual celebration animations
  - `service-worker.js`: PWA offline support

- **Design Patterns**:
  - Observer pattern for event handling
  - Module pattern for code organization
  - Factory pattern for task creation

- **CSS Architecture**:
  - BEM methodology for class naming
  - CSS custom properties for theming
  - Mobile-first responsive design
  - Hardware-accelerated animations

- **Data Management**:
  - Persistent storage with localStorage
  - JSON-based data structure
  - Data validation and sanitization

## Deployment

The app can be deployed on any static web hosting service. Ready-to-use configuration files are included for Netlify deployment.

### Deploy to Netlify

1. Fork/clone this repository
2. Sign up/login to [Netlify](https://www.netlify.com/)
3. Click "New site from Git"
4. Select your repository
5. Keep the default settings and click "Deploy site"

### Deploy to GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select "main" branch and "/" (root) folder
4. Click "Save"

### Deploy to Vercel

1. Fork/clone this repository
2. Sign up/login to [Vercel](https://vercel.com/)
3. Click "New Project"
4. Import your repository
5. Keep the default settings and click "Deploy"

## Project Structure

```
├── index.html                 # Main HTML structure
├── style.css                   # Core styling
├── script.js                   # Main timer functionality
├── tasks.js                    # Task management system
├── statistics.js               # Statistics visualization
├── export.js                   # Data export functionality
├── confetti.js                 # Celebration animations
├── service-worker.js           # PWA offline support
├── manifest.json               # PWA configuration
├── netlify.toml                # Netlify deployment config
├── package.json                # Project metadata
├── favicon.ico                 # Browser favicon
├── robots.txt                  # SEO configuration
├── README.md                   # Project documentation
├── images/                     # Image assets
│   ├── favicon.png             # App icon
│   └── favicon.svg             # Vector icon
└── sounds/                     # Audio assets
    ├── notification.mp3        # Timer completion sound
    └── lofi-background.mp3     # Background music
```

## Keyboard Shortcuts

- **Space**: Start/Pause timer
- **R**: Reset timer
- **F**: Switch to Focus mode
- **B**: Switch to Break mode
- **T**: Toggle light/dark theme
- **M**: Toggle background music
- **N**: Add new task (focuses the task input field)
- **X**: Export statistics and task data
- **C**: Show credits modal

## Browser Compatibility

The app has been tested and is fully functional on the following browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Chrome for Android
- Safari for iOS

## Installation as a PWA

You can install this application as a Progressive Web App on supported devices:

### On Desktop:
1. Visit the deployed site in Chrome or Edge
2. Look for the install icon in the address bar
3. Click "Install" and follow the prompts

### On Mobile:
1. Visit the deployed site in your mobile browser
2. Tap the share button (iOS) or menu button (Android)
3. Select "Add to Home Screen" or "Install App"
4. Follow the on-screen instructions

## Future Enhancements

- **Custom timer duration settings** (adjust Pomodoro length)
- **Focus categories** for different types of work
- **Advanced statistics dashboard** with charts and patterns
- **Breathing exercise** interstitial between sessions
- **Goal setting** and long-term tracking
- **Multiple theme options** beyond light/dark
- **Background sounds library** with various options
- **Team/shared focus sessions** for remote collaboration
- **Calendar integration** for scheduling Pomodoros

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Francesco Cirillo for the Pomodoro Technique
- Open source community for inspiration
- All contributors and testers