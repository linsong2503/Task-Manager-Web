import nodemailer from "nodemailer";
import config from "../../config/config.js";

const transport = nodemailer.createTransport(config.email.smtp);

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = "Reset password";
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`; // frontend url
  const text = `Dear user, 
    To reset your password, please click on this link: ${resetPasswordUrl}
    If you do not see any link, please ignore this email ! 
    `;
  await sendEmail(to, subject, text);
};
/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */

const sendVerificationEmail = async (to, token) => {
  const subject = "Verification email";
  const verficationEmailUrl = `http://link-to-app/verify-email?token=${token}`; // frontend url
  const text = `Dear user, 
    To reset your password, please click on this link: ${verficationEmailUrl}
    If you do not see any link, please ignore this email ! 
    `;
  await sendEmail(to, subject, text);
};

export default {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
