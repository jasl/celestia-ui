import { Controller } from '@hotwired/stimulus'

/**
 * Modal Controller
 * Handles modal open/close, backdrop click, ESC key handling
 */
export default class extends Controller {
  static targets = ['dialog']
  static values = {
    closeOnBackdrop: { type: Boolean, default: true },
    closeOnEscape: { type: Boolean, default: true }
  }

  connect() {
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    document.addEventListener('keydown', this.boundHandleKeydown)
  }

  disconnect() {
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  open(event) {
    const modalId = event?.params?.id || event?.currentTarget?.dataset?.modalOpen
    const modal = modalId ? document.getElementById(modalId) : this.dialogTarget

    if (modal && modal.tagName === 'DIALOG') {
      modal.showModal()

      // Focus first focusable element
      const focusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (focusable) {
        focusable.focus()
      }
    }
  }

  close(event) {
    const modal = event?.target?.closest('dialog.modal') || this.dialogTarget
    if (modal && modal.tagName === 'DIALOG') {
      modal.close()
    }
  }

  backdropClose(event) {
    if (!this.closeOnBackdropValue) return

    const modal = event.target.closest('dialog.modal')
    if (modal && event.target === modal) {
      modal.close()
    }
  }

  handleKeydown(event) {
    if (!this.closeOnEscapeValue) return

    if (event.key === 'Escape') {
      const openModal = document.querySelector('dialog.modal[open]')
      if (openModal) {
        openModal.close()
      }
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
    } = options

    const modalId = 'celestia-confirm-modal-' + Date.now()
    const modal = document.createElement('dialog')
    modal.id = modalId
    modal.className = 'modal'
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
    `

    document.body.appendChild(modal)

    modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      modal.close()
      onConfirm()
    })

    modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      modal.close()
      onCancel()
    })

    modal.addEventListener('close', () => {
      setTimeout(() => modal.remove(), 300)
    })

    modal.showModal()
    return modal
  }

  // Alert modal utility
  alert(message, title = '提示') {
    return new Promise((resolve) => {
      const modalId = 'celestia-alert-modal-' + Date.now()
      const modal = document.createElement('dialog')
      modal.id = modalId
      modal.className = 'modal'
      modal.innerHTML = `
        <div class="modal-box glass-panel rounded-ios">
          <h3 class="text-lg font-bold">${this.escapeHtml(title)}</h3>
          <p class="py-4">${this.escapeHtml(message)}</p>
          <div class="modal-action">
            <button class="btn btn-primary">确定</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop"><button>close</button></form>
      `

      document.body.appendChild(modal)

      modal.querySelector('.btn-primary').addEventListener('click', () => {
        modal.close()
      })

      modal.addEventListener('close', () => {
        setTimeout(() => modal.remove(), 300)
        resolve()
      })

      modal.showModal()
    })
  }

  escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
}
