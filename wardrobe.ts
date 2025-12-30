/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { WardrobeItem } from './types';

// عناصر خزانة الملابس الافتراضية للاستخدام التجريبي
// تم اختيار أسماء توحي بالأزياء السينمائية
export const defaultWardrobe: WardrobeItem[] = [
  {
    id: 'cyberpunk-jacket',
    name: 'Sci-Fi Rebel Jacket',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/gemini-sweat-2.png', // Using placeholder visual but conceptualizing as costume
  },
  {
    id: 'period-shirt',
    name: 'Vintage Protagonist Tee',
    url: 'https://raw.githubusercontent.com/ammaarreshi/app-images/refs/heads/main/Gemini-tee.png',
  }
];