import './css/App.css';
import React from 'react';
import Main from './Main';
import Login from './Login';
import {auth} from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


function App() {
  const [user, setUser] = React.useState(null);

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
  })

  return (
    
    <div className='container'>
      {
      user !== null ?
        <Main emailUser={user.email}/>
      :
        <Login/>
      }
    </div>
  );
}

export default App;