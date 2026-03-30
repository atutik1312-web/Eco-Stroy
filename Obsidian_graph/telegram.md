---
type: logic
tags: [logic, service]
---
# Telegram Service (telegram.ts)

Краткое описание: Сервис для отправки уведомлений о новых заявках (лидах) в Telegram-чат менеджерам через Telegram Bot API.

## ⚙️ Зависимости (Что использует)
- Внешнее API Telegram (api.telegram.org)
- Переменные окружения (VITE_TELEGRAM_BOT_TOKEN, VITE_TELEGRAM_CHAT_ID)

## ⬅️ Кем используется (Обратные связи)
- [[Home]] — отправка заявки с главной страницы
- [[Contacts]] — отправка формы обратной связи
- [[Calculator]] — отправка итоговой сметы
- [[ProjectDetails]] — отправка заявки на конкретный дом
- [[BathDetails]] — отправка заявки на конкретную баню
