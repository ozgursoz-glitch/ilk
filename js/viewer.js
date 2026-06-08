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
        document.getElementById('val-filename').textContent = this.currentFile;
        document.getElementById('val-pts').textContent = data.lineCount;
        document.getElementById('val-drillcnt').textContent = data.drillCount;
        document.getElementById('val-w').textContent = Utils.formatNum(data.bbox.maxX);
        document.getElementById('val-h').textContent = Utils.formatNum(data.bbox.maxY);
        document.getElementById('val-zmin').textContent = Utils.formatNum(data.bbox.minZ);
        document.getElementById('val-safe-z').textContent = Utils.formatNum(data.safeZ) + ' mm';
        document.getElementById('val-process-depth').textContent = Utils.formatNum(data.processDepth) + ' mm';
        document.getElementById('val-bbox').textContent = 
            `X: ${Utils.formatNum(data.bbox.minX)} / ${Utils.formatNum(data.bbox.maxX)} | Y: ${Utils.formatNum(data.bbox.minY)} / ${Utils.formatNum(data.bbox.maxY)}`;
        
        const focusedSection = document.getElementById('focused-line-section');
        if (this.focusedLineIndex >= 0) {
            document.getElementById('val-focused-line').textContent = this.focusedLineIndex + 1;
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
        document.getElementById('toolDiameter').value = width;
        this.render(GCodeParser.parse(document.getElementById('gcodeArea').value));
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
        const data = GCodeParser.parse(document.getElementById('gcodeArea').value);
        this.render(data);
    },
    
    updatePaths: function() {
        // Placeholder for path update logic
    }
};
