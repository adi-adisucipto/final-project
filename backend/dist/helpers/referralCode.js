"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.referralCodeGenerator = referralCodeGenerator;
const prisma_1 = require("../lib/prisma");
async function referralCodeGenerator() {
    const uuid = crypto.randomUUID();
    const cleanUUID = uuid.replace(/-/g, "").toUpperCase();
    const sixChar = cleanUUID.substring(0, 6);
    let isTaken = true;
    let code = "";
    while (isTaken) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { referral_code: sixChar }
        });
        if (!existingUser)
            isTaken = false;
    }
    return code;
}
