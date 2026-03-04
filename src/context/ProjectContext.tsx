import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ConfigSection } from '../types/project';
import { MOCK_PROJECTS } from '../data/projects';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Project) => void;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const DEFAULT_CONFIGS: ConfigSection[] = [
  {
    title: 'Фундамент',
    rows: [
      { name: 'Забивные железобетонные сваи 150х150х3000', v1: true, v2: true },
      { name: 'Металлический оголовок, 250*250мм на каждую сваю', v1: true, v2: true },
      { name: 'Гидроизоляция между сваей и обвязкой - рубероид', v1: true, v2: true },
    ]
  },
  {
    title: 'Цокольное перекрытие',
    rows: [
      { name: 'Нижняя обвязка - Брус 150х150мм', v1: true, v2: true },
      { name: 'Лаги пола - доска 50х200мм (камерной сушки)', v1: true, v2: true },
      { name: 'Утепление - 200мм (минерало-ватный утеплитель)', v1: false, v2: true },
      { name: 'Финишное покрытие - фанера 21мм', v1: false, v2: false },
    ]
  },
  {
    title: 'Несущие стены',
    rows: [
      { name: 'Каркас внешних стен - 35х140мм камерной сушки, с шагом 580мм', v1: true, v2: true },
      { name: 'Утепление плитное - 150мм (минерало-ватный утеплитель)', v1: false, v2: true },
      { name: 'Внешняя отделка - имитация бруса', v1: true, v2: true },
      { name: 'Внутренняя отделка - имитация бруса', v1: false, v2: false },
    ]
  },
  {
    title: 'Внутренние перегородки',
    rows: [
      { name: 'Каркасные 35х90мм / 35х140мм камерной сушки (по проекту)', v1: true, v2: true },
      { name: 'Утепление - 100мм / 150мм* минерало-ватный утеплитель (*по проекту)', v1: false, v2: true },
      { name: 'Внутренняя отделка - имитация бруса (стены)', v1: false, v2: false },
    ]
  },
  {
    title: 'Высоты',
    rows: [
      { name: 'Высота 1-го этажа - 2,5м', v1: true, v2: true },
      { name: 'Высота 2-го этажа - 2,5м', v1: true, v2: true },
    ]
  },
  {
    title: 'Кровля',
    rows: [
      { name: 'Стропило 45х190мм камерной сушки', v1: true, v2: true },
      { name: 'Утепление - 200мм (минерало-ватный утеплитель)', v1: false, v2: true },
      { name: 'Обрешетка - 20х90мм', v1: true, v2: true },
      { name: 'Контр-обрешетка - 40х40мм по ветрогидроизоляции', v1: true, v2: true },
      { name: 'МЕТАЛЛОЧЕРЕПИЦА 0.5мм (цвет на выбор)', v1: true, v2: true },
      { name: 'Лестница чердачная DÖCKE / FACRO (при наличии ХЧП)***', v1: false, v2: true },
    ]
  },
  {
    title: 'Пленки',
    rows: [
      { name: 'ИЗОСПАН AQ PROFF / KNAUF Extra (или аналоги) гидро-ветрозащитная паропроницаемая усиленная мембрана', v1: true, v2: true },
      { name: 'ИЗОСПАН RS (или аналоги) / KNAUF Extra армированная паро-гидроизоляция', v1: false, v2: true },
      { name: 'Проклейка пленок скотчем', v1: true, v2: true },
      { name: 'Ревизионный люк на чердак', v1: true, v2: true },
    ]
  },
  {
    title: 'Окна',
    rows: [
      { name: 'Оконные конструкции ПВХ (Rehau/Veka)', v1: true, v2: true },
      { name: '2-х камерный стеклопакет (3 стекла)**', v1: true, v2: true },
      { name: 'Цвет – белый', v1: true, v2: true },
      { name: 'Установка водоотливов под окнами', v1: true, v2: true },
    ]
  },
  {
    title: 'Двери',
    rows: [
      { name: 'Входная одностворчатая ПВХ с двухкамерным стеклопакетом', v1: true, v2: true },
    ]
  },
  {
    title: 'Оплата',
    rows: [
      { name: 'Поэтапная: Подписание договора - 15 000, По готовности архитектурного решения - 10%, Фундамент - 10%, Домокомплект на участке - 50%, Возведен каркас стен и стропильная система - 20%, Дом сдан - 10%', v1: true, v2: true },
    ]
  },
  {
    title: 'Гарантия',
    rows: [
      { name: '15 лет* (полное атисептирование каркаса)', v1: true, v2: true },
    ]
  },
  {
    title: 'Технический надзор',
    rows: [
      { name: 'на протяжении всей стройки', v1: true, v2: true },
    ]
  },
  {
    title: 'Сборка и доставка',
    rows: [
      { name: 'Сборка домокомплекта на участке', v1: true, v2: true },
      { name: 'Доставка материала 100 км от МКАД', v1: true, v2: true },
      { name: 'Разгрузка материала', v1: true, v2: true },
      { name: 'Бытовка для проживания рабочих', v1: true, v2: true },
      { name: 'Биотуалет для рабочих', v1: true, v2: true },
      { name: 'Проверка дома АэроОкном', v1: false, v2: true },
    ]
  }
];

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ecostroy_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse projects from local storage');
      }
    }
    // Map existing mock projects to include default configs and gallery if missing
    return MOCK_PROJECTS.map(p => ({
      ...p,
      priceWarm: p.price,
      priceTurnkey: Math.round(p.price * 1.3),
      gallery: [
        p.image,
        ...[1, 2, 3, 4].map(i => `https://picsum.photos/seed/${p.id}${i}/1200/900`)
      ],
      floorPlans: Array.from({ length: parseInt(p.floors) || 1 }).map((_, i) => `https://picsum.photos/seed/floorplan${p.id}${i}/1200/900`),
      configurations: DEFAULT_CONFIGS
    })) as Project[];
  });

  useEffect(() => {
    localStorage.setItem('ecostroy_projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (id: string, updated: Project) => {
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
