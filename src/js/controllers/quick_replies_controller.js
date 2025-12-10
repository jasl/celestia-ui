import { Controller } from '@hotwired/stimulus'

/**
 * Quick Replies Controller
 * Handles quick replies expand/collapse
 */
export default class extends Controller {
  static targets = ['wrapper', 'list', 'icon', 'toggle']
  static values = {
    expanded: { type: Boolean, default: false },
    collapsedHeight: { type: Number, default: 32 }
  }

  connect() {
    this.checkOverflow()
    this.boundCheckOverflow = this.checkOverflow.bind(this)
    window.addEventListener('resize', this.boundCheckOverflow)
  }

  disconnect() {
    window.removeEventListener('resize', this.boundCheckOverflow)
  }

  checkOverflow() {
    if (!this.hasListTarget || !this.hasWrapperTarget || !this.hasToggleTarget) return

    // Temporarily remove height constraint to measure actual height
    const originalMaxHeight = this.wrapperTarget.style.maxHeight
    this.wrapperTarget.style.maxHeight = 'none'

    const actualHeight = this.listTarget.scrollHeight

    // Restore height constraint
    this.wrapperTarget.style.maxHeight = originalMaxHeight || this.collapsedHeightValue + 'px'

    // Show toggle button if content overflows the collapsed height
    if (actualHeight > this.collapsedHeightValue) {
      this.toggleTarget.classList.remove('hidden')
    } else {
      this.toggleTarget.classList.add('hidden')
    }

    // Reset to collapsed state on resize
    if (this.expandedValue) {
      this.expandedValue = false
      this.wrapperTarget.style.maxHeight = this.collapsedHeightValue + 'px'
      if (this.hasIconTarget) {
        this.iconTarget.style.transform = 'rotate(0deg)'
      }
    }
  }

  toggle() {
    this.expandedValue = !this.expandedValue
  }

  expandedValueChanged() {
    if (!this.hasWrapperTarget || !this.hasListTarget) return

    if (this.expandedValue) {
      // Expand to show all
      const fullHeight = this.listTarget.scrollHeight
      this.wrapperTarget.style.maxHeight = fullHeight + 'px'
      if (this.hasIconTarget) {
        this.iconTarget.style.transform = 'rotate(180deg)'
      }
      if (this.hasToggleTarget) {
        this.toggleTarget.title = '收起'
      }
    } else {
      // Collapse to single row
      this.wrapperTarget.style.maxHeight = this.collapsedHeightValue + 'px'
      if (this.hasIconTarget) {
        this.iconTarget.style.transform = 'rotate(0deg)'
      }
      if (this.hasToggleTarget) {
        this.toggleTarget.title = '展开'
      }
    }
  }

  // Handle quick reply button click
  select(event) {
    const replyText = event.currentTarget.textContent.trim()
    this.dispatch('selected', { detail: { text: replyText } })
  }
}
