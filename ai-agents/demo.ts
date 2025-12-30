/**
 * AI Agents System - Interactive Demo
 * عرض تجريبي تفاعلي لنظام الوكلاء الذكيين
 */

import { aiAgentsSystem, cinemaMaestro, performanceMonitor } from './index';
import { AgentTask } from './shared/types/agent.types';

/**
 * Demo: Phase 1 - Core Systems Development
 */
async function demoPhase1(): Promise<void> {
  console.log('\n' + '═'.repeat(80));
  console.log('🎬 DEMO: Phase 1 - Core Systems Development');
  console.log('المرحلة الأولى: تطوير الأنظمة الأساسية');
  console.log('═'.repeat(80) + '\n');

  // Task 1: Generate Set from Script
  const task1: AgentTask = {
    taskId: 'DEMO_TASK_001',
    taskName: 'Generate Historical Palace Set',
    taskNameAr: 'توليد ديكور قصر تاريخي',
    description: 'Generate a 3D set for an Ottoman Empire palace scene based on screenplay',
    descriptionAr: 'توليد ديكور ثلاثي الأبعاد لمشهد قصر من العصر العثماني بناءً على السيناريو',
    status: 'pending',
    priority: 'high',
    assignedAgent: 'SET_GENERATOR_01',
    dependencies: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  console.log('📋 Assigning Task 1 to SET_GENERATOR_01...\n');
  const result1 = cinemaMaestro.assignTask('SET_GENERATOR_01', task1);

  if (result1.success) {
    console.log('✅ Task assigned successfully!');
    console.log(`   Task: ${task1.taskName}`);
    console.log(`   Agent: SET_GENERATOR_01\n`);

    // Simulate performance metrics
    performanceMonitor.recordMetrics('SET_GENERATOR_01', {
      responseTime: 1500,
      accuracy: 0.92,
      resourceUsage: { cpu: 45, memory: 60, gpu: 55 },
      successRate: 0.95,
      uptime: 99.9
    });
  }

  // Task 2: Cultural Validation
  const task2: AgentTask = {
    taskId: 'DEMO_TASK_002',
    taskName: 'Validate Ottoman Palace Cultural Accuracy',
    taskNameAr: 'التحقق من الدقة الثقافية للقصر العثماني',
    description: 'Verify historical accuracy of architectural elements and decorations',
    descriptionAr: 'التحقق من الدقة التاريخية للعناصر المعمارية والزخارف',
    status: 'pending',
    priority: 'critical',
    assignedAgent: 'CULTURAL_AI_02',
    dependencies: ['DEMO_TASK_001'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  console.log('📋 Assigning Task 2 to CULTURAL_AI_02...\n');
  const result2 = cinemaMaestro.assignTask('CULTURAL_AI_02', task2);

  if (result2.success) {
    console.log('✅ Task assigned successfully!');
    console.log(`   Task: ${task2.taskName}`);
    console.log(`   Agent: CULTURAL_AI_02\n`);

    performanceMonitor.recordMetrics('CULTURAL_AI_02', {
      responseTime: 800,
      accuracy: 0.97,
      resourceUsage: { cpu: 30, memory: 40 },
      successRate: 0.98,
      uptime: 99.9
    });
  }

  // Task 3: Visual Style Analysis
  const task3: AgentTask = {
    taskId: 'DEMO_TASK_003',
    taskName: 'Analyze Visual Style Inspiration',
    taskNameAr: 'تحليل الإلهام البصري',
    description: 'Extract visual DNA from historical Ottoman palace references',
    descriptionAr: 'استخراج الحمض النووي البصري من مراجع القصور العثمانية التاريخية',
    status: 'pending',
    priority: 'high',
    assignedAgent: 'VISUAL_ENGINE_03',
    dependencies: ['DEMO_TASK_001'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  console.log('📋 Assigning Task 3 to VISUAL_ENGINE_03...\n');
  const result3 = cinemaMaestro.assignTask('VISUAL_ENGINE_03', task3);

  if (result3.success) {
    console.log('✅ Task assigned successfully!');
    console.log(`   Task: ${task3.taskName}`);
    console.log(`   Agent: VISUAL_ENGINE_03\n`);

    performanceMonitor.recordMetrics('VISUAL_ENGINE_03', {
      responseTime: 1200,
      accuracy: 0.91,
      resourceUsage: { cpu: 55, memory: 65, gpu: 70 },
      successRate: 0.93,
      uptime: 99.9
    });
  }

  console.log('═'.repeat(80));
  console.log('✅ Phase 1 Demo Complete!\n');
}

/**
 * Demo: Agent Communication
 */
async function demoAgentCommunication(): Promise<void> {
  console.log('\n' + '═'.repeat(80));
  console.log('📡 DEMO: Agent Communication');
  console.log('التواصل بين الوكلاء');
  console.log('═'.repeat(80) + '\n');

  // Simulate message from SET_GENERATOR to CULTURAL_AI
  cinemaMaestro.sendMessage({
    messageId: 'MSG_001',
    fromAgent: 'SET_GENERATOR_01',
    toAgent: 'CULTURAL_AI_02',
    messageType: 'request',
    payload: {
      type: 'cultural_validation',
      setId: 'SET_12345',
      culture: 'Ottoman Empire',
      era: '16th Century'
    },
    timestamp: new Date(),
    priority: 'high'
  });

  // Simulate message from CULTURAL_AI to VISUAL_ENGINE
  cinemaMaestro.sendMessage({
    messageId: 'MSG_002',
    fromAgent: 'CULTURAL_AI_02',
    toAgent: 'VISUAL_ENGINE_03',
    messageType: 'notification',
    payload: {
      type: 'validation_complete',
      accuracy: 0.97,
      suggestions: ['Add traditional Ottoman calligraphy', 'Adjust color palette to period-accurate']
    },
    timestamp: new Date(),
    priority: 'medium'
  });

  console.log('✅ Messages sent successfully!\n');
  console.log('═'.repeat(80) + '\n');
}

/**
 * Demo: Performance Monitoring
 */
async function demoPerformanceMonitoring(): Promise<void> {
  console.log('\n' + '═'.repeat(80));
  console.log('📊 DEMO: Performance Monitoring Dashboard');
  console.log('لوحة مراقبة الأداء');
  console.log('═'.repeat(80) + '\n');

  // Display monitoring dashboard
  performanceMonitor.displayDashboard();

  // Show average metrics for SET_GENERATOR_01
  const avgMetrics = performanceMonitor.getAverageMetrics('SET_GENERATOR_01');
  if (avgMetrics) {
    console.log('\n📈 Average Performance for SET_GENERATOR_01:');
    console.log(`   Response Time: ${avgMetrics.responseTime.toFixed(2)}ms`);
    console.log(`   Accuracy: ${(avgMetrics.accuracy * 100).toFixed(2)}%`);
    console.log(`   CPU Usage: ${avgMetrics.resourceUsage.cpu.toFixed(2)}%`);
    console.log(`   Memory Usage: ${avgMetrics.resourceUsage.memory.toFixed(2)}%`);
    console.log(`   Success Rate: ${(avgMetrics.successRate * 100).toFixed(2)}%\n`);
  }

  console.log('═'.repeat(80) + '\n');
}

/**
 * Main Demo Runner
 */
async function runDemo(): Promise<void> {
  try {
    // Initialize system
    await aiAgentsSystem.initialize();

    // Wait a moment for initialization
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Run Phase 1 demo
    await demoPhase1();

    // Wait before next demo
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Run agent communication demo
    await demoAgentCommunication();

    // Wait before monitoring demo
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Run performance monitoring demo
    await demoPerformanceMonitoring();

    // Display final system overview
    console.log('\n' + '═'.repeat(80));
    console.log('🎯 FINAL SYSTEM OVERVIEW');
    console.log('النظرة العامة النهائية للنظام');
    console.log('═'.repeat(80) + '\n');

    cinemaMaestro.displayDashboard();

    console.log('\n✅ Demo completed successfully!');
    console.log('✅ العرض التجريبي اكتمل بنجاح!\n');

    // Shutdown
    setTimeout(async () => {
      await aiAgentsSystem.shutdown();
    }, 2000);

  } catch (error) {
    console.error('❌ Demo failed:', error);
    process.exit(1);
  }
}

// Run demo if executed directly
if (require.main === module) {
  runDemo();
}

export { runDemo };
