import './css/App.css';
import React from 'react';
import Main from './components/Main';
import Login from './components/Login';
import {auth} from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


function App() {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  })

  return (
    
    <div className='container'>
      {
        loading ?
          <div className='loading'>
            <div className='loading-text'>
              <h1>Loading...</h1>
            </div>
          </div>
        :
          user ?
            <Main emailUser={user.email}/>
          :
            <Login/>
      }
    </div>
  );
}

export default App;