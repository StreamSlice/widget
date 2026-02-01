# StreamSlice Widget

Библиотека для встраивания плавающего видеоплеера со стримом Amazon IVS на любой сайт.

## Возможности

- Плавающее окно с возможностью перетаскивания и изменения размера
- Интеграция с Amazon IVS Player для HLS стримов
- Автоматическое получение плейлиста по URL страницы
- Управление воспроизведением (play/pause, громкость, качество, полноэкранный режим)
- Темная и светлая темы
- TypeScript поддержка
- Легковесный и без внешних зависимостей (кроме IVS SDK)

## Установка

### NPM

```bash
npm install streamslice-widget
```

### CDN

```html
<!-- Amazon IVS Player SDK (загружается автоматически, но можно подключить вручную) -->
<script src="https://player.live-video.net/1.24.0/amazon-ivs-player.min.js"></script>

<!-- StreamSlice Widget -->
<script src="https://your-cdn.com/streamslice.js"></script>
```

## Использование

### ES Modules

```typescript
import { StreamSlice } from 'streamslice-widget';

const widget = new StreamSlice({
  apiUrl: 'https://api.your-backend.com',
  autoPlay: true,
  muted: false,
  theme: 'dark',
  onReady: () => console.log('Widget ready'),
  onError: (error) => console.error('Error:', error),
});

// Инициализация виджета
widget.init();
```

### UMD (Browser)

```html
<script src="streamslice.js"></script>
<script>
  const widget = new StreamSlice.StreamSlice({
    apiUrl: 'https://api.your-backend.com',
    autoPlay: true,
  });
  
  widget.init();
</script>
```

## Конфигурация

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `apiUrl` | `string` | **required** | URL API сервера |
| `position` | `{ x: number, y: number }` | `{ x: 20, y: 20 }` | Начальная позиция окна |
| `size` | `{ width: number, height: number }` | `{ width: 400, height: 280 }` | Начальный размер окна |
| `minSize` | `{ width: number, height: number }` | `{ width: 320, height: 220 }` | Минимальный размер окна |
| `maxSize` | `{ width: number, height: number }` | `{ width: 800, height: 600 }` | Максимальный размер окна |
| `autoPlay` | `boolean` | `true` | Автозапуск воспроизведения |
| `muted` | `boolean` | `false` | Начать с выключенным звуком |
| `volume` | `number` | `1` | Начальная громкость (0-1) |
| `showControls` | `boolean` | `true` | Показывать элементы управления |
| `zIndex` | `number` | `999999` | z-index окна |
| `theme` | `'dark' \| 'light'` | `'dark'` | Цветовая тема |
| `className` | `string` | - | Дополнительный CSS класс |

### Callbacks

| Callback | Параметры | Описание |
|----------|-----------|----------|
| `onReady` | - | Вызывается когда виджет готов к воспроизведению |
| `onPlay` | - | Вызывается при запуске воспроизведения |
| `onPause` | - | Вызывается при паузе |
| `onError` | `{ code: string, message: string }` | Вызывается при ошибке |
| `onClose` | - | Вызывается при закрытии виджета |
| `onResize` | `{ width: number, height: number }` | Вызывается при изменении размера |
| `onMove` | `{ x: number, y: number }` | Вызывается при перемещении |

## API

### Методы

```typescript
// Управление воспроизведением
widget.play();
widget.pause();
widget.togglePlayPause();

// Громкость
widget.setVolume(0.5); // 0-1
widget.getVolume();
widget.mute();
widget.unmute();
widget.toggleMute();

// Качество
widget.setQuality('720p');
widget.getQualities(); // ['Auto', '1080p', '720p', '480p', ...]

// Полноэкранный режим
widget.toggleFullscreen();

// Позиция и размер окна
widget.setPosition({ x: 100, y: 100 });
widget.setSize({ width: 500, height: 350 });

// Видимость
widget.show();
widget.hide();
widget.close();

// Состояние
widget.isReady(); // boolean
widget.getState(); // PlayerState

// Уничтожение
widget.destroy();

// Статический метод для удаления стилей
StreamSlice.removeStyles();
```

### PlayerState

```typescript
interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  isFullscreen: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  isLive: boolean;
  quality: string;
  availableQualities: string[];
}
```

## API Backend

Библиотека ожидает следующий API эндпоинт:

### GET /api/event/getPlaylist

**Query Parameters:**
- `link` (string, required) - URL страницы

**Response:**
```json
{
  "data": {
    "link": "https://ivs.stream.url/playlist.m3u8"
  },
  "error": null
}
```

**Error Response:**
```json
{
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "error_message_message": "Error description"
  }
}
```

## Сборка

```bash
# Установка зависимостей
npm install

# Сборка
npm run build

# Сборка с отслеживанием изменений
npm run dev
```

## Структура проекта

```
src/
├── index.ts           # Точка входа
├── StreamSlice.ts     # Главный класс
├── api/
│   └── client.ts      # API клиент
├── player/
│   └── IVSPlayer.ts   # Обёртка над Amazon IVS Player
├── ui/
│   ├── FloatingWindow.ts  # Плавающее окно
│   ├── PlayerControls.ts  # Элементы управления
│   └── icons.ts           # SVG иконки
├── styles/
│   └── index.ts       # CSS стили
└── types/
    └── index.ts       # TypeScript типы
```

## Лицензия

MIT
