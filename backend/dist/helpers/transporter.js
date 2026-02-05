"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = require("nodemailer");
const env_config_1 = require("../configs/env.config");
exports.transporter = (0, nodemailer_1.createTransport)({
    service: "gmail",
    auth: {
        user: env_config_1.GMAIL_EMAIL,
        pass: env_config_1.GMAIL_APP_PASS
    }
});
