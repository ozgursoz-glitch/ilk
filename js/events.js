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
            const gcodeArea = document.getElementById('gcodeArea');
            if (gcodeArea) {
                gcodeArea.value = evt.target.result;
                this.renderCurrent();
            }
        };
        reader.readAsText(file);
    },
    
    renderCurrent: function() {
        const gcodeArea = document.getElementById('gcodeArea');
        if (!gcodeArea) return;
        const gcode = gcodeArea.value;
        const data = GCodeParser.parse(gcode);
        Viewer.render(data);
    },
    
    handleMouseMove: function(e) {
        if (!Viewer.showCoordinates) return;
        
        const svg = document.getElementById('mainSvg');
        if (!svg) return;
        
        const rect = svg.getBoundingClientRect();
        // SVG transform'ı dikkate alarak koordinat hesaplama
        // scale(1, -1) translate(0, -2100) transformasyonu için düzeltme
        const x = e.clientX - rect.left;
        const y = 2100 - (e.clientY - rect.top); // Y eksenini ters çevir
        
        const tooltip = document.getElementById('coordTooltip');
        if (tooltip) {
            tooltip.textContent = `X: ${x.toFixed(2)} | Y: ${y.toFixed(2)}`;
        }
    }
};
