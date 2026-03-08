import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Contacts() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [botField, setBotField] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (botField) {
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      return;
    }

    if (formData.phone.length !== 10) return;
    if (formData.name.length < 2) return;
    if (formData.message.length < 30) return;

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'orders'), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
        source: 'contacts_page',
        status: 'new',
        createdAt: Date.now()
      });
      setIsSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error("Error adding order: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20">
      <div className="w-full max-w-7xl flex flex-col gap-12">
        <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">Контакты</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">Свяжитесь с нами любым удобным способом. Мы всегда рады ответить на ваши вопросы и обсудить будущий проект.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                <span className="material-symbols-outlined text-3xl text-primary">call</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Телефон</h4>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">+7 (495) 123-45-67</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Пн-Вс: 09:00 - 20:00</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                <span className="material-symbols-outlined text-3xl text-primary">mail</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Email</h4>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">info@ecostroy.ru</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Отвечаем в течение часа</p>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3 sm:col-span-2">
                <span className="material-symbols-outlined text-3xl text-primary">location_on</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Офис</h4>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">г. Москва, ул. Лесная, д. 43, офис 215</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Бизнес-центр "Эко-Плаза"</p>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[300px] bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden relative flex items-center justify-center">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Карта (Интеграция Google Maps / Yandex Maps)</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
            {isSuccess ? (
              <div className="flex flex-col items-center text-center py-8 gap-4 h-full justify-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Сообщение отправлено!</h3>
                <p className="text-slate-600 dark:text-slate-400">Спасибо за обращение. Мы свяжемся с вами в ближайшее время.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Отправить еще одно
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Напишите нам</h3>
                <form className="flex flex-col gap-5" onSubmit={handleFormSubmit}>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Ваше имя *</label>
                    <input 
                      type="text" 
                      id="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value.replace(/[^a-zA-Zа-яА-ЯёЁ\s-]/g, '').slice(0, 30)})}
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                      placeholder="Иван Иванов" 
                      required
                      minLength={2}
                      maxLength={30}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="phone" className="text-sm font-medium text-slate-700 dark:text-slate-300">Телефон *</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-500 font-medium">+7</span>
                      <input 
                        type="tel" 
                        id="phone" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        className="h-12 pl-10 pr-4 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                        placeholder="(999) 000-00-00" 
                        required
                        minLength={10}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" 
                      placeholder="example@mail.ru" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">Сообщение *</label>
                      <span className={`text-xs ${formData.message.length > 0 && (formData.message.length < 30 || formData.message.length > 200) ? 'text-red-500' : 'text-slate-500'}`}>
                        {formData.message.length}/200
                      </span>
                    </div>
                    <textarea 
                      id="message" 
                      rows={4} 
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value.slice(0, 200)})}
                      className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none" 
                      placeholder="Опишите ваш проект или задайте вопрос (минимум 30 символов)..."
                      required
                      minLength={30}
                      maxLength={200}
                    ></textarea>
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
                    className="h-14 mt-2 rounded-lg bg-primary hover:bg-green-500 text-slate-900 font-bold text-lg transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        Отправка...
                      </>
                    ) : 'Отправить заявку'}
                  </button>
                  <p className="text-xs text-slate-500 text-center mt-2">
                    Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
