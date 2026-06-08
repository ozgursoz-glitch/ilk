// ==================== utils.js ====================
const Utils = {
    parseFloat: function(val, def) {
        if (val === undefined || val === null || val === '') return def;
        const v = parseFloat(val);
        return isNaN(v) ? def : v;
    },
    
    clamp: function(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },
    
    formatNum: function(num, decimals) {
        if (decimals === undefined) decimals = 2;
        return num.toFixed(decimals);
    }
};
