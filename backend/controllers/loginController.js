import { Login } from '../models/login.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Student } from '../models/login.js';

export const addAdmin = async(req, res) =>{

    const user = new Login(req.body)
     const {username, password}=user;
     const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
        if (!passwordPattern.test(password)) {
       return res.status(400).json({ message: "Weak password" });
          }
    await user.save()
     res.status(201).json({ message: 'User added successfully', user });
}

export const getAdmin = async(req, res) =>{
   const user=await Login.find();
   console.log('User retrieved:', user);
   res.json(user);
}
export const deleteAdmin = async(req, res) =>{
     const username = req.query.username;
   await Login.deleteOne({ username: username });
   res.status(200).json({ message: 'User deleted successfully' });
}

export const updateAdmin = async(req, res)=>{
    const  username  = req.query.username;
       const updatedUser = await Login.findOneAndUpdate(
      { username: username },
      { $set: req.body }                 // update provided fields
       );
       res.status(200).json({ message: 'User updated successfully', updatedUser });
}

export const changeAdmin = async(req,res)=>{
  const username = req.query.username;
  const user = await Login.findOne({ username });
      
  const updatedUser = await Login.findOneAndUpdate(
    { _id: user._id },
    req.body,
    { new: true, overwrite: true }
  );
  res.json(updatedUser);
}
export const changeAdmin1 = async(req,res)=>{
  const email = req.query.email;
  const user = await Login.findOne({ email });
    let updateData = { ...req.body };
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }
  
  const updatedUser = await Login.findOneAndUpdate(
    { _id: user._id },
    {
        $set: updateData
     
      },
    { new: true, overwrite: true }
  );
    await Login.updateOne(
      { _id: user._id },
      { $unset: { email: "", authCode: "" } }
    );
  res.json(updatedUser);
}
export const getTeacherByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const teacher = await Login.findOne({ username });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    console.log("Teacher found:", teacher);
    res.json({
      username: teacher.username,
      class: teacher.class,
      section: teacher.section,
      name:teacher.name
    });
  } catch (err) {
    console.error("Error fetching teacher:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




//Student Routes

export const addStudent = async(req, res) =>{

    const user = new Student(req.body)
    await user.save()
     res.status(201).json({ message: 'User added successfully', user });
}

export const getStudent1 = async(req, res) =>{
   const user=await Student.find();
   console.log('User retrieved:', user);
   res.json(user);
}
export const getStudent = async (req, res) => {
  try {
    const roll = req.params.roll;
    const student = await Student.findOne({ roll: roll });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    console.log('Student retrieved:', student);
    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStudent = async(req, res) =>{
     const received = req.query.roll;
   const result = await Student.deleteOne({ roll: received });
   console.log(result);
   res.status(200).json({ message: 'User deleted successfully' });
}

export const updateStudent = async(req, res)=>{
    const  roll  = req.query.roll;
       const updatedUser = await Student.findOneAndUpdate(
      { roll: roll },
      { $set: req.body }                 // update provided fields
       );
       res.status(200).json({ message: 'User updated successfully', updatedUser });
}

export const changeStudent = async(req,res)=>{
  const roll = req.query.roll;
  const user = await Student.findOne({ roll });
   if (!user) {
    return res.status(404).json({ message: "Student not found" });
  }
  const updatedUser = await Student.findOneAndUpdate(
    { _id: user._id },
    req.body,
    { new: true, overwrite: true }
  );
  res.json(updatedUser);
}

export const getUser= async (req, res) => {
  try {
    const classId = req.params.classId; // e.g., "class12"
    const classNumber = classId.replace('class', ''); // Extract "12" from "class12"

    const students = await StudentModel.find({ class: classNumber });

    res.json(students);
  } catch (error) {
    console.error('Error fetching students by class:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//     UI ROUTES

export const login = async (req, res) => {
 const { username, password } = req.body;

  try {
    const user = await Login.findOne({username});
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, 'mySecretKey', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
export const welcome = async(req,res)=>{
     const user=await Student.find();
   console.log('User retrieved:', user);
   res.json(user);
}






















// export const headerData= async(req,res)=>{
     
//         const  roll  = req.query.roll;
//         const user = await Login.findOne({ roll});
//           if (!user) {
//       return res.status(404).end();  
//     }
//     res.set({
//     'Content-Type': 'application/json',
//     'X-User-Exists': 'true'
//   });

//      res.status(200).end();
// }
// export const headerOptions= async(req,res)=>{
     
//        res.set({
//     'Allow': 'GET, POST, DELETE, OPTIONS',
//     'Access-Control-Allow-Methods': 'GET, POST, DELETE',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Headers': 'Content-Type'
//   });
//   res.status(204).end(); 
// }