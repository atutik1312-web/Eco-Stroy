import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useProjects, DEFAULT_CONFIGS } from '../context/ProjectContext';
import { Project, PortfolioProject } from '../types/project';
import { Order } from '../types/order';

export default function Admin() {
  const { projects, portfolioProjects, loading, addProject, updateProject, deleteProject, addPortfolioProject, updatePortfolioProject, deletePortfolioProject } = useProjects();
  const [view, setView] = useState<'list' | 'edit' | 'edit_portfolio'>('list');
  const [adminTab, setAdminTab] = useState<'projects' | 'portfolio' | 'orders'>('projects');
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentPortfolioProject, setCurrentPortfolioProject] = useState<PortfolioProject | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'characteristics' | 'media' | 'config'>('basic');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [portfolioToDelete, setPortfolioToDelete] = useState<string | null>(null);

  const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateNew = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: 'Новый проект',
      price: 0,
      priceWarm: 0,
      priceTurnkey: 0,
      area: '100 м²',
      floors: '1 Этаж',
      bedrooms: '3',
      material: 'Кедр',
      time: '3-4 месяца',
      series: 'Сканди',
      image: '',
      badge: null,
      badgeColor: 'bg-primary',
      isPopular: false,
      description: '',
      features: [],
      gallery: Array(5).fill(''),
      floorPlans: [''],
      configurations: JSON.parse(JSON.stringify(DEFAULT_CONFIGS))
    };
    setCurrentProject(newProject);
    setView('edit');
    setActiveTab('basic');
  };

  const handleEdit = (project: Project) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const projectCopy = JSON.parse(JSON.stringify(project));
    if (!projectCopy.gallery) projectCopy.gallery = Array(5).fill('');
    if (!projectCopy.floorPlans) projectCopy.floorPlans = Array(parseInt(projectCopy.floors) || 1).fill('');
    if (!projectCopy.configurations) projectCopy.configurations = JSON.parse(JSON.stringify(DEFAULT_CONFIGS));
    setCurrentProject(projectCopy);
    setView('edit');
    setActiveTab('basic');
  };

  const handleDuplicate = (project: Project) => {
    const duplicate = JSON.parse(JSON.stringify(project));
    duplicate.id = `project-${Date.now()}`;
    duplicate.title = `${duplicate.title} (Копия)`;
    duplicate.isPopular = false;
    addProject(duplicate);
  };

  const handleDelete = (id: string) => {
    setProjectToDelete(id);
  };

  const handleCreateNewPortfolio = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const newProject: PortfolioProject = {
      id: `portfolio-${Date.now()}`,
      title: 'Новый проект портфолио',
      description: '',
      images: Array(5).fill('')
    };
    setCurrentPortfolioProject(newProject);
    setView('edit_portfolio');
  };

  const handleEditPortfolio = (project: PortfolioProject) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const projectCopy = JSON.parse(JSON.stringify(project));
    if (!projectCopy.images) projectCopy.images = Array(5).fill('');
    setCurrentPortfolioProject(projectCopy);
    setView('edit_portfolio');
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolioToDelete(id);
  };

  const handleSavePortfolio = () => {
    if (currentPortfolioProject) {
      if (!currentPortfolioProject.images || !currentPortfolioProject.images[0]) {
        showNotification('Укажите ссылку на главное фото проекта', 'error');
        return;
      }

      const exists = portfolioProjects.some(p => p.id === currentPortfolioProject.id);
      if (exists) {
        updatePortfolioProject(currentPortfolioProject.id, currentPortfolioProject);
      } else {
        addPortfolioProject(currentPortfolioProject);
      }
      showNotification('Проект портфолио успешно сохранен!');
      setView('list');
    }
  };

  const updatePortfolioField = (field: keyof PortfolioProject, value: any) => {
    if (currentPortfolioProject) {
      setCurrentPortfolioProject({ ...currentPortfolioProject, [field]: value });
    }
  };

  const updatePortfolioImage = (index: number, value: string) => {
    if (!currentPortfolioProject) return;
    const newImages = [...(currentPortfolioProject.images || Array(5).fill(''))];
    newImages[index] = value;
    setCurrentPortfolioProject({ ...currentPortfolioProject, images: newImages });
  };

  const handleSave = () => {
    if (currentProject) {
      if (!currentProject.image && (!currentProject.gallery || !currentProject.gallery[0])) {
        showNotification('Укажите ссылку на обложку проекта (Фото 1)', 'error');
        setActiveTab('media');
        return;
      }

      const exists = projects.some(p => p.id === currentProject.id);
      if (exists) {
        updateProject(currentProject.id, currentProject);
      } else {
        addProject(currentProject);
      }
      showNotification('Проект успешно сохранен!');
    }
  };

  const updateField = (field: keyof Project, value: any) => {
    if (currentProject) {
      setCurrentProject({ ...currentProject, [field]: value });
    }
  };

  const updateConfigRow = (sectionIndex: number, rowIndex: number, field: 'v1' | 'v2', value: boolean) => {
    if (!currentProject || !currentProject.configurations) return;
    const newConfigs = [...currentProject.configurations];
    newConfigs[sectionIndex].rows[rowIndex][field] = value;
    setCurrentProject({ ...currentProject, configurations: newConfigs });
  };

  const updateGallery = (index: number, value: string) => {
    if (!currentProject) return;
    const newGallery = [...(currentProject.gallery || Array(5).fill(''))];
    newGallery[index] = value;
    setCurrentProject({ ...currentProject, gallery: newGallery, image: newGallery[0] || currentProject.image });
  };

  const updateFloorPlan = (index: number, value: string) => {
    if (!currentProject) return;
    const newPlans = [...(currentProject.floorPlans || [])];
    newPlans[index] = value;
    setCurrentProject({ ...currentProject, floorPlans: newPlans });
  };

  const handleFloorsChange = (value: string) => {
    if (!currentProject) return;
    const numFloors = parseInt(value) || 1;
    const currentPlans = currentProject.floorPlans || [];
    const newPlans = Array(numFloors).fill('').map((_, i) => currentPlans[i] || '');
    setCurrentProject({ ...currentProject, floors: value, floorPlans: newPlans });
  };

  useEffect(() => {
    if (adminTab === 'orders') {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        setOrders(ordersData);
      });
      return () => unsubscribe();
    }
  }, [adminTab]);

  const updateOrderStatus = async (id: string, newStatus: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status: newStatus });
      showNotification('Статус заявки обновлен');
    } catch (error) {
      showNotification('Ошибка при обновлении статуса', 'error');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту заявку?')) {
      try {
        await deleteDoc(doc(db, 'orders', id));
        showNotification('Заявка удалена');
      } catch (error) {
        showNotification('Ошибка при удалении', 'error');
      }
    }
  };

  const handleExportBackup = () => {
    try {
      const dataStr = JSON.stringify(projects, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ecostroy_projects_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification('Резервная копия успешно скачана');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('Ошибка при создании бэкапа', 'error');
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          if (window.confirm(`Найдено ${importedData.length} проектов в файле. Восстановить их? (Существующие проекты с такими же ID будут перезаписаны)`)) {
            for (const proj of importedData) {
              if (proj && proj.id) {
                const exists = projects.some(p => p.id === proj.id);
                if (exists) {
                  updateProject(proj.id, proj);
                } else {
                  addProject(proj);
                }
              }
            }
            showNotification('Проекты успешно восстановлены!');
          }
        } else {
          showNotification('Неверный формат файла бэкапа', 'error');
        }
      } catch (error) {
        console.error('Import error:', error);
        showNotification('Ошибка при чтении файла', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Панель управления</h1>
            <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => setAdminTab('projects')}
                className={`pb-2 text-sm font-medium transition-colors relative ${adminTab === 'projects' ? 'text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Проекты
                {adminTab === 'projects' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
              </button>
              <button 
                onClick={() => setAdminTab('portfolio')}
                className={`pb-2 text-sm font-medium transition-colors relative ${adminTab === 'portfolio' ? 'text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Портфолио
                {adminTab === 'portfolio' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
              </button>
              <button 
                onClick={() => setAdminTab('orders')}
                className={`pb-2 text-sm font-medium transition-colors relative ${adminTab === 'orders' ? 'text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Заявки
                {adminTab === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"></div>}
              </button>
            </div>
          </div>
          {adminTab === 'projects' && (
            <div className="flex items-center gap-2 md:gap-3">
              <input 
                type="file" 
                id="import-backup" 
                accept=".json" 
                className="hidden" 
                onChange={handleImportBackup} 
              />
              <button onClick={() => document.getElementById('import-backup')?.click()} className="px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-medium rounded-lg flex items-center gap-2" title="Восстановить из резервной копии">
                <span className="material-symbols-outlined">upload</span>
                <span className="hidden sm:inline">Восстановить</span>
              </button>
              <button onClick={handleExportBackup} className="px-3 md:px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-300 font-medium rounded-lg flex items-center gap-2" title="Скачать резервную копию">
                <span className="material-symbols-outlined">download</span>
                <span className="hidden sm:inline">Бэкап</span>
              </button>
              <button onClick={handleCreateNew} className="px-4 md:px-6 py-2 bg-primary hover:bg-green-500 transition-colors text-slate-900 font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">add</span>
                <span className="hidden sm:inline">Добавить проект</span>
              </button>
            </div>
          )}
          {adminTab === 'portfolio' && (
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={handleCreateNewPortfolio} className="px-4 md:px-6 py-2 bg-primary hover:bg-green-500 transition-colors text-slate-900 font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined">add</span>
                <span className="hidden sm:inline">Добавить в портфолио</span>
              </button>
            </div>
          )}
        </div>

        {adminTab === 'projects' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 w-12 text-slate-500 font-medium">#</th>
                  <th className="p-4 w-24 text-slate-500 font-medium">Фото</th>
                  <th className="p-4 text-slate-500 font-medium">Название</th>
                  <th className="p-4 text-slate-500 font-medium">Серия</th>
                  <th className="p-4 text-slate-500 font-medium">Цена</th>
                  <th className="p-4 text-right text-slate-500 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={project.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-500">{index + 1}</td>
                    <td className="p-4">
                      <div className="w-16 h-12 rounded bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-slate-200 dark:border-slate-700 flex items-center justify-center" style={project.image ? { backgroundImage: `url(${project.image})` } : {}}>
                        {!project.image && <span className="material-symbols-outlined text-slate-400 text-sm">image</span>}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {project.title}
                      {project.isPopular && <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">Популярный</span>}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{project.series}</td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">{new Intl.NumberFormat('ru-RU').format(project.price)} ₽</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(project)} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Редактировать">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => handleDuplicate(project)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors" title="Дублировать">
                          <span className="material-symbols-outlined">content_copy</span>
                        </button>
                        <button onClick={() => handleDelete(project.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Удалить">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'portfolio' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 w-12 text-slate-500 font-medium">#</th>
                  <th className="p-4 w-24 text-slate-500 font-medium">Фото</th>
                  <th className="p-4 text-slate-500 font-medium">Название</th>
                  <th className="p-4 text-slate-500 font-medium">Описание</th>
                  <th className="p-4 text-right text-slate-500 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {portfolioProjects.map((project, index) => (
                  <tr key={project.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-500">{index + 1}</td>
                    <td className="p-4">
                      <div className="w-16 h-12 rounded bg-slate-100 dark:bg-slate-800 bg-cover bg-center border border-slate-200 dark:border-slate-700 flex items-center justify-center" style={project.images?.[0] ? { backgroundImage: `url(${project.images[0]})` } : {}}>
                        {!project.images?.[0] && <span className="material-symbols-outlined text-slate-400 text-sm">image</span>}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white">
                      {project.title}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{project.description}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEditPortfolio(project)} className="p-2 text-slate-400 hover:text-primary transition-colors" title="Редактировать">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => handleDeletePortfolio(project.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Удалить">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {portfolioProjects.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">Нет проектов в портфолио</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {adminTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 w-12 text-slate-500 font-medium">№</th>
                  <th className="p-4 text-slate-500 font-medium">Дата</th>
                  <th className="p-4 text-slate-500 font-medium">Имя</th>
                  <th className="p-4 text-slate-500 font-medium">Телефон</th>
                  <th className="p-4 text-slate-500 font-medium">Проект</th>
                  <th className="p-4 text-slate-500 font-medium">Статус</th>
                  <th className="p-4 text-right text-slate-500 font-medium">Действия</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">Нет заявок</td>
                  </tr>
                ) : orders.map((order, index) => (
                  <tr key={order.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 text-slate-500 font-medium align-top">{orders.length - index}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 text-sm align-top">
                      {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white align-top">
                      {order.name || <span className="text-slate-400 italic">Не указано</span>}
                      {order.email && <div className="text-xs text-slate-500 font-normal mt-1">{order.email}</div>}
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-white align-top">{order.phone}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 align-top max-w-xs">
                      {order.source === 'project_details' && order.projectTitle && (
                        <span className="flex items-center gap-1 font-medium text-slate-900 dark:text-white">
                          <span className="material-symbols-outlined text-[16px] text-primary">home</span>
                          {order.projectTitle}
                        </span>
                      )}
                      {order.source === 'home_page' && <span className="text-slate-500 italic">С главной страницы</span>}
                      {order.source === 'contacts_page' && <span className="text-slate-500 italic">Со страницы контактов</span>}
                      {order.source === 'calculator' && <span className="text-slate-500 italic">С калькулятора</span>}
                      
                      {order.message && (
                        <div className="mt-2 text-sm bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700">
                          <span className="font-medium text-xs text-slate-500 block mb-1">Сообщение:</span>
                          {order.message}
                        </div>
                      )}
                      
                      {order.summary && (
                        <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-700 whitespace-pre-line">
                          <span className="font-medium text-slate-500 block mb-1">Расчет:</span>
                          {order.summary}
                        </div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className={`text-sm font-medium px-3 py-1 rounded-full outline-none cursor-pointer border ${
                          order.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          order.status === 'in_progress' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                          order.status === 'done' ? 'bg-green-50 text-green-600 border-green-200' :
                          'bg-red-50 text-red-600 border-red-200'
                        }`}
                      >
                        <option value="new">Новая</option>
                        <option value="in_progress">В работе</option>
                        <option value="done">Выполнена</option>
                        <option value="rejected">Отказ</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteOrder(order.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Удалить">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {projectToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Удалить проект?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Это действие нельзя будет отменить.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setProjectToDelete(null)} className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Отмена</button>
                <button onClick={() => { 
                  deleteProject(projectToDelete); 
                  setProjectToDelete(null); 
                  showNotification('Проект успешно удален!');
                }} className="px-4 py-2 rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white transition-colors">Удалить</button>
              </div>
            </div>
          </div>
        )}

        {portfolioToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Удалить проект из портфолио?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Это действие нельзя будет отменить.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setPortfolioToDelete(null)} className="px-4 py-2 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Отмена</button>
                <button onClick={() => { 
                  deletePortfolioProject(portfolioToDelete); 
                  setPortfolioToDelete(null); 
                  showNotification('Проект портфолио успешно удален!');
                }} className="px-4 py-2 rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white transition-colors">Удалить</button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-xl flex items-center gap-3 z-[100] shadow-2xl animate-fade-in-up ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}>
            <span className={`material-symbols-outlined ${toast.type === 'error' ? 'text-white' : 'text-green-400'}`}>
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="font-bold">{toast.msg}</span>
          </div>
        )}
      </div>
    );
  }

  if (view === 'edit_portfolio' && currentPortfolioProject) {
    return (
      <div className="p-4 md:p-10 max-w-5xl mx-auto min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setView('list')} className="flex items-center gap-2 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
            Назад к списку
          </button>
          <button onClick={handleSavePortfolio} className="px-8 py-3 bg-primary hover:bg-green-500 transition-colors text-slate-900 font-bold rounded-lg shadow-lg shadow-primary/20">
            Сохранить проект
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden p-6 md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Название проекта</label>
              <input type="text" value={currentPortfolioProject.title} onChange={e => updatePortfolioField('title', e.target.value)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Например: Реализация проекта Нордическая ель" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Описание проекта</label>
              <textarea value={currentPortfolioProject.description} onChange={e => updatePortfolioField('description', e.target.value)} className="h-48 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Подробное описание работы..."></textarea>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Галерея проекта (5 фото)</h3>
              <p className="text-sm text-slate-500 mb-4">Вставьте ссылки на изображения. Первое изображение будет главным.</p>
              <div className="flex flex-col gap-4">
                {(currentPortfolioProject.images || Array(5).fill('')).map((url, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-24 h-16 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-cover bg-center flex items-center justify-center overflow-hidden" style={url ? { backgroundImage: `url(${url})` } : {}}>
                      {!url && <span className="material-symbols-outlined text-slate-400">image</span>}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="text-xs font-medium text-slate-500">Фото {index + 1} {index === 0 && '(Главное)'}</label>
                      <input type="text" value={url} onChange={e => updatePortfolioImage(index, e.target.value)} className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="https://..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-xl flex items-center gap-3 z-[100] shadow-2xl animate-fade-in-up ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}>
            <span className={`material-symbols-outlined ${toast.type === 'error' ? 'text-white' : 'text-green-400'}`}>
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="font-bold">{toast.msg}</span>
          </div>
        )}
      </div>
    );
  }

  if (!currentProject) return null;

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setView('list')} className="flex items-center gap-2 p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Назад к списку
        </button>
        <button onClick={handleSave} className="px-8 py-3 bg-primary hover:bg-green-500 transition-colors text-slate-900 font-bold rounded-lg shadow-lg shadow-primary/20">
          Сохранить проект
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 hide-scrollbar">
          <button onClick={() => setActiveTab('basic')} className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'basic' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Основная информация</button>
          <button onClick={() => setActiveTab('characteristics')} className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'characteristics' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Характеристики</button>
          <button onClick={() => setActiveTab('media')} className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'media' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Медиа (Фото)</button>
          <button onClick={() => setActiveTab('config')} className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === 'config' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Комплектации</button>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'basic' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Название проекта</label>
                <input type="text" value={currentProject.title} onChange={e => updateField('title', e.target.value)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Например: Дом Сканди 100" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Серия</label>
                  <select value={currentProject.series} onChange={e => updateField('series', e.target.value)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none">
                    <option value="Сканди">Сканди</option>
                    <option value="Модерн">Модерн</option>
                    <option value="Барнхаус">Барнхаус</option>
                    <option value="Классика">Классика</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Базовая цена (₽)</label>
                  <input type="number" value={currentProject.price} onChange={e => updateField('price', parseInt(e.target.value) || 0)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Например: 2500000" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isPopular" 
                    checked={currentProject.isPopular} 
                    onChange={e => updateField('isPopular', e.target.checked)} 
                    disabled={!currentProject.isPopular && projects.filter(p => p.isPopular).length >= 7}
                    className="size-5 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                  <label 
                    htmlFor="isPopular" 
                    className={`font-medium ${(!currentProject.isPopular && projects.filter(p => p.isPopular).length >= 7) ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 dark:text-slate-300 cursor-pointer'}`}
                  >
                    Показывать в блоке "Популярные проекты"
                  </label>
                </div>
                {(!currentProject.isPopular && projects.filter(p => p.isPopular).length >= 7) && (
                  <p className="text-xs text-red-500 ml-8">Достигнут лимит: максимум 7 популярных проектов.</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Описание проекта</label>
                <textarea value={currentProject.description} onChange={e => updateField('description', e.target.value)} className="h-32 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none" placeholder="Подробное описание дома..."></textarea>
              </div>
            </div>
          )}

          {activeTab === 'characteristics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Площадь</label>
                <input type="text" value={currentProject.area} onChange={e => updateField('area', e.target.value)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Например: 120 м²" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Этажность</label>
                <select value={currentProject.floors} onChange={e => handleFloorsChange(e.target.value)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none">
                  <option value="1 Этаж">1 этаж</option>
                  <option value="2 Этажа">2 этажа</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Количество спален</label>
                <input type="text" value={currentProject.bedrooms} onChange={e => updateField('bedrooms', e.target.value)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Например: 3" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Срок стройки</label>
                <input type="text" value={currentProject.time} onChange={e => updateField('time', e.target.value)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="Например: 3-4 месяца" />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Галерея проекта (5 фото)</h3>
                <p className="text-sm text-slate-500 mb-4">Вставьте ссылки на изображения. Первое изображение будет обложкой проекта.</p>
                <div className="flex flex-col gap-4">
                  {(currentProject.gallery || Array(5).fill('')).map((url, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-24 h-16 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-cover bg-center flex items-center justify-center overflow-hidden" style={url ? { backgroundImage: `url(${url})` } : {}}>
                        {!url && <span className="material-symbols-outlined text-slate-400">image</span>}
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">Фото {index + 1} {index === 0 && '(Обложка)'}</label>
                        <input type="text" value={url} onChange={e => updateGallery(index, e.target.value)} className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="https://..." />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Планировки ({currentProject.floors} этаж(а))</h3>
                <div className="flex flex-col gap-4">
                  {(currentProject.floorPlans || []).map((url, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-24 h-16 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-cover bg-center flex items-center justify-center overflow-hidden" style={url ? { backgroundImage: `url(${url})` } : {}}>
                        {!url && <span className="material-symbols-outlined text-slate-400">architecture</span>}
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <label className="text-xs font-medium text-slate-500">План {index + 1}-го этажа</label>
                        <input type="text" value={url} onChange={e => updateFloorPlan(index, e.target.value)} className="h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder="https://..." />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-white">Цена "Теплый контур" (₽)</label>
                  <input type="number" value={currentProject.priceWarm || currentProject.price} onChange={e => updateField('priceWarm', parseInt(e.target.value) || 0)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-900 dark:text-white">Цена "Под ключ" (₽)</label>
                  <input type="number" value={currentProject.priceTurnkey || Math.round(currentProject.price * 1.3)} onChange={e => updateField('priceTurnkey', parseInt(e.target.value) || 0)} className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="p-4 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">Параметр</th>
                      <th className="p-4 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 text-center w-32">Теплый контур</th>
                      <th className="p-4 font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 text-center w-32">Под ключ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(currentProject.configurations || []).map((section, sIdx) => (
                      <React.Fragment key={sIdx}>
                        <tr className="bg-slate-50 dark:bg-slate-900/50">
                          <td colSpan={3} className="p-3 font-bold text-primary border-b border-slate-200 dark:border-slate-700">{section.title}</td>
                        </tr>
                        {section.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="p-3 text-sm text-slate-700 dark:text-slate-300">{row.name}</td>
                            <td className="p-3 text-center">
                              <input type="checkbox" checked={row.v1} onChange={e => updateConfigRow(sIdx, rIdx, 'v1', e.target.checked)} className="size-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
                            </td>
                            <td className="p-3 text-center">
                              <input type="checkbox" checked={row.v2} onChange={e => updateConfigRow(sIdx, rIdx, 'v2', e.target.checked)} className="size-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-xl flex items-center gap-3 z-[100] shadow-2xl animate-fade-in-up ${toast.type === 'error' ? 'bg-red-600' : 'bg-slate-900'}`}>
          <span className={`material-symbols-outlined ${toast.type === 'error' ? 'text-white' : 'text-green-400'}`}>
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="font-bold">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
