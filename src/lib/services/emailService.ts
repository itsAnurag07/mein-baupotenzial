import nodemailer from 'nodemailer';

const port = parseInt(process.env.EMAIL_SERVER_PORT || '1025', 10);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'localhost',
  port,
  secure: port === 465,
  auth: {
    user: process.env.EMAIL_SERVER_USER || '',
    pass: process.env.EMAIL_SERVER_PASSWORD || '',
  },
});

const FROM_EMAIL = process.env.EMAIL_FROM || 'info@mein-baupotenzial.de';
const TEAM_EMAIL = process.env.INTERNAL_NOTIFICATION_EMAIL || 'team@mein-baupotenzial.de';

async function sendMail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: `"mein-baupotenzial.de" <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  };

  try {
    // Check if configuration exists
    if (!process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_HOST === 'localhost') {
      console.log(`✉️ Email Mock to [${to}] - Subject: "${subject}"`);
      console.log(`--- Email Content Start ---`);
      console.log(html.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim());
      console.log(`--- Email Content End ---`);
      return;
    }

    await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent to [${to}] - Subject: "${subject}"`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error);
    // Fallback: log to console
    console.log(`✉️ Mock Fallback to [${to}] - Subject: "${subject}"`);
    console.log(html.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim());
  }
}

function wrapInEmailTemplate(title: string, bodyContent: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #F8F7F4; font-family: Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F7F4; padding: 40px 10px;">
        <tr>
          <td align="center">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E4E0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(31,35,40,0.04);">
              <tr>
                <td style="background-color: #1F2328; padding: 32px 40px; text-align: center;">
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: -0.02em;">
                    mein-baupotenzial<span style="color: #A67C52;">.de</span>
                  </h1>
                  <p style="margin: 4px 0 0 0; color: #D0CFCB; font-size: 13px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">
                    van Valkenburg GmbH
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 40px 30px 40px; background-color: #FFFFFF;">
                  <h2 style="margin: 0 0 20px 0; color: #1F2328; font-size: 20px; font-weight: 700; border-bottom: 2px solid #F5EDE3; padding-bottom: 12px;">
                    ${title}
                  </h2>
                  <div style="color: #5E646B; font-size: 15px; line-height: 1.65; font-weight: 400;">
                    ${bodyContent}
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background-color: #F2F1EE; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E4E0;">
                  <p style="margin: 0; color: #A09E9A; font-size: 12px; line-height: 1.5;">
                    Diese E-Mail wurde automatisch von mein-baupotenzial.de versendet.<br>
                    van Valkenburg GmbH • Königsallee 60F • 40212 Düsseldorf
                  </p>
                  <p style="margin: 12px 0 0 0; color: #A09E9A; font-size: 12px;">
                    <a href="https://mein-baupotenzial.de" style="color: #234436; text-decoration: underline; font-weight: 600;">Website besuchen</a>
                    &nbsp;&nbsp;•&nbsp;&nbsp;
                    <a href="mailto:info@mein-baupotenzial.com" style="color: #234436; text-decoration: underline; font-weight: 600;">Support kontaktieren</a>
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
}

