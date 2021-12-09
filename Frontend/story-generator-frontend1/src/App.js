import React, {useState} from 'react';
import './App.css';
import Homepage from './components/Homepage/Homepage';
import CreateStory from './components/CreateStory/CreateStory';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import useToken from './components/App/UseToken';
import useUser from './components/App/UseUser';
import Auth from './components/Auth/Auth';

function App() {
  const [token, setToken] = useToken();
  const [user, setUser] = useUser();
  console.log(token)
  
  if(!token) {
    return(<Auth setToken={setToken} setUser={setUser}/>);
  }
  return (
    <div className="wrapper">
      <h1>Welcome, {user.first_name}!</h1>
      <button onClick={() => {
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('user')
      }}>Logout</button>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Navigate to="/homepage"/>}/>
          <Route exact path='/homepage' element={<Homepage/>}/>
          <Route exact path='/create_story' element={<CreateStory token={token}/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
