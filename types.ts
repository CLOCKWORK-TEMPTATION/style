/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// المدخلات بناءً على الأسئلة الستة
export interface DesignBrief {
  // أ) سياق العمل
  projectType: string; // فيلم/مسلسل + التصنيف
  sceneContext: string; // ملخص المشهد/الزمان/المكان
  
  // ب) بيانات الشخصية
  characterProfile: string; // الاسم، العمر، الدور، الطبقة
  psychologicalState: string; // الحالة النفسية، ما يظهر وما يخفى

  // ج) قيود تنفيذية
  filmingLocation: string; // المدينة (للطقس)
  productionConstraints: string; // الميزانية، المحاذير، الأكشن
}

// هيكل المخرجات التفصيلي (Costume Breakdown Sheet)
export interface ProfessionalDesignResult {
  lookTitle: string; // عنوان اللوك
  dramaticDescription: string; // الوصف الدرامي-البصري
  
  // تفكيك الزي
  breakdown: {
    basics: string; // ملابس أساسية
    layers: string; // طبقات إضافية
    shoes: string; // أحذية
    accessories: string; // إكسسوارات
    materials: string; // خامات/ملمس
    colorPalette: string; // لوحة ألوان
  };

  // المبررات
  rationale: string[]; // نقاط التبرير

  // ملاحظات إنتاجية
  productionNotes: {
    copies: string; // نسخ مطلوبة
    distressing: string; // تعتيق/اتساخ
    cameraWarnings: string; // تحذيرات كاميرا
    weatherAlt: string; // بديل طقس
    budgetAlt: string; // بديل ميزانية
  };

  imagePrompt: string; // البرومبت المستخدم للصورة
  conceptArtUrl: string; // رابط الصورة المولدة
  
  // بيانات الطقس الفعلي
  realWeather: {
    temp: number;
    condition: string;
    location: string;
    sources?: string[]; // Google Search Sources
  };
}

// نتيجة تحليل التلاؤم (AI Safety & Comfort Analysis)
export interface FitAnalysisResult {
    compatibilityScore: number; // نسبة التوافق (0-100)
    safetyIssues: string[]; // قائمة بالمخاطر المحتملة (تعثر، ضيق تنفس)
    fabricNotes: string; // ملاحظات حول تفاعل القماش
    movementPrediction: string; // توقع حرية الحركة
}

// (Legacy types kept for compatibility)
export interface WardrobeItem {
  id: string;
  name: string;
  url: string;
}

export interface OutfitLayer {
  garment: WardrobeItem | null; 
  poseImages: Record<string, string>;
}

// إعدادات محرك المحاكاة
export interface SimulationConfig {
    lighting: 'natural' | 'studio' | 'dramatic' | 'neon';
    physics: 'static' | 'flow' | 'heavy' | 'wet';
    action: 'idle' | 'walking' | 'running' | 'fighting';
    actorConstraints?: string; // New field for specific actor limitations
}

export type ImageGenerationSize = '1K' | '2K' | '4K';