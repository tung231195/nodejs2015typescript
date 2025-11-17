// utils/sendEmail.ts
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

type OptionEmail = {
  to: string;
  subject: string;
  text?: string;
  htmlTemplate?: string; // tên file template, ví dụ "reset-password.html"
  variables?: Record<string, string>; // để thay thế biến trong template
};

const sendEmail = async (options: OptionEmail) => {
  try {
    // Load HTML template nếu có
    let html: string | undefined;
    if (options.htmlTemplate) {
      const templatePath = path.join(
        process.cwd(),
        "src/util/email",
        "templates",
        options.htmlTemplate,
      );
      html = fs.readFileSync(templatePath, "utf8");

      // Thay thế {{variable}} trong file template
      if (options.variables) {
        for (const [key, value] of Object.entries(options.variables)) {
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
          html = html.replace(regex, value);
        }
      }
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD, // App Password Gmail
      },
    });

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USERNAME}>`,
      to: options.to,
      subject: options.subject,
      text: options.text, // fallback nếu không có html
      html,
    });

    console.log("✅ Email sent to:", options.to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
