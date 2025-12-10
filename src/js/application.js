/**
 * Celestia UI Template
 * Stimulus Application Entry Point
 */

import { Application } from '@hotwired/stimulus'

// Import controllers
import ThemeController from './controllers/theme_controller'
import NavbarController from './controllers/navbar_controller'
import MobileMenuController from './controllers/mobile_menu_controller'
import PasswordToggleController from './controllers/password_toggle_controller'
import FormValidatorController from './controllers/form_validator_controller'
import ModalController from './controllers/modal_controller'
import ToastController from './controllers/toast_controller'
import ChatPanelController from './controllers/chat_panel_controller'
import RangeDisplayController from './controllers/range_display_controller'
import TextareaAutoresizeController from './controllers/textarea_autoresize_controller'
import QuickRepliesController from './controllers/quick_replies_controller'

// Start Stimulus application
const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

// Register controllers
application.register('theme', ThemeController)
application.register('navbar', NavbarController)
application.register('mobile-menu', MobileMenuController)
application.register('password-toggle', PasswordToggleController)
application.register('form-validator', FormValidatorController)
application.register('modal', ModalController)
application.register('toast', ToastController)
application.register('chat-panel', ChatPanelController)
application.register('chat-panel-right', ChatPanelController) // Reuse the same controller for right panel
application.register('range-display', RangeDisplayController)
application.register('textarea-autoresize', TextareaAutoresizeController)
application.register('quick-replies', QuickRepliesController)

// Page enter animation
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter')
})
