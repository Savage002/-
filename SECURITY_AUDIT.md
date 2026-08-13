# Отчёт по безопасности — ZQAI (backend + frontend)

## Статус исправлений (2026-08-13)

Все находки **CR-1…CR-7** и **H-1…H-5** устранены в коде:

- `middleware/auth.js` — `requireAuth`/`requireRole`, `JWT_SECRET` обязателен (падает при старте, если не задан), `algorithms: ['HS256']` закреплён при verify.
- Все мутирующие и admin-роуты (`news`, `managers`, `events`, `compliance-officer`, `upload`, `auth/register`, `auth/users*`, `logs`) закрыты `requireAuth`/`requireRole`. Проверено live: 401 без токена, 403 с чужой ролью.
- `register` — allowlist ролей (`admin`/`manager`), доступен только администратору.
- Смена пароля — self-service требует текущий пароль; сброс чужого пароля — только admin.
- Удаление пользователя — запрещено удалять себя и последнего администратора.
- Загрузка файлов — allowlist MIME (jpg/png/webp/gif), лимит 5MB/1 файл, расширение берётся из провалидированного mimetype (не из `originalname`); `/uploads` отдаётся с `X-Content-Type-Options: nosniff` и `Content-Security-Policy: sandbox`.
- `POST /api/news` — `created_by` берётся из токена, а не из тела запроса; URL картинок валидируются allowlist'ом (`/uploads/...`), внешние URL отбрасываются.
- CORS — закрыт по умолчанию, разрешённые origin — через `CORS_ORIGIN`; добавлен `helmet` (CSP/security-заголовки); rate-limit на `/login`; `trust proxy` выставлен.
- `docker-compose.yml` — Postgres забинжен на `127.0.0.1`, `DB_PASSWORD`/`JWT_SECRET` обязательны (без дефолтов); `.env.example` заполнен.
- `dump.sql` — реальные хэши паролей заменены плейсхолдером (пароль `ChangeMe_2026!`, сменить после первого деплоя).
- Фронтенд — токен хранится и передаётся (`Authorization: Bearer`) через `authFetch`; при 401 — автоматический logout; роль на клиенте используется только как подсказка для UI.
- Логин — constant-time (bcrypt.compare выполняется всегда, даже для несуществующего username) — устраняет username enumeration по таймингу (L-5).
- `uncaughtException`/`unhandledRejection` теперь логируются и завершают процесс (перезапуск через Docker `restart: always`), вместо молчаливого проглатывания (L-6).
- `NODE_ENV=production` + финальный error-handler — стек-трейсы не утекают клиенту (L-4).

**Осталось на усмотрение владельца инфраструктуры** (не тронуто в этом проходе, т.к. требует координации с реальным деплоем):
- M-6: заменить `vite preview` на сборку `dist/` + nginx/статик-сервер (см. `nginx.md`).
- Ротация реальных production-паролей `admin`/`manager` и `JWT_SECRET`, если этот код уже разворачивался с боевыми данными.

---

**Дата:** 2026-08-13
**Объект:** локально поднятый стек (Docker: `db` PostgreSQL 15, `backend` Express на :3001, `frontend` Vite на :5000)
**Метод:** статический аудит кода (2 суб-агента: backend + frontend) + live-простукивание работающего API на `http://localhost:3001`. 42Crunch Audit/Scan — по решению не запускались (нужен облачный токен).
**OpenAPI-спека** сгенерирована из кода: `openapi.json` (30 операций) — пригодится для будущего 42Crunch/документации.

---

## Итоговый вердикт

