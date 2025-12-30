/**
 * AI Agents Control Panel - React Component
 * لوحة التحكم بالوكلاء الذكيين
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Agent {
  id: string;
  name: string;
  nameAr: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  specialty: string;
}

const AGENTS: Agent[] = [
  {
    id: 'ORCHESTRATOR_10',
    name: 'Cinema Maestro',
    nameAr: 'المايسترو السينمائي',
    status: 'idle',
    progress: 0,
    specialty: 'Orchestrator & Supervisor'
  },
  {
    id: 'SET_GENERATOR_01',
    name: 'Set Generator',
    nameAr: 'مولد الديكورات',
    status: 'idle',
    progress: 0,
    specialty: 'AI Set Generation'
  },
  {
    id: 'CULTURAL_AI_02',
    name: 'Cultural AI',
    nameAr: 'الذكاء الثقافي',
    status: 'idle',
    progress: 0,
    specialty: 'Cultural Authenticity'
  },
  {
    id: 'VISUAL_ENGINE_03',
    name: 'Visual Engine',
    nameAr: 'محرك الإلهام',
    status: 'idle',
    progress: 0,
    specialty: 'Visual Inspiration'
  },
  {
    id: 'PERSONAL_AI_04',
    name: 'Personal Assistant',
    nameAr: 'المساعد الشخصي',
    status: 'idle',
    progress: 0,
    specialty: 'AI Assistant'
  },
  {
    id: 'MIXED_REALITY_05',
    name: 'Mixed Reality',
    nameAr: 'الواقع المختلط',
    status: 'idle',
    progress: 0,
    specialty: 'MR Engine'
  },
  {
    id: 'AGING_SIMULATOR_06',
    name: 'Aging Simulator',
    nameAr: 'محاكي التقادم',
    status: 'idle',
    progress: 0,
    specialty: 'Set Aging'
  },
  {
    id: 'STORYTELLING_07',
    name: 'Storytelling',
    nameAr: 'السرد البصري',
    status: 'idle',
    progress: 0,
    specialty: 'Visual Storytelling'
  },
  {
    id: 'FANTASY_GENERATOR_08',
    name: 'Fantasy Generator',
    nameAr: 'العوالم الخيالية',
    status: 'idle',
    progress: 0,
    specialty: 'Fantasy Worlds'
  },
  {
    id: 'AUDIO_ANALYZER_09',
    name: 'Audio Analyzer',
    nameAr: 'محلل الصوت',
    status: 'idle',
    progress: 0,
    specialty: 'Audio Analysis'
  }
];

export default function AIAgentsControl() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [systemStatus, setSystemStatus] = useState<'offline' | 'initializing' | 'online'>('offline');

  const initializeSystem = async () => {
    setSystemStatus('initializing');

    // Simulate initialization
    for (let i = 0; i < agents.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAgents(prev => prev.map((agent, idx) =>
        idx === i ? { ...agent, status: 'running', progress: 100 } : agent
      ));
    }

    setSystemStatus('online');

    // Mark all as completed
    setTimeout(() => {
      setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' })));
    }, 1000);
  };

  const runAgent = async (agentId: string) => {
    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, status: 'running', progress: 0 } : agent
    ));

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setAgents(prev => prev.map(agent =>
        agent.id === agentId ? { ...agent, progress: i } : agent
      ));
    }

    setAgents(prev => prev.map(agent =>
      agent.id === agentId ? { ...agent, status: 'completed' } : agent
    ));
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'idle':
        return 'bg-gray-400';
      case 'running':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusEmoji = (status: Agent['status']) => {
    switch (status) {
      case 'idle':
        return '⚪';
      case 'running':
        return '🔵';
      case 'completed':
        return '✅';
      case 'error':
        return '🔴';
      default:
        return '⚫';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎬 AI Agents Orchestration
          </h1>
          <h2 className="text-3xl font-bold text-purple-300 mb-4">
            نظام تنسيق الوكلاء الذكيين
          </h2>
          <p className="text-xl text-gray-300">
            Film Production AI Systems - مشروع أنظمة الذكاء الاصطناعي للإنتاج السينمائي
          </p>
        </motion.div>

        {/* System Status */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">System Status | حالة النظام</h3>
              <p className="text-gray-400">
                {systemStatus === 'offline' && 'System Offline - النظام متوقف'}
                {systemStatus === 'initializing' && 'Initializing... - جاري التهيئة...'}
                {systemStatus === 'online' && 'System Online - النظام متصل'}
              </p>
            </div>
            <button
              onClick={initializeSystem}
              disabled={systemStatus !== 'offline'}
              className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                systemStatus === 'offline'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              {systemStatus === 'offline' && '🚀 Initialize System'}
              {systemStatus === 'initializing' && '⏳ Initializing...'}
              {systemStatus === 'online' && '✅ System Ready'}
            </button>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedAgent(agent)}
              className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 cursor-pointer hover:border-purple-500 transition-all"
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{getStatusEmoji(agent.status)}</div>
                <h3 className="text-lg font-bold mb-1">{agent.name}</h3>
                <p className="text-sm text-purple-300 mb-2">{agent.nameAr}</p>
                <p className="text-xs text-gray-400 mb-4">{agent.specialty}</p>

                {/* Progress Bar */}
                {agent.status === 'running' && (
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                )}

                {/* Status Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(agent.status)}`}>
                  {agent.status.toUpperCase()}
                </div>

                {/* Run Button */}
                {systemStatus === 'online' && agent.status !== 'running' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      runAgent(agent.id);
                    }}
                    className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-bold transition-all"
                  >
                    ▶ Run Agent
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Agent Details Modal */}
        {selectedAgent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedAgent(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full border border-purple-500"
            >
              <h2 className="text-3xl font-bold mb-4">{selectedAgent.name}</h2>
              <h3 className="text-2xl text-purple-300 mb-4">{selectedAgent.nameAr}</h3>
              <p className="text-gray-400 mb-6">ID: {selectedAgent.id}</p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg mb-2">Specialty:</h4>
                  <p className="text-gray-300">{selectedAgent.specialty}</p>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-2">Current Status:</h4>
                  <p className="text-gray-300">
                    <span className={`inline-block px-3 py-1 rounded-full ${getStatusColor(selectedAgent.status)}`}>
                      {selectedAgent.status.toUpperCase()}
                    </span>
                  </p>
                </div>

                {selectedAgent.status === 'running' && (
                  <div>
                    <h4 className="font-bold text-lg mb-2">Progress:</h4>
                    <div className="w-full bg-gray-700 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-300"
                        style={{ width: `${selectedAgent.progress}%` }}
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-400">{selectedAgent.progress}%</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedAgent(null)}
                className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400">
          <p>Built with ❤️ for the future of cinema</p>
          <p>بُني بـ ❤️ لمستقبل السينما</p>
        </div>
      </div>
    </div>
  );
}
