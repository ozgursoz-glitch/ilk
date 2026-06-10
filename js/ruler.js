// ==================== ruler.js ====================
const RulerTool = {
    enabled: true,
    startX: 200,
    startY: 200,
    endX: 800,
    endY: 800,
    dragging: null,
    
    init: function() {
        const handleA = document.getElementById('handleAGroup');
        const handleB = document.getElementById('handleBGroup');
        const rulerLayer = document.getElementById('rulerToolLayer');
        
        if (handleA) {
            handleA.addEventListener('mousedown', (e) => this.startDrag(e, 'A'));
            handleA.addEventListener('touchstart', (e) => this.startDrag(e, 'A'), { passive: false });
        }
        if (handleB) {
            handleB.addEventListener('mousedown', (e) => this.startDrag(e, 'B'));
            handleB.addEventListener('touchstart', (e) => this.startDrag(e, 'B'), { passive: false });
        }
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());
        
        this.updateDisplay();
    },
    
    startDrag: function(e, handle) {
        e.preventDefault();
        this.dragging = handle;
    },
    
    drag: function(e) {
        if (!this.dragging) return;
        e.preventDefault();
        
        const svg = document.getElementById('mainSvg');
        if (!svg) return;
        
        const rect = svg.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // SVG koordinat sistemine göre düzeltme (zoom ve pan dikkate alınarak)
        const x = (clientX - rect.left - Viewer.panX) / Viewer.zoom;
        const y = (clientY - rect.top - Viewer.panY) / Viewer.zoom;
        
        if (this.dragging === 'A') {
            this.startX = x;
            this.startY = y;
        } else {
            this.endX = x;
            this.endY = y;
        }
        
        this.updateDisplay();
    },
    
    endDrag: function() {
        this.dragging = null;
    },
    
    updateDisplay: function() {
        const rulerLine = document.getElementById('rulerLine');
        const rulerText = document.getElementById('rulerText');
        const handleA = document.getElementById('handleA');
        const handleB = document.getElementById('handleB');
        const handleAGroup = document.getElementById('handleAGroup');
        const handleBGroup = document.getElementById('handleBGroup');
        
        if (!rulerLine || !rulerText || !handleA || !handleB || !handleAGroup || !handleBGroup) return;
        
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        rulerLine.setAttribute('x1', this.startX);
        rulerLine.setAttribute('y1', this.startY);
        rulerLine.setAttribute('x2', this.endX);
        rulerLine.setAttribute('y2', this.endY);
        
        const midX = (this.startX + this.endX) / 2;
        const midY = (this.startY + this.endY) / 2;
        rulerText.setAttribute('x', midX);
        rulerText.setAttribute('y', midY - 10);
        rulerText.textContent = distance.toFixed(1) + ' mm';
        
        // Kutuları merkezle (startX, startY) ve (endX, endY) olacak şekilde konumlandır
        // rect x,y sol üst köşedir, bu yüzden -10 yapıyoruz (20x20 kutu)
        handleA.setAttribute('x', this.startX - 10);
        handleA.setAttribute('y', this.startY - 10);
        handleB.setAttribute('x', this.endX - 10);
        handleB.setAttribute('y', this.endY - 10);
        
        // Artı işaretlerini güncelle (kutunun merkezinde olmalı)
        // handleAGroup ve handleBGroup içindeki line elementlerini bul ve güncelle
        const plusHA_H = handleAGroup.querySelector('line:nth-of-type(1)');
        const plusHA_V = handleAGroup.querySelector('line:nth-of-type(2)');
        const plusHB_H = handleBGroup.querySelector('line:nth-of-type(1)');
        const plusHB_V = handleBGroup.querySelector('line:nth-of-type(2)');
        
        if (plusHA_H && plusHA_V) {
            plusHA_H.setAttribute('x1', this.startX - 5);
            plusHA_H.setAttribute('y1', this.startY);
            plusHA_H.setAttribute('x2', this.startX + 5);
            plusHA_H.setAttribute('y2', this.startY);
            
            plusHA_V.setAttribute('x1', this.startX);
            plusHA_V.setAttribute('y1', this.startY - 5);
            plusHA_V.setAttribute('x2', this.startX);
            plusHA_V.setAttribute('y2', this.startY + 5);
        }
        
        if (plusHB_H && plusHB_V) {
            plusHB_H.setAttribute('x1', this.endX - 5);
            plusHB_H.setAttribute('y1', this.endY);
            plusHB_H.setAttribute('x2', this.endX + 5);
            plusHB_H.setAttribute('y2', this.endY);
            
            plusHB_V.setAttribute('x1', this.endX);
            plusHB_V.setAttribute('y1', this.endY - 5);
            plusHB_V.setAttribute('x2', this.endX);
            plusHB_V.setAttribute('y2', this.endY + 5);
        }
    },
    
    toggle: function() {
        this.enabled = !this.enabled;
        const layer = document.getElementById('rulerToolLayer');
        const btn = document.getElementById('toggleRulerBtn');
        if (layer) layer.style.display = this.enabled ? 'block' : 'none';
        if (btn) btn.classList.toggle('active', this.enabled);
        return this.enabled;
    }
};
