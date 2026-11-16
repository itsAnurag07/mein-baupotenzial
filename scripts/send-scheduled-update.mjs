import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables
try {
  process.loadEnvFile(path.join(rootDir, '.env'));
} catch (e) {
  console.warn('Could not load .env file directly, relying on existing process.env');
}

const ADMIN_EMAIL = 'wolf@van-valkenburg.de';
const FROM_EMAIL = process.env.EMAIL_FROM || 'info@mein-baupotenzial.de';

async function runScheduledUpdate() {
  console.log(`[${new Date().toISOString()}] Starting scheduled Supabase & Resend update...`);
  
  const prisma = new PrismaClient();
  
  try {
    // 1. Query Supabase (Generates authentic database activity to keep Supabase awake)
    console.log('Querying Supabase database...');
    const [leadsCount, subscriberCount, inquiryCount] = await Promise.all([
      prisma.lead.count(),
      prisma.subscriber.count(),
      prisma.contactInquiry.count(),
    ]);
    
    console.log(`Supabase Database active. Stats: Leads: ${leadsCount}, Subscribers: ${subscriberCount}, Inquiries: ${inquiryCount}`);
    
    // 2. Setup Resend nodemailer transporter
    const port = parseInt(process.env.EMAIL_SERVER_PORT || '465', 10);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.resend.com',
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER || 'resend',
        pass: process.env.EMAIL_SERVER_PASSWORD || '',
      },
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 3. Compose email for Wolf Probst
    const title = 'Regelmäßiges Plattform- & Status-Update';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: Arial, sans-serif;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F7F4; padding: 40px 10px;">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E4E0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(31,35,40,0.04);">
                <tr>
                  <td style="background-color: #234436; padding: 32px 40px; text-align: center;">
                    <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">
                      mein-baupotenzial<span style="color: #A67C52;">.de</span>
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #D0CFCB; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">
                      van Valkenburg GmbH • Admin-Report
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 36px 40px; background-color: #FFFFFF;">
                    <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1F2328;">
                      Hallo Wolf,
                    </p>
                    <p style="margin: 0 0 20px 0; color: #5E646B; font-size: 15px; line-height: 1.6;">
                      dies ist das automatische Status- & Synchronisations-Update für <strong>mein-baupotenzial.de</strong> (${formattedDate}).
                    </p>
                    
                    <div style="background-color: #F4F7F5; border-left: 4px solid #234436; padding: 16px 20px; border-radius: 6px; margin: 24px 0;">
                      <h3 style="margin: 0 0 10px 0; color: #234436; font-size: 15px; font-weight: 700;">
                        🟢 Systemstatus: Aktiv & Verbunden
                      </h3>
                      <p style="margin: 0; font-size: 13px; color: #405047; line-height: 1.5;">
                        Die Verbindung zur Supabase-Datenbank (PostgreSQL) wurde erfolgreich geprüft und aktualisiert.
                      </p>
                    </div>

                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0; border: 1px solid #E5E4E0; border-radius: 8px; overflow: hidden; font-size: 14px;">
                      <tr style="background-color: #F8F7F4;">
                        <th style="padding: 10px 16px; text-align: left; color: #1F2328; border-bottom: 1px solid #E5E4E0;">Kennzahl</th>
                        <th style="padding: 10px 16px; text-align: right; color: #1F2328; border-bottom: 1px solid #E5E4E0;">Aktueller Stand</th>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #5E646B; border-bottom: 1px solid #ECECEA;">Eingegangene Leads (Gesamt):</td>
                        <td style="padding: 10px 16px; text-align: right; font-weight: 700; color: #234436; border-bottom: 1px solid #ECECEA;">${leadsCount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #5E646B; border-bottom: 1px solid #ECECEA;">Newsletter-Abonnenten:</td>
                        <td style="padding: 10px 16px; text-align: right; font-weight: 700; color: #234436; border-bottom: 1px solid #ECECEA;">${subscriberCount}</td>
                      </tr>
                      <tr>
                        <td style="padding: 10px 16px; color: #5E646B;">Kontaktanfragen:</td>
                        <td style="padding: 10px 16px; text-align: right; font-weight: 700; color: #234436;">${inquiryCount}</td>
                      </tr>
                    </table>

                    <p style="margin: 28px 0 0 0; text-align: center;">
                      <a href="${process.env.NEXTAUTH_URL || 'https://mein-baupotenzial.de'}/admin/dashboard" style="background-color: #234436; color: #FFFFFF; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                        Zum Admin-Dashboard
                      </a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #F2F1EE; padding: 20px 40px; text-align: center; border-top: 1px solid #E5E4E0;">
                    <p style="margin: 0; color: #A09E9A; font-size: 12px; line-height: 1.5;">
                      mein-baupotenzial.de • van Valkenburg GmbH • Königsallee 60F • 40212 Düsseldorf<br>
                      Automatische Synchronisation (Montag & Donnerstag)
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // 4. Send email to Wolf Probst
    console.log(`Sending email to ${ADMIN_EMAIL}...`);
    const mailOptions = {
      from: `"mein-baupotenzial.de" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `[mein-baupotenzial.de] Plattform- & Statusbericht – ${formattedDate}`,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Update email successfully sent to ${ADMIN_EMAIL}! MessageId:`, info.messageId);

  } catch (error) {
    console.error('❌ Error executing scheduled update:', error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

runScheduledUpdate();
