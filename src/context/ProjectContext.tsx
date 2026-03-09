import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, ConfigSection, PortfolioProject } from '../types/project';

interface ProjectContextType {
  projects: Project[];
  portfolioProjects: PortfolioProject[];
  loading: boolean;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Project) => void;
  deleteProject: (id: string) => void;
  addPortfolioProject: (project: PortfolioProject) => void;
  updatePortfolioProject: (id: string, project: PortfolioProject) => void;
  deletePortfolioProject: (id: string) => void;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectsCol = collection(db, 'projects');
    const portfolioCol = collection(db, 'portfolio');
    let unsubscribeProjects: () => void;
    let unsubscribePortfolio: () => void;

    const initFirebase = async () => {
      try {
        unsubscribeProjects = onSnapshot(projectsCol, (snapshot) => {
          const projectsData = snapshot.docs.map(doc => doc.data() as Project);
          setProjects(projectsData.reverse());
        }, (error) => {
          console.error("Error fetching projects:", error);
        });

        unsubscribePortfolio = onSnapshot(portfolioCol, (snapshot) => {
          const portfolioData = snapshot.docs.map(doc => doc.data() as PortfolioProject);
          setPortfolioProjects(portfolioData.reverse());
          setLoading(false);
        }, (error) => {
          console.error("Error fetching portfolio:", error);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error initializing Firebase:", error);
        setLoading(false);
      }
    };

    initFirebase();

    return () => {
      if (unsubscribeProjects) unsubscribeProjects();
      if (unsubscribePortfolio) unsubscribePortfolio();
    };
  }, []);

  const addProject = async (project: Project) => {
    try {
      await setDoc(doc(db, 'projects', project.id), project);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (id: string, updated: Project) => {
    try {
      await updateDoc(doc(db, 'projects', id), updated as any);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const addPortfolioProject = async (project: PortfolioProject) => {
    try {
      await setDoc(doc(db, 'portfolio', project.id), project);
    } catch (error) {
      console.error("Error adding portfolio project:", error);
    }
  };

  const updatePortfolioProject = async (id: string, updated: PortfolioProject) => {
    try {
      await updateDoc(doc(db, 'portfolio', id), updated as any);
    } catch (error) {
      console.error("Error updating portfolio project:", error);
    }
  };

  const deletePortfolioProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'portfolio', id));
    } catch (error) {
      console.error("Error deleting portfolio project:", error);
    }
  };

  return (
    <ProjectContext.Provider value={{ 
      projects, portfolioProjects, loading, 
      addProject, updateProject, deleteProject,
      addPortfolioProject, updatePortfolioProject, deletePortfolioProject
    }}>
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
