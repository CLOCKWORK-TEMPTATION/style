/**
 * Agent 6: Set Aging Simulator Developer
 * الوكيل 6: مطور محاكي التقادم
 */

import { AgentConfigBase } from '../../shared/types/agent.types';

export const AGENT_06_CONFIG: AgentConfigBase = {
  agentId: 'AGING_SIMULATOR_06',
  agentName: 'Set Aging Simulator Developer',
  agentNameAr: 'مطور محاكي التقادم',
  version: '1.0.0',
  specialization: 'Aging Simulation & Material Science',
  specializationAr: 'محاكاة التقادم وعلوم المواد',
  status: 'idle',
  priority: 'medium',
  dependencies: ['SET_GENERATOR_01'],
  integrations: ['MIXED_REALITY_05'],
  technicalStack: [
    'Blender/Substance Designer',
    'Physics Simulation',
    'Procedural Generation',
    'Real-time Shaders'
  ],
  capabilities: [
    'aging-simulation',
    'weathering-effects',
    'material-library',
    'interactive-preview'
  ]
};

export const TASKS = {
  TASK_1: {
    id: 'AGING_001',
    name: 'Build Aging Algorithms',
    nameAr: 'بناء خوارزميات التقادم',
    description: 'Create physics-based aging simulation algorithms',
    descriptionAr: 'إنشاء خوارزميات محاكاة التقادم المبنية على الفيزياء',
    priority: 'high' as const,
    estimatedDuration: 7200000
  },
  TASK_2: {
    id: 'AGING_002',
    name: 'Create Material Library',
    nameAr: 'إنشاء مكتبة المواد',
    description: 'Build comprehensive library of aging materials and techniques',
    descriptionAr: 'بناء مكتبة شاملة لمواد وتقنيات التقادم',
    priority: 'medium' as const,
    estimatedDuration: 7200000
  },
  TASK_3: {
    id: 'AGING_003',
    name: 'Develop Interactive Preview',
    nameAr: 'تطوير المعاينة التفاعلية',
    description: 'Create real-time preview system for aging effects',
    descriptionAr: 'إنشاء نظام معاينة فوري لتأثيرات التقادم',
    priority: 'medium' as const,
    estimatedDuration: 5400000
  }
};

export const API_ENDPOINTS = {
  SIMULATE_AGING: {
    endpoint: '/api/v1/aging/simulate',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Simulate aging on set',
    descriptionAr: 'محاكاة التقادم على الديكور'
  },
  APPLY_WEATHER: {
    endpoint: '/api/v1/aging/weather',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Apply weathering effects',
    descriptionAr: 'تطبيق تأثيرات العوامل الجوية'
  },
  GET_MATERIALS: {
    endpoint: '/api/v1/aging/materials',
    method: 'GET' as const,
    version: 'v1',
    authentication: true,
    description: 'Get aging materials library',
    descriptionAr: 'الحصول على مكتبة مواد التقادم'
  }
};

export const AGING_FACTORS = {
  environmental: ['sun', 'rain', 'wind', 'temperature', 'humidity'],
  material: ['wood', 'metal', 'stone', 'fabric', 'paint'],
  timeScale: ['days', 'months', 'years', 'decades', 'centuries']
};

export const PERFORMANCE_TARGETS = {
  simulationTime: 15000,
  physicalAccuracy: 0.90,
  visualRealism: 0.85,
  interactiveFrameRate: 30
};
