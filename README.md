# SkillIconsPlus 🚀

**SkillIconsPlus** is an upgraded, high-performance version of the popular [skill-icons](https://github.com/tandpfun/skill-icons) project. It provides a dynamic API and a modern interactive configurator to help developers showcase their tech stack on GitHub profiles and websites with style.

This project builds upon the excellent work of the original [skill-icons](https://github.com/tandpfun/skill-icons) library, which pioneered the standardized developer icon set.

### 🛡️ Inherited from Original `skill-icons`
- **Massive Library**: Access to 400+ meticulously crafted icons for almost every tech stack.
- **Native Themes**: Every icon comes with high-quality Dark and Light variants.
- **Layout Control**: Support for horizontal/vertical layouts via `perline`.
- **Pixel Perfection**: Standardized 256x256 icon grid for perfect alignment.

## 🌟 SkillIconsPlus Upgrades
While the original project provides a solid foundation, **SkillIconsPlus** introduces several major upgrades for a truly modern developer experience:

### 1. Dynamic API-First Architecture
Unlike static implementations, SkillIconsPlus uses a **Next.js Edge-ready API** (`/api/icons`) that generates combined SVGs on the fly. This allows for:
- **Instant Customization**: Change themes or icon layouts simply by updating URL parameters.
- **Combined Requests**: Request multiple icons in a single SVG file to reduce HTTP requests and layout shifts.
- **Per-Line Control**: Precise control over how many icons appear in each row.

### 2. Interactive Configurator & Gallery
A premium, glassmorphic web interface that makes selection a breeze:
- **Live Preview**: See your icon set update in real-time as you select icons or change themes.
- **Searchable Gallery**: Browse through 400+ high-quality icons with a fast, client-side search.
- **One-Click Copy**: Generate Markdown, HTML, or direct URLs for your README with a single click.

### 3. Visual & Technical Robustness
- **ID Unique-ification**: Fixed a critical bug in combined SVGs where icons using masks, gradients, or patterns (like **Firebase**, **BitBucket**, or **Clojure**) would clash. Every icon now has its own isolated ID namespace.
- **Theme Overrides**: Added the ability to force specific icons to a specific theme. For example, the **Excel** icon is configured to always show its mascot in the high-fidelity light variant, regardless of the global theme.
- **SVG Optimization**: Improved extraction logic that cleans up source SVGs and re-wraps them in a standard 256x256 container for perfect alignment.

### 4. New Icons
Added several missing technologies to the library, including:

|      Icon ID       |                         Icon                          |
| :----------------: | :---------------------------------------------------: |
|      `excel`       |    <img src="https://skill-icons-plus.vercel.app/api/icons?i=excel&theme=dark&perline=1" width="48"> |
|      `csv`         |    <img src="https://skill-icons-plus.vercel.app/api/icons?i=csv&theme=dark&perline=1" width="48"> |
|      `bruno`       |     <img src="https://skill-icons-plus.vercel.app/api/icons?i=bruno&theme=dark&perline=1" width="48"> |
|      `pandas`      |       <img src="https://skill-icons-plus.vercel.app/api/icons?i=pandas&theme=dark&perline=1" width="48">       |
|      `vbscript`    |    <img src="https://skill-icons-plus.vercel.app/api/icons?i=vbscript&theme=dark&perline=1" width="48">    |

## 🛠️ Usage

Simply use the provided URL format or visit the [Configurator](https://skill-icons-plus.vercel.app/) to generate your own:

```markdown
![My Skills](https://skill-icons-plus.vercel.app/api/icons?i=js,ts,react,nextjs,tailwindcss,nodejs&theme=dark)
```

### Parameters
- `i`: Comma-separated list of icon IDs (e.g., `js,react,firebase`).
- `theme`: `dark` or `light` (defaults to `dark`).
- `perline`: Number of icons per row (defaults to `15`).

## 🚀 Getting Started

1. Clone the repo.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the configurator at `http://localhost:3000`

---

*SkillIconsPlus is an open-source enhancement project. Original icons belong to their respective owners.*
