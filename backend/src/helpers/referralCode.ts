import { prisma } from "../lib/prisma";

export async function referralCodeGenerator() {
    const uuid = crypto.randomUUID();
    const cleanUUID = uuid.replace(/-/g, "").toUpperCase();
    const sixChar = cleanUUID.substring(0,6);

    let isTaken = true;
    let code = "";
    
    while(isTaken) {
        const existingUser = await prisma.user.findUnique({
            where: { referral_code: sixChar }
        });
        if(!existingUser) isTaken = false;
    }
    return code;
}