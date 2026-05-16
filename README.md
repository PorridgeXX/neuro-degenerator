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
```

### Требования

- [Bun](https://bun.sh) ≥ 1.3
- Экземпляр PostgreSQL
- Токен Telegram-бота (от [@BotFather](https://t.me/BotFather))
- [API-ключ DeepSeek](https://platform.deepseek.com/)

### Установка

**1. Клонировать репозиторий**

```bash
git clone https://github.com/PorridgeXX/neuro-degenerator.git
cd neuro-degenerator
```

**2. Установить зависимости**

```bash
bun install
```

**3. Настроить переменные окружения**

```bash
cp env .env
```

```env
API_KEY="ваш_ключ_deepseek"
BOT_TOKEN="ваш_токен_telegram_бота"
DATABASE_URL="postgres://user:pass@localhost:5432/dbname"
```

**4. Запустить миграции базы данных**

```bash
bunx drizzle-kit migrate
```

**5. Запустить бота**

```bash
bun run src/index.ts
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
- Медиафайлы хранятся локально на диске; колонка `path` в `media_messages` указывает на локальный путь к файлу.
- Бота располагайте на VPS вне территории Российской Федерации🇷🇺, иначе работать не будет((((((
- Генерация использует `temperature: 1.5` для приколов, меняйте как хотите.
