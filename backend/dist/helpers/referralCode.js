"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralCodeGenerator = referralCodeGenerator;
function referralCodeGenerator() {
    const uuid = crypto.randomUUID();
    const cleanUUID = uuid.replace(/-/g, "").toUpperCase();
    const sixChar = cleanUUID.substring(0, 6);
    return sixChar;
}
