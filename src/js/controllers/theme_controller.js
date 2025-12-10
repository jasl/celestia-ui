import { Controller } from '@hotwired/stimulus'

/**
 * Theme Controller
 * Handles theme switching (light/dark/system) with localStorage persistence
 */
export default class extends Controller {
  static targets = ['sunIcon', 'moonIcon', 'radio']
  static values = {
    storageKey: { type: String, default: '__CELESTIA_THEME__' },
    lightTheme: { type: String, default: 'celestia-light' },
    darkTheme: { type: String, default: 'celestia-dark' }
  }

  connect() {
    this.currentTheme = this.loadTheme()
    this.applyTheme(this.currentTheme)
    this.updateUI()
    this.bindSystemThemeChange()
  }

  disconnect() {
    this.mediaQuery?.removeEventListener('change', this.handleSystemThemeChange)
  }

  loadTheme() {
    try {
      const saved = localStorage.getItem(this.storageKeyValue)
      if (saved && [this.lightThemeValue, this.darkThemeValue, 'system'].includes(saved)) {
        return saved
      }
    } catch (e) {
      console.warn('Failed to load theme from localStorage:', e)
    }
    return 'system'
  }

  saveTheme(theme) {
    try {
      localStorage.setItem(this.storageKeyValue, theme)
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e)
    }
  }

  getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? this.darkThemeValue
      : this.lightThemeValue
  }

  applyTheme(theme) {
    const effectiveTheme = theme === 'system' ? this.getSystemTheme() : theme
    document.documentElement.setAttribute('data-theme', effectiveTheme)
    this.currentTheme = theme
    this.saveTheme(theme)
  }

  toggle() {
    const isDark = this.currentTheme === this.darkThemeValue ||
      (this.currentTheme === 'system' && this.getSystemTheme() === this.darkThemeValue)
    this.setTheme(isDark ? this.lightThemeValue : this.darkThemeValue)
  }

  setTheme(theme) {
    this.applyTheme(theme)
    this.updateUI()

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme: this.currentTheme }
    }))
  }

  updateUI() {
    const effectiveTheme = this.currentTheme === 'system'
      ? this.getSystemTheme()
      : this.currentTheme
    const isDark = effectiveTheme === this.darkThemeValue

    // Update all theme toggle buttons in the document
    document.querySelectorAll('[data-theme-target="sunIcon"]').forEach(icon => {
      icon.classList.toggle('hidden', !isDark)
      icon.classList.toggle('block', isDark)
    })

    document.querySelectorAll('[data-theme-target="moonIcon"]').forEach(icon => {
      icon.classList.toggle('hidden', isDark)
      icon.classList.toggle('block', !isDark)
    })

    // Update radio buttons if present
    this.radioTargets.forEach(radio => {
      radio.checked = radio.value === this.currentTheme
    })
  }

  // Handle radio button change
  selectTheme(event) {
    this.setTheme(event.target.value)
  }

  bindSystemThemeChange() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    this.handleSystemThemeChange = () => {
      if (this.currentTheme === 'system') {
        this.applyTheme('system')
        this.updateUI()
      }
    }
    this.mediaQuery.addEventListener('change', this.handleSystemThemeChange)
  }
}
