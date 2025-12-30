/**
 * Agent 1: AI Set Generator Specialist
 * الوكيل 1: مطور مولد الديكورات الذكي
 */

import { AgentConfigBase } from '../../shared/types/agent.types';

export const AGENT_01_CONFIG: AgentConfigBase = {
  agentId: 'SET_GENERATOR_01',
  agentName: 'AI Set Generator Specialist',
  agentNameAr: 'مطور مولد الديكورات الذكي',
  version: '1.0.0',
  specialization: 'AI Set Generation & 3D Design',
  specializationAr: 'توليد الديكورات بالذكاء الاصطناعي والتصميم ثلاثي الأبعاد',
  status: 'idle',
  priority: 'critical',
  dependencies: [],
  integrations: ['CULTURAL_AI_02', 'VISUAL_ENGINE_03', 'STORYTELLING_07', 'FANTASY_GENERATOR_08'],
  technicalStack: [
    'Python/TensorFlow',
    'Blender API',
    'OpenAI GPT',
    'React/Three.js'
  ],
  capabilities: [
    'text-to-3d-generation',
    'budget-adaptive-design',
    'style-transfer',
    'real-time-preview'
  ]
};

export const TASKS = {
  TASK_1: {
    id: 'SET_GEN_001',
    name: 'Initialize Text-to-3D Engine',
    nameAr: 'تهيئة محرك التوليد النصي إلى ثلاثي الأبعاد',
    description: 'Set up the core text-to-3D generation engine using TensorFlow and Blender API',
    descriptionAr: 'إعداد محرك التوليد الأساسي من النص إلى 3D باستخدام TensorFlow و Blender API',
    priority: 'critical' as const,
    estimatedDuration: 7200000 // 2 hours in milliseconds
  },
  TASK_2: {
    id: 'SET_GEN_002',
    name: 'Implement Budget Adaptation',
    nameAr: 'تطبيق التكيف مع الميزانية',
    description: 'Develop algorithms to adapt set complexity based on budget constraints',
    descriptionAr: 'تطوير خوارزميات لتكييف تعقيد الديكور حسب قيود الميزانية',
    priority: 'high' as const,
    estimatedDuration: 5400000 // 1.5 hours
  },
  TASK_3: {
    id: 'SET_GEN_003',
    name: 'Create 3D Preview Interface',
    nameAr: 'إنشاء واجهة المعاينة ثلاثية الأبعاد',
    description: 'Build React/Three.js interface for real-time 3D preview',
    descriptionAr: 'بناء واجهة React/Three.js للمعاينة الفورية ثلاثية الأبعاد',
    priority: 'high' as const,
    estimatedDuration: 7200000
  }
};

export const API_ENDPOINTS = {
  GENERATE_SET: {
    endpoint: '/api/v1/set-generator/generate',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Generate 3D set from text description',
    descriptionAr: 'توليد ديكور ثلاثي الأبعاد من وصف نصي'
  },
  ADAPT_BUDGET: {
    endpoint: '/api/v1/set-generator/adapt-budget',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Adapt set design based on budget',
    descriptionAr: 'تكييف تصميم الديكور حسب الميزانية'
  },
  GET_PREVIEW: {
    endpoint: '/api/v1/set-generator/preview/:setId',
    method: 'GET' as const,
    version: 'v1',
    authentication: true,
    description: 'Get 3D preview of generated set',
    descriptionAr: 'الحصول على معاينة ثلاثية الأبعاد للديكور المولد'
  }
};

export const PERFORMANCE_TARGETS = {
  maxGenerationTime: 30000, // 30 seconds
  minQuality: 0.90,
  budgetAccuracy: 0.95,
  culturalAlignment: 0.95
};
