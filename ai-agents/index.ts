/**
 * AI Agents Orchestration System - Main Entry Point
 * نظام تنسيق الوكلاء الذكيين - نقطة الدخول الرئيسية
 *
 * Film Production AI Systems Project
 * مشروع أنظمة الذكاء الاصطناعي للإنتاج السينمائي
 */

import { cinemaMaestro } from './orchestrator/orchestrator.core';
import { performanceMonitor } from './monitoring/performance.monitor';
import { AGENT_CONFIGS, PROJECT_PHASES } from './shared/config/agents.config';

/**
 * Main Application Class
 */
export class AIAgentsSystem {
  private isRunning: boolean = false;

  /**
   * Initialize the entire AI Agents system
   */
  public async initialize(): Promise<void> {
    console.clear();
    this.displayWelcomeBanner();

    try {
      // Start performance monitoring
      performanceMonitor.start();
      console.log('✅ Performance Monitor: ONLINE\n');

      // Start orchestrator
      const result = await cinemaMaestro.start();

      if (result.success) {
        this.isRunning = true;
        console.log('✅ Cinema Maestro: ONLINE\n');

        // Display initial dashboard
        cinemaMaestro.displayDashboard();

        // Display project phases
        this.displayProjectPhases();

        console.log('\n🎬 System Ready! All agents are standing by.\n');
      } else {
        throw new Error(result.error?.message || 'Failed to start orchestrator');
      }
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Display welcome banner
   */
  private displayWelcomeBanner(): void {
    const banner = `
╔════════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║              🎬 AI AGENTS ORCHESTRATION SYSTEM 🎬                              ║
║                                                                                ║
║              مشروع أنظمة الذكاء الاصطناعي للإنتاج السينمائي                   ║
║              Film Production AI Systems Project                                ║
║                                                                                ║
║  ────────────────────────────────────────────────────────────────────────────  ║
║                                                                                ║
║  🤖 10 Specialized AI Agents                                                   ║
║  🎼 1 Orchestrator - Cinema Maestro                                            ║
║  🎯 9 Execution Agents                                                         ║
║                                                                                ║
║  Version: 1.0.0                                                                ║
║  Status: Initializing...                                                       ║
║                                                                                ║
╚════════════════════════════════════════════════════════════════════════════════╝
    `;
    console.log(banner);
  }

  /**
   * Display project phases
   */
  private displayProjectPhases(): void {
    console.log('\n' + '─'.repeat(80));
    console.log('📅 PROJECT PHASES OVERVIEW:');
    console.log('─'.repeat(80) + '\n');

    PROJECT_PHASES.forEach((phase, index) => {
      const statusEmoji = phase.status === 'completed' ? '✅' :
                         phase.status === 'in_progress' ? '🔄' : '⏳';

      console.log(`${statusEmoji} Phase ${index + 1}: ${phase.phaseName}`);
      console.log(`   📅 ${phase.weekRange}`);
      console.log(`   🎯 ${phase.phaseNameAr}`);
      console.log(`   🤖 Agents: ${phase.agents.join(', ')}`);
      console.log('');
    });

    console.log('─'.repeat(80));
  }

  /**
   * Get system status
   */
  public getStatus(): any {
    return {
      isRunning: this.isRunning,
      orchestrator: cinemaMaestro.getSystemOverview(),
      monitoring: {
        activeAlerts: performanceMonitor.getActiveAlerts().length,
        recentErrors: performanceMonitor.getLogs('error', 10).length
      }
    };
  }

  /**
   * Shutdown the system
   */
  public async shutdown(): Promise<void> {
    console.log('\n🛑 Shutting down AI Agents System...\n');

    // Stop monitoring
    performanceMonitor.stop();
    console.log('✅ Performance Monitor: OFFLINE');

    // Display final reports
    console.log('\n📊 Final Performance Report:');
    performanceMonitor.displayDashboard();

    this.isRunning = false;
    console.log('\n✅ System shutdown complete.\n');
  }
}

/**
 * Export main instance
 */
export const aiAgentsSystem = new AIAgentsSystem();

/**
 * Auto-start if run directly
 */
if (require.main === module) {
  (async () => {
    try {
      await aiAgentsSystem.initialize();

      // Keep process running
      process.on('SIGINT', async () => {
        await aiAgentsSystem.shutdown();
        process.exit(0);
      });
    } catch (error) {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  })();
}

// Export all major components
export { cinemaMaestro } from './orchestrator/orchestrator.core';
export { performanceMonitor } from './monitoring/performance.monitor';
export { apiClient, IntegrationHelper } from './shared/apis/integration.api';
export * from './shared/types/agent.types';
export * from './shared/config/agents.config';
