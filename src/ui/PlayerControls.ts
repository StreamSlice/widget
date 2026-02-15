/**
 * Player Controls Component
 */

import type { PlayerState } from '../types';
import { Icons } from './icons';

export interface PlayerControlsOptions {
  onPlayPause?: () => void;
  onMuteToggle?: () => void;
  onVolumeChange?: (volume: number) => void;
  onFullscreenToggle?: () => void;
  onQualityChange?: (quality: string) => void;
}

export class PlayerControls {
  private container: HTMLElement;
  private options: PlayerControlsOptions;
  private state: PlayerState;
  
  private playBtn!: HTMLButtonElement;
  private muteBtn!: HTMLButtonElement;
  private volumeSlider!: HTMLInputElement;
  private fullscreenBtn!: HTMLButtonElement;
  private qualityBtn!: HTMLButtonElement;
  private qualityMenu!: HTMLElement;
  
  constructor(container: HTMLElement, options: PlayerControlsOptions) {
    this.container = container;
    this.options = options;
    this.state = {
      isPlaying: false,
      isMuted: false,
      volume: 1,
      isFullscreen: false,
      isLoading: true,
      duration: 0,
      currentTime: 0,
      isLive: true,
      quality: 'auto',
      availableQualities: [],
    };
    
    this.render();
  }

  private render(): void {
    this.container.innerHTML = '';
    
    // Left controls
    const leftControls = document.createElement('div');
    leftControls.className = 'ss-controls-left';
    
    // Play/Pause button
    this.playBtn = this.createButton('ss-control-btn ss-play-btn', Icons.play, 'Play');
    this.playBtn.addEventListener('click', () => this.options.onPlayPause?.());
    leftControls.appendChild(this.playBtn);
    
    // Volume controls
    const volumeWrapper = document.createElement('div');
    volumeWrapper.className = 'ss-volume-wrapper';
    
    this.muteBtn = this.createButton('ss-control-btn ss-mute-btn', Icons.volumeHigh, 'Mute');
    this.muteBtn.addEventListener('click', () => this.options.onMuteToggle?.());
    
    this.volumeSlider = document.createElement('input');
    this.volumeSlider.type = 'range';
    this.volumeSlider.className = 'ss-volume-slider';
    this.volumeSlider.min = '0';
    this.volumeSlider.max = '1';
    this.volumeSlider.step = '0.1';
    this.volumeSlider.value = '1';
    this.volumeSlider.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.options.onVolumeChange?.(parseFloat(target.value));
    });
    
    volumeWrapper.appendChild(this.muteBtn);
    volumeWrapper.appendChild(this.volumeSlider);
    leftControls.appendChild(volumeWrapper);
    
    // Right controls
    const rightControls = document.createElement('div');
    rightControls.className = 'ss-controls-right';
    
    // Quality selector
    const qualityWrapper = document.createElement('div');
    qualityWrapper.className = 'ss-quality-wrapper';
    
    this.qualityBtn = document.createElement('button');
    this.qualityBtn.className = 'ss-quality-btn';
    this.qualityBtn.innerHTML = `Auto ${Icons.chevronDown}`;
    this.qualityBtn.addEventListener('click', () => this.toggleQualityMenu());
    
    this.qualityMenu = document.createElement('div');
    this.qualityMenu.className = 'ss-quality-menu';
    
    qualityWrapper.appendChild(this.qualityBtn);
    qualityWrapper.appendChild(this.qualityMenu);
    rightControls.appendChild(qualityWrapper);
    
    // Fullscreen button
    this.fullscreenBtn = this.createButton('ss-control-btn ss-fullscreen-btn', Icons.fullscreen, 'Fullscreen');
    this.fullscreenBtn.addEventListener('click', () => this.options.onFullscreenToggle?.());
    rightControls.appendChild(this.fullscreenBtn);
    
    this.container.appendChild(leftControls);
    this.container.appendChild(rightControls);
    
    // Close quality menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!qualityWrapper.contains(e.target as Node)) {
        this.qualityMenu.classList.remove('ss-open');
      }
    });
  }

  private createButton(className: string, icon: string, title: string): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = className;
    btn.innerHTML = icon;
    btn.title = title;
    return btn;
  }

  private toggleQualityMenu(): void {
    this.qualityMenu.classList.toggle('ss-open');
  }

  public updateState(newState: Partial<PlayerState>): void {
    this.state = { ...this.state, ...newState };
    this.updateUI();
  }

  private updateUI(): void {
    // Update play button
    this.playBtn.innerHTML = this.state.isPlaying ? Icons.pause : Icons.play;
    this.playBtn.title = this.state.isPlaying ? 'Pause' : 'Play';
    
    // Update mute button and volume
    if (this.state.isMuted || this.state.volume === 0) {
      this.muteBtn.innerHTML = Icons.volumeMute;
      this.muteBtn.title = 'Unmute';
    } else if (this.state.volume < 0.5) {
      this.muteBtn.innerHTML = Icons.volumeLow;
      this.muteBtn.title = 'Mute';
    } else {
      this.muteBtn.innerHTML = Icons.volumeHigh;
      this.muteBtn.title = 'Mute';
    }
    
    this.volumeSlider.value = this.state.isMuted ? '0' : String(this.state.volume);
    
    // Update fullscreen button
    this.fullscreenBtn.innerHTML = this.state.isFullscreen ? Icons.fullscreenExit : Icons.fullscreen;
    this.fullscreenBtn.title = this.state.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen';
    
    // Update quality button (show short label without bitrate)
    const shortQuality = this.state.quality.replace(/\s*\(.*\)/, '');
    this.qualityBtn.innerHTML = `${shortQuality} ${Icons.chevronDown}`;
  }

  public setAvailableQualities(qualities: string[]): void {
    this.state.availableQualities = qualities;
    this.renderQualityMenu();
  }

  private renderQualityMenu(): void {
    this.qualityMenu.innerHTML = '';

    this.state.availableQualities.forEach(quality => {
      const option = document.createElement('button');
      option.className = 'ss-quality-option';
      const isActive = quality === this.state.quality;
      if (isActive) {
        option.classList.add('ss-active');
      }
      option.innerHTML = `<span class="ss-quality-check">${isActive ? '&#10003;' : ''}</span><span>${quality}</span>`;
      option.addEventListener('click', () => {
        this.state.quality = quality;
        this.options.onQualityChange?.(quality);
        this.qualityMenu.classList.remove('ss-open');
        this.updateUI();
        this.renderQualityMenu();
      });
      this.qualityMenu.appendChild(option);
    });
  }

  public setEnabled(enabled: boolean): void {
    this.playBtn.disabled = !enabled;
    this.muteBtn.disabled = !enabled;
    this.volumeSlider.disabled = !enabled;
    this.fullscreenBtn.disabled = !enabled;
    this.qualityBtn.disabled = !enabled;
  }

  public destroy(): void {
    this.container.innerHTML = '';
  }
}
