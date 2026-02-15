/**
 * StreamSlice - Main Widget Class
 */

import type { StreamSliceConfig, WindowPosition, WindowSize, PlayerState } from './types';
import { ApiClient } from './api/client';
import { FloatingWindow } from './ui/FloatingWindow';
import { PlayerControls } from './ui/PlayerControls';
import { IVSPlayerWrapper } from './player/IVSPlayer';
import { injectStyles, removeStyles } from './styles';

/** API Base URL - hardcoded for security */
const API_BASE_URL = 'https://platform.stream-slice.com';

const DEFAULT_CONFIG: Required<Omit<StreamSliceConfig, 'onReady' | 'onPlay' | 'onPause' | 'onError' | 'onClose' | 'onResize' | 'onMove' | 'className'>> = {
  position: { x: 20, y: 20 },
  size: { width: 400, height: 280 },
  minSize: { width: 320, height: 220 },
  maxSize: { width: 800, height: 600 },
  autoPlay: true,
  muted: false,
  volume: 1,
  showControls: true,
  zIndex: 999999,
  theme: 'dark',
};

export class StreamSlice {
  private config: Required<StreamSliceConfig>;
  private apiClient: ApiClient;
  private floatingWindow: FloatingWindow | null = null;
  private playerControls: PlayerControls | null = null;
  private player: IVSPlayerWrapper | null = null;
  private isInitialized = false;
  private playlistUrl: string | null = null;

  private playerState: PlayerState = {
    isPlaying: false,
    isMuted: false,
    volume: 1,
    isFullscreen: false,
    isLoading: true,
    duration: 0,
    currentTime: 0,
    isLive: true,
    quality: 'Auto',
    availableQualities: ['Auto'],
  };

  constructor(config: StreamSliceConfig = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      onReady: config.onReady,
      onPlay: config.onPlay,
      onPause: config.onPause,
      onError: config.onError,
      onClose: config.onClose,
      onResize: config.onResize,
      onMove: config.onMove,
      className: config.className,
    } as Required<StreamSliceConfig>;

    // Always use the hardcoded API URL
    this.apiClient = new ApiClient(API_BASE_URL);
    
