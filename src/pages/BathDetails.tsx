import { useParams, Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useProjects } from '../context/ProjectContext';
import { sendTelegramNotification } from '../lib/telegram';
import { sendEmailNotification } from '../lib/email';

export default function BathDetails() {
  const { id } = useParams();
  const { baths, loading } = useProjects();
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

  // Find the bath by id or fallback to the first one
  const bath = baths.find(b => b.id === id) || baths[0];

  if (!bath) {
    return <div className="p-20 text-center">Проект бани не найден</div>;
  }

  // All images for the gallery
  const allImages = [bath.image, ...(bath.gallery || [])]
    .filter(Boolean)
    .filter((img, index, self) => self.indexOf(img) === index);

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
        projectId: bath.id,
        projectTitle: bath.title,
        source: 'bath_details',
        status: 'new',
        createdAt: Date.now()
      });

      await sendTelegramNotification({
        name: formData.name,
        phone: formData.phone,
        projectTitle: bath.title,
        source: 'bath_details'
      });

      await sendEmailNotification({
        name: formData.name,
        phone: formData.phone,
        projectTitle: bath.title,
        source: 'bath_details'
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
          <Link to="/baths" className="hover:text-primary transition-colors">Бани</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{bath.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <div 
              className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative cursor-pointer group"
              onClick={() => openGallery(allImages, 0)}
            >
              <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${bath.image}')` }}></div>
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
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{bath.title}</h1>
              <p className="text-3xl font-black text-slate-900 dark:text-white mb-6">От {formatPrice(bath.price)}</p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{bath.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              {bath.area && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">square_foot</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Общая площадь</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.area}</p>
                  </div>
                </div>
              )}
              {bath.size && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">straighten</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Размер дома</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.size}</p>
                  </div>
                </div>
              )}
              {bath.steamRoom && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">hot_tub</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Парная</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.steamRoom}</p>
                  </div>
                </div>
              )}
              {bath.showerRoom && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">shower</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Душевая</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.showerRoom}</p>
                  </div>
                </div>
              )}
              {bath.bathroom && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">wc</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Санузел</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.bathroom}</p>
                  </div>
                </div>
              )}
              {bath.guestRoom && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">living</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Гостевая</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.guestRoom}</p>
                  </div>
                </div>
              )}
              {bath.terrace && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">deck</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Терраса</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.terrace}</p>
                  </div>
                </div>
              )}
              {bath.time && (
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">calendar_month</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Срок стройки</p>
                    <p className="font-bold text-slate-900 dark:text-white">{bath.time}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-10 rounded-lg bg-primary hover:bg-green-500 text-slate-900 font-bold text-lg transition-colors shadow-lg shadow-primary/20"
              >
                Заказать баню
              </button>
            </div>
          </div>
        </div>

        {/* Floor Plan */}
        {bath.floorPlan && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Планировка</h2>
            <div className="flex flex-col gap-4">
              <div 
                className="aspect-[4/3] w-full max-w-3xl mx-auto rounded-2xl overflow-hidden relative cursor-pointer group border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                onClick={() => openGallery([bath.floorPlan!], 0)}
              >
                <div className="w-full h-full bg-contain bg-no-repeat bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: `url('${bath.floorPlan}')` }}></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity text-5xl drop-shadow-lg">zoom_in</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Equipment */}
        {bath.equipment && (
          <div className="mt-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Комплектация</h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {bath.equipment}
              </p>
            </div>
          </div>
        )}

        {/* Lightbox / Gallery */}
        {isGalleryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={closeGallery}>
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50 p-2"
              onClick={closeGallery}
            >
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            
            {galleryImages.length > 1 && (
              <button 
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-4"
                onClick={prevImage}
              >
                <span className="material-symbols-outlined text-5xl drop-shadow-lg">chevron_left</span>
              </button>
            )}

            <div className="relative w-full max-w-6xl max-h-[90vh] px-16 md:px-24 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={galleryImages[currentImageIndex]} 
                alt={`${bath.title} - Фото ${currentImageIndex + 1}`} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              {galleryImages.length > 1 && (
                <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
                  {currentImageIndex + 1} / {galleryImages.length}
                </div>
              )}
            </div>

            {galleryImages.length > 1 && (
              <button 
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-50 p-4"
                onClick={nextImage}
              >
                <span className="material-symbols-outlined text-5xl drop-shadow-lg">chevron_right</span>
              </button>
            )}
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
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Проект: {bath.title}</p>
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
