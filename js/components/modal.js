/**
 * Celestia UI Template
 * Modal Component Enhancements
 */

(function() {
  'use strict';

  class ModalManager {
    constructor() {
      this.init();
    }

    init() {
      // Handle click outside to close
      document.addEventListener('click', (e) => {
        const modal = e.target.closest('dialog.modal');
        if (modal && e.target === modal) {
          // Clicked on backdrop
          modal.close();
        }
      });

      // Handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const openModal = document.querySelector('dialog.modal[open]');
          if (openModal) {
            openModal.close();
          }
        }
      });

      // Handle data-modal-open buttons
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-open]');
        if (trigger) {
          const modalId = trigger.getAttribute('data-modal-open');
          this.open(modalId);
        }
      });

      // Handle data-modal-close buttons
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-close]');
        if (trigger) {
          const modal = trigger.closest('dialog.modal');
          if (modal) {
            modal.close();
          }
        }
      });
    }

    open(modalId) {
      const modal = document.getElementById(modalId);
      if (modal && modal.tagName === 'DIALOG') {
        modal.showModal();
        
        // Focus first focusable element
        const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
          focusable.focus();
        }
      }
    }

    close(modalId) {
      const modal = document.getElementById(modalId);
      if (modal && modal.tagName === 'DIALOG') {
        modal.close();
      }
    }

    // Confirm modal utility
    confirm(options = {}) {
      const {
        title = '确认',
        message = '确定要执行此操作吗？',
        confirmText = '确定',
        cancelText = '取消',
        onConfirm = () => {},
        onCancel = () => {}
      } = options;

      // Create modal
      const modalId = 'celestia-confirm-modal-' + Date.now();
      const modal = document.createElement('dialog');
      modal.id = modalId;
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-box glass-panel rounded-ios">
          <h3 class="text-lg font-bold">${this.escapeHtml(title)}</h3>
          <p class="py-4">${this.escapeHtml(message)}</p>
          <div class="modal-action">
            <button class="btn btn-ghost" data-action="cancel">${this.escapeHtml(cancelText)}</button>
            <button class="btn btn-primary" data-action="confirm">${this.escapeHtml(confirmText)}</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop"><button>close</button></form>
      `;

      document.body.appendChild(modal);

      // Handle actions
      modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
        modal.close();
        onConfirm();
      });

      modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
        modal.close();
        onCancel();
      });

      // Clean up after close
      modal.addEventListener('close', () => {
        setTimeout(() => modal.remove(), 300);
      });

      modal.showModal();
      return modal;
    }

    // Alert modal utility
    alert(message, title = '提示') {
      return new Promise((resolve) => {
        const modalId = 'celestia-alert-modal-' + Date.now();
        const modal = document.createElement('dialog');
        modal.id = modalId;
        modal.className = 'modal';
        modal.innerHTML = `
          <div class="modal-box glass-panel rounded-ios">
            <h3 class="text-lg font-bold">${this.escapeHtml(title)}</h3>
            <p class="py-4">${this.escapeHtml(message)}</p>
            <div class="modal-action">
              <button class="btn btn-primary">确定</button>
            </div>
          </div>
          <form method="dialog" class="modal-backdrop"><button>close</button></form>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.btn-primary').addEventListener('click', () => {
          modal.close();
        });

        modal.addEventListener('close', () => {
          setTimeout(() => modal.remove(), 300);
          resolve();
        });

        modal.showModal();
      });
    }

    escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  // Initialize and expose globally
  function init() {
    window.CelestiaModal = new ModalManager();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

