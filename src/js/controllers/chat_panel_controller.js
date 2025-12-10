import { Controller } from '@hotwired/stimulus'

/**
 * Chat Panel Controller
 * Handles sidebar panel toggle for chat page
 */
export default class extends Controller {
  static targets = ['panel', 'overlay']
  static values = {
    visible: { type: String, default: 'auto' },
    breakpoint: { type: Number, default: 1024 }
  }

  connect() {
    this.boundHandleResize = this.handleResize.bind(this)
    window.addEventListener('resize', this.boundHandleResize)
  }

  disconnect() {
    window.removeEventListener('resize', this.boundHandleResize)
  }

  toggle() {
    const isLargeScreen = window.innerWidth >= this.breakpointValue
    const currentState = this.panelTarget.dataset.visible

    if (isLargeScreen) {
      // Desktop: toggle between 'true' and 'false'
      this.panelTarget.dataset.visible = currentState === 'false' ? 'true' : 'false'
    } else {
      // Mobile: toggle with overlay
      if (currentState === 'true') {
        this.panelTarget.dataset.visible = 'false'
        this.updateOverlay()
      } else {
        this.panelTarget.dataset.visible = 'true'
        if (this.hasOverlayTarget) {
          this.overlayTarget.classList.remove('hidden')
        }
      }
    }
  }

  close() {
    if (window.innerWidth < this.breakpointValue) {
      this.panelTarget.dataset.visible = 'false'
    }
    this.updateOverlay()
  }

  updateOverlay() {
    if (!this.hasOverlayTarget) return

    // Check if ANY chat sidebar panel is open on mobile
    // This handles the shared overlay between multiple panel controllers
    const anyPanelOpen = Array.from(document.querySelectorAll('.chat-sidebar')).some(panel => {
      return panel.dataset.visible === 'true'
    }) && window.innerWidth < this.breakpointValue

    if (!anyPanelOpen) {
      this.overlayTarget.classList.add('hidden')
    }
  }

  handleResize() {
    // Reset to auto on resize (restore responsive behavior)
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(() => {
      this.panelTarget.dataset.visible = 'auto'
      this.updateOverlay()
    }, 150)
  }
}
