const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Contact Email Protocol
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing protocol parameters' });
  }

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: `CodeBuddy Terminal <${process.env.EMAIL_USER}>`,
        to: 'khushantsharma766@gmail.com',
        subject: `[Protocol Transmission] ${subject}`,
        html: `
          <div style="font-family: 'Courier New', monospace; background: #0a0a0a; color: #fff; padding: 40px; border: 1px solid #1e56a0;">
            <h2 style="color: #4da8da; text-transform: uppercase;">Incoming Transmission Identified</h2>
            <hr style="border: 0; border-top: 1px solid #1e56a0; margin: 20px 0;" />
            <p><strong>Identity:</strong> ${name}</p>
            <p><strong>Link Node:</strong> ${email}</p>
            <p><strong>Objective:</strong> ${subject}</p>
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-left: 4px solid #4da8da; margin-top: 20px;">
              <p style="margin: 0;">${message}</p>
            </div>
            <p style="color: #666; font-size: 10px; margin-top: 40px; text-transform: uppercase;">Neural OS Central Command - CodeBuddy</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Transmission received by Central Command.' });
    } else {
      console.log('--- MOCK EMAIL TRANSMISSION ---');
      console.log(`To: khushantsharma766@gmail.com`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${message}`);
      console.log('--- MISSING EMAIL_USER/EMAIL_PASS IN .ENV ---');
      res.json({ success: true, message: 'Transmission simulated (SMTP missing).' });
    }
  } catch (err) {
    console.error('Contact Protocol Failure:', err);
    res.status(500).json({ error: 'Core communication failure.' });
  }
});

module.exports = router;
