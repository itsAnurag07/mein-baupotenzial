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

const FROM_EMAIL = process.env.EMAIL_FROM || 'info@mein-baupotenzial.com';
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

export const emailService = {
  // Customer notifications
  async sendOrderConfirmation(toEmail: string, name: string, packageName: string, amount: number, isBankTransfer: boolean, leadId: string) {
    const paymentInfo = isBankTransfer 
      ? `<p>Bitte überweisen Sie den Betrag von <strong>${amount.toFixed(2)} € (zzgl. MwSt.)</strong> auf folgendes Konto:</p>
         <table style="border: 1px solid #ddd; padding: 10px; width: 100%;">
           <tr><td><strong>Empfänger:</strong></td><td>van Valkenburg GmbH</td></tr>
           <tr><td><strong>Bank:</strong></td><td>GLS Gemeinschaftsbank eG</td></tr>
           <tr><td><strong>IBAN:</strong></td><td>DE62 4306 0967 1324 3634 00</td></tr>
           <tr><td><strong>BIC:</strong></td><td>GENODEM1GLS</td></tr>
           <tr><td><strong>Verwendungszweck:</strong></td><td>Analyse ${leadId.substring(0, 8)}</td></tr>
         </table>
         <p>Die Analyse beginnt unmittelbar nach Zahlungseingang. Eine entsprechende Rechnung wird Ihnen nach Zahlungseingang zugesandt.</p>`
      : `<p>Vielen Dank für Ihre PayPal-Zahlung. Wir haben Ihre Zahlung von <strong>${amount.toFixed(2)} € (zzgl. MwSt.)</strong> erhalten.</p>`;

    const html = `
      <div style="font-family: Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B1F3A;">Auftragsbestätigung - mein-baupotenzial.de</h2>
        <p>Hallo ${name},</p>
        <p>Vielen Dank für Ihren Auftrag zur Durchführung eines <strong>${packageName}</strong> für Ihr Grundstück.</p>
        ${paymentInfo}
        <p><strong>Wichtiger Hinweis:</strong><br>
        Dies ist eine bauplanungsrechtliche Potenzialanalyse und Machbarkeits-Vorprüfung, kein offizielles Baugenehmigungsverfahren und ersetzt keinen Bauantrag.
        </p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von mein-baupotenzial.de<br>van Valkenburg GmbH</p>
      </div>
    `;
    await sendMail(toEmail, `Auftragsbestätigung: Ihr ${packageName} bei mein-baupotenzial.de`, html);
  },

  async sendPaymentConfirmation(toEmail: string, name: string, packageName: string, amount: number) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B1F3A;">Zahlungseingang bestätigt - mein-baupotenzial.de</h2>
        <p>Hallo ${name},</p>
        <p>Wir bestätigen den Erhalt Ihrer Zahlung in Höhe von <strong>${amount.toFixed(2)} €</strong> für die Analyse <strong>${packageName}</strong>.</p>
        <p>Unser Expertenteam prüft nun Ihr Grundstück. Wir melden uns in Kürze mit den nächsten Schritten und dem fertigen Bericht.</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von mein-baupotenzial.de<br>van Valkenburg GmbH</p>
      </div>
    `;
    await sendMail(toEmail, `Zahlungseingang bestätigt: ${packageName}`, html);
  },

  async sendNextSteps(toEmail: string, name: string, packageName: string, timeline: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B1F3A;">Nächste Schritte für Ihre Analyse</h2>
        <p>Hallo ${name},</p>
        <p>Ihre Daten sind sicher bei uns eingegangen und wir haben mit der Auswertung begonnen.</p>
        <p><strong>Was passiert als Nächstes?</strong></p>
        <ol>
          <li>Unsere Experten werten die Flurkarten und Bauordnungen aus.</li>
          <li>Wir erstellen Ihren individuellen PDF-Bericht (Dauer ca. 5-7 Werktage).</li>
          ${packageName !== 'Quick Check' ? '<li>Wir kontaktieren Sie zur Abstimmung unseres gemeinsamen Beratungsgesprächs.</li>' : ''}
        </ol>
        <p>Falls wir Rückfragen haben, melden wir uns unter Ihrer Telefonnummer.</p>
        <p>Mit freundlichen Grüßen,<br>Ihr Team von mein-baupotenzial.de</p>
      </div>
    `;
    await sendMail(toEmail, `Nächste Schritte für Ihre Analyse (${packageName})`, html);
  },

  // Internal team notifications
  async sendInternalNewLead(leadId: string, name: string, email: string, packageName: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F766E;">Neuer Lead (Draft) erstellt</h2>
        <p>Ein neuer Lead wurde gestartet:</p>
        <ul>
          <li><strong>Lead ID:</strong> ${leadId}</li>
          <li><strong>Name:</strong> ${name || 'N/A'}</li>
          <li><strong>Email:</strong> ${email || 'N/A'}</li>
          <li><strong>Gewähltes Paket:</strong> ${packageName || 'N/A'}</li>
        </ul>
        <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/dashboard" style="background: #0B1F3A; color: #fff; padding: 8px 15px; text-decoration: none; border-radius: 4px;">Zum Admin Dashboard</a></p>
      </div>
    `;
    await sendMail(TEAM_EMAIL, `[Lead Start] Neuer Lead ${leadId.substring(0, 8)}`, html);
  },

  async sendInternalCompletedSubmission(leadId: string, name: string, packageName: string, paymentMethod: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F766E;">Wizard vollständig abgeschlossen</h2>
        <p>Ein Kunde hat den Wizard ausgefüllt und eingereicht:</p>
        <ul>
          <li><strong>Lead ID:</strong> ${leadId}</li>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Paket:</strong> ${packageName}</li>
          <li><strong>Zahlungsart:</strong> ${paymentMethod}</li>
        </ul>
        <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/dashboard" style="background: #0B1F3A; color: #fff; padding: 8px 15px; text-decoration: none; border-radius: 4px;">Lead ansehen</a></p>
      </div>
    `;
    await sendMail(TEAM_EMAIL, `[Lead Eingereicht] Lead ${leadId.substring(0, 8)} (${packageName})`, html);
  },

  async sendInternalPaymentReceived(leadId: string, amount: number, paymentMethod: string) {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1F2937; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0B1F3A;">💰 Zahlung empfangen!</h2>
        <p>Für den Lead wurde eine Zahlung bestätigt:</p>
        <ul>
          <li><strong>Lead ID:</strong> ${leadId}</li>
          <li><strong>Betrag:</strong> ${amount.toFixed(2)} €</li>
          <li><strong>Zahlungsmethode:</strong> ${paymentMethod}</li>
        </ul>
        <p><a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/dashboard" style="background: #0B1F3A; color: #fff; padding: 8px 15px; text-decoration: none; border-radius: 4px;">Lead bearbeiten</a></p>
      </div>
    `;
    await sendMail(TEAM_EMAIL, `[Zahlung] 💰 Zahlung erhalten für Lead ${leadId.substring(0, 8)}`, html);
  }
};
