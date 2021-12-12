import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses"
import Constants from "./constants"

export async function getTopStories() {
    return new Promise(function(resolve, reject) {
        fetch(Constants.BACKEND_BASE_URL+"/topStories", {
        method:'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        })
        .then(data => {
            resolve(data.json())
        })
        .catch(err => {
            reject("Error fetching stories: " + err)
        })
    })
}

export async function saveStory(story, token) {
    console.log(story)
    const request_body = {
        title: story.title,
        text: story.text,
        token: token
    };
    return new Promise(function(resolve, reject) {
        fetch(Constants.BACKEND_BASE_URL+"/saveStory",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(request_body)
        })
        .then(data => data.json())
        .then(result => {
            if(result.error) {
                console.log("error saving story");
                console.log(result.error);
                reject(result.error)
            } else {
                console.log("successfully saved story");
                console.log(result);
                resolve(result)

            }
        })
        .catch(err => {
            console.log("error saving story");
            console.log(err);
            reject(err);
        })
    })

}

export async function generateStory(prompt) {
    return new Promise(function(resolve, reject) {
        console.log(prompt)
        fetch(Constants.BACKEND_BASE_URL+"/generateStory", {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({prompt:prompt})
        })
        .then(data => data.json())
        .then(result => {
            resolve(prompt + result.text);
        })
        .catch(err => {
            reject(err);
        })

    })
}

export async function submitRating(ratingInfo, token) {
    const request_body = {
        rating: ratingInfo.rating,
        story_id: ratingInfo.story_id,
        token: token
    };
    return new Promise(function(resolve, reject) {
        fetch(Constants.BACKEND_BASE_URL+"/submitRating", {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(request_body)
        })
        .then(data => data.json())
        .then(result => {
            if(result.error) {
                reject(result.error)
            } else {
                resolve(result);
            }
        })
    })
}