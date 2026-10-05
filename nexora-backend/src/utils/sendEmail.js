const {Resend} = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({to, subject, html, text}) => {
    if (!html && !text) {
        throw new Error('sendEmail: باید حداقل یکی از فیلدهای html یا text ارسال شود');
    }

    const {data, error} = await resend.emails.send({
        from: process.env.RESEND_FROM || 'Nexora <onboarding@resend.dev>',
        to,
        subject,
        ...(html && {html}),
        ...(text && {text}),
    });

    if (error) {
        console.error('❌ Resend Error:', error);
        throw error;
    }

    console.log('✅ Email sent:', data);

    return data;
};

module.exports = sendEmail;
