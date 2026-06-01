/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Timer, Flame, CheckCircle2, Play, Pause, RotateCcw, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface PreparationGuideProps {
  products: Product[];
  onSelectProduct: (productId: string) => void;
  selectedProductId: string;
}

export function PreparationGuide({ products, onSelectProduct, selectedProductId }: PreparationGuideProps) {
  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];
  
  // Timer state
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Set default timer minutes based on product data (e.g. "4-5 mins", "3 mins")
  useEffect(() => {
    const rawTimeStr = selectedProduct.preparationTime;
    const match = rawTimeStr.match(/(\d+)/);
    const parsedMin = match ? parseInt(match[0], 10) : 3;
    setMinutes(parsedMin);
    setSeconds(0);
    setIsActive(false);
    setIsDone(false);
  }, [selectedProduct]);

  useEffect(() => {
    let interval: any = null;
    
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          setMinutes(prev => prev - 1);
          setSeconds(59);
        } else {
          setSeconds(prev => prev - 1);
        }
      }, 1000);
    } else if (isActive && minutes === 0 && seconds === 0) {
      setIsActive(false);
      setIsDone(true);
      // Play a small synthetic chime for a few seconds using Web Audio API!
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      } catch (e) {
        console.warn('Audio Context chime blocked by browser autoplay rules.');
      }
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    const rawTimeStr = selectedProduct.preparationTime;
    const match = rawTimeStr.match(/(\d+)/);
    const parsedMin = match ? parseInt(match[0], 10) : 3;
    setMinutes(parsedMin);
    setSeconds(0);
    setIsActive(false);
    setIsDone(false);
  };

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const prepSteps = [
    {
      title: "Clump-Free Mix",
      description: "Take 2 tablespoons of powder in a sturdy clean saucepan. Add exactly 1 cup of cold water or milk and stir aggressively prior to placing onto heat until fully smooth."
    },
    {
      title: "Gently Simmer",
      description: `Turn stove to a low-medium flame. Cook for ${selectedProduct.preparationTime}, ensuring you stir continuously to prevent the bottom from sticking.`,
      icon: <Flame className="w-5 h-5 text-amber-500" />
    },
    {
      title: "Glossy & Warm Finish",
      description: "Observe the porridge transform into a glowing, glossy velvety consistency (Kurukku). Remove from heat, let it breathe until safely lukewarm, and serve with sweet love."
    }
  ];

  return (
    <div className="bg-white/80 rounded-3xl p-6 md:p-8 organic-card-shadow border border-brand-sage/20 id-prep-section">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Product Selector & Info */}
        <div className="flex-1">
          <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-2">Interactive Guide</span>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-brand-primary mb-4 leading-tight">
            How to Prepare {selectedProduct.name}
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {products.map((prod) => (
              <button
                key={prod.id}
                id={`btn-prep-${prod.id}`}
                onClick={() => {
                  onSelectProduct(prod.id);
                  resetTimer();
                }}
                className={`px-3 py-2.5 rounded-2xl text-xs font-semibold text-center transition-all cursor-pointer ${
                  selectedProductId === prod.id
                    ? 'bg-brand-primary text-white scale-[1.03] shadow-md shadow-brand-primary/10'
                    : 'bg-brand-cream/60 text-brand-primary/80 hover:bg-brand-cream border border-brand-sage/10'
                }`}
              >
                {prod.name.split(' ')[0]} {prod.name.split(' ')[1] || ''}
              </button>
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-2xl bg-brand-cream/40 border border-brand-sage/10 text-sm">
              <span className="font-semibold text-brand-primary block mb-1">🔍 Raw Ingredients Matrix:</span>
              <p className="text-gray-600 italic text-xs leading-relaxed">{selectedProduct.ingredients}</p>
            </div>
            
            <div className="flex items-center gap-3 text-xs bg-amber-500/5 text-amber-900 p-3 rounded-xl border border-amber-500/10">
              <AlertCircle className="w-4 h-4 text-emerald-700 shrink-0" />
              <span><strong>Pure Guarantee:</strong> Highly sterilized Kasaragod recipes with absolute zero added starch, filler grains, or heavy metals.</span>
            </div>
          </div>

          {/* Visual Step Timeline */}
          <div className="space-y-4">
            {prepSteps.map((step, idx) => (
              <div key={idx} id={`prep-step-${idx}`} className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-full bg-brand-sage/10 text-brand-primary border border-brand-primary/10 font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-brand-primary flex items-center gap-2">
                    {step.title}
                    {idx === 1 && <Flame className="w-4 h-4 text-brand-accent animate-pulse" />}
                  </h4>
                  <p className="text-gray-600 text-xs leading-relaxed mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Visual Timer */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col items-center justify-center p-6 rounded-3xl bg-brand-cream/50 border border-brand-sage/20 relative overflow-hidden">
          
          {/* Subtle background bubble decor */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-sage/5 -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-brand-accent/5 -ml-16 -mb-16 pointer-events-none" />

          <Timer className="w-8 h-8 text-brand-primary mb-3 animate-bounce" />
          <span className="text-xs uppercase font-bold tracking-widest text-[#666666] mb-1">
            Porridge Timer
          </span>
          <div className="font-mono text-4xl sm:text-5xl font-bold text-brand-primary tracking-widest mb-6">
            {formattedTime}
          </div>

          {/* Timer status messages */}
          {isDone ? (
            <div className="flex flex-col items-center mb-6 text-center animate-fade-in">
              <span className="flex items-center gap-1.5 text-[#1e3f20] font-bold text-xs bg-brand-sage/20 px-3 py-1.5 rounded-full mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#1e3f20]" /> Safe and Done!
              </span>
              <span className="text-[11px] text-gray-500 leading-normal px-2">
                Warm tasty {selectedProduct.name.split(' ')[0]} baby porridge is cooked. Whisk gently, inspect temperature on wrist, and serve.
              </span>
            </div>
          ) : (
            <div className="text-center mb-6 h-10">
              <span className="text-xs text-brand-primary/80 italic">
                {isActive ? "Bubbling on gentle heat... stir well." : "Set the flame low, then start."}
              </span>
            </div>
          )}

          {/* Interactive controls */}
          <div className="flex items-center gap-3">
            <button
              id="timer-control-btn"
              onClick={toggleTimer}
              disabled={isDone}
              className={`p-3.5 rounded-full text-white font-semibold transition-all scale-[1.03] cursor-pointer shadow-md disabled:opacity-40 ${
                isActive ? 'bg-brand-accent hover:opacity-90 shadow-brand-accent/20' : 'bg-brand-primary hover:opacity-90 shadow-brand-primary/20'
              }`}
              title={isActive ? "Pause" : "Start"}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>

            <button
              id="timer-reset-btn"
              onClick={resetTimer}
              className="p-3.5 rounded-full bg-white text-brand-primary border border-brand-sage/30 shadow-sm hover:bg-brand-cream transition-all cursor-pointer"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Prompting action */}
          <div className="w-full text-center mt-6 pt-5 border-t border-brand-sage/10">
            <p className="text-[11px] text-gray-500 mb-2">Want to try this nutrition blend?</p>
            <a
              href="#order-section"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-brand-accent hover:text-brand-accent/80 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" /> Direct Parent Order
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
