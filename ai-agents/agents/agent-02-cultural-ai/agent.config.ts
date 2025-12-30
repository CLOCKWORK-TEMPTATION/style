/**
 * Agent 2: Cultural Authenticity AI Developer
 * الوكيل 2: مطور الذكاء الثقافي
 */

import { AgentConfigBase } from '../../shared/types/agent.types';

export const AGENT_02_CONFIG: AgentConfigBase = {
  agentId: 'CULTURAL_AI_02',
  agentName: 'Cultural Authenticity AI Developer',
  agentNameAr: 'مطور الذكاء الثقافي',
  version: '1.0.0',
  specialization: 'Cultural AI & Historical Accuracy',
  specializationAr: 'الذكاء الثقافي والدقة التاريخية',
  status: 'idle',
  priority: 'critical',
  dependencies: ['SET_GENERATOR_01'],
  integrations: ['VISUAL_ENGINE_03', 'STORYTELLING_07'],
  technicalStack: [
    'Python/spaCy',
    'Neo4j',
    'Computer Vision',
    'REST APIs'
  ],
  capabilities: [
    'cultural-validation',
    'historical-accuracy-check',
    'heritage-database-query',
    'automatic-cultural-verification'
  ]
};

export const TASKS = {
  TASK_1: {
    id: 'CULTURAL_001',
    name: 'Build Cultural Heritage Database',
    nameAr: 'بناء قاعدة بيانات التراث الثقافي',
    description: 'Create comprehensive database of cultural elements from global heritage sources',
    descriptionAr: 'إنشاء قاعدة بيانات شاملة للعناصر الثقافية من مصادر التراث العالمية',
    priority: 'critical' as const,
    estimatedDuration: 10800000 // 3 hours
  },
  TASK_2: {
    id: 'CULTURAL_002',
    name: 'Develop Error Detection Algorithms',
    nameAr: 'تطوير خوارزميات كشف الأخطاء',
    description: 'Implement AI algorithms to detect cultural and historical inaccuracies',
    descriptionAr: 'تطبيق خوارزميات الذكاء الاصطناعي لكشف الأخطاء الثقافية والتاريخية',
    priority: 'critical' as const,
    estimatedDuration: 7200000
  },
  TASK_3: {
    id: 'CULTURAL_003',
    name: 'Integrate External Heritage APIs',
    nameAr: 'دمج واجهات برمجة التراث الخارجية',
    description: 'Connect to UNESCO, museum archives, and cultural heritage databases',
    descriptionAr: 'الاتصال بقواعد بيانات اليونسكو والمتاحف والتراث الثقافي',
    priority: 'high' as const,
    estimatedDuration: 5400000
  }
};

export const API_ENDPOINTS = {
  VALIDATE_CULTURAL: {
    endpoint: '/api/v1/cultural-ai/validate',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Validate cultural authenticity of content',
    descriptionAr: 'التحقق من الأصالة الثقافية للمحتوى'
  },
  CHECK_HISTORICAL: {
    endpoint: '/api/v1/cultural-ai/historical-check',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Check historical accuracy',
    descriptionAr: 'فحص الدقة التاريخية'
  },
  QUERY_HERITAGE: {
    endpoint: '/api/v1/cultural-ai/heritage/:culture/:era',
    method: 'GET' as const,
    version: 'v1',
    authentication: true,
    description: 'Query heritage database',
    descriptionAr: 'الاستعلام من قاعدة بيانات التراث'
  }
};

export const CULTURAL_DATABASES = {
  unesco: 'https://whc.unesco.org/en/list',
  europeana: 'https://www.europeana.eu',
  smithsonian: 'https://www.si.edu/openaccess',
  britishMuseum: 'https://www.britishmuseum.org/collection'
};

export const PERFORMANCE_TARGETS = {
  validationTime: 5000, // 5 seconds
  minAccuracy: 0.95,
  culturalCoverage: 0.90, // 90% of world cultures
  expertValidation: true
};
