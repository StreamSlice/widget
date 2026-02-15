/**
 * Amazon IVS Player Wrapper
 */

import type { PlayerState, PlayerEvent, PlayerEventType } from '../types';
import { Icons } from '../ui/icons';

// IVS Player types (simplified for our use case)
declare global {
  interface Window {
    IVSPlayer?: any;
  }
}

export interface IVSPlayerOptions {
  container: HTMLElement;
  autoPlay?: boolean;
  muted?: boolean;
  volume?: number;
  onStateChange?: (state: Partial<PlayerState>) => void;
  onError?: (error: { code: string; message: string }) => void;
  onReady?: () => void;
}

export class IVSPlayerWrapper {
  private container: HTMLElement;
  private videoElement: HTMLVideoElement | null = null;
  private player: any = null;
  private options: IVSPlayerOptions;
  private isPlayerReady = false;
  private loadingOverlay: HTMLElement | null = null;
  private errorOverlay: HTMLElement | null = null;
  private currentPlaybackUrl: string | null = null;

  constructor(options: IVSPlayerOptions) {
    this.options = options;
    this.container = options.container;
    this.init();
  }

  private async init(): Promise<void> {
    this.showLoading('Initializing player...');
    
    try {
      // Check if IVS Player SDK is loaded
      if (!window.IVSPlayer) {
        // Try to load the IVS Player SDK dynamically
        await this.loadIVSPlayerSDK();
      }

      if (!window.IVSPlayer?.isPlayerSupported) {
        throw new Error('IVS Player is not supported in this browser');
      }

      this.createVideoElement();
      this.initializePlayer();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize player';
      this.showError(errorMessage);
      this.options.onError?.({ code: 'INIT_ERROR', message: errorMessage });
    }
  }

