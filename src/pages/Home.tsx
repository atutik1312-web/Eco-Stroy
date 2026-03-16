import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useProjects } from '../context/ProjectContext';
import { sendTelegramNotification } from '../lib/telegram';
import { sendEmailNotification } from '../lib/email';

export default function Home() {
  const { projects, loading } = useProjects();
  const popularProjects = projects.filter(p => p.isPopular);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [botField, setBotField] = useState('');

  const nextSlide = () => {
    if (popularProjects.length <= 3) return;
    setCurrentSlide((prev) => (prev + 1) % (popularProjects.length - 2));
  };

  const prevSlide = () => {
    if (popularProjects.length <= 3) return;
    setCurrentSlide((prev) => (prev === 0 ? popularProjects.length - 3 : prev - 1));
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length !== 10) return;
    
    if (botField) {
      setIsSuccess(true);
      setPhone('');
      setTimeout(() => setIsSuccess(false), 5000);
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        phone: phone,
        source: 'home_page',
        status: 'new',
        createdAt: Date.now()
      });

      await sendTelegramNotification({
        phone: phone,
        source: 'home_page'
      });

      await sendEmailNotification({
        phone: phone,
        source: 'home_page'
      });

      setIsSuccess(true);
      setPhone('');
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Error adding order: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 md:px-10 py-6 md:py-10 space-y-16">
        {/* Hero Section */}
        <section className="w-full rounded-2xl overflow-hidden relative min-h-[560px] flex items-end p-8 md:p-16">
          <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('https://i.postimg.cc/PXQg3VqF/hero-bg-2.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
          <div className="relative z-20 flex flex-col gap-6 max-w-2xl">
            <h1 className="text-white text-4xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Надежный застройщик с многолетним опытом
            </h1>
            <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              Экологичные деревянные дома для многих поколений. Мы объединяем традиционное мастерство с современными технологиями.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/catalog" className="flex items-center justify-center rounded-lg h-14 px-8 bg-primary hover:bg-green-500 transition-colors text-slate-900 text-base font-bold">
                Каталог проектов
              </Link>
              <button className="flex items-center justify-center rounded-lg h-14 px-8 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 transition-colors text-white text-base font-bold">
                Портфолио
              </button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold leading-tight mb-4">Выберите свой идеальный дом</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Будь то уютный летний домик или надежный семейный дом для любого сезона, у нас есть идеальное решение для вашего образа жизни.</p>
            </div>
            <Link to="/catalog" className="text-primary hover:text-green-600 font-bold flex items-center gap-1 group">
              Смотреть все варианты
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#152e15] shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaoBBxNKK0pLDEpFF1hh1KwU9F2V2tsi0aG9vVEUSAjILpp0FcA2fE8WLUm2ZsOS4SmxfU4mhRoTxqQMSfjKspSEbfJcpBMNKAZibFtTdCPrV8SD0hqB91JOvW1yyIaliqtbbpoXdBiBS2z5w-qSY-SQUVZZGXtDtm3aJJZfWoKIs-f4buZ6NC--l7TNCnnbgY_q2rEpmmJT9fwx01ZLfEMZGeX_u8AwQdXVzYYqv26LueW63DYm-gMK4cfSMk-w-ZIgu2w7jqOqk')" }}></div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <span className="material-symbols-outlined">ac_unit</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Мощная изоляция</span>
                </div>
                <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-3">Для постоянного проживания</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Утепленные, долговечные дома, созданные для суровых зим и комфорта в любое время года. Технология двойных стен и премиальные системы отопления.</p>
                <Link to="/catalog" className="text-slate-900 dark:text-white font-bold border-b-2 border-primary pb-0.5 hover:text-primary transition-colors">Смотреть модели</Link>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-xl bg-white dark:bg-[#152e15] shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://i.postimg.cc/7YZs7W3H/bsthhouse-13-1.jpg')" }}></div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <span className="material-symbols-outlined">hot_tub</span>
                  <span className="text-xs font-bold uppercase tracking-wider">Традиции и здоровье</span>
                </div>
                <h3 className="text-slate-900 dark:text-white text-2xl font-bold mb-3">Деревянные бани</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Традиционные деревянные бани для вашего здоровья и отдыха. Различные планировки с парной, моечной и уютной комнатой отдыха.</p>
                <Link to="/baths" className="text-slate-900 dark:text-white font-bold border-b-2 border-primary pb-0.5 hover:text-primary transition-colors">Смотреть проекты</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Projects Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold">Популярные проекты</h2>
            <div className="flex gap-2">
              <button onClick={prevSlide} className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <button onClick={nextSlide} className="size-10 rounded-full bg-primary text-slate-900 flex items-center justify-center hover:bg-green-500 transition-colors">
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(-${currentSlide * (100 / 3)}% - ${currentSlide * 16}px))` }}
            >
              {popularProjects.map((project) => (
                <div key={project.id} className="group min-w-[calc(100%-2rem)] md:min-w-[calc(33.333%-1rem)] bg-white dark:bg-[#152e15] rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-shadow">
                  <Link to={`/catalog/${project.id}`} onClick={() => window.scrollTo(0, 0)} className="block aspect-[4/3] relative overflow-hidden">
                    <div className="w-full h-full bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${project.image}')` }}></div>
                  </Link>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
                      <span className="text-primary font-bold text-lg">{new Intl.NumberFormat('ru-RU').format(project.price)} ₽</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-5 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">square_foot</span> {project.area}</div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">layers</span> {project.floors}</div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">bed</span> {project.bedrooms}</div>
                      <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-lg">calendar_month</span> {project.time}</div>
                    </div>
                    <Link to={`/catalog/${project.id}`} onClick={() => window.scrollTo(0, 0)} className="w-full py-2.5 rounded border border-primary text-primary hover:bg-primary hover:text-slate-900 font-medium transition-colors flex justify-center">
                      Подробнее
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="bg-white dark:bg-[#152e15] rounded-2xl p-8 md:p-12 border border-slate-100 dark:border-slate-800">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-slate-900 dark:text-white text-3xl font-bold mb-4">Почему выбирают Эко-Строй?</h2>
            <p className="text-slate-600 dark:text-slate-400">Мы не просто строим дома, мы создаем экосистемы для жизни. Наша приверженность устойчивому развитию отличает нас от других.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">eco</span>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold text-lg">100% Экологично</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Древесина из сертифицированных лесов.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">timer</span>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold text-lg">Быстрое возведение</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Заезд через 3-4 месяца после утверждения.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">shield</span>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold text-lg">Гарантия 50 лет</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Гарантированная целостность конструкции на десятилетия.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <span className="material-symbols-outlined text-3xl">design_services</span>
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold text-lg">Индивидуальные проекты</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Адаптируем любой проект под ваши нужды.</p>
            </div>
          </div>
        </section>

        {/* Experts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-slate-900 dark:text-white text-3xl font-bold mb-4">Встречайте экспертов</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">Наша команда архитекторов, инженеров и строителей работает вместе, чтобы ваш дом мечты был безопасным, экологичным и красивым.</p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#152e15] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-4xl font-black text-primary block mb-2">12+</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Лет опыта</span>
              </div>
              <div className="bg-white dark:bg-[#152e15] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-4xl font-black text-primary block mb-2">450+</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Построенных домов</span>
              </div>
              <div className="bg-white dark:bg-[#152e15] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-4xl font-black text-primary block mb-2">150</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Мастеров</span>
              </div>
              <div className="bg-white dark:bg-[#152e15] p-6 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-4xl font-black text-primary block mb-2">100%</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">Удовлетворенность</span>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-cover bg-center rounded-bl-2xl z-10 border-4 border-background-light dark:border-background-dark" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCu3iD9jnxtlA2BayjCEXlrodAElzcdKVd848YkMnIJb0-WHJhWnMNKBZd-b_7em3v1NbdQqCZSTomwBRWOZkifllgormwskqizIfzRIY2aCQRZfgenullAKzY5DpMhu5-kr55JZ8dSD3kqhhY31YEuwJOhJHsI2XqbL5_Fd6-UTjXhN5eXnPwPgQhsZwyBDiwW8tQFPwPlbekcXxARvIaPvXl2dlkWSNqr9EcnacDAnrf70xk7og6t8-SscduRBlHqUdL2cdXOppc')" }}></div>
            <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-cover bg-center rounded-tr-2xl z-20 border-4 border-background-light dark:border-background-dark" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCrLoomLiFYfie5kZhIt6tiMNMGcYNVDv__d_bKj-3AvhKdsFpirKxNI1_uBprUSzWWC2Hc2d_9d3NZlm284RPMUQs9O4tIeoh-4iI51ZCG4mcOSQEPA_XtMVNgJrCChI1kKDIuaIIwqpnnTBErFjrtk5A8hDexSJFYPwXu0R4TVnhGTX_FCLPpyYy7fgcuOOEvD4_a8aPekg0skoarbe3YxbRY0eMJd73CkYLxNNlnBVSL6kLBwS5vv0UKbdkJDvCy393FVvROWHQ')" }}></div>
            <div className="absolute top-6 left-6 z-0">
              <div className="size-32 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow"></div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full bg-primary rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-primary/20">
          <div className="max-w-xl">
            <h2 className="text-slate-900 text-3xl md:text-4xl font-black mb-4">Готовы построить дом мечты?</h2>
            <p className="text-slate-800 font-medium text-lg">Получите бесплатную консультацию и предварительную смету для вашего проекта уже сегодня.</p>
          </div>
          <form onSubmit={handlePhoneSubmit} className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {isSuccess ? (
              <div className="h-14 px-8 rounded-lg bg-green-600 text-white font-bold flex items-center justify-center whitespace-nowrap">
                <span className="material-symbols-outlined mr-2">check_circle</span>
                Заявка отправлена
              </div>
            ) : (
              <>
                <div className="relative flex items-center w-full md:w-auto">
                  <span className="absolute left-4 text-slate-900 font-medium">+7</span>
                  <input 
                    className="h-14 pl-10 pr-5 w-full rounded-lg border-0 bg-white/90 text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-slate-900 min-w-[260px] outline-none" 
                    placeholder="(999) 000-00-00" 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    minLength={10}
                    maxLength={10}
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
                  className="h-14 px-8 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors whitespace-nowrap disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                      Отправка...
                    </>
                  ) : 'Заказать звонок'}
                </button>
              </>
            )}
          </form>
        </section>
      </div>
    </main>
  );
}
