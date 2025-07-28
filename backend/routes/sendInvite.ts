// sendInvite.ts
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/api/send-invite', async (req, res) => {
  const { fullName, classAssigned, sectionAssigned, emailAddress } = req.body;

  if (!emailAddress) return res.status(400).json({ error: 'Email is required' });

  const inviteCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

  // ✅ Configure transporter (Use real creds or env variables)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'keranbrijith@gmail.com',
      pass: 'vmtwbvyvfaonvgf', // not your real password!
    },
  });

  const mailOptions = {
    from: '"Principal Panel" <keranbrijith@gmail.com>',
    to: emailAddress,
    subject: 'Teacher Registration Invitation',
    text: `Hello ${fullName},\n\nYou’ve been invited to join as a class teacher for Class ${classAssigned} - Section ${sectionAssigned}.\n\nUse the following code to register: ${inviteCode}\n\nThank you.`,
  };
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter failed to connect:', error);
  } else {
    console.log('Server is ready to take messages');
  }
});
console.log("Using email:", process.env.EMAIL_USER);
console.log("Using password:", process.env.EMAIL_PASS);
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invite sent to ${emailAddress}`);
    return res.status(200).json({ message: 'Invite sent successfully', code: inviteCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send invite' });
  }
});

export default router;
