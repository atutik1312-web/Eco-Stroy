import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-primary' : 'text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary';
  };

  const handleLinkClick = () => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 md:px-10 py-3 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-4 text-slate-900 dark:text-white" onClick={handleLinkClick}>
        <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
          <span className="material-symbols-outlined">forest</span>
        </div>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Эко-Строй</h2>
      </Link>
      <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
        <nav className="flex items-center gap-9">
          <Link to="/catalog" onClick={handleLinkClick} className={`${isActive('/catalog')} transition-colors text-sm font-medium leading-normal`}>Проекты домов</Link>
          <Link to="/baths" onClick={handleLinkClick} className={`${isActive('/baths')} transition-colors text-sm font-medium leading-normal`}>Бани</Link>
          <Link to="/portfolio" onClick={handleLinkClick} className={`${isActive('/portfolio')} transition-colors text-sm font-medium leading-normal`}>Портфолио</Link>
          <Link to="/calculator" onClick={handleLinkClick} className={`${isActive('/calculator')} transition-colors text-sm font-medium leading-normal`}>Калькулятор</Link>
          <Link to="/technologies" onClick={handleLinkClick} className={`${isActive('/technologies')} transition-colors text-sm font-medium leading-normal`}>Технологии</Link>
          <Link to="/about" onClick={handleLinkClick} className={`${isActive('/about')} transition-colors text-sm font-medium leading-normal`}>О нас</Link>
          <Link to="/contacts" onClick={handleLinkClick} className={`${isActive('/contacts')} transition-colors text-sm font-medium leading-normal`}>Контакты</Link>
        </nav>
      </div>
      <button 
        className="md:hidden text-slate-900 dark:text-white p-2"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg flex flex-col p-4 gap-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link to="/catalog" onClick={handleLinkClick} className={`${isActive('/catalog')} transition-colors text-base font-medium`}>Проекты домов</Link>
            <Link to="/baths" onClick={handleLinkClick} className={`${isActive('/baths')} transition-colors text-base font-medium`}>Бани</Link>
            <Link to="/portfolio" onClick={handleLinkClick} className={`${isActive('/portfolio')} transition-colors text-base font-medium`}>Портфолио</Link>
            <Link to="/calculator" onClick={handleLinkClick} className={`${isActive('/calculator')} transition-colors text-base font-medium`}>Калькулятор</Link>
            <Link to="/technologies" onClick={handleLinkClick} className={`${isActive('/technologies')} transition-colors text-base font-medium`}>Технологии</Link>
            <Link to="/about" onClick={handleLinkClick} className={`${isActive('/about')} transition-colors text-base font-medium`}>О нас</Link>
            <Link to="/contacts" onClick={handleLinkClick} className={`${isActive('/contacts')} transition-colors text-base font-medium`}>Контакты</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
