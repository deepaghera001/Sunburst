import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ChevronDown, BarChart3, Layers, TrendingUp, Search, Filter } from 'lucide-react';

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
  const [currentLevel, setCurrentLevel] = useState<DataItem[]>(data);
  const [levelHistory, setLevelHistory] = useState<DataItem[][]>([data]);
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [clickedSegment, setClickedSegment] = useState<string | null>(null);
  const chartRef = useRef<ChartJS<'doughnut'>>(null);

  // Calculate values for nodes that don't have explicit values
  const calculateNodeValue = (node: DataItem): number => {
    if (node.value !== undefined) {
      return node.value;
    }
    if (node.children && node.children.length > 0) {
      return node.children.reduce((sum, child) => sum + calculateNodeValue(child), 0);
    }
    return 0;
  };

  // Filter data based on search keyword
  const filterData = (nodes: DataItem[], keyword: string): DataItem[] => {
    if (!keyword.trim()) return nodes;
    
    const filtered: DataItem[] = [];
    
    for (const node of nodes) {
      if (node.name.toLowerCase().includes(keyword.toLowerCase())) {
        filtered.push(node);
      } else if (node.children) {
        const filteredChildren = filterData(node.children, keyword);
        if (filteredChildren.length > 0) {
          filtered.push({
            ...node,
            children: filteredChildren
          });
        }
      }
    }
    
    return filtered;
  };

  // Get current display data
  const getDisplayData = () => {
    const filtered = filterData(currentLevel, searchKeyword);
    return filtered;
  };

  // Generate colors based on depth and index
  const generateColors = (count: number, depth: number = 0) => {
    const colorPalettes = [
      // Level 0 - Main categories
      ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'],
      // Level 1 - Subcategories  
      ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#22D3EE'],
      // Level 2 - Sub-subcategories
      ['#93C5FD', '#6EE7B7', '#FCD34D', '#FCA5A5', '#C4B5FD', '#67E8F9']
    ];
    
    const palette = colorPalettes[Math.min(depth, colorPalettes.length - 1)];
    const colors: string[] = [];
    
    for (let i = 0; i < count; i++) {
      colors.push(palette[i % palette.length]);
    }
    
    return colors;
  };

  // Process data for Chart.js
  const processData = (nodes: DataItem[]) => {
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

  // Helper function to adjust color brightness
  const adjustColorBrightness = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const num = parseInt(hex, 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + amount));
    const g = Math.min(255, Math.max(0, (num >> 8 & 0x00FF) + amount));
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  };

  const currentData = processData(currentLevel);

  const chartData = {
    labels: currentData.labels,
    datasets: [
      {
        data: currentData.values,
        backgroundColor: currentData.colors,
        hoverBackgroundColor: currentData.hoverColors,
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4,
        hoverBorderColor: '#ffffff',
        borderRadius: 4,
        borderAlign: 'inner' as const,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: levelHistory.length === 1 ? '45%' : '55%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        setHoveredSegment(currentData.labels[elementIndex]);
      } else {
        setHoveredSegment(null);
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const clickedNode = currentData.nodes[elementIndex];
        setClickedSegment(clickedNode.name);
        
        // Drill down if the node has children
        if (clickedNode.children && clickedNode.children.length > 0) {
          setCurrentLevel(clickedNode.children);
          setLevelHistory([...levelHistory, clickedNode.children]);
        }
      }
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
      easing: 'easeOutQuart',
    },
    elements: {
      arc: {
        borderJoinStyle: 'round',
      },
    },
  };

  // Navigate back to previous level
  const navigateBack = () => {
    if (levelHistory.length > 1) {
      const newHistory = levelHistory.slice(0, -1);
      setLevelHistory(newHistory);
      setCurrentLevel(newHistory[newHistory.length - 1]);
      setClickedSegment(null);
    }
  };

  // Reset to root level
  const resetToRoot = () => {
    setCurrentLevel(data);
    setLevelHistory([data]);
    setClickedSegment(null);
    setSearchKeyword('');
  };

  // Calculate total value
  const totalValue = currentData.values.reduce((sum, value) => sum + value, 0);

  // Get current level name
  const getCurrentLevelName = () => {
    if (levelHistory.length === 1) return 'Root Level';
    return `Level ${levelHistory.length}`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">Interactive hierarchical data visualization</p>
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center space-x-3">
            {levelHistory.length > 1 && (
              <button
                onClick={navigateBack}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
            )}
            <button
              onClick={resetToRoot}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Search and Level Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 border border-gray-200">
            <Layers className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{getCurrentLevelName()}</span>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Container */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="h-96 relative">
                <Doughnut ref={chartRef} data={chartData} options={options} />
                
                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {totalValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Total Value</div>
                    {hoveredSegment && (
                      <div className="mt-2 px-3 py-1 bg-blue-100 rounded-full">
                        <div className="text-xs font-medium text-blue-700">{hoveredSegment}</div>
                      </div>
                    )}
                    {clickedSegment && (
                      <div className="mt-2 px-3 py-1 bg-green-100 rounded-full">
                        <div className="text-xs font-medium text-green-700">Clicked: {clickedSegment}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend and Stats */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-gray-600" />
                Data Breakdown
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {currentData.labels.map((label, index) => {
                  const value = currentData.values[index];
                  const percentage = ((value / totalValue) * 100).toFixed(1);
                  const isHovered = hoveredSegment === label;
                  const hasChildren = currentData.nodes[index].children && currentData.nodes[index].children!.length > 0;
                  
                  return (
                    <div 
                      key={label}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                        isHovered ? 'bg-white shadow-sm scale-105' : 'hover:bg-white hover:shadow-sm'
                      }`}
                      onMouseEnter={() => setHoveredSegment(label)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      onClick={() => {
                        if (hasChildren) {
                          const clickedNode = currentData.nodes[index];
                          setCurrentLevel(clickedNode.children!);
                          setLevelHistory([...levelHistory, clickedNode.children!]);
                          setClickedSegment(clickedNode.name);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full shadow-sm"
                          style={{ backgroundColor: currentData.colors[index] }}
                        />
                        <span className="font-medium text-gray-900 text-sm">{label}</span>
                        {hasChildren && (
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900 text-sm">{value.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Categories</span>
                  <span className="font-semibold text-gray-900">{currentData.labels.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Largest Segment</span>
                  <span className="font-semibold text-gray-900">
                    {Math.max(...currentData.values).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Value</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(totalValue / currentData.labels.length).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Current Level</span>
                  <span className="font-semibold text-gray-900">{levelHistory.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunburstChart;