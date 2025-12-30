/**
 * Cinema Maestro - Orchestrator Core System
 * المايسترو السينمائي - نظام الأوركسترا الأساسي
 *
 * Agent 10: The Conductor of AI Film Production Systems
 */

import {
  AgentStatus,
  AgentTask,
  AgentMessage,
  OrchestratorCommand,
  MonitoringData,
  AgentResponse,
  PerformanceMetrics
} from '../shared/types/agent.types';
import { AGENT_CONFIGS, PROJECT_PHASES, QUALITY_STANDARDS } from '../shared/config/agents.config';

export class CinemaMaestro {
  private agentStates: Map<string, AgentStatus>;
  private activeTasks: Map<string, AgentTask[]>;
  private messageQueue: AgentMessage[];
  private performanceData: Map<string, PerformanceMetrics>;

  constructor() {
    this.agentStates = new Map();
    this.activeTasks = new Map();
    this.messageQueue = [];
    this.performanceData = new Map();
    this.initializeAgents();
  }

  /**
   * Initialize all 9 execution agents
   * تهيئة جميع الوكلاء التنفيذيين الـ9
   */
  private initializeAgents(): void {
    Object.keys(AGENT_CONFIGS).forEach(agentId => {
      if (agentId !== 'ORCHESTRATOR_10') {
        this.agentStates.set(agentId, 'idle');
        this.activeTasks.set(agentId, []);
      }
    });

    console.log('🎬 Cinema Maestro Initialized');
    console.log(`📊 Managing ${this.agentStates.size} AI Agents`);
  }

  /**
   * Start the orchestration system
   * بدء نظام الأوركسترا
   */
  public async start(): Promise<AgentResponse> {
    try {
      console.log('\n🎭 Starting Cinema Maestro Orchestration System...\n');

      // Validate all dependencies
      const dependenciesValid = await this.validateDependencies();
      if (!dependenciesValid) {
        throw new Error('Dependency validation failed');
      }

      // Initialize Phase 1 agents
      await this.initializePhase('PHASE_1');

      return {
        success: true,
        data: {
          status: 'running',
          activeAgents: Array.from(this.agentStates.keys()),
          message: 'Orchestrator started successfully'
        },
        metadata: {
          processingTime: 0,
          agentId: 'ORCHESTRATOR_10',
          timestamp: new Date()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ORCHESTRATOR_START_ERROR',
          message: (error as Error).message,
          messageAr: 'خطأ في بدء نظام الأوركسترا'
        }
      };
    }
  }

  /**
   * Validate all agent dependencies
   * التحقق من جميع التبعيات
   */
  private async validateDependencies(): Promise<boolean> {
    console.log('🔍 Validating agent dependencies...\n');

    for (const [agentId, config] of Object.entries(AGENT_CONFIGS)) {
      if (agentId === 'ORCHESTRATOR_10') continue;

      console.log(`   ✓ ${config.agentNameAr} (${agentId})`);

      // Check if dependencies exist
      for (const depId of config.dependencies) {
        if (depId !== 'all' && !AGENT_CONFIGS[depId]) {
          console.error(`   ✗ Missing dependency: ${depId}`);
          return false;
        }
      }
    }

    console.log('\n✅ All dependencies validated\n');
    return true;
  }

  /**
   * Initialize a project phase
   * تهيئة مرحلة من المشروع
   */
  private async initializePhase(phaseId: string): Promise<void> {
    const phase = PROJECT_PHASES.find(p => p.phaseId === phaseId);
    if (!phase) {
      throw new Error(`Phase ${phaseId} not found`);
    }

    console.log(`\n📋 Initializing ${phase.phaseName} (${phase.phaseNameAr})`);
    console.log(`📅 Timeline: ${phase.weekRange}\n`);
    console.log('🤖 Activating Agents:');

    for (const agentId of phase.agents) {
      const config = AGENT_CONFIGS[agentId];
      console.log(`   • ${config.agentNameAr}`);
      this.agentStates.set(agentId, 'initializing');
    }

    console.log('\n📦 Expected Deliverables:');
    phase.deliverables.forEach(deliverable => {
      console.log(`   • ${deliverable}`);
    });
  }

