/**
 * Floating Window Component
 */

import type { WindowPosition, WindowSize, ResizeDirection } from '../types';
import { Icons } from './icons';

export interface FloatingWindowOptions {
  position: WindowPosition;
  size: WindowSize;
  minSize: WindowSize;
  maxSize: WindowSize;
  zIndex: number;
  theme: 'dark' | 'light';
  className?: string;
  onClose?: () => void;
  onResize?: (size: WindowSize) => void;
  onMove?: (position: WindowPosition) => void;
}

export class FloatingWindow {
  private container: HTMLElement;
  private header: HTMLElement;
  private videoContainer: HTMLElement;
  private controlsContainer: HTMLElement;
  
  private options: FloatingWindowOptions;
  private isDragging = false;
  private isResizing = false;
  private resizeDirection: ResizeDirection | null = null;
  private dragOffset = { x: 0, y: 0 };
  private startPos = { x: 0, y: 0 };
  private startSize = { width: 0, height: 0 };
  private startWindowPos = { x: 0, y: 0 };
  private currentPosition: WindowPosition;
  private currentSize: WindowSize;

  constructor(options: FloatingWindowOptions) {
    this.options = options;
    this.currentPosition = { ...options.position };
    this.currentSize = { ...options.size };
    
    this.container = this.createContainer();
    this.header = this.createHeader();
    this.videoContainer = this.createVideoContainer();
    this.controlsContainer = this.createControlsContainer();
    
    this.container.appendChild(this.header);
    this.container.appendChild(this.videoContainer);
    this.container.appendChild(this.controlsContainer);
    
    this.createResizeHandles();
    this.attachEventListeners();
    
    document.body.appendChild(this.container);
    
    // Trigger enter animation
    requestAnimationFrame(() => {
      this.container.classList.add('ss-entering');
      setTimeout(() => this.container.classList.remove('ss-entering'), 300);
    });
  }

  private createContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = `ss-widget ss-theme-${this.options.theme}`;
    if (this.options.className) {
      container.classList.add(this.options.className);
    }
    
    container.style.cssText = `
      left: ${this.currentPosition.x}px;
      top: ${this.currentPosition.y}px;
      width: ${this.currentSize.width}px;
      height: ${this.currentSize.height}px;
      z-index: ${this.options.zIndex};
    `;
    
