/**
 * Celestia UI Template
 * Stimulus Application Entry Point
 */

import { Application } from '@hotwired/stimulus'

// Import controllers
import ThemeController from './controllers/celestia_ui/theme_controller'
import NavbarController from './controllers/celestia_ui/navbar_controller'
import MobileMenuController from './controllers/celestia_ui/mobile_menu_controller'
import PasswordToggleController from './controllers/celestia_ui/password_toggle_controller'
import FormValidatorController from './controllers/celestia_ui/form_validator_controller'
import ModalController from './controllers/celestia_ui/modal_controller'
import ToastController from './controllers/celestia_ui/toast_controller'
import ChatPanelController from './controllers/celestia_ui/chat_panel_controller'
import RangeDisplayController from './controllers/celestia_ui/range_display_controller'
import TextareaAutoresizeController from './controllers/celestia_ui/textarea_autoresize_controller'
import QuickRepliesController from './controllers/celestia_ui/quick_replies_controller'

// Start Stimulus application
const application = Application.start()

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

// Register controllers
application.register('celestia-ui--theme', ThemeController)
application.register('celestia-ui--navbar', NavbarController)
application.register('celestia-ui--mobile-menu', MobileMenuController)
application.register('celestia-ui--password-toggle', PasswordToggleController)
application.register('celestia-ui--form-validator', FormValidatorController)
application.register('celestia-ui--modal', ModalController)
application.register('celestia-ui--toast', ToastController)
application.register('celestia-ui--chat-panel', ChatPanelController)
application.register('celestia-ui--chat-panel-right', ChatPanelController) // Reuse the same controller for right panel
application.register('celestia-ui--range-display', RangeDisplayController)
application.register('celestia-ui--textarea-autoresize', TextareaAutoresizeController)
application.register('celestia-ui--quick-replies', QuickRepliesController)

// Page enter animation
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-enter')
})
