const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const adminEmail = process.env.ADMIN_EMAIL;

const transporter =
  emailUser && emailPassword
    ? nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,

        auth: {
          user: emailUser,
          pass: emailPassword,
        },

        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
      })
    : null;

// =========================
// Send Email
// =========================

async function sendEmail({ to, subject, text, html }) {
  if (!transporter) {
    console.warn(
      "Email is not configured. Check EMAIL_USER and EMAIL_PASSWORD in backend environment variables.",
    );

    return false;
  }

  if (!to) {
    console.warn("Email recipient is missing.");
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"TechFlow Admin" <${emailUser}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent successfully to ${to}`);

    return true;
  } catch (error) {
    console.error("Email sending failed:", error.message);

    return false;
  }
}

// =========================
// User Notification Email
// =========================

async function sendUserNotificationEmail({ action, user }) {
  if (!adminEmail) {
    console.warn(
      "ADMIN_EMAIL is not configured. Add ADMIN_EMAIL to backend environment variables.",
    );

    return false;
  }

  if (!user) {
    console.warn("User data is missing for email notification.");
    return false;
  }

  let subject;
  let title;

  switch (action) {
    case "created":
      subject = "TechFlow - New User Created";
      title = "New User Created";
      break;

    case "updated":
      subject = "TechFlow - User Updated";
      title = "User Updated";
      break;

    case "deleted":
      subject = "TechFlow - User Deleted";
      title = "User Deleted";
      break;

    default:
      subject = "TechFlow - User Notification";
      title = "User Notification";
  }

  return sendEmail({
    to: adminEmail,
    subject,

    text: `
${title}

Name: ${user.name}
Email: ${user.email}
User ID: ${user.id}
Action: ${action}
    `.trim(),

    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #06b6d4;">${title}</h2>

        <p>
          A user action occurred in your TechFlow admin panel.
        </p>

        <table style="border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px; font-weight: bold;">Name</td>
            <td style="padding: 8px;">${user.name}</td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">Email</td>
            <td style="padding: 8px;">${user.email}</td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">User ID</td>
            <td style="padding: 8px;">${user.id}</td>
          </tr>

          <tr>
            <td style="padding: 8px; font-weight: bold;">Action</td>
            <td style="padding: 8px;">${action}</td>
          </tr>
        </table>

        <p style="margin-top: 25px; color: #64748b;">
          This is an automated notification from TechFlow.
        </p>
      </div>
    `,
  });
}

module.exports = {
  sendEmail,
  sendUserNotificationEmail,
};
