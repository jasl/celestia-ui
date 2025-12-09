# Celestia UI Template

A beautiful, fantasy-themed HTML template for AI chat playgrounds and creative writing applications. Built with **DaisyUI 5**, **Tailwind CSS 4**, and modern web technologies.

![Light Mode](https://img.shields.io/badge/Theme-Light-ffc0cb) ![Dark Mode](https://img.shields.io/badge/Theme-Dark-1a1625)

## ✨ Features

- **Fantasy Aesthetic** - Violet/pink color scheme with glassmorphism effects inspired by iOS/VisionOS
- **Dark/Light Mode** - Seamless theme switching with DaisyUI's native theme system
- **Responsive Design** - Mobile-first approach with collapsible sidebars
- **Modern Stack** - Tailwind CSS 4, DaisyUI 5, Vite 7
- **Animated Backgrounds** - Gradient animations and floating orbs for immersive experience
- **Icon System** - Lucide icons via Iconify plugin
- **Motion Effects** - Smooth animations powered by tailwindcss-motion

## 📸 Preview

### Pages Included

| Page | Description |
|------|-------------|
| `index.html` | Landing page with hero section and feature cards |
| `chat.html` | Main chat interface with character sidebar and parameter settings |
| `auth-login.html` | Login page with social auth options |
| `auth-signup.html` | Registration page |
| `blog-list.html` | Blog listing with featured post |
| `blog-detail.html` | Full article page with comments |
| `settings-profile.html` | User profile settings |
| `settings-password.html` | Password & security settings |

### Theme Preview

**Light Mode**
- Soft pink/violet gradient background
- White glassmorphism panels
- High contrast text

**Dark Mode**
- Deep purple gradient background
- Dark glass panels with subtle borders
- Optimized for low-light environments

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/celestia-ui.git
cd celestia-ui

# Install dependencies
pnpm install
```

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`

### Build

Build for production:

```bash
pnpm build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
```

## 📁 Project Structure

```
celestia-ui/
├── assets/
│   └── app.css          # Main stylesheet with Tailwind & DaisyUI config
├── js/
│   ├── app.js           # Theme controller & utilities
│   └── components/
│       ├── modal.js     # Modal component
│       └── toast.js     # Toast notifications
├── index.html           # Landing page
├── chat.html            # Chat interface
├── auth-login.html      # Login page
├── auth-signup.html     # Signup page
├── blog-list.html       # Blog listing
├── blog-detail.html     # Blog article
├── settings-profile.html
├── settings-password.html
├── vite.config.js       # Vite configuration
└── package.json
```

## 🎨 Customization

### Theme Colors

Edit the theme configuration in `assets/app.css`:

```css
@plugin "daisyui/theme" {
  name: "celestia-light";
  --color-primary: oklch(50% 0.22 280);
  --color-secondary: oklch(55% 0.20 330);
  /* ... other colors */
}
```

### Adding New Pages

1. Create a new HTML file in the root directory
2. Include the theme initialization script in `<head>`:

```html
<script>
  try {
    const theme = localStorage.getItem('__CELESTIA_THEME__');
    const isDark = theme === 'celestia-dark' || 
      (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', isDark ? 'celestia-dark' : 'celestia-light');
  } catch (e) {}
</script>
```

3. Add the page to `vite.config.js` (auto-detected for `.html` files in root)

## 🔤 Typography & Multi-language Support

This template supports **Chinese (中文)**, **Japanese (日本語)**, and **English** with optimized font stacks:

### Font Stack

| Type | Fonts |
|------|-------|
| **Sans-serif** | Inter → Noto Sans JP → Noto Sans SC → System fallbacks |
| **Serif** | Merriweather → Noto Serif JP → Noto Serif SC → System fallbacks |

### CJK Optimization

- Optimized line-height for mixed CJK/Latin text
- Proper punctuation handling with `font-feature-settings`
- Language-specific styles via `:lang()` selectors
- Optional vertical writing mode for Japanese

### Utility Classes

```html
<!-- Optimize CJK punctuation spacing -->
<p class="text-cjk-optimize">中文（括号）和「日本語」の句読点。</p>

<!-- Chinese/Japanese prose with proper indentation -->
<article class="prose-cjk">
  <p>第一段不缩进。</p>
  <p>后续段落自动缩进两个字符。</p>
</article>

<!-- Vertical writing (Japanese) -->
<div class="writing-vertical">縦書きテキスト</div>
```

## 🛠 Tech Stack

- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [DaisyUI 5](https://daisyui.com/) - Component library for Tailwind
- [Vite 7](https://vitejs.dev/) - Next-generation frontend tooling
- [Iconify](https://iconify.design/) - Universal icon framework (Lucide icons)
- [tailwindcss-motion](https://github.com/romboHQ/tailwindcss-motion) - Animation utilities
- [Google Fonts](https://fonts.google.com/) - Inter, Merriweather, Noto Sans/Serif JP & SC

## 📄 License

MIT License - feel free to use this template for personal or commercial projects.
