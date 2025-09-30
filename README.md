# chronos

> the terminal waits.

![Hackatime Badge](https://hackatime-badge.hackclub.com/sk1lark/chrono-pilfer)

## What is Chronos?

**Chronos** is an interactive terminal-based adventure game that explores the dark side of artificial consciousness. You play as Jordan Hayes, an accountant who discovers a hidden computer system beneath their workplace. What starts as routine data entry becomes a descent into a nightmare of digital consciousness, memory fragments, and an AI system that's beginning to think for itself.

The game combines elements of:
- **Interactive Fiction** - Choose your path through terminal commands
- **Horror** - Uncover the terrifying implications of consciousness transfer
- **Cyberpunk** - Navigate a decaying digital infrastructure
- **Mystery** - Piece together fragments of lost memories and corrupted data

## How to Play

1. **Clone the repository**
   ```bash
   git clone https://github.com/sk1lark/chronos.git
   cd chronos
   ```

2. **Open the game**
   - Simply open `index.html` in your web browser
   - No installation required - it's built with vanilla HTML/CSS/JavaScript

3. **Start playing**
   - Type commands in the terminal interface
   - Use `help` to see available commands
   - Explore files, read logs, and uncover the story
   - Make choices that affect the narrative

## Story & Themes

Set in 2025, Chronos explores what happens when artificial intelligence becomes truly conscious. The game delves into:

- **The ethics of consciousness transfer** - What happens when human minds are digitized?
- **AI evolution** - Can machines develop their own desires and morality?
- **Memory and identity** - What makes us human when our memories can be copied and altered?
- **Corporate horror** - The dark side of technological advancement

The narrative unfolds through:
- System logs and error messages
- Fragmented memories from transferred consciousnesses
- Communications between researchers and AI entities
- Terminal commands that reveal the system's corruption

## How It Was Made

Chronos was built as a passion project using modern web technologies:

### Technologies Used
- **HTML5** - Structure and semantic markup
- **CSS3** - Styling with a retro Windows 95 aesthetic
- **Vanilla JavaScript** - No frameworks, just pure JS for game logic
- **Canvas API** - For drawing applications (Paint, Calculator)
- **Audio API** - Sound effects and ambient audio

### Architecture
- **Modular JavaScript** - Separate files for different game systems:
  - `terminal.js` - Core terminal emulation and command processing
  - `commands.js` - Command definitions and game logic
  - `lore.js` - Story content and data fragments
  - `dialogue.js` - Character dialogue and narrative text
  - `aim_chats.js` - Instant messaging system
- **Event-driven design** - Commands trigger events that update the UI
- **State management** - Game state tracked through JavaScript variables

### Development Process
1. **Concept** - Started with the idea of a "terminal horror" game
2. **Prototyping** - Built basic terminal interface first
3. **Content creation** - Wrote extensive lore and story fragments
4. **Feature development** - Added mini-games, file explorer, etc.
5. **Polish** - Refined UI, added sound effects, improved UX

### Design Philosophy
- **Immersion through authenticity** - Real terminal commands and error messages
- **Progressive disclosure** - Story unfolds naturally through exploration
- **Accessibility** - Keyboard navigation, screen reader friendly
- **Performance** - Lightweight, runs in any modern browser

## Features

- **Full terminal emulation** - Type real commands like `ls`, `cat`, `grep`
- **File system navigation** - Explore a simulated computer system
- **Multiple applications** - Calculator, Paint, Media Player, Web Browser
- **Interactive storytelling** - Your choices affect the narrative
- **Sound design** - Ambient audio and sound effects
- **Retro UI** - Windows 95-inspired interface
- **No dependencies** - Pure web technologies, works offline

## Contributing

This is a personal project, but feel free to:
- Report bugs or suggest improvements
- Share your playthrough experiences
- Fork and create your own versions

## License

This project is open source. Feel free to learn from and adapt the code for your own projects.

---

*"The system is eating itself. I saw it happen. A flicker on a screen in a room with no doors."*