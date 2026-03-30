---
type: core
tags: [core, routing]
---
# App (App.tsx)

Краткое описание: Корневой компонент приложения. Отвечает за общую структуру (Layout), подключение глобальных провайдеров и высокоуровневый роутинг.

## 🧱 Основные секции / Компоненты
- Провайдеры контекста (ProjectContext)
- Header (Шапка сайта)
- Маршрутизатор (Routes)
- Footer (Подвал сайта)

## 🔗 Навигация (Роутинг страниц)
- [[Home]] — `/`
- [[Catalog]] — `/catalog`
- [[CatalogBaths]] — `/baths`
- [[Portfolio]] — `/portfolio`
- [[Calculator]] — `/calculator`
- [[Technologies]] — `/technologies`
- [[About]] — `/about`
- [[Contacts]] — `/contacts`
- [[Login]] — `/login`
- [[Admin]] — `/admin`

## ⚙️ Зависимости (Логика и данные)
- [[ProjectContext]] — оборачивает приложение для предоставления глобального состояния
