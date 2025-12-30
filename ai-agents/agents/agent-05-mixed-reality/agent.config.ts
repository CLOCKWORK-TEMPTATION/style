/**
 * Agent 5: Mixed Reality Engine Developer
 * الوكيل 5: مطور محرك الواقع المختلط
 */

import { AgentConfigBase } from '../../shared/types/agent.types';

export const AGENT_05_CONFIG: AgentConfigBase = {
  agentId: 'MIXED_REALITY_05',
  agentName: 'Mixed Reality Engine Developer',
  agentNameAr: 'مطور محرك الواقع المختلط',
  version: '1.0.0',
  specialization: 'Mixed Reality & Real-time Rendering',
  specializationAr: 'الواقع المختلط والرندر في الوقت الفعلي',
  status: 'idle',
  priority: 'high',
  dependencies: ['SET_GENERATOR_01', 'VISUAL_ENGINE_03'],
  integrations: ['STORYTELLING_07'],
  technicalStack: [
    'Unity/Unreal Engine',
    'OpenCV',
    'NVIDIA RTX',
    'Hardware Integration APIs'
  ],
  capabilities: [
    'camera-tracking',
    'real-time-rendering',
    'led-wall-integration',
    'lighting-synchronization'
  ]
};

export const TASKS = {
  TASK_1: {
    id: 'MR_001',
    name: 'Develop Camera Tracking System',
    nameAr: 'تطوير نظام تتبع الكاميرا',
    description: 'Build real-time camera tracking for virtual production',
    descriptionAr: 'بناء نظام تتبع الكاميرا في الوقت الفعلي للإنتاج الافتراضي',
    priority: 'critical' as const,
    estimatedDuration: 10800000
  },
  TASK_2: {
    id: 'MR_002',
    name: 'Create Real-time Renderer',
    nameAr: 'إنشاء محرك الرندر الفوري',
    description: 'Implement NVIDIA RTX-powered real-time rendering engine',
    descriptionAr: 'تطبيق محرك رندر فوري مدعوم بـ NVIDIA RTX',
    priority: 'critical' as const,
    estimatedDuration: 10800000
  },
  TASK_3: {
    id: 'MR_003',
    name: 'LED Wall Integration',
    nameAr: 'تكامل جدران LED',
    description: 'Develop system for LED wall synchronization and calibration',
    descriptionAr: 'تطوير نظام لمزامنة وضبط جدران LED',
    priority: 'high' as const,
    estimatedDuration: 7200000
  }
};

export const API_ENDPOINTS = {
  START_TRACKING: {
    endpoint: '/api/v1/mixed-reality/tracking/start',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Start camera tracking',
    descriptionAr: 'بدء تتبع الكاميرا'
  },
  RENDER_SCENE: {
    endpoint: '/api/v1/mixed-reality/render',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Render scene in real-time',
    descriptionAr: 'رندر المشهد في الوقت الفعلي'
  },
  SYNC_LED: {
    endpoint: '/api/v1/mixed-reality/led/sync',
    method: 'POST' as const,
    version: 'v1',
    authentication: true,
    description: 'Synchronize LED wall',
    descriptionAr: 'مزامنة جدار LED'
  }
};

export const PERFORMANCE_TARGETS = {
  frameRate: 60, // FPS
  latency: 16, // milliseconds (< 16ms for 60fps)
  trackingAccuracy: 0.99,
  renderQuality: 0.95
};
