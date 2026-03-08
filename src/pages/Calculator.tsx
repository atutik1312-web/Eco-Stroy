import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sendTelegramNotification } from '../lib/telegram';

const PRICES = {
  areaPerM2: 65000,
  layout: {
    separateKitchen: 50000,
    bedrooms: { 1: 0, 2: 100000, 3: 200000, 4: 300000 } as Record<number, number>,
    bathrooms: { 0: 0, 1: 80000, 2: 160000 } as Record<number, number>,
    options: {
      terrace: 250000,
      engineering: 100000,
      storage: 70000,
      vestibule: 50000
    } as Record<string, number>,
    doors: 30000
  },
  foundation: {
    iron_piles: 150000,
    rc_piles: 250000,
    grillage: 400000,
    swedish_plate: 600000
  } as Record<string, number>,
  insulation: {
    floor: { none: 0, '100mm': 90000, warm_floor: 280000 } as Record<string, number>,
    walls: { '50mm': 0, '100mm': 80000, '150mm': 140000, '200mm': 210000 } as Record<string, number>,
    roof: { '50mm': 0, '100mm': 70000, '150mm': 130000 } as Record<string, number>
  },
  finish: {
    siding: 0,
    pine: 180000,
    scandi_base: 280000,
    scandi_pile: 380000
  } as Record<string, number>,
  windows: {
    standard: 0,
    energy: 150000,
    panoramic: 500000,
    laminated: 100000,
    premium: 250000
  } as Record<string, number>
};

const LABELS = {
  floors: { '1': 'Одноэтажный', '2': 'Двухэтажный' } as Record<string, string>,
  foundation: { iron_piles: 'Железные сваи', rc_piles: 'ЖБС', grillage: 'Ростверк', swedish_plate: 'Шведская плита' } as Record<string, string>,
  insulationFloor: { none: 'Без утеплителя', '100mm': '100 мм', warm_floor: 'Теплые полы' } as Record<string, string>,
  insulationWalls: { '50mm': '50 мм', '100mm': '100 мм', '150mm': '150 мм', '200mm': '200 мм' } as Record<string, string>,
  insulationRoof: { '50mm': '50 мм', '100mm': '100 мм', '150mm': '150 мм' } as Record<string, string>,
  finish: { siding: 'Сайдинг', pine: 'Доска сосна', scandi_base: 'Скандинавская базовая', scandi_pile: 'Скандинавская с ворсом' } as Record<string, string>,
  windows: { standard: 'Стандартные', energy: 'Энергосберегающие', panoramic: 'Панорамные', laminated: 'Ламинированные', premium: 'Премиум' } as Record<string, string>,
  options: { terrace: 'Терраса', engineering: 'Инженерное помещение', storage: 'Складское помещение', vestibule: 'Прихожая/тамбур' } as Record<string, string>
};

const STEPS = [
  'Этажность',
  'Площадь',
  'Планировка',
  'Фундамент',
  'Утепление',
  'Отделка',
  'Окна',
  'Итого'
];

