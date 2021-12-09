const jwt = require("jsonwebtoken");
const pgPool = require("pgPool.js");
const config = process.env;
const pool = pgPool.getPool();

module.exports = {
    verifyToken: async function(token) {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if (!token) {
            return new Promise(function(resolve,reject) {
                reject("Invalid Token.");
            })
        }
            try {
                let decoded = await jwt.verify(token, config.TOKEN_KEY);
                if(typeof(decoded) === 'undefined') {
                    return new Promise(function(resolve,reject) {
                        reject("Invalid Token.");
                    })                }
                email = decoded.email;
                user_id = decoded.user_id;
            } catch (err) {
                return new Promise(function(resolve,reject) {
                    reject("Invalid Token.");
                })            }
    
        let result = await pool.query("SELECT * FROM user WHERE _id = $1", [user_id]);
        if(result.rows.length == 0) {
            return new Promise(function(resolve,reject) {
                reject("Invalid Token.");
            })
        }
        return new Promise(function(resolve, reject) {
            resolve({email: result.rows[0].email, user_id: result.rows[0]._id});
        })
            
    }

}