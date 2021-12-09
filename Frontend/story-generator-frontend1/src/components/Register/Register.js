import React, {useState} from 'react';
import '../Login/Login.css';
import {registerUser} from '../../service/auth';


export default function Register(props) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [error, setError] = useState();

    const handleSubmit = async(e) => {
        e.preventDefault()
        const data = await registerUser({
            email:email,
            password:password,
            first_name:firstName,
            last_name:lastName
        });
        if(data.error !== undefined) {
            setError(error)
        } else {
            props.setToken(data.token);
        }
    }

    return (
        <div className="login-wrapper">
            <h1>Please Log In</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Email</p>
                    <input type="text" onChange={e => setEmail(e.target.value)}/>
                </label>
                <label>
                    <p>First Name</p>
                    <input type="text" onChange={e => setFirstName(e.target.value)}/>
                </label>
                <label>
                    <p>Last Name</p>
                    <input type="text" onChange={e => setLastName(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)}/>
                </label>
                <label>
                    <p>Confirm Password</p>
                    <input type="password" onChange={e => setConfirmPassword(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
            <button onClick={() => {props.toggleRegister()}}>Back</button>
        </div>
    )


}