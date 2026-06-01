/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sparkles, Calendar, Heart, ShieldAlert, ChevronRight, HelpCircle, Loader2, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { MealPlanInput, MealPlanResponse } from '../types';

export function MealPlanner() {
  const [formData, setFormData] = useState<MealPlanInput>({
    babyName: '',
    ageMonths: 6,
    dietaryPreference: 'all',
    dailyRoutine: 'all-day'
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<MealPlanResponse | null>(null);

  const handleInputChange = (field: keyof MealPlanInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.babyName.trim()) {
      setError("Please write your baby's precious name first!");
      return;
    }
    setError(null);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/mealplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error("We encountered a small storm in our kitchen. Please try again.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to contact Rayiza's recipe consultant. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  const restartPlan = () => {
    setStep(1);
    setResult(null);
  };

  return (
    <div className="bg-white/90 rounded-3xl p-6 md:p-8 organic-card-shadow border border-brand-sage/20 id-meal-planner-section min-h-[480px] flex flex-col justify-between">
      
      {/* Title & Header */}
      <div className="mb-6">
        <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-accent" /> Premium Recipe Helper
        </span>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-primary mt-1">
          Smart Feeding Planner
        </h3>
        <p className="text-gray-600 text-xs mt-1 leading-relaxed">
          Create an expert nutritional routine backed by traditional dietary wisdom designed around your infant's development.
        </p>
      </div>

      {!result && !loading && (
        <div className="flex-1">
          {/* Progress Indicators */}
          <div className="flex gap-2 mb-6">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-brand-primary' : 'bg-gray-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-brand-primary' : 'bg-gray-200'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-brand-primary' : 'bg-gray-200'}`} />
          </div>

          {/* Form Step Content */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                  What is your baby's name?
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={formData.babyName}
                  onChange={(e) => handleInputChange('babyName', e.target.value)}
                  placeholder="e.g. Aarav, Meenakshi..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-sage/30 bg-white/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-primary text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-2">
                  How many months old is your darling?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={6}
                    max={24}
                    value={formData.ageMonths}
                    onChange={(e) => handleInputChange('ageMonths', parseInt(e.target.value, 10))}
                    className="flex-1 accent-brand-accent h-2 bg-brand-sage/20 rounded-lg cursor-pointer"
                  />
                  <span className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-xl min-w-[70px] text-center">
                    {formData.ageMonths} Mo
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 leading-tight">
                  Rayiza specializes in dehydrated feeding from 6 Months up to 2 Years. Perfect solid introduction age!
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <label className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">
                Select Dietary Emphasis
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'all', title: 'Complete Nutrition', desc: 'Balanced macronutrients' },
                  { id: 'veg', title: 'Pure Plant Energy', desc: 'Entirely vegetarian starch' },
                  { id: 'iron-rich', title: 'Iron & Calcium Boost', desc: 'Accelerates bone density' },
                  { id: 'easy-digest', title: 'Delicate Tummy', desc: 'Sprouted & soothing items' }
                ].map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => handleInputChange('dietaryPreference', pref.id)}
                    className={`p-3.5 rounded-2xl text-left border cursor-pointer transition-all ${
                      formData.dietaryPreference === pref.id
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-brand-sage/20 bg-white/50 hover:bg-white text-gray-700'
                    }`}
                  >
                    <span className="font-bold text-xs block">{pref.title}</span>
                    <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">{pref.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <label className="block text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">
                Infant's Primary Play Routine
              </label>
              <div className="space-y-2">
                {[
                  { id: 'morning-active', label: 'Active Playful Mornings', desc: 'High carbs and energy profiles to fuel morning curiosity.' },
                  { id: 'evening-soothing', label: 'Comforting & Restful Evenings', desc: 'Porridge formulated to sustain fullness for quiet, safe sleep.' },
                  { id: 'all-day', label: 'Balanced General Schedule', desc: 'Mixed profiles optimized for smooth digestion during the day.' }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleInputChange('dailyRoutine', r.id)}
                    className={`w-full p-3 rounded-2xl text-left border cursor-pointer transition-all flex items-center justify-between ${
                      formData.dailyRoutine === r.id
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary'
                        : 'border-brand-sage/20 bg-white/50 hover:bg-white text-gray-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs block">{r.label}</span>
                      <span className="text-[10px] text-gray-500 block leading-tight mt-0.5">{r.desc}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      formData.dailyRoutine === r.id ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'
                    }`}>
                      {formData.dailyRoutine === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-5 py-3 rounded-xl border border-brand-sage/30 bg-white hover:bg-brand-cream text-brand-primary font-bold text-xs cursor-pointer transition-all"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                className="flex-1 px-5 py-3 rounded-xl bg-brand-primary text-white hover:opacity-95 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-brand-primary/10 ml-auto"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex-1 px-5 py-3 rounded-xl bg-brand-accent text-white hover:opacity-95 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-brand-accent/10 ml-auto animate-pulse"
              >
                <Sparkles className="w-4 h-4" /> Generate Motherly Meal Plan
              </button>
            )}
          </div>
        </div>
      )}

      {/* Loading state designed with mother care */}
      {loading && (
        <div className="flex-grow flex flex-col items-center justify-center py-12 animate-pulse text-center">
          <Loader2 className="w-12 h-12 text-brand-sage animate-spin mb-4" />
          <h4 className="font-display font-bold text-lg text-brand-primary">Consulting Grandma's Recipes...</h4>
          <p className="text-gray-500 text-xs mt-2 max-w-sm">
            Rayiza is designing a customized schedule for adorable <strong className="text-brand-accent">{formData.babyName}</strong> based on natural, FSSAI certified baby formulas.
          </p>
        </div>
      )}

      {/* Structured Output display */}
      {result && !loading && (
        <div className="flex-grow animate-fade-in space-y-6">
          <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/15 relative overflow-hidden">
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-accent/20">
                <Heart className="w-5 h-5 text-brand-accent fill-brand-accent" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-brand-primary">Plan prepared for {result.babyName} (Age: {result.ageMonths}m)</h4>
                <p className="text-[11px] text-gray-500 italic mt-0.5">Crafted with pure organic pride of Kasaragod, Kerala</p>
              </div>
            </div>
            <p className="text-gray-700 text-xs leading-relaxed mt-3 pt-3 border-t border-brand-primary/10 italic">
              &ldquo;{result.introText}&rdquo;
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#666666] uppercase tracking-wider block">Daily Meal Roadmap:</span>
            {result.meals.map((meal, idx) => (
              <div key={idx} id={`meal-item-${idx}`} className="p-4 rounded-2xl bg-white border border-brand-sage/10 hover:border-brand-sage transition-all">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <span className="px-2.5 py-1 bg-brand-cream text-brand-primary font-bold text-[10px] rounded-lg tracking-wider uppercase">
                    ⏰ {meal.timeOfDay}
                  </span>
                  <span className="font-semibold text-[10px] text-brand-accent bg-brand-accent/5 px-2 py-0.5 rounded-full border border-brand-accent/10">
                    💡 {meal.productSuggested}
                  </span>
                </div>
                <h5 className="font-bold text-sm text-brand-primary mb-1">{meal.mealName}</h5>
                <p className="text-gray-600 text-[11px] leading-normal">{meal.benefits}</p>
                
                <div className="mt-2 text-[10px] text-gray-500 border-l-2 border-brand-accent/30 pl-2 leading-relaxed">
                  <strong>Prep Steps:</strong> {meal.instructions}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-brand-sage/10 text-brand-primary space-y-2 border border-brand-sage/20 text-xs">
            <span className="font-bold text-brand-primary flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Traditional Feeding Advice:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-gray-600 text-[11px] leading-relaxed">
              {result.nutritionTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-red-50 text-red-900 rounded-xl flex items-start gap-2 border border-red-100 text-[10px]">
            <ShieldAlert className="w-4 h-4 text-[#e07a5f] shrink-0 mt-0.5" />
            <div>
              <strong>Grandmother's Comfort Pledge:</strong> {result.safetyWarning}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <button
              onClick={restartPlan}
              className="px-4 py-2 text-xs font-bold text-brand-primary bg-brand-cream border border-brand-sage/20 rounded-xl flex items-center gap-1.5 hover:bg-brand-cream/80 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-create Schedule
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 text-xs font-bold text-white bg-brand-primary rounded-xl flex items-center gap-1.5 hover:opacity-90 cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5" /> Save Plan
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