| Класс уязвимости | Статус | Комментарий |
|---|---|---|
| **SQL-инъекции** | ✅ **НЕ найдено** | Все 47 запросов параметризованы (`$1,$2…`). Проверено вживую — инъекции не проходят. |
| **XSS (в React)** | ✅ Текст экранируется | Нет `dangerouslySetInnerHTML`/`innerHTML`/`eval`. Контент новостей рендерится безопасно. |
| **XSS (хранимый, через загрузку)** | 🔴 **КРИТИЧНО** | Загрузка `.html`/`.svg` со скриптом → отдаётся с `Content-Type: text/html` и исполняется на домене приложения. **Подтверждено вживую.** |
| **Broken Auth / Access Control** | 🔴 **КРИТИЧНО** | Аутентификация спроектирована, но нигде не проверяется. `jwt.verify` не вызывается ни разу. **Подтверждено вживую.** |
| **Инфраструктура / секреты** | 🔴 **КРИТИЧНО** | Postgres на `0.0.0.0:5432` с паролем `1234`; слабые JWT-секреты и хэши паролей в git. |

**Общая оценка: КРИТИЧЕСКАЯ.** Пока сайт доступен из интернета, его следует считать полностью скомпрометированным по умолчанию. Корневая причина не в тонком баге — **систему аутентификации наполовину построили и не подключили**: токен выдаётся при логине, но клиент его выбрасывает, а сервер никогда не проверяет.

---

## Что подтверждено вживую (на поднятом контейнере)

Все действия выполнялись **без единого токена авторизации**, на тестовых данных, которые затем удалены:

| # | Действие | Результат |
|---|---|---|
| 1 | `GET /api/auth/users` | **HTTP 200** — отдал список всех сотрудников (admin, manager) |
| 2 | `GET /api/logs` | **HTTP 200** — отдал журнал аудита (события входа, user_id) |
| 3 | `POST /api/auth/register {role:"admin"}` | **HTTP 201** — создан админ; вход под ним вернул рабочий admin-токен |
| 4 | `PATCH /api/auth/users/:id/password` | **HTTP 200** — пароль сменён, вход с новым паролем удался → **захват аккаунта** |
| 5 | `POST /api/news` c `<script>`/внешним URL картинки | **HTTP 201** — payload сохранён дословно |
| 6 | `POST /api/upload` файл `payload.html` | **HTTP 200** → `/uploads/….html` отдаётся как `text/html`, скрипт исполняется |
| 7 | `DELETE /api/news/:id` | **HTTP 200** — удаление контента без токена |
| — | SQLi: `login username="admin' OR '1'='1"` | HTTP 401 — инъекция не сработала (параметризация) |
| — | SQLi: `news?lang=ru' OR '1'='1` | HTTP 200, 0 записей — не сработала |

---

## Критические находки

### CR-1. Нет middleware авторизации — JWT нигде не проверяется
`server.js:36-44` монтирует все 9 роутеров без защиты. Единственное обращение к `jsonwebtoken` — `jwt.sign` в `routes/auth.js:21`; `jwt.verify` не встречается в проекте. Фронтенд (`src/context/AuthContext.jsx:20`) хранит только `user`, а `token` выбрасывает (`src/pages/login.jsx:55`). Ни один `fetch` не шлёт `Authorization`.
**Эксплойт:** любой запрос к любому эндпоинту (включая создание/удаление пользователей) проходит анонимно.
**Фикс:** создать `middleware/auth.js` (`requireAuth` + `requireRole`), навесить на все мутирующие и admin-роуты; пинить `algorithms:['HS256']` при verify; фронтенд — хранить и слать токен (лучше httpOnly-cookie).

### CR-2. Открытая регистрация с выбором роли → мгновенный admin
`routes/auth.js:45-62` — `role` берётся из тела запроса без allowlist и без проверки вызывающего.
**Эксплойт (подтверждён):** `POST /api/auth/register {"role":"admin"}` → создаётся администратор.
**Фикс:** `requireAuth, requireRole('admin')` + allowlist ролей (`['admin','manager']`).

### CR-3. Смена пароля без авторизации → захват любого аккаунта
`routes/auth.js:89-97` — нет проверки личности, владения `:id` и старого пароля.
**Эксплойт (подтверждён):** `PATCH /api/auth/users/1/password` перехватывает реального `admin` (id=1 из `dump.sql:751`).
**Фикс:** требовать auth; self-service — только с подтверждением текущего пароля; иначе — `requireRole('admin')`.

