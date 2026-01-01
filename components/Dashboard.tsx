/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, Legend
} from 'recharts';
import { performanceData, fabricStressTest } from '../data/mockHistoricalData';
import { useProject } from '../contexts/ProjectContext';

// ==========================================
// لوحة القيادة (Analytical Dashboard)
// عرض البيانات الهندسية والإحصائية
// ==========================================

const Dashboard: React.FC = () => {
  const { activeScene } = useProject();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 h-full overflow-y-auto bg-gray-50">
      
      {/* 1. مخطط أداء الأزياء عبر المشاهد */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Costume Performance History</h3>
            <span className="text-[10px] font-mono text-gray-400">DATA SOURCE: SCENE LOGS</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{fontSize: 10}} />
              <YAxis tick={{fontSize: 10}} />
              <Tooltip 
                contentStyle={{backgroundColor: '#1a1a1a', border: 'none', borderRadius: '4px', fontSize: '12px', color: '#fff'}}
              />
              <Legend wrapperStyle={{fontSize: '12px', paddingTop: '10px'}}/>
              <Line type="monotone" dataKey="durability" stroke="#2563eb" strokeWidth={2} name="Durability" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="comfort" stroke="#10b981" strokeWidth={2} name="Actor Comfort" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. رادار تحليل خصائص القماش */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Fabric Stress Test Analysis</h3>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded">ACTIVE: {activeScene}</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={fabricStressTest}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#4b5563'}} />
              <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{fontSize: 8}} />
              <Radar name="Current Selection" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Radar name="Safety Standard" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;
