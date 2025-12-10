import { Controller } from '@hotwired/stimulus'

/**
 * Textarea Autoresize Controller
 * Handles textarea auto height adjustment
 */
export default class extends Controller {
  static values = {
    maxHeight: { type: Number, default: 150 }
  }

  connect() {
    this.resize()
  }

  resize() {
    this.element.style.height = 'auto'
    this.element.style.height = Math.min(this.element.scrollHeight, this.maxHeightValue) + 'px'
  }

  // Handle Enter key to send (Shift+Enter for new line)
  handleKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      this.dispatch('submit', { detail: { value: this.element.value } })
      this.element.value = ''
      this.element.style.height = 'auto'
    }
  }
}
