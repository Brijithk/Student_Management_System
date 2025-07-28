import express from 'express';
import { addAdmin,addStudent, changeAdmin ,changeStudent} from '../controllers/loginController.js'; // Import the login function
import { getAdmin ,getStudent1} from '../controllers/loginController.js';
import { deleteAdmin ,deleteStudent} from '../controllers/loginController.js';
import { updateAdmin,updateStudent } from '../controllers/loginController.js';
import { welcome } from '../controllers/loginController.js';
import { login } from '../controllers/loginController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { getStudent } from '../controllers/loginController.js';
import { getTeacherByUsername } from '../controllers/loginController.js';
import { getUser } from '../controllers/loginController.js';
import nodemailer from 'nodemailer';
import {Login} from '../models/login.js';
import { changeAdmin1 } from '../controllers/loginController.js';

const router = express.Router();


//Admin and Teacher Routes
router.post('/postLogin', addAdmin);
router.get('/getAdmin', getAdmin);
router.delete('/deleteAdmin', deleteAdmin);
router.patch('/updateAdmin', updateAdmin);
router.put('/changeAdmin', changeAdmin);
router.put('/changeAdmin1', changeAdmin1);
router.get('/getTeacher/:username', getTeacherByUsername);



//Student Routes
router.post('/postStudent', addStudent);
router.get('/getStudent', getStudent1);
router.get('/getStudent/:roll', getStudent);
router.delete('/deleteStudent', deleteStudent);
router.patch('/updateStudent', updateStudent);
router.put('/changeStudent', changeStudent);
router.put('/users/:classId', getUser);


router.post('/login', login);
router.get('/welcome', verifyToken, welcome);

router.post('/api/send-invite', async (req, res) => {
  const { name, class: classAssigned, section, email } = req.body;
  console.log(name, classAssigned, section, email);
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const inviteCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code

  // ✅ Configure transporter (Use real creds or env variables)
  const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
    auth: {
      user: 'keranbrijith@gmail.com',
      pass: 'eidamcrbfmqdemgq', // not your real password!
    },
  });

  const mailOptions = {
    from: '"Principal Panel" <keranbrijith@gmail.com>',
    to:email,
    subject: 'Teacher Registration Invitation',
    text: `Hello ${name},\n\nYou’ve been invited to join as a class teacher for Class ${classAssigned} - Section ${section}.\n\nUse the following code to register: ${inviteCode}\n\nThank you.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Invite sent to ${email}`);
     const existing = await Login.findOne({ email });
    if (existing) {
      // Update the existing entry (maybe resend)
      existing.authCode = inviteCode;
      existing.name = name;
      existing.class = classAssigned;
      existing.section = section;
      await existing.save();
    } else {
      // Create new admin entry
      const newAdmin = new Admin({
        name,
        class: classAssigned,
        section,
        email,
        authCode: inviteCode,
        username: '',
        password: '',
      });
      await newAdmin.save();
    }

    return res.status(200).json({ message: 'Invite sent successfully', code: inviteCode });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send invite' });
  }
});

export default router;



// {
//     "roll":"006",
//     "username":"brijith",
//     "age":"42",
//     "phones":["9876543210","9876543210"],
//     "marks":{
//              "english":"42",
//               "computer":"33",
//                "maths":"78",
//                "physics":"90",
//                "chemistry":"90"
// }
// }
// http://localhost:3000/login/postStudent
















// router.head('/headerData', headerData);
// router.options('/headerOptions', headerOptions);
// import { headerData } from '../controllers/loginController.js';
// import { headerOptions } from '../controllers/loginController.js';



