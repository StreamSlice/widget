/**
 * StreamSlice Widget Styles
 */

export const STYLES = `
/* StreamSlice Widget Styles */
.ss-widget {
  --ss-primary: #6366f1;
  --ss-primary-hover: #4f46e5;
  --ss-bg: #1a1a2e;
  --ss-bg-secondary: #16213e;
  --ss-text: #ffffff;
  --ss-text-secondary: #a0aec0;
  --ss-border: #003049;
  --ss-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  --ss-radius: 12px;
  --ss-transition: all 0.2s ease;

  position: fixed;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--ss-bg);
  border-radius: var(--ss-radius);
  box-shadow: var(--ss-shadow);
  overflow: hidden;
  user-select: none;
  display: flex;
  flex-direction: column;
}

.ss-widget.ss-theme-light {
  --ss-bg: #ffffff;
  --ss-bg-secondary: #f7fafc;
  --ss-text: #1a202c;
  --ss-text-secondary: #718096;
  --ss-border: #e2e8f0;
  --ss-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}

/* Header / Drag Handle */
.ss-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--ss-bg-secondary);
  cursor: grab;
  border-bottom: 1px solid var(--ss-border);
}

.ss-header:active {
  cursor: grabbing;
}

.ss-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ss-text);
  font-size: 13px;
  font-weight: 600;
}

.ss-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
  animation: ss-pulse 2s infinite;
}

@keyframes ss-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.ss-live-dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}

.ss-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ss-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--ss-text-secondary);
  cursor: pointer;
  transition: var(--ss-transition);
}

.ss-btn:hover {
  background: var(--ss-border);
  color: var(--ss-text);
}

.ss-btn svg {
  width: 16px;
  height: 16px;
}

.ss-btn-close:hover {
  background: #ef4444;
  color: white;
}

/* Video Container */
.ss-video-container {
  position: relative;
  flex: 1;
  min-height: 0;
  background: #000;
  overflow: hidden;
}

.ss-video-container video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Loading Overlay */
.ss-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: var(--ss-text);
  gap: 12px;
}

.ss-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--ss-border);
  border-top-color: var(--ss-primary);
  border-radius: 50%;
  animation: ss-spin 1s linear infinite;
}

@keyframes ss-spin {
  to { transform: rotate(360deg); }
}

.ss-loading-text {
  font-size: 13px;
  color: var(--ss-text-secondary);
}

/* Error Overlay */
.ss-error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  color: var(--ss-text);
  padding: 20px;
  text-align: center;
  gap: 12px;
}

.ss-error-icon {
  width: 48px;
  height: 48px;
  color: #ef4444;
}

.ss-error-message {
  font-size: 14px;
  color: var(--ss-text-secondary);
  max-width: 280px;
}

.ss-error-retry {
  padding: 8px 16px;
  background: var(--ss-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--ss-transition);
}

.ss-error-retry:hover {
  background: var(--ss-primary-hover);
}

/* Player Controls */
.ss-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: var(--ss-bg-secondary);
  border-top: 1px solid var(--ss-border);
}

.ss-controls-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ss-controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.ss-control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--ss-text);
  cursor: pointer;
  transition: var(--ss-transition);
}

.ss-control-btn:hover {
  background: var(--ss-border);
}

.ss-control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ss-control-btn svg {
  width: 18px;
  height: 18px;
}

/* Volume Control */
.ss-volume-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ss-volume-slider {
  width: 60px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--ss-border);
  border-radius: 2px;
  cursor: pointer;
  transition: var(--ss-transition);
}

.ss-volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: var(--ss-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: var(--ss-transition);
}

.ss-volume-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.ss-volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--ss-primary);
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

/* Quality Selector */
.ss-quality-wrapper {
  position: relative;
}

.ss-quality-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--ss-border);
  border: none;
  border-radius: 4px;
  color: var(--ss-text);
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--ss-transition);
}

.ss-quality-btn:hover {
  background: var(--ss-primary);
}

.ss-quality-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 4px;
  min-width: 140px;
  background: var(--ss-bg);
  border: 1px solid var(--ss-border);
  border-radius: 6px;
  box-shadow: var(--ss-shadow);
  overflow: hidden;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: var(--ss-transition);
  z-index: 20;
}

.ss-quality-menu.ss-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.ss-quality-option {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: var(--ss-text);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: var(--ss-transition);
  white-space: nowrap;
}

.ss-quality-check {
  width: 14px;
  font-size: 11px;
  color: var(--ss-primary);
  flex-shrink: 0;
}

.ss-quality-option:hover {
  background: var(--ss-border);
}

.ss-quality-option.ss-active {
  color: var(--ss-primary);
  font-weight: 600;
}

/* Resize Handles */
.ss-resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.ss-resize-n {
  top: 0;
  left: 10px;
  right: 10px;
  height: 6px;
  cursor: n-resize;
}

.ss-resize-s {
  bottom: 0;
  left: 10px;
  right: 10px;
  height: 6px;
  cursor: s-resize;
}

.ss-resize-e {
  top: 10px;
  right: 0;
  bottom: 10px;
  width: 6px;
  cursor: e-resize;
}

.ss-resize-w {
  top: 10px;
  left: 0;
  bottom: 10px;
  width: 6px;
  cursor: w-resize;
}

.ss-resize-ne {
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: ne-resize;
}

.ss-resize-nw {
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  cursor: nw-resize;
}

.ss-resize-se {
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  cursor: se-resize;
}

.ss-resize-sw {
  bottom: 0;
  left: 0;
  width: 12px;
  height: 12px;
  cursor: sw-resize;
}

/* Animations */
.ss-widget.ss-entering {
  animation: ss-enter 0.3s ease-out;
}

.ss-widget.ss-leaving {
  animation: ss-leave 0.2s ease-in forwards;
}

@keyframes ss-enter {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes ss-leave {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

/* No Stream State */
.ss-no-stream {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--ss-bg);
  color: var(--ss-text);
  padding: 20px;
  text-align: center;
  gap: 8px;
}

.ss-no-stream-icon {
  width: 48px;
  height: 48px;
  color: var(--ss-text-secondary);
  opacity: 0.5;
}

.ss-no-stream-text {
  font-size: 14px;
  font-weight: 500;
}

.ss-no-stream-subtext {
  font-size: 12px;
  color: var(--ss-text-secondary);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .ss-widget {
    --ss-radius: 0;
  }
}
`;

export function injectStyles(): void {
  if (document.getElementById('streamslice-styles')) {
    return;
  }

  const styleElement = document.createElement('style');
  styleElement.id = 'streamslice-styles';
  styleElement.textContent = STYLES;
  document.head.appendChild(styleElement);
}

export function removeStyles(): void {
  const styleElement = document.getElementById('streamslice-styles');
  if (styleElement) {
    styleElement.remove();
  }
}
