/**
 * Celestia UI Template
 * Toast Component
 */

(function() {
  'use strict';

  const TOAST_TYPES = {
    success: {
      icon: 'lucide--check-circle',
      alertClass: 'alert-success'
    },
    error: {
      icon: 'lucide--x-circle',
      alertClass: 'alert-error'
    },
    warning: {
      icon: 'lucide--alert-triangle',
      alertClass: 'alert-warning'
    },
    info: {
      icon: 'lucide--info',
      alertClass: 'alert-info'
    }
  };

  class ToastManager {
    constructor() {
      this.container = null;
      this.toasts = [];
      this.init();
    }

    init() {
      this.createContainer();
    }

    createContainer() {
      this.container = document.createElement('div');
      this.container.className = 'toast toast-end toast-bottom z-[9999]';
      this.container.setAttribute('role', 'alert');
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 4000) {
      const config = TOAST_TYPES[type] || TOAST_TYPES.info;
      
      const toast = document.createElement('div');
      toast.className = `alert ${config.alertClass} glass-panel shadow-lg toast-enter flex items-center gap-3`;
      toast.innerHTML = `
        <span class="iconify ${config.icon} size-5 shrink-0"></span>
        <span class="flex-1">${this.escapeHtml(message)}</span>
        <button class="btn btn-ghost btn-xs btn-circle" aria-label="Close">
          <span class="iconify lucide--x size-4"></span>
        </button>
      `;

      // Close button
      const closeBtn = toast.querySelector('button');
      closeBtn.addEventListener('click', () => this.dismiss(toast));

      this.container.appendChild(toast);
      this.toasts.push(toast);

      // Auto dismiss
      if (duration > 0) {
        setTimeout(() => this.dismiss(toast), duration);
      }

      return toast;
    }

    dismiss(toast) {
      if (!toast || !toast.parentNode) return;

      toast.classList.remove('toast-enter');
      toast.classList.add('toast-exit');

      toast.addEventListener('animationend', () => {
        toast.remove();
        this.toasts = this.toasts.filter(t => t !== toast);
      }, { once: true });
    }

    dismissAll() {
      [...this.toasts].forEach(toast => this.dismiss(toast));
    }

    success(message, duration) {
      return this.show(message, 'success', duration);
    }

    error(message, duration) {
      return this.show(message, 'error', duration);
    }

    warning(message, duration) {
      return this.show(message, 'warning', duration);
    }

    info(message, duration) {
      return this.show(message, 'info', duration);
    }

    escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  // Initialize and expose globally
  function init() {
    window.CelestiaToast = new ToastManager();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

