/**
 * Phase 1 Comprehensive Demo - Core Systems
 * عرض تجريبي شامل للمرحلة الأولى - الأنظمة الأساسية
 *
 * This demo showcases the integration of:
 * - Agent 1: Set Generator
 * - Agent 2: Cultural AI
 * - Agent 3: Visual Engine
 */

import { setGeneratorService } from '../agents/agent-01-set-generator/set-generator.service';
import { culturalAIService } from '../agents/agent-02-cultural-ai/cultural-ai.service';
import { visualEngineService } from '../agents/agent-03-visual-engine/visual-engine.service';
import { cinemaMaestro } from '../orchestrator/orchestrator.core';
import { performanceMonitor } from '../monitoring/performance.monitor';

/**
 * Scenario: Producing a Historical Ottoman Palace Scene
 * السيناريو: إنتاج مشهد قصر عثماني تاريخي
 */
async function runOttomanPalaceScenario(): Promise<void> {
  console.log('\n' + '═'.repeat(100));
  console.log('🎬 PHASE 1 DEMO: Ottoman Palace Scene Production');
  console.log('العرض التجريبي للمرحلة الأولى: إنتاج مشهد القصر العثماني');
  console.log('═'.repeat(100) + '\n');

  try {
    // ========== INITIALIZATION ==========
    console.log('🚀 STEP 1: Initializing Core Systems\n');
    console.log('─'.repeat(100));

    await setGeneratorService.initialize();
    await culturalAIService.initialize();
    await visualEngineService.initialize();

    console.log('─'.repeat(100));
    console.log('✅ All core systems initialized successfully!\n');

    await delay(1000);

    // ========== SET GENERATION ==========
    console.log('─'.repeat(100));
    console.log('🚀 STEP 2: Generating Ottoman Palace Set\n');
    console.log('─'.repeat(100));

    const setRequest = {
      description: 'Grand Ottoman palace throne room with ornate calligraphy, geometric patterns, and traditional Turkish elements from the 16th century',
      style: 'Ottoman Imperial',
      budget: 75000,
      culturalContext: 'Ottoman Empire',
      era: '16th Century',
      complexity: 'complex' as const
    };

    const setResult = await setGeneratorService.generateSet(setRequest);

    if (!setResult.success || !setResult.data) {
      throw new Error('Set generation failed');
    }

    const generatedSet = setResult.data;

    console.log('─'.repeat(100));
    console.log('✅ Ottoman Palace Set Generated!\n');

    // Display set details
    console.log('📊 Set Details:');
    console.log(`   ID: ${generatedSet.setId}`);
    console.log(`   Name: ${generatedSet.name}`);
    console.log(`   Components: ${generatedSet.components.length}`);
    console.log(`   Polygons: ${generatedSet.metadata.polygonCount.toLocaleString()}`);
    console.log(`   Estimated Cost: $${generatedSet.metadata.estimatedCost.toLocaleString()}`);
    console.log('');

    await delay(1500);

    // ========== CULTURAL VALIDATION ==========
    console.log('─'.repeat(100));
    console.log('🚀 STEP 3: Validating Cultural Authenticity\n');
    console.log('─'.repeat(100));

    const validationRequest = {
      setId: generatedSet.setId,
      elements: [
        {
          id: 'elem_1',
          name: 'Ottoman Calligraphy Panel',
          type: 'decoration' as const,
          description: 'Arabic calligraphy in Thuluth script'
        },
        {
          id: 'elem_2',
          name: 'Iznik Tile Pattern',
          type: 'decoration' as const,
          description: 'Traditional blue and white ceramic tiles'
        },
        {
          id: 'elem_3',
          name: 'Domed Ceiling',
          type: 'architecture' as const,
          description: 'Central dome with muqarnas decoration'
        },
        {
          id: 'elem_4',
          name: 'Imperial Throne',
          type: 'decoration' as const,
          description: 'Gold-plated ceremonial throne'
        }
      ],
      culture: 'Ottoman',
      era: '16th Century',
      context: 'Palace throne room'
    };

    const validationResult = await culturalAIService.validateCultural(validationRequest);

    if (!validationResult.success || !validationResult.data) {
      throw new Error('Cultural validation failed');
    }

    const validation = validationResult.data;

    console.log('─'.repeat(100));
    console.log('✅ Cultural Validation Complete!\n');

    console.log('📊 Validation Results:');
    console.log(`   Overall Score: ${(validation.overallScore * 100).toFixed(1)}%`);
    console.log(`   Cultural Accuracy: ${(validation.culturalAccuracy * 100).toFixed(1)}%`);
    console.log(`   Historical Accuracy: ${(validation.historicalAccuracy * 100).toFixed(1)}%`);
    console.log('');

    if (validation.suggestions.length > 0) {
      console.log('💡 Suggestions:');
      validation.suggestions.forEach(s => console.log(`   • ${s}`));
      console.log('');
    }

    await delay(1500);

    // ========== VISUAL INSPIRATION ==========
    console.log('─'.repeat(100));
    console.log('🚀 STEP 4: Extracting Visual DNA & Generating Color Palette\n');
    console.log('─'.repeat(100));

    const visualRequest = {
      genre: 'Historical Drama',
      mood: 'dramatic',
      era: '16th Century',
      colorPreference: 'vibrant' as const
    };

    const dnaResult = await visualEngineService.extractVisualDNA(visualRequest);

    if (!dnaResult.success || !dnaResult.data) {
      throw new Error('Visual DNA extraction failed');
    }

    const visualDNA = dnaResult.data;

    console.log('─'.repeat(100));
    console.log('✅ Visual DNA Extracted!\n');

    console.log('🎨 Visual Characteristics:');
    console.log(`   Primary Colors: ${visualDNA.characteristics.colorPalette.primary.join(', ')}`);
    console.log(`   Color Harmony: ${visualDNA.characteristics.colorPalette.harmony}`);
    console.log(`   Lighting: ${visualDNA.characteristics.lighting.contrast} contrast, ${visualDNA.characteristics.lighting.colorTemperature} temperature`);
    console.log(`   Composition Symmetry: ${(visualDNA.characteristics.composition.symmetry * 100).toFixed(0)}%`);
    console.log('');

    console.log('✨ Signature Elements:');
    visualDNA.signature.forEach(s => console.log(`   • ${s}`));
    console.log('');

    await delay(1500);

    // ========== PERFORMANCE METRICS ==========
    console.log('─'.repeat(100));
    console.log('🚀 STEP 5: Collecting Performance Metrics\n');
    console.log('─'.repeat(100));

    // Record metrics for each agent
    performanceMonitor.recordMetrics('SET_GENERATOR_01', setGeneratorService.getPerformanceMetrics());
    performanceMonitor.recordMetrics('CULTURAL_AI_02', culturalAIService.getPerformanceMetrics());
    performanceMonitor.recordMetrics('VISUAL_ENGINE_03', visualEngineService.getPerformanceMetrics());

    console.log('📊 Agent Performance Summary:\n');

    console.log('   🏗️  Set Generator:');
    const setMetrics = setGeneratorService.getPerformanceMetrics();
    console.log(`      Response Time: ${setMetrics.responseTime.toFixed(0)}ms`);
    console.log(`      Accuracy: ${(setMetrics.accuracy * 100).toFixed(1)}%`);
    console.log(`      CPU: ${setMetrics.resourceUsage.cpu.toFixed(0)}%`);
    console.log('');

    console.log('   🏺 Cultural AI:');
    const culturalMetrics = culturalAIService.getPerformanceMetrics();
    console.log(`      Response Time: ${culturalMetrics.responseTime.toFixed(0)}ms`);
    console.log(`      Accuracy: ${(culturalMetrics.accuracy * 100).toFixed(1)}%`);
    console.log(`      CPU: ${culturalMetrics.resourceUsage.cpu.toFixed(0)}%`);
    console.log('');

    console.log('   🎨 Visual Engine:');
    const visualMetrics = visualEngineService.getPerformanceMetrics();
    console.log(`      Response Time: ${visualMetrics.responseTime.toFixed(0)}ms`);
    console.log(`      Accuracy: ${(visualMetrics.accuracy * 100).toFixed(1)}%`);
    console.log(`      CPU: ${visualMetrics.resourceUsage.cpu.toFixed(0)}%`);
    console.log('');

    // ========== FINAL SUMMARY ==========
    console.log('─'.repeat(100));
    console.log('\n🎉 DEMO COMPLETED SUCCESSFULLY!\n');
    console.log('═'.repeat(100));
    console.log('📝 Final Summary:\n');

    console.log('✅ Generated Set:');
    console.log(`   Name: ${generatedSet.name}`);
    console.log(`   Components: ${generatedSet.components.length}`);
    console.log(`   Cost: $${generatedSet.metadata.estimatedCost.toLocaleString()}`);
    console.log('');

    console.log('✅ Cultural Validation:');
    console.log(`   Overall Score: ${(validation.overallScore * 100).toFixed(1)}%`);
    console.log(`   Elements Validated: ${validation.elements.length}`);
    console.log('');

    console.log('✅ Visual DNA:');
    console.log(`   Confidence: ${(visualDNA.confidence * 100).toFixed(1)}%`);
    console.log(`   Signature Elements: ${visualDNA.signature.length}`);
    console.log('');

    console.log('💰 Production Impact:');
    console.log(`   Time Saved: ~60% (estimated)`);
    console.log(`   Cost Reduction: ~40% (estimated)`);
    console.log(`   Quality Score: ${(validation.overallScore * 100).toFixed(1)}%`);
    console.log('');

    console.log('═'.repeat(100));
    console.log('\n✨ Phase 1 Core Systems: OPERATIONAL ✨\n');

  } catch (error) {
    console.error('\n❌ Demo failed:', error);
    throw error;
  }
}

/**
 * Helper function for delays
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Run the demo
 */
export async function runPhase1Demo(): Promise<void> {
  try {
    await runOttomanPalaceScenario();
  } catch (error) {
    console.error('Fatal error in demo:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  runPhase1Demo();
}
