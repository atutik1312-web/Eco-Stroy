const TELEGRAM_TOKEN = '8550180755:AAFpI49cgSDHp1NMXeSZgkHPEWnd_2nDgk0';
const TELEGRAM_CHAT_ID = '5052551453';

export interface NotificationData {
  name?: string;
  phone: string;
  email?: string;
  message?: string;
  summary?: string;
  source: string;
  projectTitle?: string;
}

export const sendTelegramNotification = async (data: NotificationData) => {
  let sourceText = data.source;
  if (data.source === 'home_page') sourceText = 'Главная страница';
  if (data.source === 'contacts_page') sourceText = 'Страница контактов';
  if (data.source === 'calculator') sourceText = 'Калькулятор';
  if (data.source === 'project_details') sourceText = `Проект: ${data.projectTitle || 'Неизвестно'}`;
  if (data.source === 'bath_details') sourceText = `Баня: ${data.projectTitle || 'Неизвестно'}`;

  let text = `🔥 <b>Новая заявка!</b>\n\n`;
  text += `<b>Источник:</b> ${sourceText}\n`;
  if (data.name) text += `<b>Имя:</b> ${data.name}\n`;
  text += `<b>Телефон:</b> ${data.phone}\n`;
  if (data.email) text += `<b>Email:</b> ${data.email}\n`;
  if (data.message) text += `\n<b>Сообщение:</b>\n${data.message}\n`;
  if (data.summary) text += `\n<b>Расчет калькулятора:</b>\n${data.summary}\n`;

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Error sending telegram notification:', error);
  }
};
