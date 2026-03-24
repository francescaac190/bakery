"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalCents = calculateTotalCents;
function calculateTotalCents(lines) {
    return lines.reduce((acc, line) => acc + line.quantity * line.unitPriceCents, 0);
}
//# sourceMappingURL=money.js.map