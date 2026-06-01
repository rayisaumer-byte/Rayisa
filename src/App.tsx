/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bean, Banana, Apple, Sparkles, Heart, ShieldCheck, 
  MapPin, Activity, Award, ShoppingBag, Plus, Minus, 
  ChefHat, ChevronRight, CheckCircle2, ThumbsUp, Scale, AlertTriangle 
} from 'lucide-react';

import { SIGNATURE_PRODUCTS, FAQS, NUTRITION_BENEFITS_CHART } from './data';
import { PreparationGuide } from './components/PreparationGuide';
import { MealPlanner } from './components/MealPlanner';
import { ParentAdvisor } from './components/ParentAdvisor';
import { Logo } from './components/Logo';

// Refers to our custom generated hero image
const heroImgUrl = "/src/assets/images/rayizas_brand_hero_1780307352598.png";

export default function App() {
  // Navigation & Product Switchers
  const [activeCatalogId, setActiveCatalogId] = useState('sprouted-ragi');
  const [prepProductId, setPrepProductId] = useState('sprouted-ragi');
  const [activeFaqCategory, setActiveFaqCategory] = useState<'all' | 'safety' | 'products' | 'preparation'>('all');

  // Interactive Nutrition Tracker State
  const [trackerAge, setTrackerAge] = useState(7); // default 7 months
  const [trackerWeight, setTrackerWeight] = useState(8.5); // default 8.5 kg

  // Interactive WhatsApp Order Assistant state
  const [orderCounts, setOrderCounts] = useState<Record<string, number>>({
    'sprouted-ragi': 1,
    'natural-banana': 1,
    'abc-mix': 0,
    'mixed-kurukku': 0
  });
  const [parentName, setParentName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [babyAgeMonths, setBabyAgeMonths] = useState('7');
  const [specialNote, setSpecialNote] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Increments / Decrements for order counts
  const adjustOrderCount = (productId: string, delta: number) => {
    setOrderCounts(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) + delta)
    }));
  };

  // Nutrition requirements calculations based on interactive slider inputs
  const calculatedEnergyNeed = Math.round(trackerWeight * 80); // ~80 kcal per kg for infants
  const calculatedProteinNeed = (trackerWeight * 1.2).toFixed(1); // ~1.2g protein per kg for infants
  const calculatedCalciumNeed = trackerAge <= 12 ? 260 : 500; // 260mg under 12m, 500mg above
  const calculatedIronNeed = trackerAge <= 12 ? 11 : 7; // 11mg under 12m, 7mg above

  // Selected product logic
  const activeCatalogProduct = SIGNATURE_PRODUCTS.find(p => p.id === activeCatalogId) || SIGNATURE_PRODUCTS[0];

  // Helper to get matching icons
  const getProductIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bean': return <Bean className="w-5 h-5 text-amber-700" />;
      case 'Banana': return <Banana className="w-5 h-5 text-yellow-600" />;
      case 'Apple': return <Apple className="w-5 h-5 text-rose-600" />;
      default: return <Sparkles className="w-5 h-5 text-emerald-700" />;
    }
  };

  // FAQs selection logic
  const displayedFaqs = activeFaqCategory === 'all' 
    ? FAQS 
    : FAQS.filter(faq => faq.category === activeFaqCategory);

  // Generate order text for WhatsApp redirection
  const generateWhatsAppMessage = () => {
    const productsInOrder = SIGNATURE_PRODUCTS.filter(p => orderCounts[p.id] > 0);
    
    if (productsInOrder.length === 0) {
      return "Hello, I am interested in seeking information regarding Rayiza's Natural Products baby foods.";
    }

    let itemsString = '';
    productsInOrder.forEach(p => {
      itemsString += `• ${p.name} - ${orderCounts[p.id]} Packet(s)\n`;
    });

    const bodyMsg = 
      `🌿 *New Baby Food Order inquiry (Rayiza's Natural Products)* 🌿\n\n` +
      `*Parent Details:*\n` +
      `• Name: ${parentName || 'Lovely Parent'}\n` +
      `• Infant Age: ${babyAgeMonths} Months\n` +
      `• Delivery Address: ${deliveryAddress || 'Not specified yet'}\n` +
      `• Special Care Note: ${specialNote || 'None'}\n\n` +
      `*Product List:*\n${itemsString}\n` +
      `"Crafted with clinical infant hygiene FSSAI benchmarks & motherhood care in Kasaragod, Kerala."`;

    return encodeURIComponent(bodyMsg);
  };

  const handleCopyToClipboard = () => {
    const productsInOrder = SIGNATURE_PRODUCTS.filter(p => orderCounts[p.id] > 0);
    let itemsString = '';
    productsInOrder.forEach(p => {
      itemsString += `• ${p.name} - ${orderCounts[p.id]} Packets\n`;
    });

    const bodyMsg = 
      `🌿 New Baby Food Order Request 🌿\n` +
      `Parent: ${parentName || 'Parent'}\n` +
      `Baby Age: ${babyAgeMonths}m\n` +
      `Delivery: ${deliveryAddress || 'Kasaragod / Kerala'}\n` +
      `Order Items:\n${itemsString}` +
      `Special Note: ${specialNote || 'None'}`;

    navigator.clipboard.writeText(bodyMsg);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-brand-cream/45 selection:bg-brand-sage/30 select-none antialiased id-app-container py-0 my-0">
      
      {/* Dynamic Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-brand-sage/10 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-11 sm:h-12 w-auto" />
            <div className="border-l border-brand-sage/25 pl-3 hidden sm:block select-none pointer-events-none">
              <span className="text-[10px] text-gray-500 font-mono tracking-tight font-medium block">Mugi, Kasaragod</span>
              <span className="text-[9px] text-brand-accent font-sans font-bold uppercase tracking-wider block bg-brand-accent/5 px-1 py-0.5 mt-0.5 rounded">FSSAI Certified</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#signature-range" className="text-xs font-bold text-brand-primary/80 hover:text-brand-accent transition-colors">Our Range</a>
            <a href="#nutrition-calculator" className="text-xs font-bold text-brand-primary/80 hover:text-brand-accent transition-colors">Baby Tracker</a>
            <a href="#prep-section" className="text-xs font-bold text-brand-primary/80 hover:text-brand-accent transition-colors">Preparation</a>
            <a href="#parenting-hub" className="text-xs font-bold text-brand-primary/80 hover:text-brand-accent transition-colors">AI Advisor</a>
            <a href="#faqs-range" className="text-xs font-bold text-brand-primary/80 hover:text-brand-accent transition-colors">Safety FAQs</a>
          </nav>

          <a 
            href="#order-section" 
            className="px-4 py-2 bg-brand-primary text-white font-bold text-xs rounded-xl shadow-md shadow-brand-primary/10 hover:bg-brand-primary/95 hover:scale-[1.02] cursor-pointer transition-all flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Order Baby Food
          </a>
        </div>
      </header>

      {/* Hero Banner Area */}
      <section className="relative pt-6 pb-12 lg:pb-16 id-hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-brand-sage/20 bg-white shadow-xl shadow-brand-primary/5 lg:min-h-[580px] flex items-center">
            
            {/* Premium Full-Width Desktop Background Image */}
            <div 
              className="absolute inset-0 bg-no-repeat pointer-events-none hidden lg:block"
              style={{ 
                backgroundImage: `url("${heroImgUrl}")`,
                backgroundPosition: 'right center',
                backgroundSize: 'cover'
              }}
            />
            {/* Pure white gradient overlay for maximum readability & seamless blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 lg:via-white/80 to-transparent lg:w-[65%] pointer-events-none z-0" />
            
            <div className="relative w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 py-10 sm:p-12 lg:p-16">
              
              {/* Left Text layout */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 z-10 space-y-6"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-brand-accent font-bold tracking-widest uppercase bg-brand-accent/5 border border-brand-accent/15 px-3 py-1.5 rounded-full">
                  <Award className="w-3.5 h-3.5 text-brand-accent" /> Premium FSSAI Certified Infant Meal Mixes
                </span>
                
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-primary leading-tight">
                  Pure Nutrition, Made with a <span className="text-brand-accent italic font-serif">Mother’s Care</span>.
                </h2>
                
                <p className="text-[#555] text-sm md:text-base leading-relaxed max-w-xl">
                  At Rayiza’s, we believe that the first steps into solid foods should be pure, safe, and wholesome. We craft 100% natural, dehydrated baby health mixes designed for infants aged <strong>6 Months & above</strong>, preserving ancestral baby recipes with modern clinically hygienic, dry-milling techniques.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <a 
                    href="#order-section" 
                    className="px-6 py-3.5 bg-brand-accent text-white font-extrabold text-sm rounded-xl text-center shadow-lg shadow-brand-accent/20 hover:opacity-95 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Explore Signature Range <ChevronRight className="w-4 h-4" />
                  </a>
                  <a 
                    href="#parenting-hub" 
                    className="px-6 py-3.5 bg-white text-brand-primary border border-brand-sage/30 hover:border-brand-sage font-bold text-sm rounded-xl text-center hover:bg-brand-cream transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" /> Try AI Support
                  </a>
                </div>

                {/* Quick Micro trust points */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-brand-sage/10 text-center">
                  <div>
                    <span className="font-display font-black text-lg text-brand-primary block">100%</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Preservative Free</span>
                  </div>
                  <div className="border-x border-brand-sage/15">
                    <span className="font-display font-black text-lg text-brand-primary block">FSSAI Certified</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Reg No. Confirmed</span>
                  </div>
                  <div>
                    <span className="font-display font-black text-lg text-brand-primary block">Kasaragod</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mt-1">Direct-Farm Sourced</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column (Mobile-only Card Illustration) */}
              <div className="lg:col-span-5 block lg:hidden w-full relative z-10">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full bg-brand-sage/10 blur-3xl pointer-events-none" />
                  
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-primary/10 border-4 border-white scale-[1.01]">
                    <img 
                      src={heroImgUrl}
                      alt="Rayiza's Organic Baby Porridge"
                      className="w-full h-auto object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-brand-sage/20 shadow-md">
                      <p className="text-[11px] text-brand-primary font-bold italic text-center">
                        &ldquo;A healthy infant starts with traditional meals that sprouted seeds naturally support.&rdquo; – Rayiza, Kasaragod
                      </p>
                    </div>
                  </div>

                  {/* Float badge */}
                  <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-950 font-black text-[9px] uppercase px-3 py-2 rounded-xl shadow-md border-2 border-white rotate-12 flex flex-col items-center leading-none">
                    <span>Pure Raw</span>
                    <span className="text-[7px] opacity-80 mt-0.5">Gluten-Free</span>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Ribbon */}
      <section className="bg-brand-primary text-brand-cream py-6 id-badge-banner">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none flex gap-8 items-center justify-around whitespace-nowrap">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-sage shrink-0" />
            <span className="text-xs font-bold tracking-wider uppercase">FSSAI Certified Quality standards</span>
          </div>
          <div className="h-4 w-[1px] bg-brand-sage/40" />
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-brand-accent shrink-0" />
            <span className="text-xs font-bold tracking-wider uppercase">Absolutely ZERO Artificial Preservatives</span>
          </div>
          <div className="h-4 w-[1px] bg-brand-sage/40" />
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-brand-honey shrink-0" />
            <span className="text-xs font-bold tracking-wider uppercase">Clinically Steam-Sterilized milling</span>
          </div>
          <div className="h-4 w-[1px] bg-brand-sage/40" />
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-400 shrink-0" />
            <span className="text-xs font-bold tracking-wider uppercase">Traditional grandma-approved recipe formulas</span>
          </div>
        </div>
      </section>

      {/* Signature Products Section */}
      <section id="signature-range" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 id-signature-section">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-2">Our Signature Range</span>
          <h2 className="font-display text-3xl md:text-5xl font-black text-brand-primary">
            Nourishing Options for 6m+ Babies
          </h2>
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">
            Every product is custom milled from raw source materials in Kasaragod, carefully sun-dehydrated to lock in vital micronutrients.
          </p>
        </div>

        {/* Dynamic Catalog Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Product Selector Tabs */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-[#666666] uppercase tracking-widest block mb-1 px-1">Select Blend:</span>
            {SIGNATURE_PRODUCTS.map((prod) => (
              <button
                key={prod.id}
                id={`catalog-btn-${prod.id}`}
                onClick={() => {
                  setActiveCatalogId(prod.id);
                  setPrepProductId(prod.id); // sync prep guide as well for parent comfort
                }}
                className={`p-4 rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                  activeCatalogId === prod.id
                    ? 'bg-white border-brand-sage organic-card-shadow scale-[1.02]'
                    : 'bg-white/40 border-brand-sage/10 hover:bg-white/85'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${
                    activeCatalogId === prod.id ? 'bg-brand-primary text-white' : 'bg-brand-cream text-brand-primary'
                  }`}>
                    {getProductIcon(prod.icon)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-brand-primary leading-tight">{prod.name}</h4>
                    <span className="text-[10px] text-[#8ea890] font-semibold mt-0.5 block italic">{prod.malayalamName}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 text-brand-primary transition-transform ${
                  activeCatalogId === prod.id ? 'translate-x-1' : ''
                }`} />
              </button>
            ))}
          </div>

          {/* Right: Dynamic Product Sheet Detail Card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCatalogId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 md:p-8 organic-card-shadow border border-brand-sage/20 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden"
              >
                {/* Visual badge highlight */}
                <div className="absolute top-4 right-4 text-[10px] font-bold text-brand-accent bg-brand-accent/5 px-3 py-1 rounded-full border border-brand-accent/15">
                  👶 Ideal for {activeCatalogProduct.ageGroup}
                </div>

                {/* Card Left Details */}
                <div>
                  <span className="text-xs text-brand-accent font-bold block mb-1">Traditional Kerala Baby Formula</span>
                  <h3 className="font-display text-2xl md:text-3xl font-extrabold text-brand-primary leading-snug">
                    {activeCatalogProduct.name}
                  </h3>
                  <span className="text-xs text-emerald-800 font-bold bg-brand-sage/10 px-2 py-0.5 rounded-md mt-1.5 inline-block">
                    {activeCatalogProduct.malayalamName}
                  </span>

                  <p className="text-[#555] text-xs leading-relaxed mt-4">
                    {activeCatalogProduct.description}
                  </p>

                  <div className="mt-6 border-t border-brand-sage/15 pt-5">
                    <span className="text-[11px] font-bold text-brand-primary uppercase tracking-wider block mb-2">🌿 Primary Certified Ingredients:</span>
                    <p className="text-gray-600 text-xs italic bg-brand-cream/60 p-3 rounded-lg border border-brand-sage/5 leading-normal">
                      {activeCatalogProduct.ingredients}
                    </p>
                  </div>
                </div>

                {/* Card Right Specifics & Micro Nutrients */}
                <div className="flex flex-col justify-between bg-brand-cream/30 p-5 rounded-2xl border border-brand-sage/10">
                  <div>
                    <span className="text-[11px] font-bold text-[#666666] uppercase tracking-wider block mb-3">Key Healthy Merits:</span>
                    <div className="space-y-2.5">
                      {activeCatalogProduct.benefits.map((b, idx) => (
                        <div key={idx} className="flex gap-2.5 items-start">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                          <span className="text-[#333] text-xs font-semibold leading-tight">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Micro Nutrients list */}
                  <div className="mt-6 pt-5 border-t border-brand-sage/15">
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest block mb-2.5">Nutrition Matrix (per 100g):</span>
                    <div className="grid grid-cols-2 gap-3">
                      {activeCatalogProduct.nutrients.map((n, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white border border-brand-sage/10 text-center">
                          <span className="text-[9px] text-[#777] block leading-tight">{n.label}</span>
                          <span className={`text-xs font-extrabold block mt-0.5 ${n.isPrimary ? 'text-brand-accent' : 'text-brand-primary'}`}>
                            {n.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Button redirection to prep */}
                  <div className="mt-5 flex gap-2">
                    <a
                      href="#prep-section"
                      className="flex-1 text-center py-2.5 bg-brand-primary text-white font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer transition-all"
                    >
                      Cooking Steps
                    </a>
                    <a
                      href="#order-section"
                      className="flex-1 text-center py-2.5 bg-brand-accent/5 text-brand-accent font-bold text-xs rounded-xl border border-brand-accent/25 hover:bg-brand-accent/10 cursor-pointer transition-all"
                    >
                      Order Packet
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Interactive Parent Helper: Feeding Calculator Section */}
      <section id="nutrition-calculator" className="py-16 bg-brand-primary text-brand-cream relative overflow-hidden">
        {/* Soft circle decor background */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-sage/5 -ml-48 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Text summary */}
          <div className="lg:col-span-5">
            <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-1">Interactive Compass</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold leading-tight">
              Infant Nutrition & Requirement Calculator
            </h2>
            <p className="text-brand-cream/80 text-xs md:text-sm mt-4 leading-relaxed">
              Use the sliders to select your infant's precise age and current weight. Our traditional tracker computes estimated nutrient targets according to healthy pediatrician metrics and pairs them with Rayiza's formulations.
            </p>

            {/* Quick disclaimer alert */}
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-brand-cream/90">
              <AlertTriangle className="w-4 h-4 text-brand-accent shrink-0 mt-0.5 animate-pulse" />
              <span>
                <strong>Note:</strong> Pediatric requirements vary based on specific physical milestones. Always consult your pediatrician alongside feeding routines.
              </span>
            </div>
          </div>

          {/* Right Interactive Sliders Panel */}
          <div className="lg:col-span-7 bg-white text-[#2c3531] rounded-3xl p-6 md:p-8 organic-card-shadow border border-brand-sage/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Sliders Control area */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Baby Age:</label>
                    <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary text-xs font-extrabold rounded-lg">
                      {trackerAge} Months
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={24}
                    value={trackerAge}
                    onChange={(e) => setTrackerAge(parseInt(e.target.value, 10))}
                    className="w-full accent-brand-primary h-2 bg-brand-sage/20 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 block mt-1">Recommended solid foods span from 6m onwards.</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-brand-primary uppercase tracking-wider">Estimated Weight:</label>
                    <span className="px-2.5 py-1 bg-brand-primary/10 text-brand-primary text-xs font-extrabold rounded-lg">
                      {trackerWeight} Kilograms
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={16}
                    step={0.1}
                    value={trackerWeight}
                    onChange={(e) => setTrackerWeight(parseFloat(e.target.value))}
                    className="w-full accent-brand-primary h-2 bg-brand-sage/20 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-500 block mt-1">Weights dictate customized calorie requirements.</span>
                </div>
              </div>

              {/* Requirement outputs */}
              <div className="bg-brand-cream/50 p-5 rounded-2xl border border-brand-sage/15 space-y-4">
                <span className="text-[10px] font-bold text-[#666666] uppercase tracking-widest block mb-1">Needed Daily (Estimates):</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-white rounded-xl border border-brand-sage/10 text-center">
                    <span className="text-[9px] text-[#777] block">Daily Energy</span>
                    <strong className="text-sm font-bold text-brand-primary mt-1 block">{calculatedEnergyNeed} kcal</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-brand-sage/10 text-center">
                    <span className="text-[9px] text-[#777] block">Daily Protein</span>
                    <strong className="text-sm font-bold text-brand-primary mt-1 block">{calculatedProteinNeed}g</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-brand-sage/10 text-center">
                    <span className="text-[9px] text-[#777] block">Target Calcium</span>
                    <strong className="text-sm font-bold text-brand-accent mt-1 block">{calculatedCalciumNeed} mg</strong>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-brand-sage/10 text-center">
                    <span className="text-[9px] text-[#777] block">Target Iron</span>
                    <strong className="text-sm font-bold text-brand-accent mt-1 block">{calculatedIronNeed} mg</strong>
                  </div>
                </div>

                {/* Automatic maternal recommendation note */}
                <div className="pt-3 border-t border-brand-sage/15 text-[11px] text-gray-600 leading-normal">
                  {trackerAge < 10 ? (
                    <p>
                      🌱 For a lovely <strong className="text-brand-primary">{trackerAge}-month-old</strong> baby learning solids, prioritize starting slow with <strong className="text-brand-accent">Sprouted Ragi Powder</strong>. Sprouting guarantees easiest digestion on young intestines.
                    </p>
                  ) : (
                    <p>
                      🍌 Your vibrant <strong className="text-brand-primary">{trackerAge}-month-old</strong> bundle requires rich calcium and carbs! Mix in raw <strong className="text-brand-accent">Nendran Banana Powder</strong> and complete <strong className="text-brand-accent">Kurukku</strong> health mixes to help steady gains!
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Preparation visual switcher & timer section */}
      <section id="prep-section" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 id-interactive-preparation">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-1">Mamma's Kitchen Companion</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-primary">
            Quick Cooking & Porridge Guide
          </h2>
          <p className="text-gray-500 text-sm mt-3">
            Because modern parenting is a delicate balancing act, we have designed interactive preparation steps with live stove-timer controls below.
          </p>
        </div>

        {/* Instantiates preparation widget with built-in chimes */}
        <PreparationGuide
          products={SIGNATURE_PRODUCTS}
          selectedProductId={prepProductId}
          onSelectProduct={(id) => setPrepProductId(id)}
        />
      </section>

      {/* Double Column AI Nutrition consultation & parenting hub */}
      <section id="parenting-hub" className="py-16 md:py-24 bg-brand-cream/30 border-y border-brand-sage/15 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-1">Kasaragod Maternal Support Hub</span>
            <h2 className="font-display text-3xl md:text-5xl font-black text-brand-primary">
              AI Baby Nutrition Consultation
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Interact directly with virtual Rayiza's traditional recipe database below. Plan custom schedules or ask pressing solid food preparation questions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Column A: Smart Meal Plan Creator */}
            <div className="flex flex-col h-full justify-between">
              <MealPlanner />
            </div>

            {/* Column B: Warm Chat consultation thread with quick taps */}
            <div className="flex flex-col h-full justify-between">
              <ParentAdvisor />
            </div>
          </div>

        </div>
      </section>

      {/* Parenting testaments & safety guarantees wall */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 id-mother-testimonials">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-1">A Mother's Comfort Pledge</span>
          <h2 className="font-display text-3xl font-black text-brand-primary">
            We Treat Your Baby Like Our Own
          </h2>
          <p className="text-gray-600 text-xs md:text-sm mt-2 leading-relaxed">
            Local mothers in Kerala choose Rayiza's because our commitment is based strictly on mutual trust, purity, and clinical cleanliness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl organic-card-shadow border border-brand-sage/10 relative">
            <Heart className="w-8 h-8 text-brand-accent/20 absolute top-4 right-4 fill-brand-accent/5" />
            <p className="text-gray-600 text-xs leading-relaxed italic mb-4">
              &ldquo;My baby Meera had severe reflux problems around her 7th month. Traditional raw banana powder from Rayiza completely settled her delicate tummy and she gained weight beautifully without gas problems!&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-sage/20 text-brand-primary flex items-center justify-center text-xs font-bold font-mono">AN</div>
              <div>
                <span className="text-xs font-bold text-brand-primary block">Amrita Nair</span>
                <span className="text-[10px] text-gray-500 block">Mother of 10-Mo baby • Kasaragod</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl organic-card-shadow border border-brand-sage/10 relative">
            <Activity className="w-8 h-8 text-brand-accent/20 absolute top-4 right-4" />
            <p className="text-gray-600 text-xs leading-relaxed italic mb-4">
              &ldquo;The Sprouted Ragi Powder is extremely fine! I was afraid there might be rough grains, but it is super velvety. My little boy eats it up in seconds without refined added sugar! Absolute relief.&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-sage/20 text-brand-primary flex items-center justify-center text-xs font-bold font-mono">JS</div>
              <div>
                <span className="text-xs font-bold text-brand-primary block">Jasmin Shafi</span>
                <span className="text-[10px] text-gray-500 block">Mother of 8-Mo baby • Kanhangad</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl organic-card-shadow border border-brand-sage/10 relative">
            <Award className="w-8 h-8 text-brand-accent/20 absolute top-4 right-4" />
            <p className="text-gray-600 text-xs leading-relaxed italic mb-4">
              &ldquo;Finding FSSAI certified dehydrated mixes without stabilizers or fillers is extremely hard. ABC mix is exceptionally fresh and smells exactly like fresh apples. My kid loves the natural pink color!&rdquo;
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-sage/20 text-brand-primary flex items-center justify-center text-xs font-bold font-mono">PR</div>
              <div>
                <span className="text-xs font-bold text-brand-primary block">Dr. Parvathy R.</span>
                <span className="text-[10px] text-gray-500 block">Pediatrician & Mom • Kozhikode</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive WhatsApp Order Assistant Section */}
      <section id="order-section" className="py-16 md:py-24 bg-brand-cream/80 border-t border-brand-sage/15 id-order-generator-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Col 1: Title and Instructions */}
          <div className="lg:col-span-5">
            <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-1">Direct Delivery Channel</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-primary">
              WhatsApp Custom Order builder
            </h2>
            <p className="text-[#555] text-xs md:text-sm leading-relaxed mt-4">
              We process orders directly from our local sanitizsd warehouse in Mugi, Kasaragod. Select the packet quantities you need below, fill out details, and click the order button. This instantly creates a beautifully formatted WhatsApp message enabling speed delivery!
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3 items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 font-bold shrink-0" />
                <span className="text-xs text-[#333] font-medium">Free local delivery inside Kasaragod municipal bounds</span>
              </div>
              <div className="flex gap-3 items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 font-bold shrink-0" />
                <span className="text-xs text-[#333] font-medium">Quick speedpost cash/pay dispatch across Kerala & Karnataka</span>
              </div>
              <div className="flex gap-3 items-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 font-bold shrink-0" />
                <span className="text-xs text-[#333] font-medium">FSSAI compliant securely vacuumed packs</span>
              </div>
            </div>

            {/* Direct hotline */}
            <div className="p-4 bg-brand-primary text-brand-cream rounded-2xl border border-brand-primary/20 mt-8">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-sage block">Kasaragod direct parent care hotline:</span>
              <strong className="text-base font-serif block mt-1">+91 75919 32287</strong>
              <p className="text-[10px] text-brand-cream/70 mt-1">Chat or Call Rayiza directly for specialized baby queries.</p>
            </div>
          </div>

          {/* Col 2: Interactive Order sheet */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 organic-card-shadow border border-brand-sage/20">
            <h3 className="font-display text-xl font-bold text-brand-primary mb-6 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-brand-accent" /> Customize Pack Selections
            </h3>

            {/* Item quantity selection list */}
            <div className="space-y-4 mb-6">
              {SIGNATURE_PRODUCTS.map((prod) => (
                <div key={prod.id} id={`ord-row-${prod.id}`} className="flex items-center justify-between p-4 rounded-2xl bg-brand-cream/40 border border-brand-sage/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 text-brand-primary rounded-xl shrink-0">
                      {getProductIcon(prod.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-brand-primary">{prod.name}</h4>
                      <p className="text-[10px] text-gray-500 italic mt-0.5">{prod.malayalamName} • 250g Pack</p>
                    </div>
                  </div>

                  {/* Plus/minus count control */}
                  <div className="flex items-center gap-3.5">
                    <button
                      id={`dec-btn-${prod.id}`}
                      onClick={() => adjustOrderCount(prod.id, -1)}
                      className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-all"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-bold text-sm text-brand-primary min-w-[20px] text-center">
                      {orderCounts[prod.id] || 0}
                    </span>
                    <button
                      id={`inc-btn-${prod.id}`}
                      onClick={() => adjustOrderCount(prod.id, 1)}
                      className="p-1 rounded-lg bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Parent contact info input sheet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-2">Parent Full Name:</label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Sandra Sreedharan"
                  className="w-full px-4 py-3 rounded-xl border border-brand-sage/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-brand-cream/20 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-2">Infant Age (Months):</label>
                <input
                  type="number"
                  min={6}
                  max={24}
                  value={babyAgeMonths}
                  onChange={(e) => setBabyAgeMonths(e.target.value)}
                  placeholder="e.g. 8"
                  className="w-full px-4 py-3 rounded-xl border border-brand-sage/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-brand-cream/20 font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-2">Delivery Location (Address):</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Near Mugi Temple, Kasaragod, Kerala"
                  className="w-full px-4 py-3 rounded-xl border border-brand-sage/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-brand-cream/20 font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-[#666666] uppercase tracking-wider mb-2">Special Request or Allergen notes:</label>
                <textarea
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  placeholder="e.g. Baby is teething, first solid try"
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-brand-sage/30 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-brand-cream/20 font-semibold resize-none"
                />
              </div>
            </div>

            {/* Submit Action Redirection buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="btn-copy-order"
                onClick={handleCopyToClipboard}
                className="flex-1 py-3 bg-brand-cream border border-brand-sage/30 text-brand-primary hover:bg-brand-cream/80 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isCopied ? "✓ Packets Text Copied!" : "Copy Order Text"}
              </button>
              
              <a
                id="btn-whatsapp-order"
                href={`https://wa.me/917591932287?text=${generateWhatsAppMessage()}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 bg-[#25d366] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-95 shadow-lg shadow-[#25d366]/20 cursor-pointer text-center transition-all"
              >
                🌿 Send Order on WhatsApp
              </a>
            </div>
            
            <span className="text-[10px] text-gray-400 block text-center mt-3">
              No payment is required right now! We coordinate cash on dispatch locally.
            </span>
          </div>

        </div>
      </section>

      {/* Safety & FSSAI certified FAQs dropdown block */}
      <section id="faqs-range" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 id-parenting-faqs">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-accent font-semibold tracking-wider text-xs uppercase block mb-1">Got Questions?</span>
          <h2 className="font-display text-3xl font-black text-brand-primary">
            Frequently Asked Baby Food FAQs
          </h2>
          <p className="text-gray-500 text-xs md:text-sm mt-3 leading-relaxed">
            Every step we perform is aimed at safety, organic validation, and preserving natural enzyme profiles.
          </p>
        </div>

        {/* FAQs switcher categories */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {[
            { id: 'all', title: 'All Questions' },
            { id: 'safety', title: 'Hygiene & FSSAI' },
            { id: 'products', title: 'Products & Sprouting' },
            { id: 'preparation', title: 'Porridge Prep' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFaqCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFaqCategory === cat.id
                  ? 'bg-brand-primary text-white scale-[1.03]'
                  : 'bg-white text-brand-primary/80 border border-brand-sage/10 hover:bg-brand-cream/70'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* FAQs grid list display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedFaqs.map((faq, i) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                id={`faq-item-${faq.id}`}
                className="bg-white p-6 rounded-3xl border border-brand-sage/10 organic-card-shadow flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-serif tracking-wider text-brand-accent font-bold mb-1.5 block">Q. Category: {faq.category}</span>
                  <h4 className="font-display font-bold text-sm text-brand-primary mb-3">
                    {faq.question}
                  </h4>
                  <p className="text-[#555] text-xs leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-brand-sage/5 flex gap-2 items-center text-[10px] text-gray-500">
                  <span className="flex h-2 w-2 rounded-full bg-brand-sage" /> Approved Mother Advice guidelines
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Elegant structural footer */}
      <footer className="bg-brand-primary text-brand-cream pt-16 pb-8 id-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-brand-sage/15 pb-12 text-xs">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-14 w-auto" light={true} />
            </div>
            <p className="text-brand-cream/70 leading-relaxed max-w-sm">
              We specialize in pure raw materials sun-dehydrated below critical thresholds to lock in nutrients. 100% natural, FSSAI certified, and completely formulated with grandmother's recipe protocols.
            </p>
            <span className="text-[10px] text-gray-400 block">Kasaragod FSSAI Reg No: 21323114000300</span>
          </div>

          <div>
            <h5 className="font-bold text-brand-sage uppercase tracking-wider mb-4">Core Range</h5>
            <ul className="space-y-2.5 text-brand-cream/80">
              <li><a href="#signature-range" className="hover:text-brand-accent transition-colors">Sprouted Ragi Powder</a></li>
              <li><a href="#signature-range" className="hover:text-brand-accent transition-colors">Natural Banana Powder</a></li>
              <li><a href="#signature-range" className="hover:text-brand-accent transition-colors">Apple Beetroot Carrot (ABC)</a></li>
              <li><a href="#signature-range" className="hover:text-brand-accent transition-colors">Mixed Porridge Kurukku</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-brand-sage uppercase tracking-wider mb-4">Location Hub</h5>
            <p className="text-brand-cream/80 leading-relaxed">
              Mugi, Kasaragod district,<br />
              North Malabar, Kerala, India.<br />
              ZIP: 671121
            </p>
            <p className="text-brand-cream/65 italic mt-3 block">
              &ldquo;Serving infants everywhere with pure local love.&rdquo;
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-[10px] text-brand-cream/60">
          <p>© 2026 Rayiza's Natural Products, Mugi Kasaragod. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">Clinically hygienic, FSSAI Approved under mother's strict eye.</p>
        </div>
      </footer>

    </div>
  );
}
