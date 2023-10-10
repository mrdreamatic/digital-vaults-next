import nodemailer from 'nodemailer';

const sendmail = async (req, app) => {
  if (req.method === 'POST') {
    try {
      // Create a nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: 'Gmail', // e.g., 'Gmail'
        auth: {
          user: 'noreply@sssmediacentre.org',
          pass: 'vrixdsvmyvynwimf',
        },
      });

      // Email content
      const { name, email, message, subject, gtoken } = req.body;

      const mailOptions = {
        from: email,
        to: 'developer@sssmediacentre.org',
        subject: `${name} | ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };
      let captcha = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=6LfS2-cnAAAAAOfjG0XmdZMJXZga1Azn6hzFSNF1&response=${gtoken}`,
      });
      if(captcha.status === 200 && captcha.statusText === 'OK'){
        
          await transporter.sendMail(mailOptions);
          return { code: 200, type: "success", data: 'Email sent successfully' };
       
      }else{
        return { code: 403, type: "error", data: 'Google ReCaptcha Failure' };
      }
      
      // Send email
      
      
    } catch (error) {
      console.error(error);
      return { code: 500, type: "error", data: 'Internal Server Error' };
      
    }
  } else {

    return { code: 405, type: "error", data: 'Invalid request' };
  }
};

export default sendmail;