/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  malayalamName: string;
  description: string;
  benefits: string[];
  preparationTime: string;
  ingredients: string;
  ageGroup: string;
  icon: string; // Lucide icon identifier
  color: string; // CSS styling colors
  nutrients: {
    label: string;
    value: string;
    isPrimary?: boolean;
  }[];
}

export interface MealPlanInput {
  babyName: string;
  ageMonths: number;
  dietaryPreference: 'all' | 'veg' | 'iron-rich' | 'easy-digest';
  dailyRoutine: 'morning-active' | 'evening-soothing' | 'all-day';
}

export interface MealPlanMeal {
  timeOfDay: string;
  mealName: string;
  productSuggested: string;
  benefits: string;
  instructions: string;
}

export interface MealPlanResponse {
  babyName: string;
  ageMonths: number;
  introText: string;
  meals: MealPlanMeal[];
  nutritionTips: string[];
  safetyWarning: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'safety' | 'products' | 'preparation' | 'general';
}
