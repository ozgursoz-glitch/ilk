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
        // drawLayer'da scale(1,-1) translate(0,-2100) var, bu yüzden mouse koordinatlarını buna göre düzeltmeliyiz
        
        // Önce viewport transformunu kaldır (pan ve zoom)
        let x = (e.clientX - rect.left - Viewer.panX) / Viewer.zoom;
        let y = (e.clientY - rect.top - Viewer.panY) / Viewer.zoom;
        
        // drawLayer transform'u tersine çevirerek gerçek G-code koordinatlarını bul
        // drawLayer transform: scale(1, -1) translate(0, -2100)
        // Ters işlem: y'yi önce 2100 ile topla, sonra -1 ile çarp
        // Ancak indicatorLayer viewport içinde olduğu için doğrudan SVG koordinatları kullanılabilir
        // Sadece Y eksenini ters çevirmemiz gerekiyor (SVG'de Y aşağı, G-code'da Y yukarı)
        // Ama indicatorLayer drawLayer dışında olduğu için direkt kullanabiliriz
        
        const tooltip = document.getElementById('coordTooltip');
        if (tooltip) {
            tooltip.textContent = `X: ${x.toFixed(2)} | Y: ${(2100 - y).toFixed(2)}`;
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
        
        // Indicator layer viewport içinde ve drawLayer dışında olduğu için
        // Y koordinatını ters çevirmemiz gerekiyor (SVG'de Y aşağı, G-code'da Y yukarı)
        const svgY = 2100 - y;
        
        if (indicatorX) {
            indicatorX.setAttribute('x1', x);
            indicatorX.setAttribute('x2', x);
        }
        if (indicatorY) {
            indicatorY.setAttribute('y1', svgY);
            indicatorY.setAttribute('y2', svgY);
        }
        if (indicatorCenter) {
            indicatorCenter.setAttribute('cx', x);
            indicatorCenter.setAttribute('cy', svgY);
        }
        if (indicatorText) {
            indicatorText.setAttribute('x', x + 10);
            indicatorText.setAttribute('y', svgY - 10);
            indicatorText.textContent = `X:${x.toFixed(1)} Y:${y.toFixed(1)}`;
        }
    }
};
