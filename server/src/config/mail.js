const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@phonebook.com';

  if (!apiKey) {
    console.log('=== DEVELOPMENT MODE: MOCK EMAIL SENT ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`HTML Body:`);
    console.log(html);
    console.log('=========================================');
    return { success: true, mock: true };
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'PhoneBook', email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();
    if (response.status >= 200 && response.status < 300) {
      return { success: true, data };
    } else {
      console.error('Brevo API Error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }
  } catch (error) {
    console.error('Error sending email via Brevo:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendEmail };
