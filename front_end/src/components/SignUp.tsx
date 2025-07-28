import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';
import '../css/SignUp.css';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
   const [authCode, setAuthCode] = useState('');
    const [expectedAuthCode, setExpectedAuthCode] = useState('');
   const [email, setEmail] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [showConfirmPassword, setShowConfirmPassword] = useState(false);
      const [errors, setErrors] = useState<{ username?: string; password?: string; confirmPassword?: string }>({});
      const navigate = useNavigate();
       
      const handleSignUp = async (e: React.FormEvent) => {
                   e.preventDefault();
      const newErrors: typeof errors = {};
      if (!username.trim()) newErrors.username = 'Username is required';
          if (!password) {
  newErrors.password = 'Password is required';
} else if (!passwordPattern.test(password)) {
  newErrors.password = 'Password is too weak';
} else if (password !== confirmPassword) {
  newErrors.password = 'Passwords do not match';
}
     console.log('Initial validation errors:', newErrors);
      const res = await axios.get('http://localhost:3000/login/getAdmin');
      const existingAdmins = res.data;
         
    
      const usernameExists = existingAdmins.some((admin: any) => admin.username === username);
      const emailExists = existingAdmins.some((admin: any) => admin.email === email); 
      if (usernameExists) {
      
        newErrors.username = 'Username already exists. Please choose a different one.';
        setErrors(newErrors); 
        console.log('Duplicate username found, updated errors:', newErrors);
        setTimeout(() => {}, 0); 
      
  return;

      }
        if (emailExists) {
              const matchedAdmin = existingAdmins.find((admin: any) => admin.email === email);  
                if (!matchedAdmin) {
        alert(  'Email not found in system.' );
          setExpectedAuthCode(matchedAdmin.authCode);

      // Step 3: Compare auth code
      if (matchedAdmin.authCode === authCode) {
        alert('✅ Authentication successful!'); // Or show a toast
      //   await axios.post('http://localhost:3000/login/postLogin', {
      //   username,
      //   password,
      //   authCode,
      //     email,
      //      name: matchedAdmin.name,
      //   class: matchedAdmin.class,
      //   section: matchedAdmin.section
      // });
   
        // Proceed with allowing password change or next step
      } else {
        alert('❌ Incorrect authentication code.');
      }
        return;
      }   
}                                                                                                              setErrors(newErrors);if (Object.keys(newErrors).length === 0) {try {
                    const matchedAdmin = existingAdmins.find((admin: any) => admin.email === email);  

           await axios.put(`http://localhost:3000/login/changeAdmin1?email=${email}`, {
  username,
  password,
  authCode,
          email,
        name: matchedAdmin.name,
        class: matchedAdmin.class,
        section: matchedAdmin.section
});  
 
     navigate('/users');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Registration error:', error);
        newErrors.password = 'Password is too weak';
        setErrors(newErrors); 
      // alert('Failed to register. Please try again.');
      
    }
  }
};

const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;

React.useEffect(() => {
  const newErrors: typeof errors = { ...errors };
  
  if (password && !passwordPattern.test(password)) {
    newErrors.password = 'Password is too weak';
  } else if (errors.password === 'Password is too weak') {
    delete newErrors.password; // Remove the error if now it's valid
  }

  setErrors(newErrors);
}, [password]);
  return (
    <div className="signup-container">
        <div className='signup-inner'>
        <div className='sign-left'>
             <img src='/signimg.png' alt="Login Illustration" className='sign-image' />
        </div>
        <div className='sign-right'>
            <div className='sign-right-inner'>
      <h2>SignUp</h2>
      <p className='signup-p1'>Let’s get you all set up your personal account</p>
      <form onSubmit={handleSignUp}>
        <div className="form-group-1">
       
          <input type="text" value={username} className='sign-username'
           placeholder=" " id="username" onChange={(e) =>{ setUsername(e.target.value);if (errors.username) {
    setErrors((prev) => ({ ...prev, username: '' }));
  }}} />
           <label className='sign-label1' htmlFor="username">UserName </label>
          {errors.username && (
            <div className="error-message2024">
              <AlertTriangle size={12} /> {errors.username}
            </div>
          )}
        </div>
      <div className="form-group-authcode">
  <input
    type="text"
    className="sign-authcode"
    placeholder=" "
    id="authCode"
    value={authCode}
    onChange={(e) => setAuthCode(e.target.value)}
  />
  <label className="sign-label-authcode" htmlFor="authCode">Authentication Code</label>
  
</div>
<div className="input-box-email">
  
  <input
    type="email"
    value={email}
     placeholder=" "
    id="eemail"
    onChange={(e) => setEmail(e.target.value)}
    required
  />
  <label htmlFor="eemail">Email</label>
  {/* {errors.email && (
    <div className="error-message-email">
      <AlertTriangle size={12} /> {errors.email} */}
    {/* </div>
  )} */}
</div>
        <div className="form-group-2">
         
          <input  type={showPassword ? 'text' : 'password'} 
          className='sign-pass' 
           placeholder=" " id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
           <label className='sign-label2' htmlFor="password">Password</label>
             {password && (<span
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </span>)}

          {errors.password && (
            <div className="error-message2025">
              <AlertTriangle size={12} /> {errors.password}
            </div>
          )}
        </div>

        <div className="form-group-3">
        
          <input 
            type={showConfirmPassword ? 'text' : 'password'}
           className='sign-cpass'
           placeholder=" " id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
         <label className='sign-label3' htmlFor="confirmPassword">Confirm Password</label>
          {confirmPassword && ( <span
    className="password-toggle"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </span>)}
         
        </div>

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      <p className='sign-dpass' style={{ marginTop: '15px' }}>
  Already have an account?{' '}
  <span 
    style={{ color: '#447cf7', cursor: 'pointer', textDecoration: 'underline' }} 
    onClick={() => navigate('/')}
  >
    Login 
  </span>
</p>

    </div>
    </div>
    </div>
    </div>
  );
};

export default SignUp;
