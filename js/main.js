// ==================== main.js ====================
document.addEventListener('DOMContentLoaded', function() {
    RulerTool.init();
    Viewer.init();
    Events.init();
    
    window.triggerFileLoad = function() {
        document.getElementById('fileInput').click();
    };
    
    window.render = function() {
        Events.renderCurrent();
    };
    
    window.saveGCode = function() {
        const gcode = document.getElementById('gcodeArea').value;
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
        const val = parseFloat(document.getElementById('toolDiameter').value);
        if (val && val > 0) {
            Viewer.toolWidth = val;
            Events.renderCurrent();
        }
    };
    
    window.setToolDiameter = function(d) {
        document.getElementById('toolDiameter').value = d;
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
    Events.renderCurrent();
});
