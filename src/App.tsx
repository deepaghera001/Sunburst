import React from 'react';
import SunburstChart from './components/SunburstChart';

// Sample hierarchical data matching the case study requirements
const companySalesData = [
  {
    name: "Company Sales",
    children: [
      {
        name: "Electronics",
        children: [
          {
            name: "Computers",
            children: [
              { name: "Laptops", value: 120 },
              { name: "Desktops", value: 80 }
            ]
          },
          {
            name: "Mobile Devices", 
            children: [
              { name: "Smartphones", value: 200 },
              { name: "Tablets", value: 50 }
            ]
          }
        ]
      },
      {
        name: "Home Appliances",
        children: [
          { name: "Refrigerators", value: 60 },
          { name: "Washers", value: 40 }
        ]
      },
      {
        name: "Furniture",
        value: 90
      }
    ]
  }
];

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React Sunburst Chart with Chart.js
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interactive hierarchical data visualization following the case study requirements.
            Features drill-down navigation, keyword filtering, and responsive design.
          </p>
        </div>

        {/* Main Chart Component */}
        <SunburstChart 
          data={companySalesData}
          title="Company Sales Sunburst Chart"
          className="mb-8"
        />

        {/* Feature Highlights */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Interactive Navigation</h3>
            </div>
            <p className="text-gray-600">
              Click on segments to drill down into hierarchical data. Navigate back through levels with intuitive controls.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Keyword Filtering</h3>
            </div>
            <p className="text-gray-600">
              Filter data by keywords while preserving hierarchical context. Search functionality maintains parent-child relationships.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Case Study Compliant</h3>
            </div>
            <p className="text-gray-600">
              Built according to the exact specifications in the case study with proper data structure and interaction patterns.
            </p>
          </div>
        </div>

        {/* Requirements Summary */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Implementation Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Core Requirements Met</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Hierarchical data visualization with concentric rings
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Interactive hover behavior with tooltips
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Click behavior for drill-down navigation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  Keyword filtering with context preservation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Features</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Modular and extensible architecture
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Configurable styling and appearance
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Responsive design for all screen sizes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Comprehensive data statistics and insights
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;