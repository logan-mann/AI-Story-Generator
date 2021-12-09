import React, {useState} from 'react';
import Login from '../Login/Login';
import Register from '../Register/Register';

export default function Auth(props) {
    const [register, setRegister] = useState(false);

    const toggleRegister = () => {
        setRegister(!register);
    }

    if(register) return(<Register setToken={props.setToken} setUser={props.setUser} toggleRegister={toggleRegister}/>)
    return(<Login setToken={props.setToken} setUser={props.setUser} toggleRegister={toggleRegister}/>)
}