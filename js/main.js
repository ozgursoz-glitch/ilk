// ==================== main.js ====================
document.addEventListener('DOMContentLoaded', function() {
    RulerTool.init();
    Viewer.init();
    Events.init();
    
    window.triggerFileLoad = function() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.click();
    };
    
    window.render = function() {
        Events.renderCurrent();
    };
    
    window.saveGCode = function() {
        const gcodeArea = document.getElementById('gcodeArea');
        if (!gcodeArea) return;
        const gcode = gcodeArea.value;
        const blob = new Blob([gcode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = Viewer.currentFile;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    window.saveSVG = function() {
        const svg = document.getElementById('mainSvg');
        if (!svg) return;
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const blob = new Blob([svgStr], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.svg';
        a.click();
        URL.revokeObjectURL(url);
    };
    
    window.autoFit = function() {
        Viewer.resetView();
    };
    
    window.toggleCoordinateTracking = function() {
        Viewer.toggleCoordinateTracking();
    };
    
    window.toggleLineTracking = function() {
        Viewer.toggleLineTracking();
    };
    
    window.toggleRulerTool = function() {
        RulerTool.toggle();
    };
    
    window.updateToolWidth = function() {
        const toolDiameterEl = document.getElementById('toolDiameter');
        if (!toolDiameterEl) return;
        const val = parseFloat(toolDiameterEl.value);
        if (val && val > 0) {
            Viewer.toolWidth = val;
            Events.renderCurrent();
        }
    };
    
    window.setToolDiameter = function(d) {
        const toolDiameterEl = document.getElementById('toolDiameter');
        if (!toolDiameterEl) return;
        toolDiameterEl.value = d;
        Viewer.toolWidth = d;
        Events.renderCurrent();
    };
    
    // Varsayılan örnek G-code (yeni .gm formatına uygun)
    const defaultGCode = `G71
G90
M05
M06T6
M21 I11-
G00X0.000Y0.000
M03S18000
M20 A7+
G04 D2
M20 A7-
G00X118.000Y302.387Z80.000
G01Z45.000F3000.0
G01X210.000Z40.650F4800.0
Y226.187
X26.000
Y302.387
X118.000
X210.000Z36.300
Y226.187
X26.000
Y302.387
X118.000
X210.000Z31.950
Y226.187
X26.000
Y302.387
X118.000
X210.000Z27.600
Y226.187
X26.000
Y302.387
X118.000
X210.000
G00Z80.000
G00X0.000Y0.000Z190.000
M05
M20 A8+
G04 D2
M20 A8-
G00X0Y0
M02`;
    
    document.getElementById('gcodeArea').value = defaultGCode;
    // DOM elementlerinin tamamen yüklenmesini bekleyip render yap
    setTimeout(function() {
        Events.renderCurrent();
    }, 100);
});
