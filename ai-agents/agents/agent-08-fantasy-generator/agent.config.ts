/**
 * Agent 8: Fantasy Worlds Generator Developer
 * الوكيل 8: مطور مولد العوالم الخيالية
 */

import { AgentConfigBase } from '../../shared/types/agent.types';

export const AGENT_08_CONFIG: AgentConfigBase = {
  agentId: 'FANTASY_GENERATOR_08',
  agentName: 'Fantasy Worlds Generator Developer',
  agentNameAr: 'مطور مولد العوالم الخيالية',
  version: '1.0.0',
  specialization: 'Procedural World Generation & Physics',
  specializationAr: 'التوليد الإجرائي للعوالم والفيزياء',
  status: 'idle',
  priority: 'medium',
  dependencies: ['SET_GENERATOR_01', 'VISUAL_ENGINE_03'],
  integrations: ['STORYTELLING_07', 'CULTURAL_AI_02'],
  technicalStack: [
    'Procedural Generation Algorithms',
    'Physics Engines (Custom)',
    'Architectural Pattern Libraries',
    'World Building Tools'
  ],
  capabilities: [
    'world-generation',
    'custom-physics',
    'unique-architecture',
    'fictional-culture-creation'
  ]
};

export const TASKS = {
  TASK_1: {
    id: 'FANTASY_001',
    name: 'Build World Generation Engine',
    nameAr: 'بناء محرك توليد العوالم',
    description: 'Create procedural generation system for fantasy worlds',
    descriptionAr: 'إنشاء نظام توليد إجرائي للعوالم الخيالية',
    priority: 'high' as const,
    estimatedDuration: 10800000
  },
  TASK_2: {
    id: 'FANTASY_002',
    name: 'Develop Custom Physics Engine',
    nameAr: 'تطوير محرك فيزياء مخصص',
    description: 'Build customizable physics engine for unique world rules',
    descriptionAr: 'بناء محرك فيزياء قابل للتخصيص لقواعد عوالم فريدة',
    priority: 'medium' as const,
    estimatedDuration: 9000000
  },
  TASK_3: {
    id: 'FANTASY_003',
    name: 'Create Fictional Culture System',
    nameAr: 'إنشاء نظام الثقافات الخيالية',
    description: 'Develop system for generating consistent fictional cultures',
    descriptionAr: 'تطوير نظام لتوليد ثقافات خيالية متسقة',
    priority: 'medium' as const,
    estimatedDuration: 7200000
  }
};

export const API_ENDPOINTS = {
  GENERATE_WORLD: {
    endpoint: '/api/v1/fantasy/generate-world',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Generate fantasy world',
    descriptionAr: 'توليد عالم خيالي'
  },
  CONFIGURE_PHYSICS: {
    endpoint: '/api/v1/fantasy/physics',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Configure custom physics',
    descriptionAr: 'تكوين الفيزياء المخصصة'
  },
  CREATE_CULTURE: {
    endpoint: '/api/v1/fantasy/culture',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Create fictional culture',
    descriptionAr: 'إنشاء ثقافة خيالية'
  }
};

export const WORLD_TYPES = [
  'medieval-fantasy',
  'sci-fi-future',
  'steampunk',
  'cyberpunk',
  'magical-realism',
  'post-apocalyptic',
  'mythological'
];

export const PERFORMANCE_TARGETS = {
  generationTime: 60000, // 1 minute for complex world
  consistency: 0.95,
  uniqueness: 0.90,
  logicalCoherence: 0.90
};