function wrapInInternalEmailTemplate(title: string, bodyContent: string): string {
  return `
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
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E4E0; border-radius: 16px; overflow: hidden;">
              <tr>
                <td style="background-color: #234436; padding: 24px; text-align: center;">
                  <h1 style="margin: 0; color: #FFFFFF; font-size: 20px; font-weight: 700;">
                    mein-baupotenzial.de • Team-Portal
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 32px 32px 24px 32px; background-color: #FFFFFF;">
                  <h2 style="margin: 0 0 16px 0; color: #1F2328; font-size: 18px; font-weight: 700; border-bottom: 2px solid #E5E4E0; padding-bottom: 8px;">
                    ${title}
                  </h2>
                  <div style="color: #5E646B; font-size: 14px; line-height: 1.6;">
                    ${bodyContent}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export const emailService = {
  // Customer notifications
  async sendOrderConfirmation(toEmail: string, name: string, packageName: string, amount: number, isBankTransfer: boolean, leadId: string) {
    const title = 'Auftragsbestätigung';
    
    const paymentInfo = isBankTransfer 
      ? `<p style="margin: 0 0 16px 0;">Bitte überweisen Sie den ausstehenden Bruttobetrag von <strong>${amount.toFixed(2)} €</strong> auf folgendes Bankkonto:</p>
         <div style="background-color: #F8F7F4; border: 1px solid #E5E4E0; border-radius: 12px; padding: 20px; margin: 24px 0;">
           <h3 style="margin: 0 0 12px 0; color: #1F2328; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #D0CFCB; padding-bottom: 6px;">Zahlungsdetails</h3>
           <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #5E646B;">
             <tr><td style="padding: 8px 0; font-weight: 600; color: #1F2328; border-bottom: 1px solid #ECECEA;">Empfänger:</td><td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #ECECEA; font-weight: 500;">van Valkenburg GmbH</td></tr>
             <tr><td style="padding: 8px 0; font-weight: 600; color: #1F2328; border-bottom: 1px solid #ECECEA;">Kreditinstitut:</td><td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #ECECEA;">GLS Gemeinschaftsbank eG</td></tr>
             <tr><td style="padding: 8px 0; font-weight: 600; color: #1F2328; border-bottom: 1px solid #ECECEA;">IBAN:</td><td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #ECECEA; font-family: monospace; font-weight: 600; color: #1F2328;">DE62 4306 0967 1324 3634 00</td></tr>
             <tr><td style="padding: 8px 0; font-weight: 600; color: #1F2328; border-bottom: 1px solid #ECECEA;">BIC:</td><td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #ECECEA; font-family: monospace;">GENODEM1GLS</td></tr>
             <tr><td style="padding: 8px 0; font-weight: 600; color: #1F2328; border-bottom: 1px solid #ECECEA;">Verwendungszweck:</td><td style="padding: 8px 0; text-align: right; border-bottom: 1px solid #ECECEA; font-family: monospace; font-weight: 700; color: #234436;">Analyse ${leadId.substring(0, 8)}</td></tr>
             <tr><td style="padding: 8px 0; font-weight: 700; color: #1F2328;">Betrag (Brutto):</td><td style="padding: 8px 0; text-align: right; font-weight: 700; color: #234436; font-size: 15px;">${amount.toFixed(2)} €</td></tr>
           </table>
         </div>
         <p style="margin: 0 0 16px 0;">Die planungsrechtliche Analyse beginnt unmittelbar nach Verifizierung Ihres Zahlungseingangs. Eine entsprechende Rechnung wird Ihnen nach Zahlungseingang zugesandt.</p>`
      : `<p style="margin: 0 0 24px 0;">Vielen Dank für Ihre PayPal-Zahlung. Wir haben Ihre Zahlung von <strong>${amount.toFixed(2)} €</strong> erfolgreich erhalten.</p>`;

    const bodyContent = `
      <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1F2328;">Hallo ${name},</p>
      <p style="margin: 0 0 20px 0;">vielen Dank für Ihren Auftrag zur Durchführung einer <strong>${packageName}</strong> für Ihr Grundstück.</p>
      ${paymentInfo}
      <div style="background-color: #F5EDE3; border-left: 4px solid #A67C52; padding: 16px; margin: 28px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #5E646B;">
          <strong>Wichtiger Hinweis:</strong><br>
          Dies ist eine bauplanungsrechtliche Potenzialanalyse und Machbarkeits-Vorprüfung, kein offizielles Baugenehmigungsverfahren und ersetzt keinen Bauantrag.
        </p>
      </div>
      <p style="margin: 20px 0 0 0; color: #1F2328; font-weight: 500;">
        Mit freundlichen Grüßen,<br>
        <span style="color: #234436; font-weight: 700;">Ihr Team von mein-baupotenzial.de</span>
      </p>
    `;

    const html = wrapInEmailTemplate(title, bodyContent);
    await sendMail(toEmail, `Auftragsbestätigung: Ihr ${packageName} bei mein-baupotenzial.de`, html);
  },

  async sendPaymentConfirmation(toEmail: string, name: string, packageName: string, amount: number) {
    const title = 'Zahlungseingang bestätigt';
    
    const bodyContent = `
      <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1F2328;">Hallo ${name},</p>
      <p style="margin: 0 0 20px 0;">wir bestätigen den Erhalt Ihrer Zahlung in Höhe von <strong>${amount.toFixed(2)} €</strong> für die Analyse <strong>${packageName}</strong>.</p>
      <p style="margin: 0 0 20px 0;">Unser Expertenteam beginnt nun mit der detaillierten planungsrechtlichen Prüfung Ihres Grundstücks. Wir melden uns in Kürze mit den nächsten Schritten und dem fertigen Bericht.</p>
      <p style="margin: 20px 0 0 0; color: #1F2328; font-weight: 500;">
        Mit freundlichen Grüßen,<br>
        <span style="color: #234436; font-weight: 700;">Ihr Team von mein-baupotenzial.de</span>
      </p>
    `;

    const html = wrapInEmailTemplate(title, bodyContent);
    await sendMail(toEmail, `Zahlungseingang bestätigt: ${packageName}`, html);
  },

  async sendNextSteps(toEmail: string, name: string, packageName: string, timeline: string) {
    const title = 'Nächste Schritte für Ihre Analyse';
    
    const stepsHtml = packageName !== 'Quick Check'
      ? `<ol style="margin: 0 0 24px 0; padding-left: 20px; color: #5E646B;">
           <li style="margin-bottom: 10px;">Unsere Experten werten die Flurkarten, Bebauungspläne und Bauordnungen aus.</li>
           <li style="margin-bottom: 10px;">Wir erstellen Ihren individuellen PDF-Bericht (Dauer ca. 5-7 Werktage).</li>
           <li style="margin-bottom: 10px;">Wir kontaktieren Sie zur Abstimmung unseres gemeinsamen 30-minütigen Expertengesprächs.</li>
         </ol>`
      : `<ol style="margin: 0 0 24px 0; padding-left: 20px; color: #5E646B;">
           <li style="margin-bottom: 10px;">Unsere Experten werten die Flurkarten, Bebauungspläne und Bauordnungen aus.</li>
           <li style="margin-bottom: 10px;">Wir erstellen Ihren individuellen PDF-Bericht (Dauer ca. 3 Werktage).</li>
         </ol>`;

    const bodyContent = `
      <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1F2328;">Hallo ${name},</p>
      <p style="margin: 0 0 20px 0;">Ihre Daten sind sicher bei uns eingegangen und wir haben mit der Auswertung begonnen.</p>
      <p style="margin: 0 0 12px 0; font-weight: 700; color: #1F2328;">Was passiert als Nächstes?</p>
      ${stepsHtml}
      <p style="margin: 0 0 20px 0;">Falls wir Rückfragen haben oder weitere Unterlagen benötigen, werden wir Sie unter Ihrer angegebenen Telefonnummer kontaktieren.</p>
      <p style="margin: 20px 0 0 0; color: #1F2328; font-weight: 500;">
        Mit freundlichen Grüßen,<br>
        <span style="color: #234436; font-weight: 700;">Ihr Team von mein-baupotenzial.de</span>
      </p>
    `;

    const html = wrapInEmailTemplate(title, bodyContent);
    await sendMail(toEmail, `Nächste Schritte für Ihre Analyse (${packageName})`, html);
  },

  // Internal team notifications
  async sendInternalNewLead(leadId: string, name: string, email: string, packageName: string) {
    const title = 'Neuer Lead (Draft) erstellt';
    
    const bodyContent = `
      <p>Ein neuer Lead wurde gestartet:</p>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><strong>Lead ID:</strong> ${leadId}</li>
        <li style="margin-bottom: 8px;"><strong>Name:</strong> ${name || 'N/A'}</li>
        <li style="margin-bottom: 8px;"><strong>Email:</strong> ${email || 'N/A'}</li>
        <li style="margin-bottom: 8px;"><strong>Gewähltes Paket:</strong> ${packageName || 'N/A'}</li>
      </ul>
      <p style="margin-top: 24px;"><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/dashboard" style="background: #234436; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Zum Admin Dashboard</a></p>
    `;

    const html = wrapInInternalEmailTemplate(title, bodyContent);
    await sendMail(TEAM_EMAIL, `[Lead Start] Neuer Lead ${leadId.substring(0, 8)}`, html);
  },

  async sendInternalCompletedSubmission(leadId: string, name: string, packageName: string, paymentMethod: string) {
    const title = 'Wizard vollständig abgeschlossen';
    
    const bodyContent = `
      <p>Ein Kunde hat den Wizard ausgefüllt und eingereicht:</p>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><strong>Lead ID:</strong> ${leadId}</li>
        <li style="margin-bottom: 8px;"><strong>Name:</strong> ${name}</li>
        <li style="margin-bottom: 8px;"><strong>Paket:</strong> ${packageName}</li>
        <li style="margin-bottom: 8px;"><strong>Zahlungsart:</strong> ${paymentMethod}</li>
      </ul>
      <p style="margin-top: 24px;"><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/dashboard" style="background: #234436; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Lead ansehen</a></p>
    `;

    const html = wrapInInternalEmailTemplate(title, bodyContent);
    await sendMail(TEAM_EMAIL, `[Lead Eingereicht] Lead ${leadId.substring(0, 8)} (${packageName})`, html);
  },

  async sendInternalPaymentReceived(leadId: string, amount: number, paymentMethod: string) {
    const title = 'Zahlung empfangen!';
    
    const bodyContent = `
      <p>Für den Lead wurde eine Zahlung bestätigt:</p>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><strong>Lead ID:</strong> ${leadId}</li>
        <li style="margin-bottom: 8px;"><strong>Betrag:</strong> ${amount.toFixed(2)} €</li>
        <li style="margin-bottom: 8px;"><strong>Zahlungsmethode:</strong> ${paymentMethod}</li>
      </ul>
      <p style="margin-top: 24px;"><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/dashboard" style="background: #234436; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">Lead bearbeiten</a></p>
    `;

    const html = wrapInInternalEmailTemplate(title, bodyContent);
    await sendMail(TEAM_EMAIL, `[Zahlung] 💰 Zahlung erhalten für Lead ${leadId.substring(0, 8)}`, html);
  },

  async sendNewsletterWelcome(toEmail: string, name?: string) {
    const title = 'Willkommen bei mein-baupotenzial.de!';
    const displayName = name ? `Hallo ${name}` : 'Hallo';
    
    const bodyContent = `
      <p style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1F2328;">${displayName},</p>
      <p style="margin: 0 0 16px 0;">vielen Dank für Ihre Anmeldung zu unserem Newsletter! Wir freuen uns, Sie auf Ihrem Weg zum maximalen Baupotenzial begleiten zu dürfen.</p>
      <p style="margin: 0 0 16px 0;">Ab sofort erhalten Sie regelmäßig wertvolle Tipps, Fallbeispiele und Experten-Einblicke rund um das deutsche Bauplanungsrecht, Nachverdichtung, Aufstockung und städtebauliche Analysen – direkt und auf den Punkt gebracht.</p>
      <div style="background-color: #EAF0EC; border-left: 4px solid #234436; padding: 16px; margin: 24px 0; border-radius: 4px;">
        <p style="margin: 0; font-size: 13px; color: #234436; font-weight: 600;">
          Wussten Sie schon?<br>
          Über 40 Jahre Erfahrung in der städtebaulichen Beratung fließen in unsere Analysen und Tipps ein.
        </p>
      </div>
      <p style="margin: 0 0 20px 0;">Falls Sie Fragen zu unseren Analyse-Paketen haben, können Sie jederzeit einfach auf diese E-Mail antworten.</p>
      <p style="margin: 20px 0 0 0; color: #1F2328; font-weight: 500;">
        Mit freundlichen Grüßen,<br>
        <span style="color: #234436; font-weight: 700;">Ihr Team von mein-baupotenzial.de</span>
      </p>
    `;

    const html = wrapInEmailTemplate(title, bodyContent);
    await sendMail(toEmail, 'Willkommen bei mein-baupotenzial.de (Newsletter)', html);
  },

  async sendInternalNewSubscriber(email: string, name?: string, source?: string) {
    const title = 'Neuer Newsletter-Abonnent';
    const bodyContent = `
      <p>Es gibt eine neue Newsletter-Anmeldung auf der Plattform:</p>
      <ul style="padding-left: 20px;">
        <li style="margin-bottom: 8px;"><strong>E-Mail:</strong> ${email}</li>
        <li style="margin-bottom: 8px;"><strong>Name:</strong> ${name || 'N/A'}</li>
        <li style="margin-bottom: 8px;"><strong>Quelle:</strong> ${source || 'NEWSLETTER'}</li>
        <li style="margin-bottom: 8px;"><strong>Datum:</strong> ${new Date().toLocaleString('de-DE')}</li>
      </ul>
    `;

    const html = wrapInInternalEmailTemplate(title, bodyContent);
    await sendMail(TEAM_EMAIL, `[Newsletter] Neuer Abonnent: ${email}`, html);
  }
};
