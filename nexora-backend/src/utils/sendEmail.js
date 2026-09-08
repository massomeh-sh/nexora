const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM || 'Nexora <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) {
    console.error('❌ Resend Error:', error);
    throw error;
  }

  console.log('✅ Email sent:', data);

  return data;
};

module.exports = sendEmail;