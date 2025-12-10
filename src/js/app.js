/**
 * Celestia UI Template
 * Main JavaScript - Theme Control & Utilities
 */

(function() {
  'use strict';

  // ================================
  // Theme Controller
  // ================================
  const THEME_KEY = '__CELESTIA_THEME__';
  const THEMES = {
    LIGHT: 'celestia-light',
    DARK: 'celestia-dark',
    SYSTEM: 'system'
  };

  class ThemeController {
    constructor() {
      this.currentTheme = this.loadTheme();
      this.init();
    }

    init() {
      this.applyTheme(this.currentTheme);
      this.bindEvents();
      this.updateUI();
    }

    loadTheme() {
      try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved && Object.values(THEMES).includes(saved)) {
          return saved;
        }
      } catch (e) {
        console.warn('Failed to load theme from localStorage:', e);
      }
      return THEMES.SYSTEM;
    }

    saveTheme(theme) {
      try {
        localStorage.setItem(THEME_KEY, theme);
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }
    }

    getSystemTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEMES.DARK 
        : THEMES.LIGHT;
    }

    applyTheme(theme) {
      const effectiveTheme = theme === THEMES.SYSTEM ? this.getSystemTheme() : theme;
      
      // Only set data-theme attribute - CSS handles all styling
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      
      this.currentTheme = theme;
      this.saveTheme(theme);
    }

    toggleTheme() {
      // Simple toggle between light and dark
      const isDark = this.currentTheme === THEMES.DARK || 
        (this.currentTheme === THEMES.SYSTEM && this.getSystemTheme() === THEMES.DARK);
      this.setTheme(isDark ? THEMES.LIGHT : THEMES.DARK);
    }

    setTheme(theme) {
      this.applyTheme(theme);
      this.updateUI();
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('themechange', { 
        detail: { theme: this.currentTheme } 
      }));
    }

    updateUI() {
      const effectiveTheme = this.currentTheme === THEMES.SYSTEM 
        ? this.getSystemTheme() 
        : this.currentTheme;
      const isDark = effectiveTheme === THEMES.DARK;
      
      const buttons = document.querySelectorAll('[data-theme-toggle]');
      buttons.forEach(btn => {
        // Find sun and moon icons
        const sunIcon = btn.querySelector('[data-theme-icon="light"], [data-theme-icon="celestia-light"]');
        const moonIcon = btn.querySelector('[data-theme-icon="dark"], [data-theme-icon="celestia-dark"]');
        
        // Show sun in dark mode (click to go light), show moon in light mode (click to go dark)
        if (sunIcon) {
          sunIcon.classList.toggle('hidden', !isDark);
          sunIcon.classList.toggle('block', isDark);
        }
        if (moonIcon) {
          moonIcon.classList.toggle('hidden', isDark);
          moonIcon.classList.toggle('block', !isDark);
        }
      });

      // Update radio buttons if present
      const radios = document.querySelectorAll('[name="theme-radio"]');
      radios.forEach(radio => {
        radio.checked = radio.value === this.currentTheme;
      });
    }

    bindEvents() {
      // Toggle button
      document.addEventListener('click', (e) => {
        const toggle = e.target.closest('[data-theme-toggle]');
        if (toggle) {
          e.preventDefault();
          this.toggleTheme();
        }
      });

      // Radio buttons
      document.addEventListener('change', (e) => {
        if (e.target.name === 'theme-radio') {
          this.setTheme(e.target.value);
        }
      });

      // System theme change
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (this.currentTheme === THEMES.SYSTEM) {
          this.applyTheme(THEMES.SYSTEM);
        }
      });
    }
  }

  // ================================
  // Navbar Scroll Effect
  // ================================
  class NavbarController {
    constructor() {
      this.navbar = document.querySelector('[data-navbar]');
      if (this.navbar) {
        this.init();
      }
    }

    init() {
      this.updateState();
      window.addEventListener('scroll', () => this.updateState(), { passive: true });
    }

    updateState() {
      const isAtTop = window.scrollY < 10;
      this.navbar.setAttribute('data-at-top', isAtTop);
    }
  }

  // ================================
  // Mobile Menu Controller
  // ================================
  class MobileMenuController {
    constructor() {
      this.toggle = document.querySelector('[data-mobile-menu-toggle]');
      this.menu = document.querySelector('[data-mobile-menu]');
      this.overlay = document.querySelector('[data-mobile-menu-overlay]');
      
      if (this.toggle && this.menu) {
        this.init();
      }
    }

    init() {
      this.toggle.addEventListener('click', () => this.toggleMenu());
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.closeMenu());
      }
      
      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) {
          this.closeMenu();
        }
      });
    }

    isOpen() {
      return this.menu.classList.contains('open');
    }

    toggleMenu() {
      this.isOpen() ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
      this.menu.classList.add('open');
      this.overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    closeMenu() {
      this.menu.classList.remove('open');
      this.overlay?.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ================================
  // Password Toggle
  // ================================
  class PasswordToggle {
    constructor() {
      this.init();
    }

    init() {
      document.addEventListener('click', (e) => {
        const toggle = e.target.closest('button[data-password-toggle]');
        if (toggle) {
          const targetId = toggle.getAttribute('data-password-toggle');
          const input = document.getElementById(targetId);
          if (input) {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            
            // Toggle icon visibility
            const showIcon = toggle.querySelector('[data-show-icon]');
            const hideIcon = toggle.querySelector('[data-hide-icon]');
            if (showIcon && hideIcon) {
              showIcon.classList.toggle('hidden', isPassword);
              hideIcon.classList.toggle('hidden', !isPassword);
            }
          }
        }
      });
    }
  }

  // ================================
  // Smooth Scroll for Anchor Links
  // ================================
  class SmoothScroll {
    constructor() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
          const targetId = link.getAttribute('href').slice(1);
          const target = document.getElementById(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }
  }

  // ================================
  // Form Validator
  // ================================
  class FormValidator {
    constructor() {
      this.validators = {
        email: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入有效的邮箱地址'
        },
        minlength: {
          validate: (value, min) => value.length >= parseInt(min),
          message: (min) => `至少需要 ${min} 个字符`
        },
        match: {
          validate: (value, targetId) => {
            const target = document.getElementById(targetId);
            return target && value === target.value;
          },
          message: '两次输入不一致'
        }
      };
      this.init();
    }

    init() {
      // Listen for input events with debounce
      document.addEventListener('input', (e) => {
        const input = e.target;
        if (input.matches('input[type="email"], input[data-validate], input[data-match]')) {
          this.validateInput(input);
        }
      });

      // Listen for blur events for immediate validation
      document.addEventListener('focusout', (e) => {
        const input = e.target;
        if (input.matches('input[type="email"], input[data-validate], input[data-match]')) {
          this.validateInput(input, true);
        }
      });
    }

    validateInput(input, showError = false) {
      const value = input.value.trim();
      const wrapper = input.closest('label.input, .input-wrapper');
      const hintEl = this.getOrCreateHint(input);
      
      let isValid = true;
      let errorMessage = '';

      // Skip validation if empty and not required
      if (!value && !input.hasAttribute('required')) {
        this.clearValidation(input, wrapper, hintEl);
        return true;
      }

      // Email validation
      if (input.type === 'email' && value) {
        if (!this.validators.email.pattern.test(value)) {
          isValid = false;
          errorMessage = this.validators.email.message;
        }
      }

      // Minlength validation
      const minlength = input.getAttribute('minlength');
      if (minlength && value && value.length < parseInt(minlength)) {
        isValid = false;
        errorMessage = this.validators.minlength.message(minlength);
      }

      // Match validation (for password confirmation)
      const matchTarget = input.getAttribute('data-match');
      if (matchTarget && value) {
        if (!this.validators.match.validate(value, matchTarget)) {
          isValid = false;
          errorMessage = this.validators.match.message;
        }
      }

      // Apply validation state
      if (value) {
        this.applyValidationState(input, wrapper, hintEl, isValid, errorMessage, showError);
      } else {
        this.clearValidation(input, wrapper, hintEl);
      }

      return isValid;
    }

    getOrCreateHint(input) {
      const fieldset = input.closest('fieldset');
      let hint = fieldset?.querySelector('.validator-hint');
      
      if (!hint && fieldset) {
        hint = document.createElement('p');
        hint.className = 'validator-hint text-xs mt-1 transition-all duration-200';
        const labelWrapper = fieldset.querySelector('label.input');
        if (labelWrapper) {
          labelWrapper.after(hint);
        }
      }
      
      return hint;
    }

    applyValidationState(input, wrapper, hintEl, isValid, errorMessage, showError) {
      // Remove existing states
      input.classList.remove('input-error', 'input-success');
      wrapper?.classList.remove('input-error', 'input-success');

      if (isValid) {
        input.classList.add('input-success');
        wrapper?.classList.add('input-success');
        if (hintEl) {
          hintEl.textContent = '';
          hintEl.classList.remove('text-error', 'opacity-100');
          hintEl.classList.add('opacity-0');
        }
      } else if (showError) {
        input.classList.add('input-error');
        wrapper?.classList.add('input-error');
        if (hintEl) {
          hintEl.textContent = errorMessage;
          hintEl.classList.remove('opacity-0');
          hintEl.classList.add('text-error', 'opacity-100');
        }
      }
    }

    clearValidation(input, wrapper, hintEl) {
      input.classList.remove('input-error', 'input-success');
      wrapper?.classList.remove('input-error', 'input-success');
      if (hintEl) {
        hintEl.textContent = '';
        hintEl.classList.remove('text-error', 'opacity-100');
        hintEl.classList.add('opacity-0');
      }
    }

    // Validate entire form
    validateForm(form) {
      const inputs = form.querySelectorAll('input[type="email"], input[data-validate], input[data-match]');
      let isFormValid = true;
      
      inputs.forEach(input => {
        if (!this.validateInput(input, true)) {
          isFormValid = false;
        }
      });
      
      return isFormValid;
    }
  }

  // ================================
  // Initialize on DOM Ready
  // ================================
  function init() {
    window.CelestiaTheme = new ThemeController();
    window.CelestiaValidator = new FormValidator();
    new NavbarController();
    new MobileMenuController();
    new PasswordToggle();
    new SmoothScroll();

    // Page enter animation
    document.body.classList.add('page-enter');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for external use
  window.CelestiaUI = {
    theme: () => window.CelestiaTheme,
    validator: () => window.CelestiaValidator,
    toast: (message, type) => window.CelestiaToast?.show(message, type),
    modal: {
      open: (id) => document.getElementById(id)?.showModal(),
      close: (id) => document.getElementById(id)?.close()
    }
  };

})();

