# Widget

A floating video player library for embedding live streams on any website.

## Features

- Draggable and resizable floating window
- Automatic playlist fetching by page URL
- Playback controls (play/pause, volume, quality, fullscreen)
- Dark and light themes
- TypeScript support

## Installation

### NPM

```bash
npm install @streamslice/widget
```

### CDN

```html
<!-- Minified (recommended for production) -->
<script src="https://unpkg.com/@streamslice/widget"></script>

<!-- Or via jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/@streamslice/widget"></script>
```

## Usage

### ES Modules

```typescript
import { StreamSlice } from '@streamslice/widget';

const widget = new StreamSlice({
  autoPlay: true,
  muted: false,
  theme: 'dark',
  onReady: () => console.log('Widget ready'),
  onError: (error) => console.error('Error:', error),
});

// Initialize widget
widget.init();
```

### UMD (Browser)

```html
<script src="https://unpkg.com/@streamslice/widget"></script>
<script>
  const widget = new StreamSlice.StreamSlice({
    autoPlay: true,
    theme: 'dark',
  });
  
  widget.init();
</script>
```

## Configuration

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | `{ x: number, y: number }` | `{ x: 20, y: 20 }` | Initial window position |
| `size` | `{ width: number, height: number }` | `{ width: 400, height: 280 }` | Initial window size |
| `minSize` | `{ width: number, height: number }` | `{ width: 320, height: 220 }` | Minimum window size |
| `maxSize` | `{ width: number, height: number }` | `{ width: 800, height: 600 }` | Maximum window size |
| `autoPlay` | `boolean` | `true` | Auto-play when stream loads |
| `muted` | `boolean` | `false` | Start muted |
| `volume` | `number` | `1` | Initial volume (0-1) |
| `showControls` | `boolean` | `true` | Show player controls |
| `zIndex` | `number` | `999999` | Window z-index |
| `theme` | `'dark' \| 'light'` | `'dark'` | Color theme |
| `className` | `string` | - | Additional CSS class |

### Callbacks

| Callback | Parameters | Description |
|----------|-----------|-------------|
| `onReady` | - | Called when widget is ready for playback |
| `onPlay` | - | Called when playback starts |
| `onPause` | - | Called when playback pauses |
| `onError` | `{ code: string, message: string }` | Called on error |
| `onClose` | - | Called when widget is closed |
| `onResize` | `{ width: number, height: number }` | Called when window is resized |
| `onMove` | `{ x: number, y: number }` | Called when window is moved |

## API

### Methods

```typescript
// Playback control
widget.play();
widget.pause();
widget.togglePlayPause();

// Volume
widget.setVolume(0.5); // 0-1
widget.getVolume();
widget.mute();
widget.unmute();
widget.toggleMute();

// Quality
widget.setQuality('720p');
widget.getQualities(); // ['Auto', '1080p', '720p', '480p', ...]

// Fullscreen
widget.toggleFullscreen();

// Window position and size
widget.setPosition({ x: 100, y: 100 });
widget.setSize({ width: 500, height: 350 });

// Visibility
widget.show();
widget.hide();
widget.close();

// State
widget.isReady(); // boolean
widget.getState(); // PlayerState

// Cleanup
widget.destroy();

// Static method to remove injected styles
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

## Build

```bash
# Install dependencies
npm install

# Build
npm run build

# Build with watch mode
npm run dev

# Run example server
npm run serve
```

## Output Files

| File | Size | Description |
|------|------|-------------|
| `streamslice.js` | ~55 KB | UMD, development |
| `streamslice.min.js` | ~33 KB | UMD, minified (production) |
| `streamslice.esm.js` | ~50 KB | ES Modules |
| `streamslice.esm.min.js` | ~33 KB | ES Modules, minified |

## Project Structure

```
src/
├── index.ts           # Entry point
├── StreamSlice.ts     # Main class
├── api/
│   └── client.ts      # API client
├── player/
│   └── IVSPlayer.ts   # Amazon IVS Player wrapper
├── ui/
│   ├── FloatingWindow.ts  # Floating window
│   ├── PlayerControls.ts  # Player controls
│   └── icons.ts           # SVG icons
├── styles/
│   └── index.ts       # CSS styles
└── types/
    └── index.ts       # TypeScript types
```

## License

MIT
