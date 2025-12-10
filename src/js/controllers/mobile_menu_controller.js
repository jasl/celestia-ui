import { Controller } from '@hotwired/stimulus'

/**
 * Mobile Menu Controller
 * Handles mobile menu open/close with overlay
 */
export default class extends Controller {
  static targets = ['menu', 'overlay']
  static values = {
    open: { type: Boolean, default: false }
  }

  connect() {
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    document.addEventListener('keydown', this.boundHandleKeydown)
  }

  disconnect() {
    document.removeEventListener('keydown', this.boundHandleKeydown)
  }

  toggle() {
    this.openValue = !this.openValue
  }

  open() {
    this.openValue = true
  }

  close() {
    this.openValue = false
  }

  openValueChanged() {
    if (this.openValue) {
      this.menuTarget.classList.add('open')
      if (this.hasOverlayTarget) {
        this.overlayTarget.classList.add('open')
      }
      document.body.style.overflow = 'hidden'
    } else {
      this.menuTarget.classList.remove('open')
      if (this.hasOverlayTarget) {
        this.overlayTarget.classList.remove('open')
      }
      document.body.style.overflow = ''
    }
  }

  handleKeydown(event) {
    if (event.key === 'Escape' && this.openValue) {
      this.close()
    }
  }
}
