import nodemailer from 'nodemailer';

const sendmail = async (req, app) => {
  if (req.method === 'POST') {
    try {
      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'YourEmailService', // e.g., 'Gmail'
        auth: {
          user: 'team@digitalvaults.org',
          pass: 'vrixdsvmyvynwimf',
        },
      });

      // Email content
      const { name, email, message, subject } = req.body;

      const mailOptions = {
        from: email,
        to: email,
        subject: `${name} | ${subject}`,
        text: `${message}`,
      };

      // Send email
      await transporter.sendMail(mailOptions);
      return { code: 200, type: "success", data: 'Email sent successfully' };
      
    } catch (error) {
      console.error(error);
      return { code: 500, type: "error", data: 'Internal Server Error' };
      
    }
  } else {

    return { code: 405, type: "error", data: 'Invalid request' };
  }
};

export default sendmail;