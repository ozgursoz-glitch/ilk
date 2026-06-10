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
        // SVG transform'ı ve zoom/pan dikkate alarak koordinat hesaplama
        // Sol alt orijinli sistemde Y yukarı doğru artar
        const x = (e.clientX - rect.left - Viewer.panX) / Viewer.zoom;
        const y = (e.clientY - rect.top - Viewer.panY) / Viewer.zoom;
        
        const tooltip = document.getElementById('coordTooltip');
        if (tooltip) {
            tooltip.textContent = `X: ${x.toFixed(2)} | Y: ${y.toFixed(2)}`;
        }
        
        // Çizgi izleme göstergesini güncelle
        if (Viewer.showLineTrack) {
            this.updateLineIndicator(x, y);
        }
    },
    
    updateLineIndicator: function(x, y) {
        const indicatorX = document.getElementById('indicatorX');
        const indicatorY = document.getElementById('indicatorY');
        const indicatorCenter = document.getElementById('indicatorCenter');
        const indicatorText = document.getElementById('indicatorText');
        
        if (indicatorX) indicatorX.setAttribute('x1', x);
        if (indicatorY) indicatorY.setAttribute('y1', y);
        if (indicatorCenter) {
            indicatorCenter.setAttribute('cx', x);
            indicatorCenter.setAttribute('cy', y);
        }
        if (indicatorText) {
            indicatorText.setAttribute('x', x + 10);
            indicatorText.setAttribute('y', y - 10);
            indicatorText.textContent = `X:${x.toFixed(1)} Y:${y.toFixed(1)}`;
        }
    }
};
