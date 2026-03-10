import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';

type FilterOption = 'popular' | 'price_asc' | 'price_desc';

export default function Catalog() {
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState<FilterOption>('price_asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];
    
    if (filter === 'popular') {
      result = result.filter(p => p.isPopular);
    } else if (filter === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filter === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }
    
    return result;
  }, [filter, projects]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedProjects.length / itemsPerPage));

  const currentProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Наши проекты</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl">Изучите наш каталог экологически чистых деревянных домов, созданных для современной жизни. Используйте фильтры, чтобы найти свой идеальный дом.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 rounded-xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Сортировка:</span>
            <div className="relative">
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterOption)}
                className="appearance-none h-10 pl-4 pr-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors cursor-pointer"
              >
                <option value="popular">Популярные</option>
                <option value="price_asc">Сначала дешевле</option>
                <option value="price_desc">Сначала дороже</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none text-[20px]">expand_more</span>
            </div>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Найдено проектов: <span className="font-bold text-slate-900 dark:text-white">{filteredAndSortedProjects.length}</span>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProjects.map((project) => (
            <article key={project.id} className="flex flex-col overflow-hidden rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-primary/50 transition-all duration-300 group">
              <Link to={`/catalog/${project.id}`} className="relative aspect-[4/3] w-full overflow-hidden block">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 z-10"></div>
                <div className="w-full h-full bg-center bg-cover transform group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url("${project.image}")` }}></div>
                <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
                  <h3 className="text-xl font-bold leading-tight">{project.title}</h3>
                  <p className="text-sm font-medium text-white/90">{project.series}</p>
                </div>
              </Link>
              <div className="p-5 flex flex-col gap-4 flex-1">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[18px] text-primary">square_foot</span>
                    <span className="truncate">{project.area}</span>
                  </div>
                  {project.houseSize && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[18px] text-primary">straighten</span>
                      <span className="truncate">{project.houseSize}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[18px] text-primary">layers</span>
                    <span className="truncate">{project.floors}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[18px] text-primary">bed</span>
                    <span className="truncate">{project.bedrooms}</span>
                  </div>
                  {project.bathrooms && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[18px] text-primary">bathtub</span>
                      <span className="truncate">{project.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                    <span className="truncate">{project.time}</span>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">От</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{formatPrice(project.price)}</p>
                  </div>
                  <Link to={`/catalog/${project.id}`} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-slate-900 text-slate-900 dark:text-white text-sm font-semibold transition-colors flex items-center gap-1 group-hover:gap-2">
                    Подробнее
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center py-6">
            <nav className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button 
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`size-10 flex items-center justify-center rounded-lg font-bold shadow-sm transition-colors ${
                    currentPage === page 
                      ? 'bg-primary text-slate-900' 
                      : 'border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="size-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </main>
  );
}
