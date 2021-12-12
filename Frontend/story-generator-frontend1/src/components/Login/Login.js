import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {loginUser} from '../../service/auth';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.css';


export default function Login(props) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const handleSubmit = async(e) => {
        e.preventDefault();
        const data = await loginUser({
            email,
            password
        });
        if(data.error !== undefined) {
            setError(data.error)
        } else {
            props.setUser(data)
            props.setToken(data.token);
        }
    }
    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Username</label>
                    <input onChange={e=> setEmail(e.target.value)} type="text" className="form-control" id="email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input onChange={e=> setPassword(e.target.value)} type="password" className="form-control" id="password"/>
                </div>
                <button type="submit" className="m-3 btn btn-primary">Login</button>
                <button className="m-3 btn btn-primary" onClick={() => {props.toggleRegister()}}>Register</button>
            </form>
            <p color="red">{error}</p>
        </div>
        
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};