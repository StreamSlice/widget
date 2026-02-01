/**
 * StreamSlice Widget Types
 */

export interface StreamSliceConfig {
  /** Initial position of the floating window */
  position?: WindowPosition;
  /** Initial size of the floating window */
  size?: WindowSize;
  /** Minimum window size */
  minSize?: WindowSize;
  /** Maximum window size */
  maxSize?: WindowSize;
  /** Auto-play when stream is loaded */
  autoPlay?: boolean;
  /** Initial muted state */
  muted?: boolean;
  /** Initial volume (0-1) */
  volume?: number;
  /** Show controls */
  showControls?: boolean;
  /** Z-index for the floating window */
  zIndex?: number;
  /** Custom CSS class name */
  className?: string;
  /** Theme */
  theme?: 'dark' | 'light';
  /** Callbacks */
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onError?: (error: StreamSliceError) => void;
  onClose?: () => void;
  onResize?: (size: WindowSize) => void;
  onMove?: (position: WindowPosition) => void;
}

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface StreamSliceError {
  code: string;
  message: string;
}

export interface PlaylistResponse {
  data?: {
    link: string;
  };
  error?: {
    code: string;
    error_message_message: string;
  };
}

export interface PlayerState {
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

export type PlayerEventType = 
  | 'play'
  | 'pause'
  | 'volumechange'
  | 'timeupdate'
  | 'ended'
  | 'error'
  | 'qualitychange'
  | 'statechange'
  | 'buffering';

export interface PlayerEvent {
  type: PlayerEventType;
  data?: any;
}

export type ResizeDirection = 
  | 'n' | 's' | 'e' | 'w' 
  | 'ne' | 'nw' | 'se' | 'sw';
