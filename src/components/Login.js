import React from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import { ToastContainer } from 'react-toastify';
import { error, success } from "./Toast";
import 'react-toastify/dist/ReactToastify.css';
import '../css/Login.css';
import Button from './Button';



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
  })
  
  const signUp = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      setUser(user);
    } catch (error) {
      console.log(error);
      error("Add email and password to Register")
    }
  }
  
  const login = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      setUser(user);
    } catch (error) {
      console.log(error);
      error("Invalid email or password")
    }
  }

  const logout = async () => {
    await signOut(auth)
    window.location.reload();
  }
  
  return (
    <div className='container'>
      <div className='row login-pannel'>
        <div className='col-lg-12'>
          <div>Email</div>
          <input
            id="email"
            type="text"
            placeholder="Enter Email..."
            onChange={(e) => {setEmail(e.target.value)}}
          />
        </div>
        <div className='col-lg-12'>
          <div>Password</div>
          <input
            id="password"
            type="password"
            placeholder="Enter Password..."
            onChange={(e) => {setPassword(e.target.value)}}
          />
        </div>
        <div className='button-row col-lg-12'>
          <Button textButton="Login" style="button-pannel" type="primary" size="medium" onPress={login} ></Button>
          <Button textButton="Sign Up" style="button-pannel" type="primary" size="medium" onPress={signUp} ></Button>
        </div>
      </div>
      <div>
        <ToastContainer
          position="top-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}

export default Login;