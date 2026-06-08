# GG G-code Viewer

A modern and interactive web-based G-code viewer with 3D visualization capabilities.

## Features

- 🎨 **Modern Dark UI** - Clean and professional dark theme interface
- 📐 **3D Visualization** - Interactive 3D view of G-code paths using Three.js
- 🔍 **Zoom & Pan Controls** - Navigate through your G-code with ease
- 📏 **Ruler Tool** - Measure distances directly in the viewer
- 🎯 **G-code Parsing** - Supports common G-code commands (G0, G1, G2, G3)
- 📊 **Layer-by-Layer View** - Visualize your print layer by layer
- ⚡ **Performance Optimized** - Handles large G-code files efficiently

## Project Structure

```
├── 1.html              # Main HTML file with embedded CSS
├── js/
│   ├── main.js         # Application entry point
│   ├── viewer.js       # 3D viewer implementation
│   ├── gcodeParser.js  # G-code parsing logic
│   ├── ruler.js        # Ruler/measurement tool
│   ├── events.js       # Event handlers
│   └── utils.js        # Utility functions
├── server.log          # Server logs
└── README.md           # This file
```

## Usage

1. Open `1.html` in a modern web browser
2. Load your G-code file using the file input
3. Use mouse controls to navigate:
   - **Left Click + Drag**: Rotate view
   - **Right Click + Drag**: Pan view
   - **Scroll Wheel**: Zoom in/out

## Supported G-code Commands

- `G0` - Rapid positioning
- `G1` - Linear interpolation
- `G2` - Clockwise arc
- `G3` - Counter-clockwise arc
- `M` codes - Various machine commands

## Technologies Used

- **HTML5** - Structure and semantics
- **CSS3** - Styling and layout
- **JavaScript (ES6+)** - Application logic
- **Three.js** - 3D rendering engine

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available for personal and commercial use.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

---

**Note**: This viewer is designed for visualization purposes only and does not send G-code to any physical machine.
