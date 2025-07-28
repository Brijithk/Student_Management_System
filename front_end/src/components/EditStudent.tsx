import '../css/EditStudent.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const EditStudent = () => {
 const [phones, setPhones] = useState<string[]>(['']);
const [phoneErrors, setPhoneErrors] = useState<string[]>(['']);

    const navigate = useNavigate();
const { roll } = useParams();

useEffect(() => {
  if (roll) {
    axios.get(`http://localhost:3000/login/getStudent/${roll}`)
      .then(res => {
        const student = res.data;

        setFormValues({
          roll: student.roll,
          username: student.username,
          age: student.age,
          maths: student.marks.maths,
          physics: student.marks.physics,
          chemistry: student.marks.chemistry,
          computer: student.marks.computer,
          english: student.marks.english
        });

        setPhones(student.phones);
      })
      .catch(err => {
        console.error('Failed to fetch student data', err);
      });
  }
}, [roll]);

const handlePhoneChange = (index: number, value: string) => {
  const updatedPhones = [...phones];
  updatedPhones[index] = value;
  setPhones(updatedPhones);

  const updatedErrors = [...phoneErrors];
   if (!/^\d*$/.test(value)) {
    updatedErrors[index] = '! Only numbers allowed';
  }

  else if (value.length !== 0 && value.length !== 10) {
    updatedErrors[index] = 'Phone number must be exactly 10 digits.';
  } 
  else {
    updatedErrors[index] = '';
  }
  setPhoneErrors(updatedErrors);
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valid = validateForm();
  if (!valid) {
    alert("Please fix the form errors before submitting.");
    return;
  }
  const errorInputs = document.querySelectorAll('.input-error');
if (errorInputs.length > 0) {
  alert(".input-error.input-error.input-errorPlease correct the highlighted fields before submitting.");
  return;
}
    const userData = {
  roll: formValues.roll,
  username: formValues.username,
  age: formValues.age,
  marks: {
    english: formValues.english,
    computer: formValues.computer,
    maths: formValues.maths,
    physics: formValues.physics,
    chemistry: formValues.chemistry,
  },
  phones
};

    try {
      const res = await axios.patch(`http://localhost:3000/login/updateStudent?roll=${formValues.roll}`, userData);

      alert('User registered successfully!');
      navigate('/users'); 
      console.log(res.data);
    } catch (err) {
      console.error('Error registering user', err);
      alert('Failed to register user.');
    }
  };
const [formValues, setFormValues] = useState({
  roll: '',
  username: '',
  age: '',
  maths: '',
  physics: '',
  chemistry: '',
  computer: '',
  english: '',
});

const [formErrors, setFormErrors] = useState({
  roll: '',
  username: '',
  age: '',
  maths: '',
  physics: '',
  chemistry: '',
  computer: '',
  english: '',
});
const validateForm = () => {
  let isValid = true;
  const errors: any = {};
  const phoneErrorsTemp: string[] = [];


  if (!/^\d{1,3}$/.test(formValues.roll)) {
    errors.roll = 'Roll No must be a number between 1 and 999.';
    isValid = false;
  }


  if (formValues.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
    isValid = false;
  }


  const ageNum = Number(formValues.age);
  if (isNaN(ageNum) || ageNum < 5 || ageNum > 99) {
    errors.age = 'Age must be between 5 and 99.';
    isValid = false;
  }


  ['maths', 'physics', 'chemistry', 'computer', 'english'].forEach((subject) => {
    const markValue = (formValues as any)[subject];

    if (!/^\d{1,3}$/.test(markValue)) {
      errors[subject] = 'Marks must be a number between 0 and 100.';
      isValid = false;
    } else if (Number(markValue) > 100) {
      errors[subject] = 'Marks cannot exceed 100.';
      isValid = false;
    }
  });


  phones.forEach((phone, index) => {
    if (!/^\d+$/.test(phone)) {
      phoneErrorsTemp[index] = '! Only numbers allowed';
      isValid = false;
    } else if (phone.length !== 10) {
      phoneErrorsTemp[index] = 'Phone number must be exactly 10 digits.';
      isValid = false;
    } else {
      phoneErrorsTemp[index] = '';
    }
  });

  
  setFormErrors(errors);
  setPhoneErrors(phoneErrorsTemp);
   console.log("Errors object:", errors);
 console.log("Validation final result:", isValid);
console.log("Final isValid value before returning:", isValid);
  return isValid;
};