    // Set initial player state from config
    this.playerState.volume = this.config.volume;
    this.playerState.isMuted = this.config.muted;
  }

  /**
   * Initialize and show the widget
   */
  public async init(): Promise<void> {
    if (this.isInitialized) {
      console.warn('StreamSlice: Widget is already initialized');
      return;
    }

    // Inject styles
    injectStyles();

    // Get current page URL
    const pageUrl = window.location.href;

    // Fetch playlist from API
    try {
      const response = await this.apiClient.getPlaylist(pageUrl);
      
      if (response.error) {
        this.config.onError?.({
          code: response.error.code,
          message: response.error.error_message_message,
        });
        
        // Still show the widget but with error state
        this.createWidget();
        this.showNoStreamState();
        return;
      }

      if (response.data?.link) {
        this.playlistUrl = response.data.link;
      }

      this.createWidget();
      
      if (this.playlistUrl) {
        await this.loadStream(this.playlistUrl);
      } else {
        this.showNoStreamState();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.config.onError?.({
        code: 'INIT_ERROR',
        message: errorMessage,
      });
      
      // Show widget with error
      this.createWidget();
      this.showNoStreamState();
    }

    this.isInitialized = true;
  }

  private createWidget(): void {
    // Create floating window
    this.floatingWindow = new FloatingWindow({
      position: this.config.position,
      size: this.config.size,
      minSize: this.config.minSize,
      maxSize: this.config.maxSize,
      zIndex: this.config.zIndex,
      theme: this.config.theme,
      className: this.config.className,
      onClose: () => this.handleClose(),
      onResize: (size) => this.config.onResize?.(size),
      onMove: (position) => this.config.onMove?.(position),
    });

    // Create player controls
    if (this.config.showControls) {
      this.playerControls = new PlayerControls(
        this.floatingWindow.getControlsContainer(),
        {
          onPlayPause: () => this.togglePlayPause(),
          onMuteToggle: () => this.toggleMute(),
          onVolumeChange: (volume) => this.setVolume(volume),
          onFullscreenToggle: () => this.toggleFullscreen(),
          onQualityChange: (quality) => this.setQuality(quality),
        }
      );
      
      // Update controls with initial state
      this.playerControls.updateState(this.playerState);
      this.playerControls.setEnabled(false); // Disabled until stream loads
    }
  }

  private async loadStream(url: string): Promise<void> {
    if (!this.floatingWindow) return;

    // Create IVS player
    this.player = new IVSPlayerWrapper({
      container: this.floatingWindow.getVideoContainer(),
      autoPlay: this.config.autoPlay,
      muted: this.config.muted,
      volume: this.config.volume,
      onStateChange: (state) => this.handlePlayerStateChange(state),
      onError: (error) => this.config.onError?.(error),
      onReady: () => {
        this.playerControls?.setEnabled(true);
        this.config.onReady?.();
      },
    });

    // Load the stream
    await this.player.load(url);
  }

  private showNoStreamState(): void {
    if (!this.floatingWindow) return;
    
    this.floatingWindow.showLiveBadge(false);
    
    // Show no stream message in video container
    const videoContainer = this.floatingWindow.getVideoContainer();
    videoContainer.innerHTML = `
      <div class="ss-no-stream">
        <svg class="ss-no-stream-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
        </svg>
        <div class="ss-no-stream-text">No stream available</div>
        <div class="ss-no-stream-subtext">Stream is not active for this page</div>
      </div>
    `;
  }

  private handlePlayerStateChange(state: Partial<PlayerState>): void {
    this.playerState = { ...this.playerState, ...state };
    
    // Update controls
    this.playerControls?.updateState(this.playerState);
    
    // Update live badge
    if (state.isLive !== undefined) {
      this.floatingWindow?.showLiveBadge(state.isLive);
    }
    
    // Update available qualities and apply default quality
    if (state.availableQualities) {
      this.playerControls?.setAvailableQualities(state.availableQualities);

      // Auto-select 360p as default quality if available
      if (this.playerState.quality === 'Auto') {
        const target = state.availableQualities.find(q => q.startsWith('360p'));
        if (target) {
          this.setQuality(target);
        }
      }
    }
    
    // Trigger callbacks
    if (state.isPlaying !== undefined) {
      if (state.isPlaying) {
        this.config.onPlay?.();
      } else {
        this.config.onPause?.();
      }
    }
  }

  private handleClose(): void {
    this.destroy();
    this.config.onClose?.();
  }

  /**
   * Play the stream
   */
  public play(): void {
    this.player?.play();
  }

  /**
   * Pause the stream
   */
  public pause(): void {
    this.player?.pause();
  }

  /**
   * Toggle play/pause
   */
  public togglePlayPause(): void {
    this.player?.togglePlayPause();
  }

  /**
   * Set volume (0-1)
   */
  public setVolume(volume: number): void {
    this.player?.setVolume(volume);
    this.playerState.volume = volume;
    this.playerControls?.updateState({ volume });
  }

  /**
   * Get current volume
   */
  public getVolume(): number {
    return this.player?.getVolume() ?? this.playerState.volume;
  }

  /**
   * Mute the player
   */
  public mute(): void {
    this.player?.setMuted(true);
  }

  /**
   * Unmute the player
   */
  public unmute(): void {
    this.player?.setMuted(false);
  }

  /**
   * Toggle mute
   */
  public toggleMute(): void {
    this.player?.toggleMute();
  }

  /**
   * Set quality
   */
  public setQuality(quality: string): void {
    this.player?.setQuality(quality);
    this.playerState.quality = quality;
    this.playerControls?.updateState({ quality });
  }

  /**
   * Get available qualities
   */
  public getQualities(): string[] {
    return this.player?.getQualities() ?? ['Auto'];
  }

  /**
   * Toggle fullscreen
   */
  public toggleFullscreen(): void {
    this.player?.toggleFullscreen();
  }

  /**
   * Set window position
   */
  public setPosition(position: WindowPosition): void {
    this.floatingWindow?.setPosition(position);
  }

  /**
   * Set window size
   */
  public setSize(size: WindowSize): void {
    this.floatingWindow?.setSize(size);
  }

  /**
   * Check if widget is initialized
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current player state
   */
  public getState(): PlayerState {
    return { ...this.playerState };
  }

  /**
   * Show the widget
   */
  public show(): void {
    if (this.floatingWindow) {
      this.floatingWindow.getContainer().style.display = 'flex';
    }
  }

  /**
   * Hide the widget
   */
  public hide(): void {
    if (this.floatingWindow) {
      this.floatingWindow.getContainer().style.display = 'none';
    }
  }

  /**
   * Close and destroy the widget
   */
  public close(): void {
    this.floatingWindow?.close();
  }

  /**
   * Destroy the widget and clean up resources
   */
  public destroy(): void {
    this.player?.destroy();
    this.playerControls?.destroy();
    this.floatingWindow?.destroy();
    
    this.player = null;
    this.playerControls = null;
    this.floatingWindow = null;
    this.isInitialized = false;
    
    // Note: We don't remove styles as other instances might use them
  }

  /**
   * Static method to remove all injected styles
   */
  public static removeStyles(): void {
    removeStyles();
  }
}
