const { verifyToken } = require("./auth.js");
const pgPool = require("./pgPool.js");

var pool = pgPool.getPool();
module.exports = {
    getTopStories: async function() {
        const pageSize = 20;
        return new Promise(function(resolve, reject) {
            pool.query("SELECT story.story_id, story.title, story.text, story.average_rating, users.email FROM story, users WHERE story.user_id = users.user_id ORDER BY story.average_rating DESC LIMIT $1", [pageSize])
            .then(res => {
                resolve(res.rows);
            })
            .catch(err => {
                console.log("Error getting stories:", err);
                reject("Error getting stories: " + err);
            })
        })
    },

    saveStory: async function(request) {
        console.log(request.body)
        return new Promise(function(resolve, reject) {
            verifyToken(request)
            .then(userData => {
                pool.query("INSERT INTO story (title, text, user_id) VALUES ($1, $2, $3)", [request.body.title, request.body.text, userData.user_id])
            })
            .then(() => {
                resolve()
            })
            .catch(err => {
                console.log(err);
                reject(err);
            })
        })
    },

    submitRating: async function(request) {
        return new Promise(function(resolve, reject) {
            verifyToken(request)
            .then(() => {
                pool.query("UPDATE story SET total_rating = total_rating + $1, num_ratings = num_ratings + 1 WHERE story_id = $2", [request.body.rating, request.body.story_id])
            })
            .then(() => {
                resolve()
            })
            .catch(err => {
                reject(err);
            })
        })
    }

    
}