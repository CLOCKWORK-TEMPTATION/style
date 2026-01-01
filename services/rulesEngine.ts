/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// محرك القواعد المنطقي (Deterministic Rules Engine)
// ده الكود المسؤول عن حساب عوامل الأمان والمتانة
// بناءً على قواعد فيزيائية وهندسية ثابتة، مش تخمين AI.
// ==========================================

export type FabricType = 'cotton' | 'polyester' | 'silk' | 'wool' | 'leather' | 'spandex';
export type SceneHazard = 'fire' | 'water' | 'stunt' | 'extreme_heat' | 'extreme_cold';

interface SafetyReport {
  score: number; // من 0 لـ 100
  status: 'safe' | 'warning' | 'critical';
  issues: string[];
  durabilityIndex: number; // مؤشر التحمل
}

/**
 * دالة تقييم المخاطر الفيزيائية
 * @param fabric نوع القماش المستخدم
 * @param hazards المخاطر الموجودة في المشهد
 */
export const evaluateSafety = (fabric: FabricType, hazards: SceneHazard[]): SafetyReport => {
  let score = 100;
  const issues: string[] = [];
  let durabilityIndex = 80; // Default

  // 1. تحليل مخاطر الحريق (Fire Hazard Logic)
  if (hazards.includes('fire')) {
    if (fabric === 'polyester' || fabric === 'spandex') {
      score -= 50;
      issues.push('خطر جسيم: البوليستر والسباندكس مواد سريعة الاشتعال وتذوب على الجلد.');
    } else if (fabric === 'wool') {
      score -= 5; // الصوف مقاوم نسبياً للنار
      durabilityIndex += 10;
    } else if (fabric === 'cotton') {
      score -= 20;
      issues.push('تحذير: القطن يشتعل بسرعة ما لم يتم معالجته كيميائياً.');
    }
  }

  // 2. تحليل الأكشن والحركة (Stunt Logic)
  if (hazards.includes('stunt')) {
    if (fabric === 'silk') {
      score -= 30;
      durabilityIndex -= 40;
      issues.push('تمزق: الحرير لا يتحمل الاحتكاك أو الشد العنيف في مشاهد الأكشن.');
    } else if (fabric === 'leather') {
      score += 10; // الجلد ممتاز للحماية
      durabilityIndex += 20;
    } else if (fabric === 'spandex') {
      score += 5; // مرونة عالية
      issues.push('ملاحظة: السباندكس يوفر حرية حركة ممتازة لكنه لا يوفر حماية من الكشط.');
    } else {
      issues.push('توصية: تأكد من خياطة مزدوجة (Double Stitching) لهذا المشهد.');
    }
  }

  // 3. تحليل البيئة المائية (Water Logic)
  if (hazards.includes('water')) {
    if (fabric === 'wool' || fabric === 'leather') {
      score -= 25;
      issues.push('وزن زائد: هذا القماش يمتص الماء ويصبح ثقيلاً جداً، مما قد يعيق السباحة.');
    } else if (fabric === 'polyester') {
      score += 10; // يجف بسرعة
    } else if (fabric === 'silk') {
      issues.push('تلف بصري: الحرير يفقد رونقه وتماسكه عند البلل.');
    }
  }

  // حساب الحالة النهائية
  let status: SafetyReport['status'] = 'safe';
  if (score < 50) status = 'critical';
  else if (score < 80) status = 'warning';

  return {
    score: Math.max(0, score),
    status,
    issues,
    durabilityIndex: Math.min(100, Math.max(0, durabilityIndex))
  };
};

/**
 * حساب تكلفة الاستهلاك المتوقعة
 * معادلة بسيطة لحساب الـ ROI
 */
export const calculateROI = (baseCost: number, durability: number, copiesNeeded: number) => {
    // كل ما المتانة تزيد، احتمالية إعادة الشراء بتقل
    const replacementFactor = (100 - durability) / 100; 
    const totalEstimatedCost = (baseCost * copiesNeeded) * (1 + replacementFactor);
    return Math.round(totalEstimatedCost);
};