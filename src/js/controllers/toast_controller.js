import { Controller } from '@hotwired/stimulus'

/**
 * Toast Controller
 * Handles toast notifications with different types
 */

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
}

export default class extends Controller {
  static targets = ['container']
  static values = {
    position: { type: String, default: 'toast-end toast-bottom' },
    duration: { type: Number, default: 4000 }
  }

  connect() {
    this.toasts = []
    this.ensureContainer()
  }

  ensureContainer() {
    if (!this.hasContainerTarget) {
      this.container = document.createElement('div')
      this.container.className = `toast ${this.positionValue} z-[9999]`
      this.container.setAttribute('role', 'alert')
      this.container.setAttribute('aria-live', 'polite')
      this.container.setAttribute('data-toast-target', 'container')
      document.body.appendChild(this.container)
    } else {
      this.container = this.containerTarget
    }
  }

  show(message, type = 'info', duration = null) {
    const config = TOAST_TYPES[type] || TOAST_TYPES.info
    const toastDuration = duration ?? this.durationValue

    const toast = document.createElement('div')
    toast.className = `alert ${config.alertClass} glass-panel shadow-lg toast-enter flex items-center gap-3`
    toast.innerHTML = `
      <span class="iconify ${config.icon} size-5 shrink-0"></span>
      <span class="flex-1">${this.escapeHtml(message)}</span>
      <button class="btn btn-ghost btn-xs btn-circle" aria-label="Close" data-action="click->toast#dismissToast">
        <span class="iconify lucide--x size-4"></span>
      </button>
    `

    // Close button
    const closeBtn = toast.querySelector('button')
    closeBtn.addEventListener('click', () => this.dismiss(toast))

    this.container.appendChild(toast)
    this.toasts.push(toast)

    // Auto dismiss
    if (toastDuration > 0) {
      setTimeout(() => this.dismiss(toast), toastDuration)
    }

    return toast
  }

  dismiss(toast) {
    if (!toast || !toast.parentNode) return

    toast.classList.remove('toast-enter')
    toast.classList.add('toast-exit')

    toast.addEventListener('animationend', () => {
      toast.remove()
      this.toasts = this.toasts.filter(t => t !== toast)
    }, { once: true })
  }

  dismissToast(event) {
    const toast = event.target.closest('.alert')
    if (toast) {
      this.dismiss(toast)
    }
  }

  dismissAll() {
    [...this.toasts].forEach(toast => this.dismiss(toast))
  }

  success(message, duration) {
    return this.show(message, 'success', duration)
  }

  error(message, duration) {
    return this.show(message, 'error', duration)
  }

  warning(message, duration) {
    return this.show(message, 'warning', duration)
  }

  info(message, duration) {
    return this.show(message, 'info', duration)
  }

  escapeHtml(str) {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }
}
