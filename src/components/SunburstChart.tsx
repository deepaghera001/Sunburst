import {
  ArcElement,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import { BarChart3, Download, Search } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DataItem {
  name: string;
  value?: number;
  children?: DataItem[];
}

interface SunburstChartProps {
  data: DataItem[];
  title?: string;
  className?: string;
}

const SunburstChart: React.FC<SunburstChartProps> = ({ 
  data, 
  title = "Sunburst Chart",
  className = "" 
}) => {
  const handleExportCSV = () => {
    const headers = ['Name', 'Value', '% of Total', 'Has Children'];
    const total = currentData.values.reduce((a, b) => a + b, 0);
    const rows = currentData.nodes.map((item, i) => {
      const value = currentData.values[i];
      const percent = total ? ((value / total) * 100).toFixed(2) : '0.00';
      return [
        `"${item.name.replace(/"/g, '""')}"`, // Ensure quotes are closed
        value,
        `${percent}%`,
        item.children && item.children.length > 0 ? 'Yes' : 'No',
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sunburst-data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const [currentLevel, setCurrentLevel] = useState<DataItem[]>(data);
  const [levelHistory, setLevelHistory] = useState<DataItem[][]>([data]);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // Recursively calculate value for a node
  const calculateNodeValue = (node: DataItem): number => {
    if (typeof node.value === 'number') return node.value;
    if (node.children) return node.children.reduce((sum, c) => sum + calculateNodeValue(c), 0);
    return 0;
  };

  // Filter data by keyword, preserving parent context
  const filterData = (nodes: DataItem[], keyword: string): DataItem[] => {
    if (!keyword) return nodes;
    const lower = keyword.toLowerCase();
    const filterRecursive = (node: DataItem): DataItem | null => {
      if (node.name.toLowerCase().includes(lower)) return node;
      if (node.children) {
        const filtered = node.children.map(filterRecursive).filter(Boolean) as DataItem[];
        if (filtered.length > 0) return { ...node, children: filtered };
      }
      return null;
    };
    return nodes.map(filterRecursive).filter(Boolean) as DataItem[];
  };

  // Get current display data (filtered and at current drill level)
  const getDisplayData = () => {
    return filterData(currentLevel, searchKeyword);
  };

  // Generate color palette by depth and index
  const baseColors = [
    '#2563eb', '#f59e42', '#10b981', '#f43f5e', '#a21caf', '#eab308', '#0ea5e9', '#6366f1', '#f472b6', '#22d3ee', '#84cc16', '#f87171', '#facc15', '#14b8a6', '#c026d3', '#fb7185', '#fbbf24', '#38bdf8', '#4ade80', '#fcd34d'
  ];
  const adjustColorBrightness = (color: string, amount: number) => {
    let usePound = false;
    let col = color;
    if (col[0] === "#") {
      col = col.slice(1);
      usePound = true;
    }
    let num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let b = ((num >> 8) & 0x00FF) + amount;
    let g = (num & 0x0000FF) + amount;
    r = Math.max(Math.min(255, r), 0);
    b = Math.max(Math.min(255, b), 0);
    g = Math.max(Math.min(255, g), 0);
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  };
  const generateColors = (count: number, depth: number = 0) => {
    return Array.from({ length: count }, (_, i) => adjustColorBrightness(baseColors[i % baseColors.length], depth * 20));
  };

  // Process data for Chart.js
  const processData = (): { labels: string[]; values: number[]; colors: string[]; hoverColors: string[]; nodes: DataItem[] } => {
    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];
    const hoverColors: string[] = [];

    const displayData = getDisplayData();
    const generatedColors = generateColors(displayData.length, levelHistory.length - 1);

    displayData.forEach((item, index) => {
      const value = calculateNodeValue(item);
      labels.push(item.name);
      values.push(value);
      colors.push(generatedColors[index]);
      hoverColors.push(adjustColorBrightness(generatedColors[index], 20));
    });

    return { labels, values, colors, hoverColors, nodes: displayData };
  };

  // Chart.js data
  const currentData = processData();
  const chartData = {
    labels: currentData.labels,
    datasets: [
      {
        data: currentData.values,
        backgroundColor: currentData.colors,
        hoverBackgroundColor: currentData.hoverColors,
        borderWidth: 2,
        borderColor: '#fff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#2563eb',
        borderRadius: 4,
        borderAlign: 'inner' as const,
      },
    ],
  };

  // Chart.js options
  const chartOptions: ChartOptions<'doughnut'> = {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const label = ctx.label || '';
            const value = ctx.raw as number;
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percent = total ? ((value / total) * 100).toFixed(1) : '0';
            return `${label} | Value: ${value} | % of Total: ${percent}%`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#2563eb',
        bodyColor: '#222',
        borderColor: '#2563eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        caretSize: 8,
        cornerRadius: 8,
      },
    },
    cutout: '60%',
    onHover: (_event, elements) => {
      if (elements.length > 0) {
        setHoveredSegment(currentData.labels[elements[0].index]);
      } else {
        setHoveredSegment(null);
      }
    },
    onClick: (_event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const clickedNode = currentData.nodes[elementIndex];
        setHoveredSegment(clickedNode.name);
        setSelectedIndex(elementIndex); // highlight row in table
        // Drill down if the node has children
        if (clickedNode.children && clickedNode.children.length > 0) {
          setCurrentLevel(clickedNode.children);
          setLevelHistory([...levelHistory, clickedNode.children]);
        }
      } else {
        setSelectedIndex(null);
      }
    },
    animation: { animateRotate: true, animateScale: true },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Inline the breadcrumb path logic since getBreadcrumbPath is now unused elsewhere
  const breadcrumbPath: { name: string; nodes: DataItem[] }[] = (() => {
    const path: { name: string; nodes: DataItem[] }[] = [];
    let nodes = data;
    for (let i = 0; i < levelHistory.length; i++) {
      if (i === 0) {
        path.push({ name: 'Root', nodes });
      } else {
        const prevNodes = levelHistory[i - 1];
        const currentNodes = levelHistory[i];
        const match = prevNodes.find((n) =>
          n.children && n.children.some((c) => c.name === currentNodes[0].name)
        );
        if (match) {
          path.push({ name: match.name, nodes: currentNodes });
          nodes = match.children || [];
        }
      }
    }
    return path;
  })();

  // UI
  return (
    <div className={`w-full bg-white rounded-2xl shadow-lg p-6 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              className="pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 text-gray-700 bg-gray-50"
              placeholder="Filter by keyword..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button
            className="ml-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 flex items-center gap-1"
            onClick={handleExportCSV}
            title="Export as CSV"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>
      {/* Breadcrumb Navigation (single navigation, includes Root) */}
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        {levelHistory.length > 1 && (
          <button
            className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded shadow-sm border border-blue-200 transition"
            onClick={() => {
              const newHistory = [...levelHistory];
              newHistory.pop();
              setLevelHistory(newHistory);
              setCurrentLevel(newHistory[newHistory.length - 1]);
            }}
          >
            <span className="font-bold">&#8592;</span> Back
          </button>
        )}
        <nav className="flex items-center gap-1 flex-wrap">
          {breadcrumbPath.map((item, idx, arr) => (
            <React.Fragment key={idx}>
              {idx < arr.length - 1 ? (
                <button
                  className="hover:underline text-blue-600 font-medium transition"
                  onClick={() => {
                    setLevelHistory(levelHistory.slice(0, idx + 1));
                    setCurrentLevel(item.nodes);
                  }}
                  type="button"
                >
                  {item.name}
                </button>
              ) : (
                <span className="font-semibold text-gray-900">{item.name}</span>
              )}
              {idx < arr.length - 1 && <span className="mx-1">/</span>}
            </React.Fragment>
          ))}
        </nav>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chart Section */}
        <div className="flex-1 bg-gray-50 rounded-xl shadow-inner p-6 flex flex-col items-center justify-center min-w-[320px]">
          <div className="relative w-full h-[350px] flex items-center justify-center">
            <Doughnut
              ref={chartRef}
              data={chartData}
              options={chartOptions}
            />
            {/* Center label */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-lg font-bold text-blue-700">{currentData.labels.length === 1 ? currentData.labels[0] : title}</div>
            </div>
          </div>
          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {currentData.labels.map((label, i) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <span className="inline-block w-4 h-4 rounded-full border border-gray-200" style={{ background: currentData.colors[i] }}></span>
                <span className={hoveredSegment === label ? 'font-bold text-blue-700' : 'text-gray-700'}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Data Table Section */}
        <div className="flex-1 bg-white rounded-xl shadow-inner p-6 overflow-x-auto min-w-[320px]">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Data Table</h3>
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-blue-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-blue-700">Value</th>
                <th className="px-4 py-2 text-left font-medium text-blue-700">% of Total</th>
                <th className="px-4 py-2 text-left font-medium text-blue-700">Has Children</th>
              </tr>
            </thead>
            <tbody>
              {currentData.nodes.map((item, i) => {
                const value = currentData.values[i];
                const total = currentData.values.reduce((a, b) => a + b, 0);
                const percent = total ? ((value / total) * 100).toFixed(1) : '0';
                return (
                  <tr key={item.name} className={`border-b last:border-b-0 hover:bg-blue-50 transition ${selectedIndex === i ? 'bg-blue-100 !font-bold' : ''}`}>
                    <td className="px-4 py-2 font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-2 text-gray-700">{value}</td>
                    <td className="px-4 py-2 text-gray-700">{percent}%</td>
                    <td className="px-4 py-2 text-center">
                      {item.children && item.children.length > 0 ? (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Yes</span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">No</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SunburstChart;