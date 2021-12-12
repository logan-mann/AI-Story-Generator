import React, {useEffect} from 'react';
import './App.css';
import Homepage from './components/Homepage/Homepage';
import StoryGenerator from './components/StoryGenerator/StoryGenerator';
import {BrowserRouter, Route, Routes, Navigate, Link} from 'react-router-dom';
import useToken from './components/App/UseToken';
import useUser from './components/App/UseUser';
import Auth from './components/Auth/Auth';
import {Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import { verifyToken } from './service/auth.js';

function App() {
  const [token, setToken] = useToken();
  const [user, setUser] = useUser();

  useEffect(() => {
    if(token){
      console.log("APP Looded")
      verifyToken(token)
      .then(user => {
        console.log("RESULTING USER", user)
        if(user.error) {
          setToken('')
          setUser('')
        }
      })
      .catch(error => {
        console.log(error)
        setToken('')
        setUser('')
      })
    }
      
  })

      return (
        <div>
          {token &&    
                    <BrowserRouter>
                    <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand href="#home">AI Madlibs</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/homepage">Home</Nav.Link>
                  <Nav.Link as={Link} to="/story_generator">Story Generator</Nav.Link>
                  <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
                <button className="btn btn-primary" onClick={() => {
            setToken('');
            localStorage.removeItem('token');
            localStorage.removeItem('user')
          }}>Logout</button>
              </Navbar.Collapse>
            </Container>
          </Navbar>

                  <div className="wrapper">
            <Routes>
              <Route exact path='/' element={<Navigate to="/homepage"/>}/>
              <Route exact path='/homepage' element={<Homepage user={user} token={token}/>}/>
              <Route exact path='/story_generator' element={<StoryGenerator user={user} token={token}/>}/>
            </Routes>
          </div>
          </BrowserRouter>

          }
          {!token && <Auth setToken={setToken} setUser={setUser}/>}

        </div>
      );
}

export default App;
