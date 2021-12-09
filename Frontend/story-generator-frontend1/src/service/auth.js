import {Constants} from "./constants.js";

export async function loginUser(credentials){
    console.log(credentials)
    return fetch(Constants.BACKEND_BASE_URL+"/login", {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
    .catch(err => {return {error: err.message}});
}

export async function registerUser(credentials) {
    console.log(credentials);
    return fetch(Constants.BACKEND_BASE_URL+"/register", {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(data => data.json())
    .catch(err => {return {error: err.message}})
}
