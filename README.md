# 🛍️ Shop Backend

**Shop Backend** — это мощный сервер на NestJS, разработанный для обслуживания онлайн-магазина. Он предоставляет надёжную и масштабируемую архитектуру, включающую:

- 🔐 Аутентификацию и авторизацию пользователей

- 🎁 Управление товарами, категориями и заказами

- 🧾 Систему корзины и оформления покупок

- 👤 Разделение ролей (админ / пользователь)

- 📊 Админ-панель для управления контентом

- 📂 Интеграцию с базой данных и валидацией

- 📘 Документацию API с помощью Swagger

Проект построен с использованием NestJS и Prisma ORM, с прицелом на высокую производительность, безопасность и удобство масштабирования.

## 🚀 Технологии
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![NestJS](https://img.shields.io/badge/NestJS-%E2%9D%A4-red)
![Docker](https://img.shields.io/badge/Docker-ready-blue)
![NestJS](https://img.shields.io/badge/Docker-ready-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-%23316192?style=flat&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-blueviolet)
![ЮKassa](https://img.shields.io/badge/ЮKassa-Payments-009FE3)
- **NestJS** – прогрессивный Node.js фреймворк для построения масштабируемых приложений
- **Prisma ORM** – быстрая и безопасная работа с базой данных PostgreSQL
- **Swagger** – автоматическая генерация документации для всех endpoint'ов
- **JWT (JSON Web Token)** – аутентификация и защита маршрутов
- **ЮKassa** - оплата заказов
- **Docker** - упаковка для запуска
- **Zod** – валидация данных


## 📚 Документация API

Вся информация по доступным endpoint'ам находится в Swagger-документации:

> 🔗 Перейти по адресу: `http://localhost:3001/api/docs` (или URL сервера)


## 🚀 Запуск проекта

Проект собирается и запускается через Docker. Это обеспечивает быстрое развёртывание и изоляцию окружения.
📦 Запуск через Docker Compose

    Убедитесь, что у вас установлен Docker и Docker Compose.

    Склонируйте репозиторий:

git clone https://github.com/sh3ydiii/shop-backend
cd shop-backend

    Настройте .env файл (пример в .env.example).

    Запустите сборку и контейнеры:

docker-compose up --build

Приложение будет доступно по адресу:
📍 http://localhost:3001

## 💬 Контакты

Если у тебя есть вопросы или предложения – пиши мне в Telegram: @sh3ydi_code