### CR-4. Удаление пользователей без авторизации
`routes/auth.js:110-113` — `DELETE /api/auth/users/:id` открыт. Массовое удаление всех аккаунтов = отказ в доступе к админке.
**Фикс:** `requireAuth, requireRole('admin')` + запрет удаления последнего админа/самого себя.

### CR-5. Неограниченная загрузка файлов → хранимый XSS на домене приложения
`routes/upload.js:22-30` — нет `fileFilter`, нет `limits`, расширение берётся из `originalname`; `server.js:33` отдаёт папку через `express.static`.
**Эксплойт (подтверждён):** загрузка `payload.html` → `/uploads/….html` отдаётся с `Content-Type: text/html`, скрипт исполняется на origin приложения (читает `localStorage`, дёргает открытые admin-эндпоинты). `.svg` — аналогично. Также — DoS переполнением диска (нет лимита размера, `nginx.md` разрешает 50M).
**Фикс:** `requireAuth`; `multer({ limits:{fileSize:5MB,files:1}, fileFilter })` с allowlist MIME; расширение — из провалидированного mimetype, `originalname` игнорировать; на `/uploads` — `X-Content-Type-Options: nosniff` + `Content-Disposition: attachment`/sandbox-CSP; проверка magic-bytes.

### CR-6. Postgres открыт на 0.0.0.0:5432 с паролем `1234`
`docker-compose.yml:9,12` — публикация порта на все интерфейсы + дефолтный пароль; `.env.example` пустой (0 байт), так что дефолты — вероятная реальность прода.
**Эксплойт:** `psql -h <host> -U postgres` с паролем `1234` — полный доступ к БД в обход приложения. (Docker пишет iptables-правила в обход UFW.)
**Фикс:** `127.0.0.1:5432:5432` или убрать маппинг; `POSTGRES_PASSWORD: ${DB_PASSWORD:?required}`; заполнить `.env.example`.

### CR-7. Контроль доступа только на клиенте (роль из localStorage)
`src/pages/Dashboard.jsx:19,74-76` — `isAdmin = user?.role === 'admin'`, `user` берётся из `localStorage` без подписи/срока. Правкой одной строки в devtools открывается вся админка — и из-за CR-1 её кнопки реально работают.
**Фикс:** серверные проверки роли (главное); на клиенте — `role` только как подсказка для рендера, личность — из `/api/auth/me` по httpOnly-cookie.

---

## Высокие

- **H-1. Слабые/закоммиченные JWT-секреты.** `routes/auth.js:7` (`'your_jwt_secret_key_change_me'`) и `docker-compose.yml:36` (`'zqai_secret_key_2024'`) — два разных дефолта в git. **Чинить одновременно с CR-1**, иначе токены станут подделываемыми. Убрать `|| fallback`, генерировать `openssl rand -base64 48`.
- **H-2. Нет rate-limit на логине.** `express-rate-limit` в зависимостях, но не используется. Возможен credential stuffing + CPU-DoS (bcrypt) + флуд `system_logs`. Навесить лимитер на `/login`, выставить `app.set('trust proxy', 1)`.
- **H-3. Анонимное чтение справочника сотрудников** (`routes/auth.js:76-80`) — **подтверждено**. PII + список целей для брутфорса. `requireAuth, requireRole('admin')`.
- **H-4. Хранение внешних URL картинок без валидации** (`routes/news.js:72-77` → `NewsDetail.jsx:84` и др.) — **подтверждено** (beacon-URL сохранён). Анонимный `POST /api/news` с `images:["https://attacker/..."]` → трекинг всех посетителей. Валидировать, что `image_url` — относительный путь под `/uploads/`.
- **H-5. Сессия в localStorage** (`AuthContext.jsx:11,20`) — читается из XSS (CR-5), без подписи, не истекает. Перенести в httpOnly-cookie.

