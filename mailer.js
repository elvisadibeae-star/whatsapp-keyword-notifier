const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (not your regular password)
  },
});

/**
 * Sends an email alert when a keyword is found in a WhatsApp message.
 * @param {Object} param0
 * @param {string} param0.from - Sender's phone number
 * @param {string} param0.text - The full message text
 * @param {string[]} param0.matched - Keywords that were matched
 * @param {string} param0.timestamp - Human-readable timestamp
 */
async function sendEmailAlert({ from, text, matched, timestamp }) {
  const mailOptions = {
    from: `"WhatsApp Notifier 🤖" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `🚨 WhatsApp Alert: Keyword "${matched[0]}" detected`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background: #25D366; padding: 20px;">
          <h2 style="color: white; margin: 0;">📱 WhatsApp Keyword Alert</h2>
        </div>
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #333;">A message containing a monitored keyword was received.</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 10px; background: #f9f9f9; font-weight: bold; width: 35%; border-radius: 4px;">📞 From</td>
              <td style="padding: 10px;">+${from}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9f9f9; font-weight: bold; border-radius: 4px;">🕐 Time</td>
              <td style="padding: 10px;">${timestamp}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9f9f9; font-weight: bold; border-radius: 4px;">🔑 Keywords</td>
              <td style="padding: 10px;">
                ${matched.map((k) => `<span style="background: #fff3cd; padding: 2px 8px; border-radius: 12px; margin-right: 4px;">${k}</span>`).join("")}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; background: #f9f9f9; font-weight: bold; border-radius: 4px;">💬 Message</td>
              <td style="padding: 10px; font-style: italic; color: #555;">"${text}"</td>
            </tr>
          </table>

          <p style="margin-top: 24px; font-size: 13px; color: #999;">
            This notification was sent by your WhatsApp Keyword Notifier bot.
          </p>
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
}

module.exports = { sendEmailAlert };
