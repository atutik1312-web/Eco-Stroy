import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#152e15] border-t border-slate-200 dark:border-slate-800 py-12 px-4 md:px-10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10">
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="size-6 bg-primary rounded-md flex items-center justify-center text-slate-900">
              <span className="material-symbols-outlined text-sm">forest</span>
            </div>
            <span className="text-lg font-bold">Эко-Строй</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Строим устойчивое будущее, по одному деревянному дому за раз. Качество, которому можно доверять, комфорт, который можно почувствовать.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="https://t.me/ecostroy" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center" title="Telegram"><span className="material-symbols-outlined -rotate-45">send</span></a>
            <a href="mailto:info@ecosrtoy.ru" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center" title="Email"><span className="material-symbols-outlined">alternate_email</span></a>
            <a href="tel:+79000000000" className="text-slate-400 hover:text-primary transition-colors flex items-center justify-center" title="Телефон"><span className="material-symbols-outlined">call</span></a>
          </div>
        </div>
        <div className="flex flex-wrap gap-12 md:gap-24">
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 dark:text-white">Компания</h4>
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">О нас</Link>
            <Link to="/technologies" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Технологии</Link>
            <Link to="/contacts" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Контакты</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 dark:text-white">Проекты</h4>
            <Link to="/catalog" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Каталог домов</Link>
            <Link to="/baths" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Бани</Link>
            <Link to="/portfolio" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Наше портфолио</Link>
            <Link to="/catalog" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Индивидуальные проекты</Link>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-slate-900 dark:text-white">Поддержка</h4>
            <Link to="/contacts" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Связаться с нами</Link>
            <Link to="/technologies" onClick={() => window.scrollTo(0, 0)} className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">Условия</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
        © 2026 Eco-Stroy Construction. Все права защищены.
      </div>
    </footer>
  );
}