export default function Calculator() {
  const location = useLocation();
  const [step, setStep] = useState(1);
  
  // State
  const [floors, setFloors] = useState<string>('1');
  const [area, setArea] = useState<number>(120);
  const [layout, setLayout] = useState({
    separateKitchen: false,
    bedrooms: 2,
    bathrooms: 1,
    options: [] as string[],
    doors: 1
  });
  const [foundation, setFoundation] = useState<string>('iron_piles');
  const [insulation, setInsulation] = useState({
    floor: 'none',
    walls: '50mm',
    roof: '50mm'
  });
  const [finish, setFinish] = useState<string>('siding');
  const [windows, setWindows] = useState<string>('standard');

  // Form State
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [botField, setBotField] = useState('');

  const resetCalculator = () => {
    setStep(1);
    setFloors('1');
    setArea(120);
    setLayout({
      separateKitchen: false,
      bedrooms: 2,
      bathrooms: 1,
      options: [],
      doors: 1
    });
    setFoundation('iron_piles');
    setInsulation({
      floor: 'none',
      walls: '50mm',
      roof: '50mm'
    });
    setFinish('siding');
    setWindows('standard');
    setFormData({ name: '', phone: '', email: '' });
    setIsSuccess(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    resetCalculator();
  }, [location.pathname]);

  const toggleOption = (opt: string) => {
    setLayout(prev => ({
      ...prev,
      options: prev.options.includes(opt) 
        ? prev.options.filter(o => o !== opt)
        : [...prev.options, opt]
    }));
  };

  const calculateTotal = useMemo(() => {
    let total = 0;
    
    // Area
    if (step >= 2) {
      total += area * PRICES.areaPerM2;
    }

    // Layout
    if (step >= 3) {
      if (layout.separateKitchen) total += PRICES.layout.separateKitchen;
      total += PRICES.layout.bedrooms[layout.bedrooms];
      total += PRICES.layout.bathrooms[layout.bathrooms];
      layout.options.forEach(opt => total += PRICES.layout.options[opt]);
      total += layout.doors * PRICES.layout.doors;
    }

    // Foundation
    if (step >= 4) {
      total += PRICES.foundation[foundation];
    }

    // Insulation
    if (step >= 5) {
      total += PRICES.insulation.floor[insulation.floor];
      total += PRICES.insulation.walls[insulation.walls];
      total += PRICES.insulation.roof[insulation.roof];
    }

    // Finish
    if (step >= 6) {
      total += PRICES.finish[finish];
    }

    // Windows
    if (step >= 7) {
      total += PRICES.windows[windows];
    }

    // Floors multiplier
    if (floors === '2' && step >= 2) {
      total = total * 1.15;
    }

    return total;
  }, [floors, area, layout, foundation, insulation, finish, windows, step]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const nextStep = () => {
    if (step < 8) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (botField) {
      setIsSuccess(true);
      return;
    }

    if (formData.phone.length !== 10) return;
    if (formData.name.length < 2) return;

    setIsSubmitting(true);

    // Сбор данных для заявки
    const summary = [
      `Этажность: ${LABELS.floors[floors]}`,
      `Площадь: ${area} м²`,
      layout.separateKitchen ? 'Раздельная кухня' : '',
      `Спальни: ${layout.bedrooms}`,
      `Санузлы: ${layout.bathrooms}`,
      `Входные двери: ${layout.doors}`,
      ...layout.options.map(opt => LABELS.options[opt]),
      `Фундамент: ${LABELS.foundation[foundation]}`,
      `Утепление пола: ${LABELS.insulationFloor[insulation.floor]}`,
      `Утепление стен: ${LABELS.insulationWalls[insulation.walls]}`,
      `Утепление кровли: ${LABELS.insulationRoof[insulation.roof]}`,
      `Отделка: ${LABELS.finish[finish]}`,
      `Окна: ${LABELS.windows[windows]}`,
      `Итоговая стоимость: ${formatPrice(calculateTotal)}`
    ].filter(Boolean).join('\n');

    try {
      await addDoc(collection(db, 'orders'), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        summary: summary,
        source: 'calculator',
        status: 'new',
        createdAt: Date.now()
      });

      await sendTelegramNotification({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        summary: summary,
        source: 'calculator'
      });

      setIsSuccess(true);
    } catch (error) {
      console.error("Error adding order: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Выберите этажность</h1>
              <p className="text-slate-500 dark:text-slate-400">Двухэтажный дом увеличивает общую стоимость на 15%.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => setFloors('1')}
                className={`group relative flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all shadow-sm overflow-hidden ${floors === '1' ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/50' : 'border-transparent bg-white dark:bg-white/5 hover:border-primary/50'}`}
              >
                <span className="material-symbols-outlined text-5xl mb-4 text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">home</span>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Одноэтажный</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Базовая стоимость</p>
                {floors === '1' && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-900 text-sm font-bold">check</span>
                  </div>
                )}
              </button>
              <button 
                onClick={() => setFloors('2')}
                className={`group relative flex flex-col items-center text-center p-6 rounded-xl border-2 transition-all shadow-sm overflow-hidden ${floors === '2' ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/50' : 'border-transparent bg-white dark:bg-white/5 hover:border-primary/50'}`}
              >
                <span className="material-symbols-outlined text-5xl mb-4 text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">domain</span>
                <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Двухэтажный</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">+15% к стоимости</p>
                {floors === '2' && (
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-900 text-sm font-bold">check</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Выберите площадь</h1>
              <p className="text-slate-500 dark:text-slate-400">Стоимость 1 м² составляет 65 000 ₽.</p>
            </div>
            <div className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-end">
                  <label className="text-lg font-medium text-slate-900 dark:text-white" htmlFor="area-range">Общая жилая площадь</label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary display-value">{area}</span>
                    <span className="text-slate-500 dark:text-slate-400">м²</span>
                  </div>
                </div>
                <div className="relative py-4">
                  <input 
                    className="w-full h-2 bg-wood-light dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50" 
                    id="area-range" 
                    max="300" 
                    min="30" 
                    type="range" 
                    value={area}
                    onChange={(e) => setArea(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
                    <span>30 м²</span>
                    <span>100 м²</span>
                    <span>200 м²</span>
                    <span>300 м²</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Планировка</h1>
              <p className="text-slate-500 dark:text-slate-400">Настройте внутреннее пространство вашего дома.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5 flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Основные помещения</h3>
                
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary transition-colors">
                  <span className="text-slate-700 dark:text-slate-300">Раздельные кухня и гостиная</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">+50 000 ₽</span>
                    <input type="checkbox" checked={layout.separateKitchen} onChange={(e) => setLayout({...layout, separateKitchen: e.target.checked})} className="w-5 h-5 accent-primary" />
                  </div>
                </label>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300">Количество спален</span>
                  <select value={layout.bedrooms} onChange={(e) => setLayout({...layout, bedrooms: Number(e.target.value)})} className="bg-transparent border-none outline-none font-bold text-slate-900 dark:text-white cursor-pointer">
                    <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value={1}>1 (0 ₽)</option>
                    <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value={2}>2 (+100 000 ₽)</option>
                    <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value={3}>3 (+200 000 ₽)</option>
                    <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value={4}>4 (+300 000 ₽)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300">Санузлы</span>
                  <select value={layout.bathrooms} onChange={(e) => setLayout({...layout, bathrooms: Number(e.target.value)})} className="bg-transparent border-none outline-none font-bold text-slate-900 dark:text-white cursor-pointer">
                    <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value={0}>0 (0 ₽)</option>
                    <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value={1}>1 (+80 000 ₽)</option>
                    <option className="text-slate-900 bg-white dark:bg-slate-800 dark:text-white" value={2}>2 (+160 000 ₽)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-slate-700 dark:text-slate-300">Входные двери</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">+30 000 ₽ / шт</span>
                    <input type="number" min="1" max="5" value={layout.doors} onChange={(e) => setLayout({...layout, doors: Number(e.target.value)})} className="w-16 h-8 px-2 rounded border border-slate-300 dark:border-slate-600 bg-transparent text-center text-slate-900 dark:text-white outline-none focus:border-primary" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5 flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Дополнительные опции</h3>
                
                {Object.entries(LABELS.options).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-primary transition-colors">
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary">+{formatPrice(PRICES.layout.options[key])}</span>
                      <input type="checkbox" checked={layout.options.includes(key)} onChange={() => toggleOption(key)} className="w-5 h-5 accent-primary" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Фундамент</h1>
              <p className="text-slate-500 dark:text-slate-400">Выберите тип фундамента в зависимости от грунта.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(LABELS.foundation).map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setFoundation(key)}
                  className={`group relative flex flex-col items-start text-left p-6 rounded-xl border-2 transition-all shadow-sm overflow-hidden ${foundation === key ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/50' : 'border-transparent bg-white dark:bg-white/5 hover:border-primary/50'}`}
                >
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{label}</h4>
                  <p className="text-sm font-bold text-primary">+{formatPrice(PRICES.foundation[key])}</p>
                  {foundation === key && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-900 text-sm font-bold">check</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Утепление</h1>
              <p className="text-slate-500 dark:text-slate-400">Настройте теплоизоляцию для комфортного проживания.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5 flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Пол</h3>
                {Object.entries(LABELS.insulationFloor).map(([key, label]) => (
                  <label key={key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${insulation.floor === key ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary">+{formatPrice(PRICES.insulation.floor[key])}</span>
                      <input type="radio" name="floor" checked={insulation.floor === key} onChange={() => setInsulation({...insulation, floor: key})} className="w-4 h-4 accent-primary" />
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5 flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Стены</h3>
                {Object.entries(LABELS.insulationWalls).map(([key, label]) => (
                  <label key={key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${insulation.walls === key ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary">+{formatPrice(PRICES.insulation.walls[key])}</span>
                      <input type="radio" name="walls" checked={insulation.walls === key} onChange={() => setInsulation({...insulation, walls: key})} className="w-4 h-4 accent-primary" />
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5 flex flex-col gap-4">
                <h3 className="font-bold text-slate-900 dark:text-white">Кровля</h3>
                {Object.entries(LABELS.insulationRoof).map(([key, label]) => (
                  <label key={key} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${insulation.roof === key ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700 hover:border-primary/50'}`}>
                    <span className="text-slate-700 dark:text-slate-300">{label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary">+{formatPrice(PRICES.insulation.roof[key])}</span>
                      <input type="radio" name="roof" checked={insulation.roof === key} onChange={() => setInsulation({...insulation, roof: key})} className="w-4 h-4 accent-primary" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Отделка фасада</h1>
              <p className="text-slate-500 dark:text-slate-400">Выберите материал для внешней отделки.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(LABELS.finish).map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setFinish(key)}
                  className={`group relative flex flex-col items-start text-left p-6 rounded-xl border-2 transition-all shadow-sm overflow-hidden ${finish === key ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/50' : 'border-transparent bg-white dark:bg-white/5 hover:border-primary/50'}`}
                >
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{label}</h4>
                  <p className="text-sm font-bold text-primary">+{formatPrice(PRICES.finish[key])}</p>
                  {finish === key && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-900 text-sm font-bold">check</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 7:
        return (
          <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Окна</h1>
              <p className="text-slate-500 dark:text-slate-400">Выберите тип остекления.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(LABELS.windows).map(([key, label]) => (
                <button 
                  key={key}
                  onClick={() => setWindows(key)}
                  className={`group relative flex flex-col items-start text-left p-6 rounded-xl border-2 transition-all shadow-sm overflow-hidden ${windows === key ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/50' : 'border-transparent bg-white dark:bg-white/5 hover:border-primary/50'}`}
                >
                  <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{label}</h4>
                  <p className="text-sm font-bold text-primary">+{formatPrice(PRICES.windows[key])}</p>
                  {windows === key && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-900 text-sm font-bold">check</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 8:
        return (
          <div className="flex flex-col gap-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Ваш расчет готов!</h1>
              <p className="text-slate-500 dark:text-slate-400">Итоговая стоимость и выбранные параметры.</p>
            </div>
            
            <div className="bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center">
              <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-2">Ориентировочная стоимость:</p>
              <p className="text-5xl md:text-6xl font-black text-primary">{formatPrice(calculateTotal)}</p>
              {floors === '2' && <p className="text-sm text-slate-500 mt-2">* Включает надбавку 15% за второй этаж</p>}
              <button 
                onClick={resetCalculator}
                className="mt-6 px-8 py-3 rounded-lg border-2 border-primary text-slate-900 dark:text-white hover:bg-primary hover:text-slate-900 font-bold transition-colors shadow-sm"
              >
                Рассчитать заново
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              {isSuccess ? (
                <div className="flex flex-col items-center text-center py-8 gap-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Заявка успешно отправлена!</h3>
                  <p className="text-slate-600 dark:text-slate-400">Наш менеджер свяжется с вами в ближайшее время по номеру {formData.phone}.</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Оставьте заявку</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">Заполните форму, и наш менеджер свяжется с вами для обсуждения деталей и точного расчета.</p>
                  <form className="flex flex-col gap-5" onSubmit={handleFormSubmit}>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Ваше имя *</label>
                      <input 
                        type="text" 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '').slice(0, 30)})}
                        className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                        placeholder="Иван Иванов" 
                        required
                        minLength={2}
                        maxLength={30}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Телефон *</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-slate-500 font-medium">+7</span>
                        <input 
                          type="tel" 
                          id="phone" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                          className="h-12 pl-10 pr-4 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                          placeholder="(999) 000-00-00" 
                          required
                          minLength={10}
                          maxLength={10}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                        placeholder="example@mail.ru" 
                      />
                    </div>
                    
                    {/* Honeypot field */}
                    <input 
                      type="text" 
                      name="website" 
                      style={{ display: 'none' }} 
                      tabIndex={-1} 
                      autoComplete="off" 
                      value={botField}
                      onChange={(e) => setBotField(e.target.value)} 
                    />

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="h-14 mt-2 rounded-lg bg-primary hover:bg-green-500 text-slate-900 font-bold text-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">progress_activity</span>
                          Отправка...
                        </>
                      ) : 'Отправить заявку'}
                    </button>
                    <p className="text-xs text-slate-500 text-center mt-2">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center py-10 px-4 md:px-8">
      <div className="w-full max-w-5xl flex flex-col gap-8">
        
        {/* Progress Bar */}
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">ШАГ {step} ИЗ 8</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{STEPS[step - 1]}</h3>
            </div>
            <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-full text-sm">{Math.round((step / 8) * 100)}% Завершено</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(step / 8) * 100}%` }}></div>
          </div>
          <div className="hidden md:flex justify-between mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
            {STEPS.map((s, i) => (
              <span key={i} className={step > i ? 'text-primary' : ''}>{s}</span>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {step < 8 && (
              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Назад
                </button>
                <button 
                  onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3 rounded-lg bg-primary hover:bg-primary/90 text-slate-900 font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
                >
                  Следующий шаг
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            )}
            {step === 8 && (
              <div className="flex justify-start items-center pt-4">
                <button 
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 font-medium transition-colors"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                  Вернуться к редактированию
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-80 shrink-0">
            <div className="sticky top-24 bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-wood-light/50 dark:border-white/5 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Ваш выбор
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Этажность ({LABELS.floors[floors]})</span>
                    <span className="font-medium text-slate-900 dark:text-white">{floors === '2' ? '+15% к итогу' : '0 ₽'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Площадь ({area} м²)</span>
                    <span className="font-medium text-slate-900 dark:text-white">{step >= 2 ? `+${formatPrice(area * PRICES.areaPerM2)}` : '0 ₽'}</span>
                  </div>
                  
                  {step >= 3 && layout.separateKitchen && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Раздельная кухня</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.layout.separateKitchen)}</span>
                    </div>
                  )}
                  {step >= 3 && PRICES.layout.bedrooms[layout.bedrooms] > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Спальни ({layout.bedrooms})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.layout.bedrooms[layout.bedrooms])}</span>
                    </div>
                  )}
                  {step >= 3 && PRICES.layout.bathrooms[layout.bathrooms] > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Санузлы ({layout.bathrooms})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.layout.bathrooms[layout.bathrooms])}</span>
                    </div>
                  )}
                  {step >= 3 && layout.options.map(opt => (
                    <div key={opt} className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{LABELS.options[opt]}</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.layout.options[opt])}</span>
                    </div>
                  ))}
                  {step >= 3 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Входные двери ({layout.doors})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(layout.doors * PRICES.layout.doors)}</span>
                    </div>
                  )}

                  {step >= 4 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Фундамент ({LABELS.foundation[foundation]})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.foundation[foundation])}</span>
                    </div>
                  )}

                  {step >= 5 && PRICES.insulation.floor[insulation.floor] > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Пол ({LABELS.insulationFloor[insulation.floor]})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.insulation.floor[insulation.floor])}</span>
                    </div>
                  )}
                  {step >= 5 && PRICES.insulation.walls[insulation.walls] > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Стены ({LABELS.insulationWalls[insulation.walls]})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.insulation.walls[insulation.walls])}</span>
                    </div>
                  )}
                  {step >= 5 && PRICES.insulation.roof[insulation.roof] > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Кровля ({LABELS.insulationRoof[insulation.roof]})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.insulation.roof[insulation.roof])}</span>
                    </div>
                  )}

                  {step >= 6 && PRICES.finish[finish] > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Отделка ({LABELS.finish[finish]})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.finish[finish])}</span>
                    </div>
                  )}

                  {step >= 7 && PRICES.windows[windows] > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Окна ({LABELS.windows[windows]})</span>
                      <span className="font-medium text-slate-900 dark:text-white">+{formatPrice(PRICES.windows[windows])}</span>
                    </div>
                  )}

                  <div className="h-px bg-slate-200 dark:bg-white/10 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900 dark:text-white">Итоговая стоимость</span>
                    <span className="text-xl font-black text-primary">
                      {step === 1 ? '0 ₽' : formatPrice(calculateTotal)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-wood-light/20 dark:bg-white/5 p-4 rounded-xl">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Нужна помощь?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Не уверены, какой вариант выбрать? Наши консультанты помогут вам определиться.</p>
                <a className="text-xs font-bold text-primary hover:underline flex items-center gap-1" href="#">
                  Спросить эксперта <span className="material-symbols-outlined text-xs">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
