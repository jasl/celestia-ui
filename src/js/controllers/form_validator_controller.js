import { Controller } from '@hotwired/stimulus'

/**
 * Form Validator Controller
 * Handles form validation (email, minlength, match)
 */
export default class extends Controller {
  static targets = ['input', 'hint']
  static values = {
    emailPattern: { type: String, default: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
    emailMessage: { type: String, default: '请输入有效的邮箱地址' },
    minlengthMessage: { type: String, default: '至少需要 {min} 个字符' },
    matchMessage: { type: String, default: '两次输入不一致' }
  }

  connect() {
    this.emailRegex = new RegExp(this.emailPatternValue)
  }

  validate(event) {
    this.validateInput(event.target, false)
  }

  validateOnBlur(event) {
    this.validateInput(event.target, true)
  }

  validateInput(input, showError = false) {
    const value = input.value.trim()
    const wrapper = input.closest('label.input, .input-wrapper')
    const hintEl = this.getOrCreateHint(input)

    let isValid = true
    let errorMessage = ''

    // Skip validation if empty and not required
    if (!value && !input.hasAttribute('required')) {
      this.clearValidation(input, wrapper, hintEl)
      return true
    }

    // Email validation
    if (input.type === 'email' && value) {
      if (!this.emailRegex.test(value)) {
        isValid = false
        errorMessage = this.emailMessageValue
      }
    }

    // Minlength validation
    const minlength = input.getAttribute('minlength')
    if (minlength && value && value.length < parseInt(minlength)) {
      isValid = false
      errorMessage = this.minlengthMessageValue.replace('{min}', minlength)
    }

    // Match validation (for password confirmation)
    const matchTarget = input.dataset.match
    if (matchTarget && value) {
      const target = document.getElementById(matchTarget)
      if (target && value !== target.value) {
        isValid = false
        errorMessage = this.matchMessageValue
      }
    }

    // Apply validation state
    if (value) {
      this.applyValidationState(input, wrapper, hintEl, isValid, errorMessage, showError)
    } else {
      this.clearValidation(input, wrapper, hintEl)
    }

    return isValid
  }

  getOrCreateHint(input) {
    const fieldset = input.closest('fieldset')
    let hint = fieldset?.querySelector('.validator-hint')

    if (!hint && fieldset) {
      hint = document.createElement('p')
      hint.className = 'validator-hint text-xs mt-1 transition-all duration-200'
      const labelWrapper = fieldset.querySelector('label.input')
      if (labelWrapper) {
        labelWrapper.after(hint)
      }
    }

    return hint
  }

  applyValidationState(input, wrapper, hintEl, isValid, errorMessage, showError) {
    // Remove existing states
    input.classList.remove('input-error', 'input-success')
    wrapper?.classList.remove('input-error', 'input-success')

    if (isValid) {
      input.classList.add('input-success')
      wrapper?.classList.add('input-success')
      if (hintEl) {
        hintEl.textContent = ''
        hintEl.classList.remove('text-error', 'opacity-100')
        hintEl.classList.add('opacity-0')
      }
    } else if (showError) {
      input.classList.add('input-error')
      wrapper?.classList.add('input-error')
      if (hintEl) {
        hintEl.textContent = errorMessage
        hintEl.classList.remove('opacity-0')
        hintEl.classList.add('text-error', 'opacity-100')
      }
    }
  }

  clearValidation(input, wrapper, hintEl) {
    input.classList.remove('input-error', 'input-success')
    wrapper?.classList.remove('input-error', 'input-success')
    if (hintEl) {
      hintEl.textContent = ''
      hintEl.classList.remove('text-error', 'opacity-100')
      hintEl.classList.add('opacity-0')
    }
  }

  // Validate entire form
  validateForm(event) {
    const form = event.target.closest('form') || this.element
    const inputs = form.querySelectorAll('input[type="email"], input[data-validate], input[data-match]')
    let isFormValid = true

    inputs.forEach(input => {
      if (!this.validateInput(input, true)) {
        isFormValid = false
      }
    })

    if (!isFormValid) {
      event.preventDefault()
    }

    return isFormValid
  }
}
