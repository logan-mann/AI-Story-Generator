const pgPool = require('./middleware/pgPool.js');
const pool = pgPool.getPool();

module.exports = {
    start: async function(){

        // users
        res = await pool.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='users'");
        if(res.rows[0].count == 0){
            await pool.query("CREATE TABLE users (user_id SERIAL, email TEXT, password TEXT, first_name TEXT, last_name TEXT, PRIMARY KEY (user_id));", (err, res) => {
                if(err){
                    console.log(err);
                    console.log("CRITICAL: Database not intialized");
                }
            })
        }

        res = await pool.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='story'");
        if(res.rows[0].count == 0){
            await pool.query("CREATE TABLE story (story_id SERIAL, title TEXT, text TEXT, total_rating NUMERIC, num_ratings NUMERIC, average_rating NUMERIC GENERATED ALWAYS AS (total_rating/num_ratings) STORED, user_id INTEGER, PRIMARY KEY (story_id), CONSTRAINT fk_story_user FOREIGN KEY(user_id) REFERENCES users(user_id));", (err, res) => {
                if(err){
                    console.log(err);
                    console.log("CRITICAL: Database not intialized");
                }
            })
        }

        return new Promise(function(resolve, reject){
            resolve("Database initialized");
        })
    }
}