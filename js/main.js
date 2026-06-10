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
        Viewer.autoFit();
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
    
    // Varsayılan örnek G-code
    const defaultGCode = `G21
G90
G0 X0 Y0
G1 X100 Y0 F500
G1 X100 Y100
G1 X0 Y100
G1 X0 Y0
G0 X200 Y200
G1 X300 Y200
G1 X300 Y300
G1 X200 Y300
G1 X200 Y200`;
    
    document.getElementById('gcodeArea').value = defaultGCode;
    // DOM elementlerinin tamamen yüklenmesini bekleyip render yap
    setTimeout(function() {
        Events.renderCurrent();
    }, 0);
});
