import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const loginSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true} ,
   name: { type: String, required: true },
  class: { type: String, required: true },
   section: { type: String, required: true },
  password: { type: String, required: true },
   email: { type: String},
    authCode:{ type: String},
});


const studentSchema = new mongoose.Schema({
  roll :{type: String, required: true, unique: true},
  username: { type: String, required: true }, 
  class: { type: String, required: true }, 
  gender: { type: String, required: true }, 
  section: { type: String, required: true },
  classTeacher: { type: String, required: true },
    marks: {
    term1: {
      english: { type: String },
      computer: { type: String},
      maths: { type: String },
    },
    term2: {
      english: { type: String },
      computer: { type: String },
      maths: { type: String },
    },
    term3: {
      english: { type: String},
      computer: { type: String },
      maths: { type: String },
    }
  }
});


// Hash password before saving
loginSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const Login = mongoose.model("Login", loginSchema);
export const Student = mongoose.model("Student", studentSchema);
