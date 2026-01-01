/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// طبقة البيانات (Data Layer)
// بيانات هيكلية لتغذية الـ Dashboards
// ==========================================

export const performanceData = [
  { name: 'المشهد 1', durability: 90, comfort: 80, visual: 95 },
  { name: 'المشهد 2', durability: 65, comfort: 50, visual: 85 },
  { name: 'المشهد 3', durability: 40, comfort: 90, visual: 70 },
  { name: 'المشهد 4', durability: 85, comfort: 85, visual: 90 },
  { name: 'المشهد 5', durability: 20, comfort: 40, visual: 60 },
];

export const fabricStressTest = [
  { subject: 'مقاومة الشد', A: 120, B: 110, fullMark: 150 },
  { subject: 'ثبات اللون', A: 98, B: 130, fullMark: 150 },
  { subject: 'التهوية', A: 86, B: 130, fullMark: 150 },
  { subject: 'العمر الافتراضي', A: 99, B: 100, fullMark: 150 },
  { subject: 'المرونة', A: 85, B: 90, fullMark: 150 },
  { subject: 'مقاومة الحريق', A: 65, B: 85, fullMark: 150 },
];

export const budgetDistribution = [
  { name: 'خامات أساسية', value: 4000 },
  { name: 'تصنيع وتفصيل', value: 3000 },
  { name: 'تعديلات (Alterations)', value: 1500 },
  { name: 'إكسسوارات', value: 1000 },
];
