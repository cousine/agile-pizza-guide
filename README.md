# An Agile Product Development Workflow

A comprehensive visual guide to Agile product development, featuring interactive diagrams, team roles, ceremonies, and continuous improvement metrics. Built as a static website with a hand-drawn aesthetic.

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd agile_guide

# Open in browser
open index.html
```

Or simply double-click `index.html` to open it in your default browser.

## Project Structure

```
agile_guide/
├── index.html          # Main HTML structure (1,864 lines)
├── main.css            # Styles with hand-drawn aesthetic (1,563 lines)
├── main.js             # Vanilla JavaScript functionality (317 lines)
├── assets/             # PNG images for roles, work items, metrics
│   ├── po.png          # Product Owner icon
│   ├── sm.png          # Scrum Master icon
│   ├── team.png        # Development Team icon
│   ├── epic.png        # Epic work item
│   ├── user_story.png  # User Story work item
│   ├── task.png        # Task work item
│   ├── sub_task.png    # Sub-task work item
│   ├── dora.png        # DORA metrics icon
│   ├── arrow.png       # Carousel navigation arrow
│   └── ...             # Additional assets
├── LICENSE             # Project license
└── README.md           # This file
```

## Technology Stack

- **HTML5** - Semantic markup with accessibility attributes
- **CSS3** - Custom properties, animations, responsive design
- **Vanilla JavaScript** - No frameworks or dependencies
- **Google Fonts** - Lexend (body text), JetBrains Mono (code)

## Design Aesthetic

The site features a unique hand-drawn visual style:

- **Borders**: 3px solid black borders on all cards and sections
- **Shadows**: Layered box-shadows for depth
- **Filters**: SVG roughen filters for sketched appearance
- **Typography**: Lexend font family for clean readability

### Color Palette

| Color | Hex | Name |
|-------|-----|------|
| ![#fbb03b](https://img.shields.io/badge/-fbb03b-fbb03b?style=flat-square) | `#fbb03b` | Primary (Orange) |
| ![#f54e42](https://img.shields.io/badge/-f54e42-f54e42?style=flat-square) | `#f54e42` | Secondary (Red) |
| ![#1d4ed8](https://img.shields.io/badge/-1d4ed8-1d4ed8?style=flat-square) | `#1d4ed8` | Accent (Blue) |
| ![#10b981](https://img.shields.io/badge/-10b981-10b981?style=flat-square) | `#10b981` | Success (Green) |
| ![#7c3aed](https://img.shields.io/badge/-7c3aed-7c3aed?style=flat-square) | `#7c3aed` | Purple |
| ![#15141a](https://img.shields.io/badge/-15141a-15141a?style=flat-square) | `#15141a` | Text Primary (Dark Gray) |
| ![#6b7280](https://img.shields.io/badge/-6b7280-6b7280?style=flat-square) | `#6b7280` | Text Secondary (Medium Gray) |
| ![#ffffff](https://img.shields.io/badge/-ffffff-ffffff?style=flat-square) | `#ffffff` | Card Background (White) |

## Browser Support

Modern browsers with support for:

- CSS Custom Properties
- CSS Grid & Flexbox
- IntersectionObserver API
- requestAnimationFrame
- ES6+ JavaScript

## Contributing

This is a static educational resource. If you'd like to contribute:

1. Fork the repository
2. Make your changes
3. Test by opening `index.html` in your browser
4. Submit a pull request

## License

See [LICENSE](LICENSE) file for details.

## Development Notes

- No build process required - edit HTML/CSS/JS directly
- No linting or testing configured
- All JavaScript is in external `main.js` file (previously inline)
- Assets are PNG format, referenced as `assets/filename.png`
