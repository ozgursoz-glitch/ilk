// ==================== gcodeParser.js ====================
const GCodeParser = {
    lines: [],
    points: [],
    travels: [],
    cuts: [],
    drills: [],
    bbox: { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: 0, maxZ: 0 },
    safeZ: 5,
    processDepth: 0,
    drillCount: 0,
    
    parse: function(gcode) {
        this.lines = gcode.split('\n');
        this.points = [];
        this.travels = [];
        this.cuts = [];
        this.drills = [];
        this.bbox = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: 0, maxZ: 0 };
        this.drillCount = 0;
        
        let x = 0, y = 0, z = 0;
        let isRapid = false;
        let startPoint = null;
        
        for (let i = 0; i < this.lines.length; i++) {
            let line = this.lines[i].trim();
            if (!line || line.startsWith('(') || line.startsWith(';')) continue;
            
            line = line.split(/[;(]/)[0].trim();
            if (!line) continue;
            
            const parts = line.split(/\s+/);
            let cmd = '';
            let newX = x, newY = y, newZ = z;
            let hasMove = false;
            
            for (const part of parts) {
                const upper = part.toUpperCase();
                if (upper.startsWith('G')) {
                    cmd = upper;
                } else if (upper.startsWith('X')) {
                    newX = Utils.parseFloat(upper.substring(1), x);
                    hasMove = true;
                } else if (upper.startsWith('Y')) {
                    newY = Utils.parseFloat(upper.substring(1), y);
                    hasMove = true;
                } else if (upper.startsWith('Z')) {
                    newZ = Utils.parseFloat(upper.substring(1), z);
                    hasMove = true;
                }
            }
            
            if (cmd === 'G0' || cmd === 'G00') {
                isRapid = true;
            } else if (cmd === 'G1' || cmd === 'G01') {
                isRapid = false;
            }
            
            if (hasMove) {
                if (startPoint === null) {
                    startPoint = { x, y, z };
                }
                
                if (isRapid && (x !== newX || y !== newY)) {
                    this.travels.push({ x1: x, y1: y, x2: newX, y2: newY });
                } else if (!isRapid && (x !== newX || y !== newY)) {
                    this.cuts.push({ x1: x, y1: y, x2: newX, y2: newY, z: newZ });
                    if (newZ < this.bbox.minZ) this.bbox.minZ = newZ;
                    if (newZ > this.bbox.maxZ) this.bbox.maxZ = newZ;
                    if (newZ < 0 && Math.abs(newZ) > Math.abs(this.processDepth)) {
                        this.processDepth = newZ;
                    }
                }
                
                if (cmd === 'G81' || cmd === 'G83') {
                    this.drills.push({ x: newX, y: newY, z: newZ });
                    this.drillCount++;
                }
                
                x = newX;
                y = newY;
                z = newZ;
                
                this.updateBBox(x, y);
            }
        }
        
        if (this.bbox.minX === Infinity) {
            this.bbox = { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 };
        }
        
        return {
            travels: this.travels,
            cuts: this.cuts,
            drills: this.drills,
            bbox: this.bbox,
            safeZ: this.safeZ,
            processDepth: this.processDepth,
            drillCount: this.drillCount,
            lineCount: this.lines.length
        };
    },
    
    updateBBox: function(x, y) {
        if (x < this.bbox.minX) this.bbox.minX = x;
        if (x > this.bbox.maxX) this.bbox.maxX = x;
        if (y < this.bbox.minY) this.bbox.minY = y;
        if (y > this.bbox.maxY) this.bbox.maxY = y;
    },
    
    getFocusedLine: function(lineNum) {
        if (lineNum < 0 || lineNum >= this.lines.length) return null;
        const line = this.lines[lineNum];
        const parts = line.split(/\s+/);
        let x = 0, y = 0;
        for (const part of parts) {
            const upper = part.toUpperCase();
            if (upper.startsWith('X')) x = Utils.parseFloat(upper.substring(1), 0);
            if (upper.startsWith('Y')) y = Utils.parseFloat(upper.substring(1), 0);
        }
        return { x, y, lineNum };
    }
};
