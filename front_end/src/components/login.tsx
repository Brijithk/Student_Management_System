 import '../css/login.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; 
import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



 const Login = ()=>{
       const navigate = useNavigate();
       const [showPassword, setShowPassword] = useState(false);
       const [errorMessage, setErrorMessage] = useState('');
       const [shakeUsername, setShakeUsername] = useState(false);
       const [shakePassword, setShakePassword] = useState(false);
       const [username, setUsername] = useState('');
        const [password, setPassword] = useState('');
        
         const handleSubmit = async (e: React.FormEvent) => {
                          e.preventDefault();
        const loginData = {     
                       username: username,
                  password: password
                };
         try {
    const res = await axios.post('http://localhost:3000/login/login', loginData);
       localStorage.setItem('token', res.data.token);
    if (username === 'Admin') {
       localStorage.setItem('username', username);
    window.location.href = '/principal-dashboard';
  } else {
      localStorage.setItem('username', username);
      // localStorage.setItem("teacherUsername", response.data.username);

    window.location.href = '/teacher-dashboard';
  }
    } catch (error) {
    
     setErrorMessage('Invalid username or password');
     setShakeUsername(true);setShakePassword(true);
     setTimeout(() => {setShakeUsername(false);setShakePassword(false);}, 300);
  }};
                                                                                                                 const [shake, setShake] = useState(false);

                                                                                                                            useEffect(() => {if (errorMessage) {setShake(true);const timer = setTimeout(() => setShake(false), 300); return () => clearTimeout(timer);}}, [errorMessage]);

    return(
        <div className="login-main-container">                                                                                     <div className='login-inner-container'><div className='login-left'><div className='login-container'>
            <h2 className='login-heading'>Login</h2>
                                                                                                                             <div className='login-wrap-container'>
                  <p className='login-description'>Login to access your travelwise  account</p> 
                         <form className='register-input-container' onSubmit={handleSubmit}>
                                                     <div className={`login-username ${shakeUsername ? 'shake' : ''}`}>
  
      <input placeholder='Enter your username' id="username" className="login-input0"                                                                         type="text" value={username}
                       onChange={e =>{ setUsername(e.target.value);if (errorMessage) setErrorMessage('');}}  autoComplete="off" required/>
                                                                                                                                              <label className='login-label1' htmlFor="username">Username</label> {errorMessage && <span className="error-message200"><AlertTriangle className="alertTriangle1" size={15} color="red" />{errorMessage}</span>}

                                                                                                                                      </div><div className={`login-password ${shakePassword ? 'shake' : ''}`}>

                <input placeholder="Enter your password" id="password"
                                                                                                                                        className="login-input1" type={showPassword ? 'text' : 'password'}  value={password}
        onChange={e => {setPassword(e.target.value);if (errorMessage) setErrorMessage('');}} autoComplete="off" required/>
                                                                                                                                         <label className="login-label2" htmlFor="password">Password</label><span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</span></div>
                <button className='sign-fbutton' type="submit" >Login</button>
                 </form> 
                <p className="signup-link">
        Don’t have an account?{' '}
        <span onClick={() => navigate('/signup')} className="register-link">Sign Up</span>
        
      </p>                      
                                                                                                             </div> </div> </div> <div className='login-right'><img src='/Group 4.png' alt="Login Illustration" className='login-image' /></div></div>
        </div>
    )
}
export default Login;