  /**
   * Assign task to agent
   * تعيين مهمة لوكيل
   */
  public assignTask(agentId: string, task: AgentTask): AgentResponse {
    try {
      if (!this.agentStates.has(agentId)) {
        throw new Error(`Agent ${agentId} not found`);
      }

      const agentTasks = this.activeTasks.get(agentId) || [];
      agentTasks.push(task);
      this.activeTasks.set(agentId, agentTasks);

      const config = AGENT_CONFIGS[agentId];
      console.log(`\n✅ Task assigned: ${task.taskName}`);
      console.log(`   → Agent: ${config.agentNameAr} (${agentId})`);

      return {
        success: true,
        data: { taskId: task.taskId, agentId }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TASK_ASSIGNMENT_ERROR',
          message: (error as Error).message,
          messageAr: 'خطأ في تعيين المهمة'
        }
      };
    }
  }

  /**
   * Send message between agents
   * إرسال رسالة بين الوكلاء
   */
  public sendMessage(message: AgentMessage): void {
    this.messageQueue.push(message);
    console.log(`\n📨 Message sent: ${message.fromAgent} → ${message.toAgent}`);
  }

  /**
   * Get agent status
   * الحصول على حالة الوكيل
   */
  public getAgentStatus(agentId: string): AgentResponse {
    const status = this.agentStates.get(agentId);
    const tasks = this.activeTasks.get(agentId) || [];
    const config = AGENT_CONFIGS[agentId];

    if (!config) {
      return {
        success: false,
        error: {
          code: 'AGENT_NOT_FOUND',
          message: `Agent ${agentId} not found`,
          messageAr: 'الوكيل غير موجود'
        }
      };
    }

    return {
      success: true,
      data: {
        agentId,
        agentName: config.agentName,
        agentNameAr: config.agentNameAr,
        status,
        activeTasks: tasks.length,
        tasks
      }
    };
  }

  /**
   * Get system overview
   * الحصول على نظرة عامة على النظام
   */
  public getSystemOverview(): AgentResponse {
    const overview = {
      totalAgents: this.agentStates.size,
      agentsByStatus: {
        idle: 0,
        initializing: 0,
        running: 0,
        paused: 0,
        error: 0,
        completed: 0
      },
      totalTasks: 0,
      activePhases: PROJECT_PHASES.filter(p => p.status === 'in_progress').length
    };

    this.agentStates.forEach(status => {
      overview.agentsByStatus[status]++;
    });

    this.activeTasks.forEach(tasks => {
      overview.totalTasks += tasks.length;
    });

    return {
      success: true,
      data: overview
    };
  }

  /**
   * Monitor agent performance
   * مراقبة أداء الوكيل
   */
  public monitorPerformance(agentId: string, metrics: PerformanceMetrics): void {
    this.performanceData.set(agentId, metrics);

    // Check against quality standards
    const standards = QUALITY_STANDARDS.technicalPerformance;

    if (metrics.responseTime > standards.maxResponseTime) {
      console.warn(`⚠️  ${agentId}: Response time exceeded (${metrics.responseTime}ms)`);
    }

    if (metrics.accuracy < standards.minAccuracy) {
      console.warn(`⚠️  ${agentId}: Accuracy below threshold (${metrics.accuracy})`);
    }
  }

  /**
   * Execute orchestrator command
   * تنفيذ أمر الأوركسترا
   */
  public async executeCommand(command: OrchestratorCommand): Promise<AgentResponse> {
    try {
      console.log(`\n🎼 Executing command: ${command.commandType}`);
      console.log(`   Target: ${command.targetAgent}`);

      const targetAgents = command.targetAgent === 'all'
        ? Array.from(this.agentStates.keys())
        : [command.targetAgent];

      for (const agentId of targetAgents) {
        switch (command.commandType) {
          case 'start':
            this.agentStates.set(agentId, 'running');
            break;
          case 'pause':
            this.agentStates.set(agentId, 'paused');
            break;
          case 'stop':
            this.agentStates.set(agentId, 'idle');
            break;
          case 'resume':
            this.agentStates.set(agentId, 'running');
            break;
        }
      }

      return {
        success: true,
        data: {
          command: command.commandType,
          affectedAgents: targetAgents.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMMAND_EXECUTION_ERROR',
          message: (error as Error).message,
          messageAr: 'خطأ في تنفيذ الأمر'
        }
      };
    }
  }

  /**
   * Display orchestrator dashboard
   * عرض لوحة التحكم
   */
  public displayDashboard(): void {
    console.log('\n' + '═'.repeat(80));
    console.log('🎬 CINEMA MAESTRO - AI AGENTS ORCHESTRATION DASHBOARD');
    console.log('═'.repeat(80) + '\n');

    const overview = this.getSystemOverview();
    if (overview.success && overview.data) {
      console.log('📊 SYSTEM OVERVIEW:');
      console.log(`   Total Agents: ${overview.data.totalAgents}`);
      console.log(`   Active Tasks: ${overview.data.totalTasks}`);
      console.log(`   Active Phases: ${overview.data.activePhases}\n`);

      console.log('📈 AGENTS BY STATUS:');
      Object.entries(overview.data.agentsByStatus).forEach(([status, count]) => {
        if (count > 0) {
          console.log(`   ${status}: ${count}`);
        }
      });
    }

    console.log('\n' + '─'.repeat(80));
    console.log('🤖 AGENT DETAILS:\n');

    this.agentStates.forEach((status, agentId) => {
      const config = AGENT_CONFIGS[agentId];
      const tasks = this.activeTasks.get(agentId) || [];
      const statusEmoji = this.getStatusEmoji(status);

      console.log(`${statusEmoji} ${config.agentNameAr}`);
      console.log(`   ID: ${agentId}`);
      console.log(`   Status: ${status}`);
      console.log(`   Active Tasks: ${tasks.length}`);
      console.log(`   Priority: ${config.priority}`);
      console.log('');
    });

    console.log('═'.repeat(80) + '\n');
  }

  /**
   * Get status emoji
   * الحصول على رمز الحالة
   */
  private getStatusEmoji(status: AgentStatus): string {
    const emojiMap: Record<AgentStatus, string> = {
      idle: '⚪',
      initializing: '🔵',
      running: '🟢',
      paused: '🟡',
      error: '🔴',
      completed: '✅'
    };
    return emojiMap[status] || '⚫';
  }
}

// Export singleton instance
export const cinemaMaestro = new CinemaMaestro();
