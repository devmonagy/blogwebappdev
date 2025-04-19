import SibApiV3Sdk from "sib-api-v3-sdk";

interface MailOptions {
  to: string;
  link: string;
}

export const sendEmail = async ({ to, link }: MailOptions): Promise<void> => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY!;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = {
    sender: {
      email: process.env.EMAIL_FROM!, // ✅ MUST be a verified sender under Brevo's "Senders" tab
      name: "Blogwebapp",
    },
    to: [{ email: to }],
    subject: "Your Magic Login Link",
    htmlContent: `
      <h2>Sign in to Blogwebapp</h2>
      <p>Click the link below to log in:</p>
      <a href="${link}" target="_blank">${link}</a>
      <p>This link expires in 15 minutes.</p>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Magic link sent to:", to);
  } catch (error: any) {
    console.error("❌ Email sending failed:", error.response?.text || error);
    throw new Error("Email sending failed");
  }
};
