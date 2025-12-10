import { Controller } from '@hotwired/stimulus'

/**
 * Password Toggle Controller
 * Handles password visibility toggle
 */
export default class extends Controller {
  static targets = ['input', 'showIcon', 'hideIcon']

  toggle() {
    const isPassword = this.inputTarget.type === 'password'
    this.inputTarget.type = isPassword ? 'text' : 'password'

    if (this.hasShowIconTarget && this.hasHideIconTarget) {
      this.showIconTarget.classList.toggle('hidden', isPassword)
      this.hideIconTarget.classList.toggle('hidden', !isPassword)
    }
  }
}
