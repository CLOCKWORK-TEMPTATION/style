/**
 * Performance Monitoring System
 * نظام مراقبة الأداء
 */

import { PerformanceMetrics, MonitoringData, Alert, LogEntry } from '../shared/types/agent.types';
import { QUALITY_STANDARDS } from '../shared/config/agents.config';

export class PerformanceMonitor {
  private metricsHistory: Map<string, PerformanceMetrics[]>;
  private alerts: Alert[];
  private logs: LogEntry[];
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    this.metricsHistory = new Map();
    this.alerts = [];
    this.logs = [];
  }

  /**
   * Start monitoring system
   */
  public start(intervalMs: number = 5000): void {
    console.log('🔍 Performance Monitor Started');

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, intervalMs);
  }

  /**
   * Stop monitoring system
   */
  public stop(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      console.log('⏹️  Performance Monitor Stopped');
    }
  }

  /**
   * Record metrics for an agent
   */
  public recordMetrics(agentId: string, metrics: PerformanceMetrics): void {
    const history = this.metricsHistory.get(agentId) || [];
    history.push(metrics);

    // Keep only last 100 records
    if (history.length > 100) {
      history.shift();
    }

    this.metricsHistory.set(agentId, history);

    // Check against quality standards
    this.checkQualityStandards(agentId, metrics);

    // Log metrics
    this.log('info', agentId, 'Metrics recorded', { metrics });
  }

  /**
   * Check metrics against quality standards
   */
  private checkQualityStandards(agentId: string, metrics: PerformanceMetrics): void {
    const standards = QUALITY_STANDARDS.technicalPerformance;

    // Check response time
    if (metrics.responseTime > standards.maxResponseTime) {
      this.createAlert({
        alertId: this.generateAlertId(),
        severity: 'warning',
        message: `${agentId}: Response time exceeded threshold (${metrics.responseTime}ms > ${standards.maxResponseTime}ms)`,
        messageAr: `${agentId}: وقت الاستجابة تجاوز الحد المسموح (${metrics.responseTime}ms > ${standards.maxResponseTime}ms)`,
        timestamp: new Date(),
        resolved: false
      });
    }

    // Check accuracy
    if (metrics.accuracy < standards.minAccuracy) {
      this.createAlert({
        alertId: this.generateAlertId(),
        severity: 'critical',
        message: `${agentId}: Accuracy below threshold (${metrics.accuracy} < ${standards.minAccuracy})`,
        messageAr: `${agentId}: الدقة أقل من الحد المسموح (${metrics.accuracy} < ${standards.minAccuracy})`,
        timestamp: new Date(),
        resolved: false
      });
    }

    // Check resource usage
    if (metrics.resourceUsage.cpu > 80) {
      this.createAlert({
        alertId: this.generateAlertId(),
        severity: 'warning',
        message: `${agentId}: High CPU usage (${metrics.resourceUsage.cpu}%)`,
        messageAr: `${agentId}: استخدام عالٍ للمعالج (${metrics.resourceUsage.cpu}%)`,
        timestamp: new Date(),
        resolved: false
      });
    }

    if (metrics.resourceUsage.memory > 70) {
      this.createAlert({
        alertId: this.generateAlertId(),
        severity: 'warning',
        message: `${agentId}: High memory usage (${metrics.resourceUsage.memory}%)`,
        messageAr: `${agentId}: استخدام عالٍ للذاكرة (${metrics.resourceUsage.memory}%)`,
        timestamp: new Date(),
        resolved: false
      });
    }
  }

  /**
   * Create alert
   */
  private createAlert(alert: Alert): void {
    this.alerts.push(alert);
    console.warn(`⚠️  ALERT [${alert.severity}]: ${alert.message}`);
  }

  /**
   * Get metrics for agent
   */
  public getMetrics(agentId: string, count: number = 10): PerformanceMetrics[] {
    const history = this.metricsHistory.get(agentId) || [];
    return history.slice(-count);
  }

  /**
   * Get average metrics for agent
   */
  public getAverageMetrics(agentId: string): PerformanceMetrics | null {
    const history = this.metricsHistory.get(agentId);
    if (!history || history.length === 0) return null;

    const avg = history.reduce((acc, metrics) => ({
      responseTime: acc.responseTime + metrics.responseTime,
      accuracy: acc.accuracy + metrics.accuracy,
      resourceUsage: {
        cpu: acc.resourceUsage.cpu + metrics.resourceUsage.cpu,
        memory: acc.resourceUsage.memory + metrics.resourceUsage.memory,
        gpu: (acc.resourceUsage.gpu || 0) + (metrics.resourceUsage.gpu || 0)
      },
      successRate: acc.successRate + metrics.successRate,
      uptime: acc.uptime + metrics.uptime
    }), {
      responseTime: 0,
      accuracy: 0,
      resourceUsage: { cpu: 0, memory: 0, gpu: 0 },
      successRate: 0,
      uptime: 0
    });

    const count = history.length;
    return {
      responseTime: avg.responseTime / count,
      accuracy: avg.accuracy / count,
      resourceUsage: {
        cpu: avg.resourceUsage.cpu / count,
        memory: avg.resourceUsage.memory / count,
        gpu: avg.resourceUsage.gpu ? avg.resourceUsage.gpu / count : undefined
      },
      successRate: avg.successRate / count,
      uptime: avg.uptime / count
    };
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  /**
   * Get all alerts
   */
  public getAllAlerts(limit: number = 50): Alert[] {
    return this.alerts.slice(-limit);
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.alertId === alertId);
    if (alert) {
      alert.resolved = true;
      console.log(`✅ Alert resolved: ${alertId}`);
    }
  }

  /**
   * Get recent logs
   */
  public getLogs(level?: 'debug' | 'info' | 'warning' | 'error', limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    return filteredLogs.slice(-limit);
  }

  /**
   * Log entry
   */
  public log(level: 'debug' | 'info' | 'warning' | 'error', agentId: string, message: string, metadata?: any): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      agentId,
      message,
      metadata
    };

    this.logs.push(entry);

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }

    // Console output
    const emoji = {
      debug: '🔍',
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌'
    }[level];

    if (level !== 'debug') {
      console.log(`${emoji} [${agentId}] ${message}`);
    }
  }

  /**
   * Collect metrics (simulated)
   */
  private collectMetrics(): void {
    // In a real implementation, this would collect actual system metrics
    // For now, we'll just log that monitoring is active
    this.log('debug', 'MONITOR', 'Collecting metrics...');
  }

  /**
   * Generate monitoring report
   */
  public generateReport(): string {
    const report = [];

    report.push('\n' + '═'.repeat(80));
    report.push('📊 PERFORMANCE MONITORING REPORT');
    report.push('═'.repeat(80));
    report.push('');

    // Active Alerts
    const activeAlerts = this.getActiveAlerts();
    report.push(`🚨 Active Alerts: ${activeAlerts.length}`);
    activeAlerts.forEach(alert => {
      report.push(`   [${alert.severity}] ${alert.message}`);
    });
    report.push('');

    // Agent Metrics Summary
    report.push('📈 Agent Performance Summary:');
    this.metricsHistory.forEach((history, agentId) => {
      const avg = this.getAverageMetrics(agentId);
      if (avg) {
        report.push(`   ${agentId}:`);
        report.push(`      Avg Response Time: ${avg.responseTime.toFixed(2)}ms`);
        report.push(`      Avg Accuracy: ${(avg.accuracy * 100).toFixed(2)}%`);
        report.push(`      Avg CPU: ${avg.resourceUsage.cpu.toFixed(2)}%`);
        report.push(`      Success Rate: ${(avg.successRate * 100).toFixed(2)}%`);
        report.push('');
      }
    });

    // Recent Errors
    const errors = this.getLogs('error', 10);
    report.push(`❌ Recent Errors: ${errors.length}`);
    errors.forEach(error => {
      report.push(`   [${error.agentId}] ${error.message}`);
    });

    report.push('═'.repeat(80) + '\n');

    return report.join('\n');
  }

  /**
   * Display monitoring dashboard
   */
  public displayDashboard(): void {
    console.log(this.generateReport());
  }

  /**
   * Generate alert ID
   */
  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();
