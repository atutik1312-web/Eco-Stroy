import { useParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useProjects } from '../context/ProjectContext';
import { sendTelegramNotification } from '../lib/telegram';
import { sendEmailNotification } from '../lib/email';

export default function ProjectDetails() {
  const { id } = useParams();
  const { projects, loading } = useProjects();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [botField, setBotField] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Find the project by id or fallback to the first one
  const project = projects.find(p => p.id === id) || projects[0];

  if (!project) {
    return <div className="p-20 text-center">Проект не найден</div>;
  }

  const configurations = project.configurations || [];

  // All images for the gallery
  const allImages = (project.gallery && project.gallery.some(img => img))
    ? project.gallery.filter(Boolean)
    : [project.image].filter(Boolean);

  const numFloors = parseInt(project.floors) || 1;
  const floorPlans = (project.floorPlans || []).filter(Boolean);

  const openGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => setIsGalleryOpen(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (botField) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
        setFormData({ name: '', phone: '' });
      }, 3000);
      return;
    }

    if (formData.phone.length !== 10) return;
    if (formData.name.length < 2) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        name: formData.name,
        phone: formData.phone,
        projectId: project.id,
        projectTitle: project.title,
        source: 'project_details',
        status: 'new',
        createdAt: Date.now()
      });

      await sendTelegramNotification({
        name: formData.name,
        phone: formData.phone,
        projectTitle: project.title,
        source: 'project_details'
      });

      await sendEmailNotification({
        name: formData.name,
        phone: formData.phone,
        projectTitle: project.title,
        source: 'project_details'
      });

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsModalOpen(false);
        setFormData({ name: '', phone: '' });
      }, 3000);
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
    <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <Link to="/catalog" className="hover:text-primary transition-colors">Каталог проектов</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{project.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <div 
              className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative cursor-pointer group"
              onClick={() => openGallery(allImages, 0)}
            >
              <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${project.image}')` }}></div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-5xl drop-shadow-lg">zoom_in</span>
              </div>
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.slice(1, 5).map((img, index) => (
                  <div 
                    key={index} 
                    className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-all group relative"
                    onClick={() => openGallery(allImages, index + 1)}
                  >
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url('${img}')` }}></div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="text-primary font-bold text-sm uppercase tracking-wider mb-2">{project.series}</p>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{project.title}</h1>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-6">От {formatPrice(project.price)}</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{project.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">square_foot</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Площадь</p>
                  <p className="font-bold text-slate-900 dark:text-white">{project.area}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">layers</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Этажность</p>
                  <p className="font-bold text-slate-900 dark:text-white">{project.floors}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">bed</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Спальни</p>
                  <p className="font-bold text-slate-900 dark:text-white">{project.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Срок стройки</p>
                  <p className="font-bold text-slate-900 dark:text-white">{project.time}</p>
                </div>
              </div>
              {project.houseSize && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">straighten</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Размер дома</p>
                    <p className="font-bold text-slate-900 dark:text-white">{project.houseSize}</p>
                  </div>
                </div>
              )}
              {project.bathrooms && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">bathtub</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Санузлов</p>
                    <p className="font-bold text-slate-900 dark:text-white">{project.bathrooms}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-10 rounded-lg bg-primary hover:bg-green-500 text-slate-900 font-bold text-lg transition-colors shadow-lg shadow-primary/20"
              >
                Заказать проект
              </button>
            </div>
          </div>
        </div>

        {/* Floor Plans */}
        {floorPlans.length > 0 && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Планировка</h2>
            <div className={`grid grid-cols-1 ${floorPlans.length > 1 ? 'md:grid-cols-2' : ''} gap-8`}>
              {floorPlans.map((plan, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center">
                    {index === 0 ? '1-й этаж' : '2-й этаж'}
                  </h3>
                  <div 
                    className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative cursor-pointer group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                    onClick={() => openGallery(floorPlans, index)}
                  >
                    <div className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${plan}')` }}></div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity text-5xl drop-shadow-lg">zoom_in</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configurations Table */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Комплектации и цены</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-primary text-slate-900">
                  <th className="p-4 font-bold text-lg border-b border-r border-black/10 w-1/3">Цена</th>
                  <th className="p-4 font-bold text-lg border-b border-r border-black/10 text-center">{formatPrice(project.priceWarm || project.price)}</th>
                  <th className="p-4 font-bold text-lg border-b border-black/10 text-center">{formatPrice(project.priceTurnkey || Math.round(project.price * 1.3))}</th>
                </tr>
                <tr className="bg-slate-50 dark:bg-slate-900">
                  <th className="p-4 font-bold text-slate-900 dark:text-white border-b border-r border-slate-200 dark:border-slate-800">Параметр</th>
                  <th className="p-4 font-bold text-slate-900 dark:text-white border-b border-r border-slate-200 dark:border-slate-800 text-center">Теплый контур</th>
                  <th className="p-4 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 text-center">Под ключ</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-950">
                {configurations.map((section, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <tr className="bg-slate-50 dark:bg-slate-900">
                      <th colSpan={3} className="p-4 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">{section.title}</th>
                    </tr>
                    {section.rows.map((row, i) => (
                      <tr key={`${sIdx}-${i}`} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 text-sm text-slate-700 dark:text-slate-300 border-r border-slate-100 dark:border-slate-800">{row.name}</td>
                        <td className="p-4 text-center border-r border-slate-100 dark:border-slate-800">
                          {row.v1 ? <span className="material-symbols-outlined text-primary">check</span> : <span className="text-slate-300 dark:text-slate-700">—</span>}
                        </td>
                        <td className="p-4 text-center">
                          {row.v2 ? <span className="material-symbols-outlined text-primary">check</span> : <span className="text-slate-300 dark:text-slate-700">—</span>}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1">
            <p>* обязательным условием для получения гарантии 15 лет - оплата полного атисептирования каркаса</p>
            <p>** количество камер стеклопакета, зависит от геометрии и параметров изделий ПВХ</p>
            <p>*** холодное чердачное помещение</p>
          </div>
          
          <div className="mt-10 flex justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="h-14 px-10 rounded-lg bg-primary hover:bg-green-500 text-slate-900 font-bold text-lg transition-colors shadow-lg shadow-primary/20"
            >
              Заказать проект
            </button>
          </div>
        </div>

        {/* Lightbox / Gallery */}
        {isGalleryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeGallery}>
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
              onClick={closeGallery}
            >
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            
            <button 
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-4"
              onClick={prevImage}
            >
              <span className="material-symbols-outlined text-5xl drop-shadow-lg">chevron_left</span>
            </button>

            <div className="relative w-full max-w-6xl max-h-[90vh] px-16 md:px-24 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={galleryImages[currentImageIndex]} 
                alt={`${project.title} - Фото ${currentImageIndex + 1}`} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
            </div>

            <button 
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-4"
              onClick={nextImage}
            >
              <span className="material-symbols-outlined text-5xl drop-shadow-lg">chevron_right</span>
            </button>
          </div>
        )}

        {/* Order Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
            <div 
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Заявка на расчет</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Проект: {project.title}</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Заявка отправлена!</h4>
                    <p className="text-slate-500 dark:text-slate-400">Мы свяжемся с вами в ближайшее время для уточнения деталей.</p>
                  </div>
                ) : (
                  <form onSubmit={handleOrderSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Ваше имя *</label>
                      <input 
                        id="name"
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '').slice(0, 30)})}
                        className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="Иван Иванов"
                        minLength={2}
                        maxLength={30}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Номер телефона *</label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-slate-500 font-medium">+7</span>
                        <input 
                          id="phone"
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                          className="h-12 pl-10 pr-4 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                          placeholder="(999) 000-00-00"
                          minLength={10}
                          maxLength={10}
                        />
                      </div>
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
                      className="h-12 mt-2 rounded-lg bg-primary hover:bg-green-500 text-slate-900 font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">progress_activity</span>
                          Отправка...
                        </>
                      ) : 'Отправить заявку'}
                    </button>
                    <p className="text-xs text-center text-slate-500 mt-2">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
