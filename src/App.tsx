import { BarChart3, Layers, MousePointerClick, Search, TrendingUp } from 'lucide-react';
import SunburstChart from './components/SunburstChart';

// Sample hierarchical data matching the case study requirements
const companySalesData = [
	{
		name: 'Company Sales',
		children: [
			{
				name: 'Electronics',
				children: [
					{
						name: 'Computers',
						children: [
							{ name: 'Laptops', value: 120 },
							{ name: 'Desktops', value: 80 },
						],
					},
					{
						name: 'Mobile Devices',
						children: [
							{ name: 'Smartphones', value: 200 },
							{ name: 'Tablets', value: 50 },
						],
					},
				],
			},
			{
				name: 'Home Appliances',
				children: [
					{ name: 'Refrigerators', value: 60 },
					{ name: 'Washers', value: 40 },
				],
			},
			{
				name: 'Furniture',
				value: 90,
			},
		],
	},
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
						Interactive hierarchical data visualization following the case study
						requirements. Features drill-down navigation, keyword filtering, and
						responsive design.
					</p>
				</div>

				{/* Main Chart Component */}
				<SunburstChart
					data={companySalesData}
					title="Product Sales"
					className="mb-8"
				/>

				{/* Feature Highlights */}
				<div className="mt-12 grid md:grid-cols-3 gap-6">
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center mb-4">
							<MousePointerClick className="w-6 h-6 text-blue-600 mr-2" />
							<span className="font-semibold text-gray-900">
								Drill-down Navigation
							</span>
						</div>
						<p className="text-gray-600">
							Click on segments to drill down into hierarchical data. Navigate back
							through levels with intuitive controls and breadcrumbs.
						</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center mb-4">
							<Search className="w-6 h-6 text-blue-600 mr-2" />
							<span className="font-semibold text-gray-900">
								Keyword Filtering
							</span>
						</div>
						<p className="text-gray-600">
							Instantly filter chart segments by typing keywords. Parent nodes
							remain visible for context, even if only descendants match.
						</p>
					</div>
					<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
						<div className="flex items-center mb-4">
							<BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
							<span className="font-semibold text-gray-900">
								Interactive Tooltips
							</span>
						</div>
						<p className="text-gray-600">
							Hover over segments to see detailed tooltips with label, value, and
							percentage. Visual highlight on hover for clarity.
						</p>
					</div>
				</div>

				{/* Requirements Summary */}
				<div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Implementation Features
					</h2>
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="font-semibold text-blue-700 mb-2 flex items-center">
								<Layers className="w-5 h-5 mr-2" />
								Hierarchical Sunburst Visualization
							</h3>
							<ul className="list-disc ml-6 text-gray-700 text-sm">
								<li>
									Displays data in concentric rings, each ring a deeper level in
									the hierarchy.
								</li>
								<li>Angular span of each segment proportional to its value.</li>
								<li>Supports any depth of nesting.</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-blue-700 mb-2 flex items-center">
								<TrendingUp className="w-5 h-5 mr-2" />
								Styling & Appearance
							</h3>
							<ul className="list-disc ml-6 text-gray-700 text-sm">
								<li>
									Distinct colors by depth/category, subtle borders between
									segments.
								</li>
								<li>
									Modern, responsive, and accessible UI with Tailwind CSS.
								</li>
								<li>Export chart as PNG image.</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-blue-700 mb-2 flex items-center">
								<Search className="w-5 h-5 mr-2" />
								Filtering & Modularity
							</h3>
							<ul className="list-disc ml-6 text-gray-700 text-sm">
								<li>
									Filter by keyword, case-insensitive, with parent context
									preserved.
								</li>
								<li>
									Separation of data parsing and rendering logic for easy
									extensibility.
								</li>
								<li>Configurable tooltips and click handlers.</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold text-blue-700 mb-2 flex items-center">
								<MousePointerClick className="w-5 h-5 mr-2" />
								Interactivity
							</h3>
							<ul className="list-disc ml-6 text-gray-700 text-sm">
								<li>Drill-down on click, with breadcrumb/back navigation.</li>
								<li>Hover for tooltips and visual highlight.</li>
								<li>Legend for color/segment mapping.</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;