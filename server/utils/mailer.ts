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
      email: process.env.EMAIL_FROM!, // ✅ Must be verified sender in Brevo
      name: "Blogwebapp",
    },
    to: [{ email: to }],
    subject: "Login to Blogwebapp — Your Magic Link",
    htmlContent: `
      <h2>Sign in to Blogwebapp</h2>
      <p>Click the button below to log in:</p>
      <a href="${encodeURI(
        link
      )}" target="_blank" style="display:inline-block;padding:10px 15px;background-color:#0a2540;color:white;text-decoration:none;border-radius:4px;">Login Now</a>
      <p>This link will expire in 15 minutes. If you didn't request this, you can ignore this email.</p>
    `,
    textContent: `Sign in to Blogwebapp by clicking this link: ${link}`,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Magic link sent to:", to);
  } catch (error: any) {
    console.error("❌ Email sending failed:", error.response?.text || error);
    throw new Error("Email sending failed");
  }
};
