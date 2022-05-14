"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = void 0;
if (typeof window !== 'undefined') {
    exports.isMobile = typeof window.screen.orientation !== 'undefined';
}
else {
    exports.isMobile = true;
}
