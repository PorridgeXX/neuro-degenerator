# neuro-degenerator
Telegram-бот, который генерирует демотиваторы из сообщений в вашей группе.

### Как это работает

1. **Пассивный сбор** — бот тихо сохраняет каждое текстовое сообщение и каждое фото из группового чата в базу данных PostgreSQL.
2. **Команда `/slop`** — пользователь вызывает команду; бот берёт до 30 случайных текстовых сообщений из истории чата и отправляет их в DeepSeek.
3. **Генерация текста** — DeepSeek генерирует 2 прикола.
4. **Рендеринг изображения** — Через canvas создается демотиватор.
5. **Ответ** — бот отправляет итоговый PNG в чат.
```
  Юзер пишет /slop
       │
       ▼
  Выбирается 30 сообщений из бд
       │
       ▼
  Передается DeepSeek → Из сообщений делается 2 предложения
       │
       ▼
  Берется случайное фото
       │
       ▼
  При помощи @napi-rs/canvas генерируется демотиватор
       │
       ▼
  В чат отправляется демотиватор
```
### Примеры

<p align="center">
  <img src="assets/example1.jpg" width="640" alt="Generated demotivator example"/>
</p>
<p align="center">
  <img src="assets/example2.jpg" width="640" alt="Generated demotivator example"/>
</p>

### Стек технологий

| Слой | Технология |
|---|---|
| Среда выполнения | [Bun](https://bun.sh) |
| Язык | TypeScript 5 |
| Telegram-фреймворк | [grammY](https://grammy.dev) |
| LLM | [DeepSeek](https://deepseek.com) через OpenAI-совместимый API |
| Рендеринг изображений | [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas) |
| ORM | [Drizzle ORM](https://orm.drizzle.team) |
| База данных | PostgreSQL |
| Валидация | [Zod](https://zod.dev) |
| Логирование | [Pino](https://getpino.io) |
| Контейнеризация | Docker + Docker Compose |

### Структура проекта

```
src/
├── app/            # Экземпляр бота и конфигурация
├── commands/       # Обработчики команд (/slop)
├── controllers/    # Логика оркестрации
├── db/             # Схема Drizzle, миграции, клиент БД
├── handlers/       # Слушатели сообщений и медиа (пассивный сбор)
├── middlewares/    # Middleware для grammY
├── parsers/        # Парсинг и валидация ответов LLM
├── services/
│   ├── generation/         # Генерация текста через DeepSeek
│   └── imageGeneration/    # Рендеринг демотиватора через Canvas
└── utils/          # Логгер, кастомные ошибки

Dockerfile          # Сборка образа бота (Bun + системные шрифты)
docker-compose.yml  # postgres + migrate + bot
```

### Требования

- Токен Telegram-бота (от [@BotFather](https://t.me/BotFather))
- [API-ключ DeepSeek](https://platform.deepseek.com/)
- **Для запуска в Docker:** Docker ≥ 24 и Docker Compose v2
- **Для локального запуска:** [Bun](https://bun.sh) ≥ 1.3 и запущенный PostgreSQL

### Запуск  


**1. Клонировать репозиторий**

```bash
git clone https://github.com/PorridgeXX/neuro-degenerator.git
cd neuro-degenerator
```

**2. Создать `.env`**

```bash
cp env .env
```

И заполнить:

```env
API_KEY="ваш_ключ_deepseek"
BOT_TOKEN="ваш_токен_telegram_бота"

POSTGRES_HOST="postgres"
POSTGRES_NAME="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="neuro_degenerator"
POSTGRES_PORT="5432"
```


**3. Запустить**

```bash
docker compose up -d
```

### Схема базы данных

- **`text_messages`** — все текстовые сообщения, индексированные по `chat_id`
- **`media_messages`** — пути к скачанным фото и GIF, дедуплицированные по `file_unique_id`
- **`messages_counter`** — счётчик сообщений для каждого чата

### Обработка ошибок

| Ошибка | Ответ бота |
|---|---|
| Менее 2 текстовых сообщений в БД | `"Недостаточно сообщений в чате"` |
| Нет медиафайлов для чата | `"Нет картинок для создания демотиватора"` |
| LLM вернул неверный формат (3 попытки) | `"Не удалось сгенерировать текст"` |

### Примечания

- Бот должен быть добавлен в группу с правами на чтение сообщений для пассивного сбора.
- Медиафайлы хранятся локально на диске. В Docker они лежат в томе `uploads_data` и монтируются в `/app/uploads`; колонка `path` в `media_messages` указывает на этот путь.
- Бота располагайте на VPS вне территории Российской Федерации🇷🇺, иначе работать не будет((((((
- Генерация использует `temperature: 1.5` для приколов, меняйте как хотите.