## Средние

- **M-1. Анонимное чтение журнала аудита** (`routes/logs.js:8`) — **подтверждено**. `SELECT *`, `requireRole('admin')`.
- **M-2. Хэши паролей прод-аккаунтов в git** (`dump.sql:751-752`) — считать скомпрометированными, ротировать, убрать строки из дампа.
- **M-3. Широко открытый CORS** (`server.js:29`) — `Access-Control-Allow-Origin: *`. Ограничить реальными origin.
- **M-4. Весь контент-CRUD без авторизации (BFLA)** — news/managers/events/compliance-officer. Особо: `PUT /api/compliance-officer` позволяет подменить контакты антикоррупционного офицера → перехват обращений граждан. `requireRole('admin','manager')` на все не-GET.
- **M-5. Нет security-заголовков/CSP** (`helmet`, CSP, `nosniff`, HSTS отсутствуют) — усиливает CR-5.
- **M-6. Прод обслуживается `vite preview`** (`Dockerfile.client:13`) — не боевой сервер. Собрать `dist/` и раздавать nginx/Caddy.
- **M-7. Неэкранированные параметры в URL API** (`encodeURIComponent` отсутствует) + валидация ввода/mass-assignment `userId` (`news.js:63`).

## Низкие

- **L-1.** `mailto:` header injection из API-email (`CallCenter.jsx:182`).
- **L-2.** Незащищённый `JSON.parse(localStorage)` → вечный спиннер (`AuthContext.jsx:13`).
- **L-3.** Незащищённый доступ к полям ответа + нет ErrorBoundary → белый экран (`NewsDetail.jsx:130`, `Dashboard.jsx:404`).
- **L-4.** Verbose stack traces (нет `NODE_ENV=production` и терминального error-handler) — `server.js`.
- **L-5.** Username enumeration по таймингу логина (`auth.js:14-30`).
- **L-6.** Проглатывание `uncaughtException` (`server.js:83-89`) — процесс живёт в неопределённом состоянии.

---

## Что сделано корректно (не требует правок)

- **SQL — параметризация везде.** Динамические сборки в `news/managers/events/reception` конкатенируют только статические фрагменты; данные всегда в `params`. `departments.js:67` — корректный `= ANY($1)`.
- **Нет опасных HTML-сников** во фронтенде; текст из API рендерится как экранированный JSX.
- **Нет секретов в клиентском бандле** (нет `import.meta.env`).
- **`rel="noopener noreferrer"`** на всех `target="_blank"`.
- **bcrypt** (cost 10), пароли не возвращаются в ответах и не логируются; JWT `expiresIn: '8h'`.
- **Path traversal при загрузке невозможен** — `path.extname` берёт только basename; `originalname` отбрасывается генерацией имени.
- **Нет command injection** — нет `child_process`/`exec`/`eval`.

---

## Порядок устранения

1. **Немедленно (часы):** привязать Postgres к `127.0.0.1` + ротировать `DB_PASSWORD` (CR-6); ротировать `JWT_SECRET` без fallback (H-1); ротировать пароли `admin`/`manager`, считать хэши в git сожжёнными (M-2). До п.2 — по возможности убрать `/api` из публичного доступа.
2. **На этой неделе:** `middleware/auth.js` + `requireAuth`/`requireRole` на все не-публичные роуты (CR-1..CR-4, CR-7, H-3, M-1, M-4); фронтенд — хранить/слать токен; allowlist ролей; rate-limit на логине (H-2).
3. **Далее:** жёсткая настройка загрузок (CR-5); ограничить CORS (M-3); валидация URL картинок (H-4).
4. **Затем:** схемы-валидация и удаление mass-assignment `userId` (M-7); `NODE_ENV=production` + error-handler (L-4); `helmet`/CSP (M-5); constant-time логин (L-5).

После правок — проверить, что каждый мутирующий эндпоинт отдаёт **401 без токена** и **403 с валидным не-admin токеном**.
