import { Controller } from '@hotwired/stimulus'

/**
 * Navbar Controller
 * Handles navbar scroll effect (data-at-top attribute)
 */
export default class extends Controller {
  static values = {
    threshold: { type: Number, default: 10 }
  }

  connect() {
    this.updateState()
    this.boundUpdateState = this.updateState.bind(this)
    window.addEventListener('scroll', this.boundUpdateState, { passive: true })
  }

  disconnect() {
    window.removeEventListener('scroll', this.boundUpdateState)
  }

  updateState() {
    const isAtTop = window.scrollY < this.thresholdValue
    this.element.setAttribute('data-at-top', isAtTop)
  }
}
