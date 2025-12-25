import "dotenv/config"

const SECRET_KEY_REGIS = process.env.SECRET_KEY_REGIS || ""

const GMAIL_EMAIL = process.env.GMAIL_EMAIL || ""
const GMAIL_APP_PASS = process.env.GMAIL_APP_PASS

const BASE_WEB_URL = process.env.BASE_WEB_URL || ""

export {
    SECRET_KEY_REGIS,
    GMAIL_EMAIL,
    GMAIL_APP_PASS,
    BASE_WEB_URL
}