# 🚀 Quick Start Guide | دليل البدء السريع

## نظام تنسيق الوكلاء الذكيين للإنتاج السينمائي
**AI Agents Orchestration System for Film Production**

---

## ⚡ Quick Installation | التثبيت السريع

### 1. Prerequisites | المتطلبات

```bash
# Check Node.js version (must be >= 18.0.0)
node --version

# Check npm
npm --version
```

### 2. Install Dependencies | تثبيت التبعيات

```bash
# Navigate to ai-agents directory
cd ai-agents

# Install packages
npm install
```

### 3. Build the Project | بناء المشروع

```bash
# Compile TypeScript
npm run build
```

---

## 🎬 Running the System | تشغيل النظام

### Option 1: Run Demo | تشغيل العرض التجريبي

```bash
npm run demo
```

This will:
- Initialize all 10 AI agents
- Run Phase 1 demonstration
- Show agent communication
- Display performance monitoring

### Option 2: Run in Development Mode | التشغيل في وضع التطوير

```bash
npm run dev
```

### Option 3: Run Production Build | تشغيل النسخة النهائية

```bash
npm run build
npm start
```

---

## 📚 Basic Usage Examples | أمثلة الاستخدام الأساسية

### Example 1: Initialize System

```typescript
import { aiAgentsSystem } from './ai-agents';

async function main() {
  // Initialize the entire AI system
  await aiAgentsSystem.initialize();

  // System is now ready!
  console.log('System is running!');
}

main();
```

### Example 2: Assign Task to Agent

```typescript
import { cinemaMaestro } from './ai-agents';

// Create a task
const task = {
  taskId: 'TASK_001',
  taskName: 'Generate Medieval Castle Set',
  description: 'Create 3D medieval castle based on screenplay',
  priority: 'high',
  assignedAgent: 'SET_GENERATOR_01',
  status: 'pending',
  dependencies: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

// Assign task
const result = cinemaMaestro.assignTask('SET_GENERATOR_01', task);

if (result.success) {
  console.log('Task assigned successfully!');
}
```

### Example 3: Monitor Performance

```typescript
import { performanceMonitor } from './ai-agents';

// Display monitoring dashboard
performanceMonitor.displayDashboard();

// Get metrics for specific agent
const metrics = performanceMonitor.getMetrics('SET_GENERATOR_01');

// Get active alerts
const alerts = performanceMonitor.getActiveAlerts();
console.log(`Active alerts: ${alerts.length}`);
```

### Example 4: Agent Communication

```typescript
import { cinemaMaestro } from './ai-agents';

// Send message between agents
cinemaMaestro.sendMessage({
  messageId: 'MSG_001',
  fromAgent: 'SET_GENERATOR_01',
  toAgent: 'CULTURAL_AI_02',
  messageType: 'request',
  payload: { action: 'validate_cultural_accuracy' },
  timestamp: new Date(),
  priority: 'high'
});
```

---

## 🎯 Quick Reference | مرجع سريع

### Available Agents | الوكلاء المتاحة

1. **SET_GENERATOR_01** - AI Set Generator | مولد الديكورات
2. **CULTURAL_AI_02** - Cultural Authenticity | التوافق الثقافي
3. **VISUAL_ENGINE_03** - Visual Inspiration | الإلهام البصري
4. **PERSONAL_AI_04** - Personal Assistant | المساعد الشخصي
5. **MIXED_REALITY_05** - Mixed Reality | الواقع المختلط
6. **AGING_SIMULATOR_06** - Set Aging | محاكي التقادم
7. **STORYTELLING_07** - Visual Storytelling | السرد البصري
8. **FANTASY_GENERATOR_08** - Fantasy Worlds | العوالم الخيالية
9. **AUDIO_ANALYZER_09** - Audio Analysis | تحليل الصوت
10. **ORCHESTRATOR_10** - Cinema Maestro | قائد الأوركسترا

### Common Commands | الأوامر الشائعة

```bash
# Build project
npm run build

# Run demo
npm run demo

# Development mode
npm run dev

# Production mode
npm start

# Clean build
npm run clean
```

### Directory Structure | بنية المجلدات

```
ai-agents/
├── orchestrator/      # Cinema Maestro
├── agents/            # 9 Execution Agents
├── shared/           # Shared resources
├── monitoring/       # Performance monitoring
├── docs/            # Documentation
├── index.ts         # Main entry
└── demo.ts          # Demo script
```

---

## 🔧 Configuration | الإعدادات

### Environment Variables | متغيرات البيئة

Create a `.env` file in the `ai-agents` directory:

```env
# API Configuration
API_BASE_URL=http://localhost:3000
WS_URL=ws://localhost:3001

# Monitoring
MONITORING_INTERVAL=5000

# Agent Settings
AGENT_TIMEOUT=30000
AGENT_RETRY_ATTEMPTS=3
```

### Quality Standards | معايير الجودة

Defined in `/shared/config/agents.config.ts`:

- **Response Time**: < 2000ms
- **Accuracy**: > 95%
- **System Stability**: 99.9%
- **Cultural Accuracy**: > 95%

---

## 📊 System Health Check | فحص صحة النظام

```typescript
import { aiAgentsSystem, performanceMonitor } from './ai-agents';

// Get system status
const status = aiAgentsSystem.getStatus();
console.log('System Running:', status.isRunning);

// Check active alerts
const alerts = performanceMonitor.getActiveAlerts();
if (alerts.length > 0) {
  console.warn('Active alerts:', alerts.length);
}

// Get agent status
const agentStatus = cinemaMaestro.getAgentStatus('SET_GENERATOR_01');
console.log('Agent Status:', agentStatus.data);
```

---

## 🆘 Troubleshooting | حل المشاكل

### Problem: TypeScript compilation errors

**Solution:**
```bash
npm install
npm run clean
npm run build
```

### Problem: Module not found

**Solution:**
```bash
# Ensure you're in the correct directory
cd ai-agents

# Install dependencies
npm install
```

### Problem: Port already in use

**Solution:**
```bash
# Change port in .env file
API_BASE_URL=http://localhost:3001
```

---

## 📖 Next Steps | الخطوات التالية

1. **Read Full Documentation**: See `docs/README.md`
2. **Explore Agent Configs**: Check `/agents/*/agent.config.ts`
3. **Review API Documentation**: See integration APIs
4. **Run Demo**: Execute `npm run demo`
5. **Monitor Performance**: Use performance dashboard

---

## 💡 Tips | نصائح

- Always initialize the system before using agents
- Monitor performance regularly
- Check alerts for system issues
- Follow the phased development approach
- Test cultural accuracy thoroughly

---

## 📞 Support | الدعم

For questions or issues:
- Check the full documentation in `docs/README.md`
- Review the agent configurations
- Run the demo for examples

---

**Happy Building! 🎬**
**بناءً سعيداً! 🎬**
