/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FabricType } from './rulesEngine';

export interface TechPackSpec {
  pantoneCode: string;
  pantoneName: string;
  hexPreview: string;
  fabricConsump: number; // Meters
  costEstimate: number; // USD
  historicalWarning: string | null;
  careLabel: string;
  // New properties for view
  threadCount: string;
  liningRequired: boolean;
}

// قاموس تواريخ اختراع الأقمشة
const FABRIC_HISTORY: Record<string, number> = {
  'polyester': 1941,
  'spandex': 1959,
  'nylon': 1935,
  'acrylic': 1950,
  'viscose': 1883,
  'cotton': -3000, // Ancient
  'wool': -10000, // Ancient
  'silk': -3000,
  'leather': -50000
};

// قاموس البانتون السينمائي (ألوان قياسية)
const PANTONE_MAP: Record<string, { code: string; name: string; hex: string }> = {
  'red': { code: '19-1763 TCX', name: 'High Risk Red', hex: '#A81C07' },
  'blue': { code: '19-4052 TCX', name: 'Classic Blue', hex: '#0F4C81' },
  'green': { code: '19-0419 TCX', name: 'Rifle Green', hex: '#444C38' },
  'black': { code: '19-4005 TCX', name: 'Stretch Limo', hex: '#2B2B2B' },
  'white': { code: '11-0601 TCX', name: 'Bright White', hex: '#F4F5F0' },
  'brown': { code: '19-1250 TCX', name: 'Picante', hex: '#8D4F37' },
  'yellow': { code: '13-0647 TCX', name: 'Illuminating', hex: '#F5DF4D' },
  'grey': { code: '17-5104 TCX', name: 'Ultimate Gray', hex: '#939597' }
};

/**
 * استخراج كود البانتون الأقرب (محاكاة)
 */
export const extractPantone = (colorFamily: string = 'black'): { code: string; name: string; hex: string } => {
  const key = colorFamily.toLowerCase();
  return PANTONE_MAP[key] || PANTONE_MAP['black'];
};

/**
 * تقدير استهلاك القماش بناءً على النوع
 */
export const estimateFabricUsage = (type: string, fabricWidth: number = 150): number => {
  // حساب تقريبي بالمتر الطولي (عرض 150 سم)
  switch (type.toLowerCase()) {
    case 'coat': return 3.5;
    case 'jacket': return 2.2;
    case 'shirt': return 1.8;
    case 'pants': return 1.5;
    case 'dress': return 4.0;
    default: return 2.0;
  }
};

/**
 * التحقق من الدقة التاريخية
 */
export const validateHistoricalAccuracy = (year: number, material: FabricType): string | null => {
  const inventionYear = FABRIC_HISTORY[material.toLowerCase()];
  
  if (inventionYear && year < inventionYear) {
    return `خطأ تاريخي: خامة "${material}" لم تكن موجودة في سنة ${year}. تم اختراعها عام ${inventionYear}.`;
  }
  
  // قواعد ثقافية إضافية
  if (year < 1920 && material === 'spandex') {
    return "خطأ راكور زمني: الأقمشة المطاطية (الليكرا/السباندكس) غير مقبولة في الدراما التاريخية قبل الخمسينات.";
  }

  return null;
};

/**
 * توليد أمر الشغل الكامل
 */
export const generateFullTechPack = (
  fabric: FabricType,
  garmentType: string,
  year: number,
  baseColor: string
): TechPackSpec => {
  const pantone = extractPantone(baseColor);
  const yardage = estimateFabricUsage(garmentType);
  const historyCheck = validateHistoricalAccuracy(year, fabric);
  
  // تقدير التكلفة (سعر المتر * الكمية + المصنعية)
  const basePricePerMeter = fabric === 'silk' || fabric === 'leather' ? 45 : 12;
  const cost = Math.round((basePricePerMeter * yardage) + 150); // 150 labour cost

  // تحديد Thread Count بشكل افتراضي بناءً على القماش
  let threadCount = '300 TC';
  if (fabric === 'silk') threadCount = '600 TC';
  if (fabric === 'wool') threadCount = '120 GSM';
  if (fabric === 'leather') threadCount = 'N/A';
  if (fabric === 'polyester') threadCount = '180 TC';

  // تحديد حاجة البطانة (Lining)
  const liningRequired = ['coat', 'jacket', 'dress'].includes(garmentType.toLowerCase());

  return {
    pantoneCode: pantone.code,
    pantoneName: pantone.name,
    hexPreview: pantone.hex,
    fabricConsump: yardage,
    costEstimate: cost,
    historicalWarning: historyCheck,
    careLabel: fabric === 'silk' || fabric === 'wool' ? 'Dry Clean Only' : 'Machine Wash Cold',
    threadCount,
    liningRequired
  };
};