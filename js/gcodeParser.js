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
    absoluteMode: true, // G90 varsayılan
    
    parse: function(gcode) {
        this.lines = gcode.split('\n');
        this.points = [];
        this.travels = [];
        this.cuts = [];
        this.drills = [];
        this.bbox = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity, minZ: 0, maxZ: 0 };
        this.drillCount = 0;
        this.absoluteMode = true; // Her parse işleminde sıfırla
        
        let x = 0, y = 0, z = 0;
        let isRapid = false;
        let startPoint = null;
        
        for (let i = 0; i < this.lines.length; i++) {
            let line = this.lines[i].trim();
            if (!line || line.startsWith('(') || line.startsWith(';')) continue;
            
            // Parantez içi yorumları temizle
            const commentIndex = line.indexOf('(');
            if (commentIndex !== -1) {
                line = line.substring(0, commentIndex).trim();
            }
            
            line = line.split(/[;(]/)[0].trim();
            if (!line) continue;
            
            // Harf ve sayıları (işaretli dahil) ayıkla: X118.000, M21, I11-, A7+ vb.
            const parts = line.match(/[A-Z](?:\d+\.?\d*|[+-]\d+)/g);
            if (!parts) continue;
            
            let cmd = '';
            let newX = x, newY = y, newZ = z;
            let hasMove = false;
            
            for (const part of parts) {
                const upper = part.toUpperCase();
                const code = upper[0];
                const valueStr = upper.substring(1);
                
                // Sayısal değeri parse et (işaretli olabilir: +, -)
                let value = parseFloat(valueStr);
                if (isNaN(value)) value = 0;
                
                if (code === 'G') {
                    cmd = upper;
                    if (value === 90) this.absoluteMode = true;
                    if (value === 91) this.absoluteMode = false;
                } else if (code === 'X') {
                    newX = this.absoluteMode ? value : x + value;
                    hasMove = true;
                } else if (code === 'Y') {
                    newY = this.absoluteMode ? value : y + value;
                    hasMove = true;
                } else if (code === 'Z') {
                    newZ = this.absoluteMode ? value : z + value;
                    hasMove = true;
                } else if (code === 'F') {
                    // Feed rate, şimdilik sadece okuyoruz
                } else if (code === 'M') {
                    // M kodları: M03, M05, M06, M20, M21 vb.
                    // Hareket etmezler ama durum değiştirebilirler
                } else if (code === 'S' || code === 'D' || code === 'T' || code === 'I' || code === 'A') {
                    // Diğer parametreler (S: speed, D: delay, T: tool, I/A: custom params)
                    // Şimdilik görmezden geliyoruz, hareket etkilemiyor
                }
            }
            
            // Hareket komutu kontrolü
            if (cmd === 'G0' || cmd === 'G00') {
                isRapid = true;
            } else if (cmd === 'G1' || cmd === 'G01') {
                isRapid = false;
            }
            
            // Hareket varsa işle
            if (hasMove) {
                if (startPoint === null) {
                    startPoint = { x, y, z };
                }
                
                // Sadece X/Y değiştiyse ve Z yüksekse (rapid gibi davran)
                const isZHigh = newZ > 10; // Güvenlik yüksekliği
                
                if ((isRapid || isZHigh) && (x !== newX || y !== newY)) {
                    // Hızlı geçiş (travel)
                    this.travels.push({ x1: x, y1: y, x2: newX, y2: newY });
                } else if (!isRapid && !isZHigh && (x !== newX || y !== newY)) {
                    // Kesim hareketi (cut)
                    this.cuts.push({ x1: x, y1: y, x2: newX, y2: newY, z: newZ });
                    if (newZ < this.bbox.minZ) this.bbox.minZ = newZ;
                    if (newZ > this.bbox.maxZ) this.bbox.maxZ = newZ;
                    if (newZ < 0 && Math.abs(newZ) > Math.abs(this.processDepth)) {
                        this.processDepth = newZ;
                    }
                }
                
                // Delme döngüsü kontrolü (G81, G83)
                if (cmd === 'G81' || cmd === 'G83') {
                    this.drills.push({ x: newX, y: newY, z: newZ });
                    this.drillCount++;
                }
                
                // Pozisyonu güncelle
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
