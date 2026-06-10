// ==================== viewer.js ====================
const Viewer = {
    toolWidth: 6,
    currentFile: 'output.nc',
    focusedLineIndex: -1,
    showCoordinates: true,
    showLineTrack: true,
    
    init: function() {
        this.updatePaths();
    },
    
    render: function(data) {
        if (!data) return;
        
        const pathTravel = document.getElementById('pathTravel');
        const pathCut = document.getElementById('pathCut');
        const layerDrill = document.getElementById('layerDrill');
        
        if (pathTravel) {
            let d = '';
            data.travels.forEach(t => {
                d += `M ${t.x1} ${t.y1} L ${t.x2} ${t.y2} `;
            });
            pathTravel.setAttribute('d', d || 'M 0 0');
        }
        
        if (pathCut) {
            let d = '';
            data.cuts.forEach(c => {
                d += `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2} `;
            });
            pathCut.setAttribute('d', d || 'M 0 0');
            pathCut.setAttribute('stroke-width', this.toolWidth);
        }
        
        if (layerDrill) {
            layerDrill.innerHTML = '';
            data.drills.forEach(d => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', d.x);
                circle.setAttribute('cy', d.y);
                circle.setAttribute('r', this.toolWidth / 2);
                circle.setAttribute('fill', '#ff9900');
                circle.setAttribute('opacity', '0.7');
                layerDrill.appendChild(circle);
            });
        }
        
        this.updateStatus(data);
    },
    
    updateStatus: function(data) {
        const filenameEl = document.getElementById('val-filename');
        const ptsEl = document.getElementById('val-pts');
        const drillcntEl = document.getElementById('val-drillcnt');
        const wEl = document.getElementById('val-w');
        const hEl = document.getElementById('val-h');
        const zminEl = document.getElementById('val-zmin');
        const safeZEl = document.getElementById('val-safe-z');
        const processDepthEl = document.getElementById('val-process-depth');
        const bboxEl = document.getElementById('val-bbox');
        
        if (filenameEl) filenameEl.textContent = this.currentFile;
        if (ptsEl) ptsEl.textContent = data.lineCount;
        if (drillcntEl) drillcntEl.textContent = data.drillCount;
        
        const width = data.bbox.maxX - data.bbox.minX;
        const height = data.bbox.maxY - data.bbox.minY;
        if (wEl) wEl.textContent = Utils.formatNum(width);
        if (hEl) hEl.textContent = Utils.formatNum(height);
        if (zminEl) zminEl.textContent = Utils.formatNum(data.bbox.minZ);
        if (safeZEl) safeZEl.textContent = Utils.formatNum(data.safeZ) + ' mm';
        if (processDepthEl) processDepthEl.textContent = Utils.formatNum(data.processDepth) + ' mm';
        if (bboxEl) bboxEl.textContent = 
            `X: ${Utils.formatNum(data.bbox.minX)} / ${Utils.formatNum(data.bbox.maxX)} | Y: ${Utils.formatNum(data.bbox.minY)} / ${Utils.formatNum(data.bbox.maxY)}`;
        
        const focusedSection = document.getElementById('focused-line-section');
        if (this.focusedLineIndex >= 0) {
            const focusedLineEl = document.getElementById('val-focused-line');
            if (focusedLineEl) focusedLineEl.textContent = this.focusedLineIndex + 1;
            if (focusedSection) focusedSection.style.display = 'flex';
        } else if (focusedSection) {
            focusedSection.style.display = 'none';
        }
    },
    
    autoFit: function() {
        // Basit implementasyon - gerçekte viewBox ayarlaması yapılır
        console.log('Auto-fit triggered');
    },
    
    setToolWidth: function(width) {
        this.toolWidth = width;
        const toolDiameterEl = document.getElementById('toolDiameter');
        if (toolDiameterEl) toolDiameterEl.value = width;
        const gcodeArea = document.getElementById('gcodeArea');
        if (gcodeArea) {
            this.render(GCodeParser.parse(gcodeArea.value));
        }
    },
    
    toggleCoordinateTracking: function() {
        this.showCoordinates = !this.showCoordinates;
        const tooltip = document.getElementById('coordTooltip');
        const btn = document.getElementById('toggleCoordBtn');
        if (tooltip) tooltip.style.display = this.showCoordinates ? 'block' : 'none';
        if (btn) btn.classList.toggle('active', this.showCoordinates);
        return this.showCoordinates;
    },
    
    toggleLineTracking: function() {
        this.showLineTrack = !this.showLineTrack;
        const indicatorLayer = document.getElementById('lineIndicatorLayer');
        const indicatorText = document.getElementById('indicatorText');
        const btn = document.getElementById('toggleLineTrackBtn');
        const display = this.showLineTrack ? 'block' : 'none';
        if (indicatorLayer) indicatorLayer.style.display = display;
        if (indicatorText) indicatorText.style.display = display;
        if (btn) btn.classList.toggle('active', this.showLineTrack);
        return this.showLineTrack;
    },
    
    setFocusedLine: function(lineIndex) {
        this.focusedLineIndex = lineIndex;
        const gcodeArea = document.getElementById('gcodeArea');
        if (gcodeArea) {
            const data = GCodeParser.parse(gcodeArea.value);
            this.render(data);
        }
    },
    
    updatePaths: function() {
        // Placeholder for path update logic
    }
};
