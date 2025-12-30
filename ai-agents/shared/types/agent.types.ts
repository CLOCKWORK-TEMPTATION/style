/**
 * AI Agents System - Shared Type Definitions
 * نظام الوكلاء الذكيين - تعريفات الأنواع المشتركة
 */

// Agent Status Types
export type AgentStatus = 'idle' | 'initializing' | 'running' | 'paused' | 'error' | 'completed';

// Agent Priority Levels
export type AgentPriority = 'critical' | 'high' | 'medium' | 'low';

// Task Status
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'blocked';

// Performance Metrics
export interface PerformanceMetrics {
  responseTime: number;
  accuracy: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    gpu?: number;
  };
  successRate: number;
  uptime: number;
}

// Agent Configuration Base
export interface AgentConfigBase {
  agentId: string;
  agentName: string;
  agentNameAr: string;
  version: string;
  specialization: string;
  specializationAr: string;
  status: AgentStatus;
  priority: AgentPriority;
  dependencies: string[];
  integrations: string[];
  technicalStack: string[];
  capabilities: string[];
}

// Task Definition
export interface AgentTask {
  taskId: string;
  taskName: string;
  taskNameAr: string;
  description: string;
  descriptionAr: string;
  status: TaskStatus;
  priority: AgentPriority;
  assignedAgent: string;
  dependencies: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Communication Message
export interface AgentMessage {
  messageId: string;
  fromAgent: string;
  toAgent: string;
  messageType: 'request' | 'response' | 'notification' | 'error';
  payload: any;
  timestamp: Date;
  priority: AgentPriority;
}

// Quality Standards
export interface QualityStandards {
  visualQuality: {
    colorAccuracy: number;
    lightingQuality: number;
    visualConsistency: number;
    detailRichness: number;
  };
  culturalAccuracy: {
    historicalAccuracy: number;
    culturalSensitivity: number;
    expertValidation: boolean;
  };
  technicalPerformance: {
    maxResponseTime: number;
    minAccuracy: number;
    systemStability: number;
    scalability: number;
  };
}

// Integration API
export interface AgentAPI {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  version: string;
  authentication: boolean;
  rateLimit?: number;
}

// Monitoring Data
export interface MonitoringData {
  agentId: string;
  timestamp: Date;
  metrics: PerformanceMetrics;
  alerts: Alert[];
  logs: LogEntry[];
}

// Alert Definition
export interface Alert {
  alertId: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  messageAr: string;
  timestamp: Date;
  resolved: boolean;
}

// Log Entry
export interface LogEntry {
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error';
  agentId: string;
  message: string;
  metadata?: any;
}

// Orchestrator Command
export interface OrchestratorCommand {
  commandId: string;
  commandType: 'start' | 'stop' | 'pause' | 'resume' | 'configure' | 'monitor';
  targetAgent: string | 'all';
  parameters?: any;
  timestamp: Date;
}

// Dependency Graph
export interface DependencyNode {
  agentId: string;
  dependencies: string[];
  dependents: string[];
  criticalPath: boolean;
}

// Phase Definition
export interface ProjectPhase {
  phaseId: string;
  phaseName: string;
  phaseNameAr: string;
  weekRange: string;
  agents: string[];
  deliverables: string[];
  successCriteria: string[];
  status: TaskStatus;
}

// Agent Response
export interface AgentResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    messageAr: string;
  };
  metadata?: {
    processingTime: number;
    agentId: string;
    timestamp: Date;
  };
}
