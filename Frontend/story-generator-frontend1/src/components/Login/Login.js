import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {loginUser} from '../../service/auth';
import './Login.css';

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
            setError(error)
        } else {
            props.setUser(data)
            props.setToken(data.token);
        }
    }
    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
            <button onClick={() => {props.toggleRegister()}}>Register</button>
        </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};