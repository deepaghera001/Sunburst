# Sunburst Chart React App

This project implements an interactive sunburst chart in a React application using Chart.js. The chart visualizes hierarchical data with concentric rings, supports tooltips, drill-down, filtering, and is styled for clarity and extensibility.

## Features
- Hierarchical sunburst visualization using Chart.js
- Interactive tooltips and hover effects
- Drill-down and zoom-in on chart segments
- Keyword-based filtering of chart nodes
- Modular, extensible, and easy to customize
- Responsive and visually clear design

## Project Structure
```
/Approach_and_Challenges.md   # Project approach and challenges document
/src/
  App.tsx                    # Main React app
  components/
    SunburstChart.tsx        # Sunburst chart component
  ...                        # Other source files
index.html                   # App entry point
package.json                 # Project dependencies and scripts
vite.config.ts               # Vite configuration
```

## Installation

1. **Clone the repository:**
   ```zsh
   git clone <your-repo-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```zsh
   npm install
   ```

## Running the App

Start the development server:
```zsh
npm run dev
```

The app will be available at `http://localhost:5173` (or as indicated in your terminal).

## Building for Production

To build the app for production:
```zsh
npm run build
```
The output will be in the `dist/` directory.

## Customization
- Edit `src/components/SunburstChart.tsx` to adjust chart logic, interactivity, or styling.
- Update data or add new features as needed.

## Dependencies
- React
- Chart.js
- chartjs-chart-sunburst (or similar plugin)
- Vite (for development/build)

## License
This project is for demonstration and case study purposes.