    return container;
  }

  private createHeader(): HTMLElement {
    const header = document.createElement('div');
    header.className = 'ss-header';
    
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'ss-header-title';
    
    const liveBadge = document.createElement('span');
    liveBadge.className = 'ss-live-badge';
    liveBadge.innerHTML = `<span class="ss-live-dot"></span>LIVE`;
    
    titleWrapper.appendChild(liveBadge);
    
    const actions = document.createElement('div');
    actions.className = 'ss-header-actions';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ss-btn ss-btn-close';
    closeBtn.innerHTML = Icons.close;
    closeBtn.title = 'Close';
    closeBtn.addEventListener('click', () => this.close());
    
    actions.appendChild(closeBtn);
    
    header.appendChild(titleWrapper);
    header.appendChild(actions);
    
    return header;
  }

  private createVideoContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'ss-video-container';
    return container;
  }

  private createControlsContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'ss-controls';
    return container;
  }

  private createResizeHandles(): void {
    const directions: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];
    
    directions.forEach(dir => {
      const handle = document.createElement('div');
      handle.className = `ss-resize-handle ss-resize-${dir}`;
      handle.dataset.direction = dir;
      this.container.appendChild(handle);
    });
  }

  private attachEventListeners(): void {
    // Drag handling
    this.header.addEventListener('mousedown', this.onDragStart.bind(this));
    document.addEventListener('mousemove', this.onDrag.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
    
    // Touch support for drag
    this.header.addEventListener('touchstart', this.onTouchDragStart.bind(this), { passive: false });
    document.addEventListener('touchmove', this.onTouchDrag.bind(this), { passive: false });
    document.addEventListener('touchend', this.onDragEnd.bind(this));
    
    // Resize handling
    this.container.querySelectorAll('.ss-resize-handle').forEach(handle => {
      (handle as HTMLElement).addEventListener('mousedown', this.onResizeStart.bind(this));
    });
    document.addEventListener('mousemove', this.onResize.bind(this));
    document.addEventListener('mouseup', this.onResizeEnd.bind(this));
  }

  private onDragStart(e: MouseEvent): void {
    if ((e.target as HTMLElement).closest('.ss-btn')) return;
    
    this.isDragging = true;
    this.dragOffset = {
      x: e.clientX - this.currentPosition.x,
      y: e.clientY - this.currentPosition.y,
    };
    
    this.container.style.transition = 'none';
  }

  private onTouchDragStart(e: TouchEvent): void {
    if ((e.target as HTMLElement).closest('.ss-btn')) return;
    
    const touch = e.touches[0];
    this.isDragging = true;
    this.dragOffset = {
      x: touch.clientX - this.currentPosition.x,
      y: touch.clientY - this.currentPosition.y,
    };
    
    this.container.style.transition = 'none';
  }

  private onDrag(e: MouseEvent): void {
    if (!this.isDragging) return;
    
    e.preventDefault();
    this.updatePosition(e.clientX - this.dragOffset.x, e.clientY - this.dragOffset.y);
  }

  private onTouchDrag(e: TouchEvent): void {
    if (!this.isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    this.updatePosition(touch.clientX - this.dragOffset.x, touch.clientY - this.dragOffset.y);
  }

  private onDragEnd(): void {
    if (this.isDragging) {
      this.isDragging = false;
      this.container.style.transition = '';
      this.options.onMove?.(this.currentPosition);
    }
  }

  private updatePosition(x: number, y: number): void {
    // Keep window within viewport
    const maxX = window.innerWidth - this.currentSize.width;
    const maxY = window.innerHeight - this.currentSize.height;
    
    this.currentPosition = {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY)),
    };
    
    this.container.style.left = `${this.currentPosition.x}px`;
    this.container.style.top = `${this.currentPosition.y}px`;
  }

  private onResizeStart(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    
    const handle = e.target as HTMLElement;
    this.resizeDirection = handle.dataset.direction as ResizeDirection;
    this.isResizing = true;
    
    this.startPos = { x: e.clientX, y: e.clientY };
    this.startSize = { ...this.currentSize };
    this.startWindowPos = { ...this.currentPosition };
    
    this.container.style.transition = 'none';
  }

  private onResize(e: MouseEvent): void {
    if (!this.isResizing || !this.resizeDirection) return;

    e.preventDefault();

    const deltaX = e.clientX - this.startPos.x;
    const deltaY = e.clientY - this.startPos.y;

    let newWidth = this.startSize.width;
    let newHeight = this.startSize.height;
    let newX = this.startWindowPos.x;
    let newY = this.startWindowPos.y;

    // Calculate new dimensions based on resize direction
    if (this.resizeDirection.includes('e')) {
      newWidth = this.startSize.width + deltaX;
    }
    if (this.resizeDirection.includes('w')) {
      newWidth = this.startSize.width - deltaX;
    }
    if (this.resizeDirection.includes('s')) {
      newHeight = this.startSize.height + deltaY;
    }
    if (this.resizeDirection.includes('n')) {
      newHeight = this.startSize.height - deltaY;
    }

    // Apply constraints
    newWidth = Math.max(this.options.minSize.width, Math.min(newWidth, this.options.maxSize.width));
    newHeight = Math.max(this.options.minSize.height, Math.min(newHeight, this.options.maxSize.height));

    // Adjust position if resizing from left or top
    if (this.resizeDirection.includes('w')) {
      newX = this.startWindowPos.x + (this.startSize.width - newWidth);
    }
    if (this.resizeDirection.includes('n')) {
      newY = this.startWindowPos.y + (this.startSize.height - newHeight);
    }

    this.currentSize = { width: newWidth, height: newHeight };
    this.currentPosition = { x: newX, y: newY };

    this.container.style.width = `${newWidth}px`;
    this.container.style.height = `${newHeight}px`;
    this.container.style.left = `${newX}px`;
    this.container.style.top = `${newY}px`;
  }

  private onResizeEnd(): void {
    if (this.isResizing) {
      this.isResizing = false;
      this.resizeDirection = null;
      this.container.style.transition = '';
      this.options.onResize?.(this.currentSize);
    }
  }

  public getVideoContainer(): HTMLElement {
    return this.videoContainer;
  }

  public getControlsContainer(): HTMLElement {
    return this.controlsContainer;
  }

  public getContainer(): HTMLElement {
    return this.container;
  }

  public setSize(size: WindowSize): void {
    this.currentSize = size;
    this.container.style.width = `${size.width}px`;
    this.container.style.height = `${size.height}px`;
  }

  public setPosition(position: WindowPosition): void {
    this.currentPosition = position;
    this.container.style.left = `${position.x}px`;
    this.container.style.top = `${position.y}px`;
  }

  public showLiveBadge(show: boolean): void {
    const badge = this.header.querySelector('.ss-live-badge') as HTMLElement;
    if (badge) {
      badge.style.display = show ? 'inline-flex' : 'none';
    }
  }

  public close(): void {
    this.container.classList.add('ss-leaving');
    setTimeout(() => {
      this.destroy();
      this.options.onClose?.();
    }, 200);
  }

  public destroy(): void {
    document.removeEventListener('mousemove', this.onDrag.bind(this));
    document.removeEventListener('mouseup', this.onDragEnd.bind(this));
    document.removeEventListener('mousemove', this.onResize.bind(this));
    document.removeEventListener('mouseup', this.onResizeEnd.bind(this));
    
    this.container.remove();
  }
}
