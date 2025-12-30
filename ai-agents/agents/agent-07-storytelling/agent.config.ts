/**
 * Agent 7: Visual Storytelling Assistant Developer
 * الوكيل 7: مطور مساعد السرد البصري
 */

import { AgentConfigBase } from '../../shared/types/agent.types';

export const AGENT_07_CONFIG: AgentConfigBase = {
  agentId: 'STORYTELLING_07',
  agentName: 'Visual Storytelling Assistant Developer',
  agentNameAr: 'مطور مساعد السرد البصري',
  version: '1.0.0',
  specialization: 'Narrative Analysis & Visual Metaphors',
  specializationAr: 'تحليل السرد والرمزية البصرية',
  status: 'idle',
  priority: 'high',
  dependencies: ['SET_GENERATOR_01', 'VISUAL_ENGINE_03'],
  integrations: ['CULTURAL_AI_02', 'FANTASY_GENERATOR_08'],
  technicalStack: [
    'NLP',
    'Graph Theory',
    'Computer Vision',
    'Semantic Networks'
  ],
  capabilities: [
    'dramatic-arc-analysis',
    'visual-symbolism',
    'transition-coordination',
    'world-cohesion'
  ]
};

export const TASKS = {
  TASK_1: {
    id: 'STORY_001',
    name: 'Build Dramatic Arc Analyzer',
    nameAr: 'بناء محلل القوس الدرامي',
    description: 'Create NLP system to analyze narrative structure',
    descriptionAr: 'إنشاء نظام معالجة لغوية لتحليل البنية السردية',
    priority: 'critical' as const,
    estimatedDuration: 9000000
  },
  TASK_2: {
    id: 'STORY_002',
    name: 'Develop Visual Metaphor Engine',
    nameAr: 'تطوير محرك الاستعارات البصرية',
    description: 'Build system to identify and suggest visual metaphors',
    descriptionAr: 'بناء نظام لتحديد واقتراح الاستعارات البصرية',
    priority: 'high' as const,
    estimatedDuration: 7200000
  },
  TASK_3: {
    id: 'STORY_003',
    name: 'Create Transition Coordinator',
    nameAr: 'إنشاء منسق الانتقالات',
    description: 'Develop intelligent system for scene transition planning',
    descriptionAr: 'تطوير نظام ذكي لتخطيط انتقالات المشاهد',
    priority: 'high' as const,
    estimatedDuration: 5400000
  }
};

export const API_ENDPOINTS = {
  ANALYZE_ARC: {
    endpoint: '/api/v1/storytelling/analyze-arc',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Analyze dramatic arc',
    descriptionAr: 'تحليل القوس الدرامي'
  },
  SUGGEST_METAPHOR: {
    endpoint: '/api/v1/storytelling/metaphor',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Suggest visual metaphors',
    descriptionAr: 'اقتراح استعارات بصرية'
  },
  PLAN_TRANSITIONS: {
    endpoint: '/api/v1/storytelling/transitions',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Plan scene transitions',
    descriptionAr: 'تخطيط انتقالات المشاهد'
  }
};

export const NARRATIVE_STRUCTURES = [
  "three-act",
  "hero-journey",
  "circular",
  "parallel",
  "non-linear"
];

export const PERFORMANCE_TARGETS = {
  analysisTime: 10000,
  narrativeAccuracy: 0.90,
  metaphorRelevance: 0.85,
  transitionQuality: 0.90
};