  private loadIVSPlayerSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.IVSPlayer) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://player.live-video.net/1.24.0/amazon-ivs-player.min.js';
      script.async = true;
      script.onload = () => {
        if (window.IVSPlayer) {
          resolve();
        } else {
          reject(new Error('IVS Player SDK loaded but not available'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load IVS Player SDK'));
      document.head.appendChild(script);
    });
  }

  private createVideoElement(): void {
    this.videoElement = document.createElement('video');
    this.videoElement.playsInline = true;
    this.videoElement.muted = this.options.muted ?? false;
    this.container.appendChild(this.videoElement);
  }

  private initializePlayer(): void {
    if (!window.IVSPlayer || !this.videoElement) return;

    const { create, PlayerState, PlayerEventType } = window.IVSPlayer;
    
    this.player = create({
      wasmWorker: 'https://player.live-video.net/1.24.0/amazon-ivs-wasmworker.min.js',
      wasmBinary: 'https://player.live-video.net/1.24.0/amazon-ivs-wasmworker.min.wasm',
    });

    this.player.attachHTMLVideoElement(this.videoElement);

    // Set initial volume
    this.player.setVolume(this.options.volume ?? 1);
    this.player.setMuted(this.options.muted ?? false);

    // Event listeners
    this.player.addEventListener(PlayerState.READY, () => {
      this.isPlayerReady = true;
      this.hideLoading();
      this.hideError();
      this.updateQualities();
      this.options.onReady?.();
      this.options.onStateChange?.({ isLoading: false });
    });

    this.player.addEventListener(PlayerState.PLAYING, () => {
      this.hideLoading();
      this.options.onStateChange?.({ isPlaying: true, isLoading: false });
    });

    this.player.addEventListener(PlayerState.ENDED, () => {
      this.options.onStateChange?.({ isPlaying: false });
    });

    this.player.addEventListener(PlayerState.IDLE, () => {
      this.options.onStateChange?.({ isPlaying: false });
    });

    this.player.addEventListener(PlayerState.BUFFERING, () => {
      this.showLoading('Buffering...');
      this.options.onStateChange?.({ isLoading: true });
    });

    this.player.addEventListener(PlayerEventType.ERROR, (error: any) => {
      const errorMessage = error?.message || 'Playback error';
      this.showError(errorMessage);
      this.options.onError?.({ code: 'PLAYBACK_ERROR', message: errorMessage });
    });

    this.player.addEventListener(PlayerEventType.QUALITY_CHANGED, () => {
      const quality = this.player.getQuality();
      const label = quality ? this.formatQualityLabel(quality) : 'Auto';
      this.options.onStateChange?.({ quality: label });
    });
  }

  public async load(playbackUrl: string): Promise<void> {
    this.currentPlaybackUrl = playbackUrl;
    this.showLoading('Loading stream...');

    if (!this.player) {
      // Wait for player to initialize
      await new Promise<void>((resolve) => {
        const checkPlayer = setInterval(() => {
          if (this.player) {
            clearInterval(checkPlayer);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkPlayer);
          resolve();
        }, 10000);
      });
    }

    if (!this.player) {
      this.showError('Player not initialized');
      return;
    }

    try {
      this.player.load(playbackUrl);
      
      if (this.options.autoPlay) {
        await this.play();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load stream';
      this.showError(errorMessage);
      this.options.onError?.({ code: 'LOAD_ERROR', message: errorMessage });
    }
  }

  public async play(): Promise<void> {
    if (!this.player) return;
    
    try {
      await this.player.play();
    } catch (error) {
      // Auto-play might be blocked, try muted
      if (this.player) {
        this.player.setMuted(true);
        await this.player.play();
        this.options.onStateChange?.({ isMuted: true });
      }
    }
  }

  public pause(): void {
    if (!this.player) return;
    this.player.pause();
    this.options.onStateChange?.({ isPlaying: false });
  }

  public togglePlayPause(): void {
    if (!this.player) return;
    
    if (this.player.isPaused()) {
      this.play();
    } else {
      this.pause();
    }
  }

  public setVolume(volume: number): void {
    if (!this.player) return;
    this.player.setVolume(Math.max(0, Math.min(1, volume)));
    this.options.onStateChange?.({ volume, isMuted: volume === 0 });
  }

  public getVolume(): number {
    return this.player?.getVolume() ?? 1;
  }

  public setMuted(muted: boolean): void {
    if (!this.player) return;
    this.player.setMuted(muted);
    this.options.onStateChange?.({ isMuted: muted });
  }

  public toggleMute(): void {
    if (!this.player) return;
    const isMuted = this.player.isMuted();
    this.setMuted(!isMuted);
  }

  public setQuality(qualityLabel: string): void {
    if (!this.player) return;

    if (qualityLabel === 'Auto') {
      this.player.setAutoQualityMode(true);
      return;
    }

    const qualities = this.player.getQualities();
    const selectedQuality = qualities.find((q: any) => this.formatQualityLabel(q) === qualityLabel);

    if (selectedQuality) {
      this.player.setAutoQualityMode(false);
      this.player.setQuality(selectedQuality);
    }
  }

  public getQualities(): string[] {
    if (!this.player) return ['Auto'];

    const qualities = this.player.getQualities();
    return ['Auto', ...qualities.map((q: any) => this.formatQualityLabel(q))];
  }

  private formatQualityLabel(quality: any): string {
    const height = quality.height;
    const fps = quality.framerate ? Math.round(quality.framerate) : null;
    let label = height ? `${height}p` : quality.name;
    if (fps && fps > 30) {
      label += `${fps}`;
    }
    return label;
  }

  private updateQualities(): void {
    const qualities = this.getQualities();
    this.options.onStateChange?.({ availableQualities: qualities });
  }

  public async enterFullscreen(): Promise<void> {
    try {
      if (this.container.requestFullscreen) {
        await this.container.requestFullscreen();
      } else if ((this.container as any).webkitRequestFullscreen) {
        await (this.container as any).webkitRequestFullscreen();
      }
      this.options.onStateChange?.({ isFullscreen: true });
    } catch (error) {
      console.warn('Fullscreen not supported or denied');
    }
  }

  public async exitFullscreen(): Promise<void> {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      this.options.onStateChange?.({ isFullscreen: false });
    } catch (error) {
      console.warn('Exit fullscreen failed');
    }
  }

  public toggleFullscreen(): void {
    if (document.fullscreenElement) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  public isPlaying(): boolean {
    return this.player ? !this.player.isPaused() : false;
  }

  public isMuted(): boolean {
    return this.player?.isMuted() ?? false;
  }

  private showLoading(text: string = 'Loading...'): void {
    this.hideError();
    
    if (!this.loadingOverlay) {
      this.loadingOverlay = document.createElement('div');
      this.loadingOverlay.className = 'ss-loading';
      this.container.appendChild(this.loadingOverlay);
    }
    
    this.loadingOverlay.innerHTML = `
      <div class="ss-spinner"></div>
      <div class="ss-loading-text">${text}</div>
    `;
    this.loadingOverlay.style.display = 'flex';
  }

  private hideLoading(): void {
    if (this.loadingOverlay) {
      this.loadingOverlay.style.display = 'none';
    }
  }

  private showError(message: string): void {
    this.hideLoading();
    
    if (!this.errorOverlay) {
      this.errorOverlay = document.createElement('div');
      this.errorOverlay.className = 'ss-error';
      this.container.appendChild(this.errorOverlay);
    }
    
    this.errorOverlay.innerHTML = `
      <div class="ss-error-icon">${Icons.error}</div>
      <div class="ss-error-message">${message}</div>
      <button class="ss-error-retry">Retry</button>
    `;
    this.errorOverlay.style.display = 'flex';
    
    const retryBtn = this.errorOverlay.querySelector('.ss-error-retry');
    retryBtn?.addEventListener('click', () => {
      if (this.currentPlaybackUrl) {
        this.load(this.currentPlaybackUrl);
      }
    });
  }

  private hideError(): void {
    if (this.errorOverlay) {
      this.errorOverlay.style.display = 'none';
    }
  }

  public showNoStream(): void {
    this.hideLoading();
    this.hideError();
    
    const noStreamOverlay = document.createElement('div');
    noStreamOverlay.className = 'ss-no-stream';
    noStreamOverlay.innerHTML = `
      <div class="ss-no-stream-icon">${Icons.video}</div>
      <div class="ss-no-stream-text">No stream available</div>
      <div class="ss-no-stream-subtext">Stream has not started yet</div>
    `;
    this.container.appendChild(noStreamOverlay);
  }

  public destroy(): void {
    if (this.player) {
      this.player.pause();
      this.player.delete();
      this.player = null;
    }
    
    if (this.videoElement) {
      this.videoElement.remove();
      this.videoElement = null;
    }
    
    this.loadingOverlay?.remove();
    this.errorOverlay?.remove();
  }
}
