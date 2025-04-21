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
      email: process.env.EMAIL_FROM!,
      name: "Blogwebapp",
    },
    to: [{ email: to }],
    subject: "Login to Blogwebapp — Your Magic Link",
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="light" />
          <meta name="supported-color-schemes" content="light" />
          <title>Magic Login Link</title>
        </head>
        <body style="margin:0;padding:0;background-color:#ffffff;color:#111827;font-family:Helvetica,Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background-color:#ffffff;padding:30px;border-radius:12px;box-shadow:0 5px 20px rgba(0,0,0,0.05);text-align:center;">
            <img src="https://res.cloudinary.com/dqdix32m5/image/upload/v1745200160/logo512_irw0ji.png" alt="Blogwebapp logo" style="width:50px;height:50px;margin-bottom:20px;" />
            <h1 style="font-size:22px;margin-bottom:8px;color:#111827;">Welcome to Blogwebapp! 👋</h1>
            <p style="font-size:16px;color:#4B5563;margin-bottom:30px;">
              Here’s your secure magic link to log in and get started.
            </p>
            <a href="${encodeURI(
              link
            )}" target="_blank" style="display:inline-block;padding:14px 28px;background-color:#111827;color:#ffffff;border-radius:9999px;text-decoration:none;font-weight:bold;">
              Log in to Blogwebapp
            </a>
            <p style="margin-top:20px;color:#6B7280;font-size:14px;">
              This link will expire in 15 minutes.<br/>
              If you didn’t request this, feel free to ignore it.
            </p>
            <hr style="margin:30px 0;border:0;border-top:1px solid #E5E7EB;" />
            <div style="text-align:left;">
              <h2 style="font-size:16px;color:#111827;margin-bottom:10px;">Tips to get started</h2>
              <ul style="padding-left:20px;color:#4B5563;font-size:14px;">
                <li>📖 <strong>Explore posts</strong> from other creators</li>
                <li>📝 <strong>Create your first story</strong> from your dashboard</li>
                <li>💡 <strong>Discover unique perspectives</strong> and connect with like-minded readers</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `,
    textContent: `Login to Blogwebapp using this link: ${link}`,
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Magic link sent to:", to);
  } catch (error: any) {
    console.error("❌ Email sending failed:", error.response?.text || error);
    throw new Error("Email sending failed");
  }
};
