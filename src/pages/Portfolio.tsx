import React, { useState, useEffect } from 'react';
import { useProjects } from '../context/ProjectContext';

const ProjectGallery = ({ images, onOpenGallery }: { images: string[], onOpenGallery: (images: string[], idx: number) => void }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const validImages = images?.filter(img => img && img.trim() !== '') || [];
  
  if (validImages.length === 0) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
      </div>
    );
  }

  const safeIdx = activeIdx < validImages.length ? activeIdx : 0;
  
  return (
    <div className="flex flex-col gap-3 w-full">
      <div 
        className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 cursor-pointer group relative"
        onClick={() => onOpenGallery(validImages, safeIdx)}
      >
        <img 
          src={validImages[safeIdx]} 
          alt="Main project view" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity text-5xl drop-shadow-lg">zoom_in</span>
        </div>
      </div>
      {validImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {validImages.map((img, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveIdx(idx)}
              className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                safeIdx === idx 
                  ? 'border-primary opacity-100' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${idx + 1}`} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Portfolio() {
  const { portfolioProjects, loading, addPortfolioProject } = useProjects();
  
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

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

  // Initialize with dummy data if empty (only once)
  useEffect(() => {
    if (!loading && portfolioProjects.length === 0) {
      const dummyData = [
        {
          id: '1',
          title: 'Реализация проекта "Нордическая ель" в Подмосковье',
          description: 'Строительство этого дома заняло 4 месяца. Клиент выбрал комплектацию "Теплый контур" с дополнительным утеплением крыши.\n\nОсобенностью проекта стала просторная терраса из лиственницы, которая идеально вписалась в лесной ландшафт участка. Внутренняя отделка выполнена в светлых тонах с сохранением естественной текстуры дерева.',
          images: [
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542314831-c6a4d1409362?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1524431144429-03fdd30eee26?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
          ]
        },
        {
          id: '2',
          title: 'Современный Барнхаус для большой семьи',
          description: 'Индивидуальный проект в стиле барнхаус площадью 180 м². Главным пожеланием заказчика было создание максимально светлого пространства.\n\nМы реализовали панорамное остекление на главном фасаде и второй свет в зоне гостиной. Фасад отделан планкеном из лиственницы, покрытым натуральным маслом, что подчеркивает экологичность постройки.',
          images: [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1600607687931-cebf0746e50e?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600566753086-00f18efc204b?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1600585154526-990dced4ea0d?auto=format&fit=crop&q=80&w=800'
          ]
        },
        {
          id: '3',
          title: 'Уютный гостевой дом-баня',
          description: 'Компактный проект, объединяющий в себе полноценную баню на дровах и комфортную зону отдыха для гостей.\n\nСруб выполнен из отборной сосны зимней рубки. В парной использована отделка из кедра и абаша. Просторная веранда позволяет комфортно отдыхать на свежем воздухе после банных процедур в любое время года.',
          images: [
            'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200',
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1542314831-c6a4d1409362?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1524431144429-03fdd30eee26?auto=format&fit=crop&q=80&w=800'
          ]
        }
      ];
      dummyData.forEach(p => addPortfolioProject(p));
    }
  }, [loading, portfolioProjects.length, addPortfolioProject]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-4 md:px-10 lg:px-20">
      <div className="w-full max-w-6xl flex flex-col gap-16">
        <div className="flex flex-col gap-4 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Наше портфолио</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
            Мы гордимся каждым построенным домом. Посмотрите на наши реализованные проекты, чтобы оценить качество материалов, внимание к деталям и внешний вид домов в реальных условиях.
          </p>
        </div>

        <div className="flex flex-col gap-24">
          {portfolioProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              Проекты загружаются...
            </div>
          ) : (
            portfolioProjects.map((project, index) => (
              <section 
                key={project.id} 
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
              >
                <div className="w-full md:w-3/5 shrink-0">
                  <ProjectGallery images={project.images} onOpenGallery={openGallery} />
                </div>
                <div className="w-full md:w-2/5 flex flex-col gap-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                    {project.title}
                  </h2>
                  <div className="w-12 h-1 bg-primary rounded-full"></div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                    {project.description}
                  </p>
                </div>
              </section>
            ))
          )}
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
              alt={`Фото ${currentImageIndex + 1}`} 
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
    </main>
  );
}
