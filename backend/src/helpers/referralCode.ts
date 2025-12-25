export function referralCodeGenerator() {
    const uuid = crypto.randomUUID();
    const cleanUUID = uuid.replace(/-/g, "").toUpperCase();
    const sixChar = cleanUUID.substring(0,6);

    return sixChar
}