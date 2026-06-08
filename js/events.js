// ==================== events.js ====================
const Events = {
    init: function() {
        const fileInput = document.getElementById('fileInput');
        const gcodeArea = document.getElementById('gcodeArea');
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }
        
        if (gcodeArea) {
            gcodeArea.addEventListener('input', () => this.renderCurrent());
        }
        
        const mainSvg = document.getElementById('mainSvg');
        if (mainSvg) {
            mainSvg.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        }
    },
    
    handleFileSelect: function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        Viewer.currentFile = file.name;
        const reader = new FileReader();
        reader.onload = (evt) => {
            document.getElementById('gcodeArea').value = evt.target.result;
            this.renderCurrent();
        };
        reader.readAsText(file);
    },
    
    renderCurrent: function() {
        const gcode = document.getElementById('gcodeArea').value;
        const data = GCodeParser.parse(gcode);
        Viewer.render(data);
    },
    
    handleMouseMove: function(e) {
        if (!Viewer.showCoordinates) return;
        
        const svg = document.getElementById('mainSvg');
        const rect = svg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.height - (e.clientY - rect.top);
        
        const tooltip = document.getElementById('coordTooltip');
        if (tooltip) {
            tooltip.textContent = `X: ${x.toFixed(2)} | Y: ${y.toFixed(2)}`;
        }
    }
};
