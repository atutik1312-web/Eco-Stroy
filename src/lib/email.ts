import emailjs from '@emailjs/browser';
import { NotificationData } from './telegram';

const EMAILJS_SERVICE_ID = 'service_6nwd63p';
const EMAILJS_TEMPLATE_ID = 'template_v9h1iyj';
const EMAILJS_PUBLIC_KEY = 'R9KK9pm8KhKTK_vW9';

export const sendEmailNotification = async (data: NotificationData) => {
  let sourceText = data.source;
  if (data.source === 'home_page') sourceText = 'Главная страница';
  if (data.source === 'contacts_page') sourceText = 'Страница контактов';
  if (data.source === 'calculator') sourceText = 'Калькулятор';
  if (data.source === 'project_details') sourceText = `Проект: ${data.projectTitle || 'Неизвестно'}`;
  if (data.source === 'bath_details') sourceText = `Баня: ${data.projectTitle || 'Неизвестно'}`;

  const templateParams = {
    source: sourceText,
    projectTitle: data.projectTitle || '',
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    message: data.message || '',
    summary: data.summary || ''
  };

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};
