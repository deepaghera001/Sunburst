Approach and Challenges: Building a Sunburst Chart in React Using Chart.js
Introduction
The goal of this task was to implement an interactive sunburst chart in a React application using
Chart.js, closely mirroring the features of Plotly's sunburst visualization. The requirements included
hierarchical data display, interactive tooltips, click behavior, filtering, modularity, and clear styling.
My Approach
1. Understanding the Requirements
I started by carefully reviewing the requirements and the example data structure. The key was to
ensure the chart could handle hierarchical data, support interactivity (hover, click, filter), and be
modular and extensible.
2. Data Preparation
The data needed to be hierarchical, with each node having a name and either a value (for leaves) or
a children array (for internal nodes). I made sure to structure the data accordingly and wrote a utility
to flatten the hierarchy for Chart.js, which expects a flat array with parent references.
3. Chart Implementation
I used Chart.js along with a sunburst chart plugin. The chart was rendered inside a React
component, and I ensured that the data transformation logic was separated from the rendering logic
for maintainability.
4. Interactivity
Tooltips: I customized tooltips to show the segment's name, value, and percentage.
Hover Effects: Added visual feedback (highlight/border) on hover.
Click Events: Implemented drill-down functionality, allowing users to zoom into a segment and treat
it as the new root.
5. Filtering
I implemented a keyword filter that allows users to search for nodes by label. The filter is
case-insensitive and ensures that parent nodes of matching descendants remain visible for context.
6. Styling
Colors were assigned based on depth or category, using a consistent palette. I also added subtle
borders between segments for clarity.
Challenges Faced
1. Data Transformation
Flattening the hierarchical data while preserving parent-child relationships was tricky, especially
ensuring unique identification for nodes with duplicate names.
2. Interactive Drill-Down
Managing the chart's state for drill-down and zoom-out actions required careful handling to ensure a
smooth user experience.
3. Filtering Logic
Implementing filtering that preserves context (showing ancestors of matches) involved recursive
logic and performance considerations for larger datasets.
4. Chart.js Limitations
Since sunburst is not a core Chart.js type, I had to rely on a third-party plugin, which sometimes
lacked documentation or required workarounds for advanced interactivity.
5. Styling Consistency
Ensuring that colors were both visually distinct and meaningful across different levels of the
hierarchy was a challenge, especially for larger datasets.
Conclusion
This project required a blend of data manipulation, React state management, and creative use of
Chart.js and its plugins. The main challenges were around data transformation, interactivity, and
working within the constraints of the available charting tools. The result is a modular, interactive
sunburst chart that meets the requirements and can be easily extended or customized in the future.