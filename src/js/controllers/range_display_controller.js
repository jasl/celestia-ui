import { Controller } from '@hotwired/stimulus'

/**
 * Range Display Controller
 * Handles range input value real-time display
 */
export default class extends Controller {
  static targets = ['input', 'display']

  connect() {
    this.update()
  }

  update() {
    if (this.hasDisplayTarget && this.hasInputTarget) {
      this.displayTarget.textContent = this.inputTarget.value
    }
  }
}
