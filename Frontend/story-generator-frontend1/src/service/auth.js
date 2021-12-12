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

export async function verifyToken(token) {
    console.log("Verifying token--------")
    return new Promise(function(resolve, reject) {
        fetch(Constants.BACKEND_BASE_URL+"/verifyToken", {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({token:token})
        })
        .then(response => response.json())
        .then(result => {
            console.log("Token verification result:", result)
            if(result.error) {
                console.log("verification failed")
                    reject("Verification failed");
            } else {
                console.log("EMAIL", result.email)
                    resolve(result);
            }
        })
        .catch(err => {
            console.log("verification failed", err)
                reject({error: err})
        })

    })
}
