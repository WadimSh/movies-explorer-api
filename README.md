# movies-explorer-api

## Описание

REST API для аутентификации пользователей и сохранения фильмов в избранном. 

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

## Ссылка

[api.wadim.nomoreparties.sbs](https://api.wadim.nomoreparties.sbs)

## Схемы и модели ресурсов API

### Поля схемы `user`:

Поле | Описание
-----|------------
email | Почта пользователя, по которой он регистрируется. Обязательное поле, уникальное для каждого пользователя. Валидируется на соответствие схеме элекстронной почты.
password | Хеш пароля. Обязательное поле-строка. База данных не возвращает это поле.
name | Имя пользователя. Обязательное поле-строка от 2 до 30 символов.

### Поля схемы `movie`:

Поле | Описание
-----|------------
country | Страна создания фильма. Обязательное поле-строка.
director | Режиссёр фильма. Обязательное поле-строка.
duration | Длительность фильма. Обязательное поле-число.
year | Год выпуска фильма. Обязательное поле-строка.
description | Описание фильма. Обязательное поле-строка.
image | Cсылка на постер к фильму. Обязательное поле-строка. URL-адрес.
trailer | Cсылка на трейлер фильма. Обязательное поле-строка. URL-адрес.
thumbnail | Миниатюрное изображение постера к фильму. Обязательное поле-строка. URL-адрес.
owner | **_id** пользователя, который сохранил статью. Обязательное поле.
movieId | **id** фильма, который содержится в ответе сервиса. Обязательное поле.
nameRU | Название фильма на русском языке. Обязательное поле-строка.
nameEN | Название фильма на английском языке. Обязательное поле-строка.

## Методы и роуты

Метод | Роут | Описание
----- |------|---------
GET | `/users/me` | возвращает **email** и **имя**
PATCH | `/users/me` | обновляет информацию о пользователе 
POST | `/movies` | создаёт фильм с передаными **country**, **director**, **duration**, **year**, **description**, **image**, **trailer**, **nameRU**, **nameEN**, **movieId** и **thumbnail**
GET | `/movies` | возвращает все сохранённые пользователем фильмы
DELETE | `/movies/_id` | удаляет сохранённый фильм по его **id**
POST | `/signup` | создает пользователя с передаными **email**, **password**, **name**
POST | `/signin` | проверяет переданные **email** и **password** и возвращает **JWT**


## Используемые технологии 

* Expressjs
* nodemon
* MongoDB
* mongoose
* dotenv
* cors
* celebrate
* bcryptjs
* express-rate-limit
* winston
* express-winston*
* helmet
* jsonwebtoken
* validator
* eslint