const validateField = (name: string, value: string) => {
  let error = '';

  switch (name) {
    case 'roll':
      if (!/^\d{1,3}$/.test(value)) {
        error = 'Roll No must be a number between 1 and 999.';
      }
      break;

    case 'username':
      if (value.trim().length < 3) {
        error = 'Username must be at least 3 characters.';
      }
      break;

    case 'age':
        const ageNum = Number(value);
  if (isNaN(ageNum)) {
    error = 'Age must be a valid number.';
  } else if (ageNum < 5) {
    error = 'Age must be at least 5.';
  } else if (ageNum > 99) {
    error = 'Age cannot exceed 99.';
  }
      break;

    case 'maths':
    case 'physics':
    case 'chemistry':
    case 'computer':
    case 'english':
      if (!/^\d{1,3}$/.test(value)) {
        error = 'Marks must be a number between 0 and 100.';
      } else if (Number(value) > 100) {
        error = 'Marks cannot exceed 100.';
      }
      break;

    default:
      break;
  }

  setFormErrors(prev => ({ ...prev, [name]: error }));
};


  return (
    <div className='register-main-container'>
      <div className='register-inner-container'>
        <h1 className='Register-heading'>Update Student</h1>
    
        <form className='register-input-container' onSubmit={handleSubmit}>
         <div className='div1'>
          <p className='p1'>Student Details</p>
          <p className='p12'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Roll no: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Student Name:</p>
          <input
  className={`p2 ${formErrors.roll ? 'input-error' : ''}`}
  type="text"
  placeholder="Roll No"
  name="roll"
  value={formValues.roll}
  onChange={(e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  }}
  readOnly
/>
{formErrors.roll && <p className="p19">{formErrors.roll}</p>}
         <input
    className={`p3 ${formErrors.username ? 'input-error' : ''}`}
    type="text"
    placeholder="Username"
    name="username"
    value={formValues.username}
    onChange={(e) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }}
    required
  />
 
  <p className="p20">{formErrors.username}</p>
            <p className='p13'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Age:&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Phone Number:</p>
         <input
    className={`p4 ${formErrors.age ? 'input-error' : ''}`}
    type="text"
    placeholder="Age"
    name="age"
    value={formValues.age}
    onChange={(e) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }}
    required
  />

  <p className="p21">{formErrors.age}</p>
           
           
          {phones.map((phone, index) => (
  <div key={index}>
    <input
      className={`p5 ${phoneErrors[index] ? 'input-error' : ''}`}
      type="text"
      value={phone}
      onChange={(e) => handlePhoneChange(index, e.target.value)}
      placeholder="Enter phone number"
      required
    />
    {phoneErrors[index] && <p className="p18">{phoneErrors[index]}</p>}
  </div>
))}
           
          </div>
          <div className='div2'>
               <p className='p6'>Academic Performance</p>
                 <p className='p14'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maths mark: &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Physics mark:</p>
            <input
    className={`p7 ${formErrors.maths ? 'input-error' : ''}`}
    type="text"
    placeholder="Maths mark"
    name="maths"
    value={formValues.maths}
    onChange={(e) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }}
    required
  />
  <p className="p22">{formErrors.maths}</p>
          <input
    className={`p8 ${formErrors.physics ? 'input-error' : ''}`}
    type="text"
    placeholder="Physics mark"
    name="physics"
    value={formValues.physics}
    onChange={(e) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }}
    required
  />
  <p className="p23">{formErrors.physics}</p>
          <p className='p15'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chemistry mark:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            Computer mark:</p>
      <input
    className={`p9 ${formErrors.chemistry ? 'input-error' : ''}`}
    type="text"
    placeholder="Chemistry mark"
    name="chemistry"
    value={formValues.chemistry}
    onChange={(e) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }}
    required
  />
  <p className="p24">{formErrors.chemistry}</p>
           <input
    className={`p10 ${formErrors.computer ? 'input-error' : ''}`}
    type="text"
    placeholder="Computer mark"
    name="computer"
    value={formValues.computer}
    onChange={(e) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }}
    required
  />
  <p className="p25">{formErrors.computer}</p>
           <p className='p16'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;English mark:</p>
          <input
    className={`p11 ${formErrors.english ? 'input-error' : ''}`}
    type="text"
    placeholder="English mark"
    name="english"
    value={formValues.english}
    onChange={(e) => {
      const { name, value } = e.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
      validateField(name, value);
    }}
    required
  />
  <p className="p26">{formErrors.english}</p>

        

          </div>
        <div className='div3'>
          <button className='p17' type="submit">+ Update</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
