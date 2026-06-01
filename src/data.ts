/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, FAQItem } from './types';

export const SIGNATURE_PRODUCTS: Product[] = [
  {
    id: 'sprouted-ragi',
    name: 'Sprouted Ragi Powder',
    malayalamName: 'മുളപ്പിച്ച രാഗി പൊടി',
    description: "Rich in calcium, organic iron, and essential dietary fiber. Sprouting naturally breaks down complex starches, making it incredibly gentle for your baby's delicate tummy to digest and absorb.",
    benefits: [
      'Excellent Calcium source for sturdy bone development',
      'High Bio-available Iron to prevent infant anemia',
      'Sprouted for 3x easier nutrient absorption',
      '100% allergen-friendly and gluten-free'
    ],
    preparationTime: '4–5 mins',
    ingredients: '100% Certified Sprouted finger millet grains (Ragi/Muthari). Purely washed, sprouted, sun-dried, gently roasted, and finely ground under strict clinical hygiene.',
    ageGroup: '6 Months & Above',
    icon: 'Bean',
    color: 'from-amber-700/10 to-amber-700/20 text-amber-800 border-amber-500/20',
    nutrients: [
      { label: 'Calcium', value: '344 mg/100g', isPrimary: true },
      { label: 'Iron', value: '3.9 mg/100g', isPrimary: true },
      { label: 'Fiber', value: '3.6g/100g' },
      { label: 'Protein', value: '7.3g/100g' }
    ]
  },
  {
    id: 'natural-banana',
    name: 'Natural Raw Banana Powder',
    malayalamName: 'ഏത്തക്കായ പൊടി',
    description: "A legendary traditional Keralite baby weight-gainer made from organic Nendran bananas. Gently dried below critical heat to preserve digestive starch that nurtures gut healthy microflora.",
    benefits: [
      'Renowned for healthy and organic infant weight gain',
      'Rich in potassium and Vitamin B6 for brain development',
      'Exceptionally soothing for reflux and tummy sensitivity',
      'Naturally sweet taste that babies naturally love'
    ],
    preparationTime: '3 mins',
    ingredients: '100% Premium Raw Kerala Nendran Bananas. Sourced directly from local high-range farms of Kasaragod, peeled, meticulously washed, sliced, sun-dehydrated, and ground.',
    ageGroup: '6 Months & Above',
    icon: 'Banana',
    color: 'from-yellow-600/10 to-yellow-600/20 text-yellow-800 border-yellow-500/20',
    nutrients: [
      { label: 'Potassium', value: '350 mg/100g', isPrimary: true },
      { label: 'Carbs (Energy)', value: '82g/100g', isPrimary: true },
      { label: 'Vitamin B6', value: '0.3 mg/100g' },
      { label: 'Dietary Fiber', value: '2.4g/100g' }
    ]
  },
  {
    id: 'abc-mix',
    name: 'ABC Powder (Apple, Beetroot & Carrot)',
    malayalamName: 'എ.ബി.സി ഹെൽത്ത് മിക്സ്',
    description: "A vibrant, vitamin-packed superpower blend. Introduces colorful local veggies and sweet apples to train your child's palette early towards diverse organic tastes while boosting active immunity.",
    benefits: [
      'Antioxidant powerhouse for building deep resistance',
      'Splendid natural Vitamin C to enhance Iron assimilation',
      'Supplements natural folic acid and skin-glowing skin nutrients',
      'No added sugars or colors - beautifully pink naturally'
    ],
    preparationTime: '2 mins',
    ingredients: 'Pure dehydrate combination of fresh Himalayan Red Apples (50%), garden-fresh organic Beetroots (25%), and sweet local Carrots (25%). No additives.',
    ageGroup: '6 Months & Above',
    icon: 'Apple',
    color: 'from-rose-600/10 to-rose-600/20 text-rose-800 border-rose-500/20',
    nutrients: [
      { label: 'Vitamin C', value: '8.4 mg/100g', isPrimary: true },
      { label: 'Vitamin A', value: '1250 IU/100g', isPrimary: true },
      { label: 'Antioxidants', value: 'Super High' },
      { label: 'Folate', value: '25 mcg/100g' }
    ]
  },
  {
    id: 'mixed-kurukku',
    name: 'Mixed Baby Food Kurukku',
    malayalamName: 'മിക്സഡ് കുറുക്ക്',
    description: "The golden traditional standard for Kerala infants. Provides complete, balanced macros that satisfy growing mineral and sleep demands, keeping infants happy, filling their tummies safely.",
    benefits: [
      'Multi-grain high protein matrix for healthy growth spurts',
      'Keeps baby full and comforted through the evening sleep scale',
      'Blended with mild traditional cooling cardamoms',
      'Traditional grandmother-approved formula'
    ],
    preparationTime: '5 mins',
    ingredients: 'Premium balanced blend of sprouted Ragi, sun-dried raw banana powder, pearl millet, high-quality red rice granules, roasted gram dhal, and a pinch of aromatic green cardamom.',
    ageGroup: '6 Months & Above',
    icon: 'Sparkles',
    color: 'from-emerald-700/10 to-emerald-700/20 text-emerald-800 border-emerald-500/20',
    nutrients: [
      { label: 'Protein', value: '11.4g/100g', isPrimary: true },
      { label: 'Calcium', value: '210 mg/100g', isPrimary: true },
      { label: 'Energy', value: '388 kcal/100g' },
      { label: 'Phosphorus', value: '185 mg/100g' }
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'safety',
    question: "Do you have FSSAI certification and what are your hygiene measures?",
    answer: "Yes, absolutely! Rayiza's Natural Products is fully FSSAI certified. Our production process takes place in a highly controlled, clinically sanitized kitchen environment in Mugi, Kasaragod. Every vessel is steam-sterilized, and our team adheres to double-mask and glove protocols because baby safety is our highest pledge."
  },
  {
    id: 'faq-2',
    category: 'products',
    question: "Why do you sprout the Ragi grains?",
    answer: "Sprouting is like pre-digesting the grain for your baby! When Ragi sprouts, it releases phytases that break down phytic acid (which usually blocks mineral absorption). This significantly multiplies the bioavailability of Calcium and Iron and makes the porridge super smooth and simple on your infant's gut."
  },
  {
    id: 'faq-3',
    category: 'preparation',
    question: "How do I prepare the powder for my 6-month-old baby?",
    answer: "It is incredibly easy! Take 2 tablespoons of Rayiza's powder in a clean pan. Add 1 cup of cold water or milk and mix thoroughly until no clumps remain. Cook on a medium-to-low stove flame for 3–5 minutes, stirring continuously. Once it thickens into a glossy, velvety consistency, remove from heat, let it cool to lukewarm, and lovingly spoon-feed."
  },
  {
    id: 'faq-4',
    category: 'safety',
    question: "Are there any synthetic preservatives, sugars, or salt added?",
    answer: "Never. We strictly guarantee 100% natural pure ingredients. Our hydration and gentle roasting method are natural ways to extend shelf life without any chemical preservatives. We believe baby food should are pristine with zero refined sugar or sodium."
  },
  {
    id: 'faq-5',
    category: 'products',
    question: "What is special about Kasaragod Nendran Bananas?",
    answer: "The raw Nendran bananas of North Kerala are praised for their digestive properties and are rich in prebiotic starches. They form the ultimate traditional weight-gaining porridge that does not cause baby constipation, unlike standard banana purees."
  }
];

export const NUTRITION_BENEFITS_CHART = [
  { nutrient: 'Iron (Blood health)', needed: '11mg', ragiPower: '3.9mg', bananaPower: '1.2mg', abcBlend: '1.8mg', kurukku: '4.2mg' },
  { nutrient: 'Calcium (Bones)', needed: '260mg', ragiPower: '344mg', bananaPower: '40mg', abcBlend: '50mg', kurukku: '210mg' },
  { nutrient: 'Protein (Growth)', needed: '11g', ragiPower: '7.3g', bananaPower: '3.2g', abcBlend: '4.8g', kurukku: '11.4g' },
  { nutrient: 'Potassium (Heart)', needed: '500mg', ragiPower: '120mg', bananaPower: '350mg', abcBlend: '210mg', kurukku: '280mg' }
];
