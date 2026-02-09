"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const google_auth_library_1 = require("google-auth-library");
const env_config_1 = require("../configs/env.config");
const client = new google_auth_library_1.OAuth2Client(env_config_1.GOOGLE_CLIENT_ID);
async function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).send('No token provided');
    const token = authHeader.split(' ')[1];
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: env_config_1.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        req.googleUser = payload;
        next();
    }
    catch (error) {
        res.status(401).send('Invalid Token');
    }
}
