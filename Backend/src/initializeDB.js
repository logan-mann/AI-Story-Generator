const pgPool = require('./middleware/pgPool.js');
const pool = pgPool.getPool();

module.exports = {
    start: async function(){

        // users
        res = await pool.query("SELECT COUNT(table_name) FROM INFORMATION_SCHEMA.TABLES WHERE table_name='users'");
        if(res.rows[0].count == 0){
            await pool.query("CREATE TABLE users (user_id SERIAL, email TEXT, password TEXT, first_name TEXT, last_name TEXT);", (err, res) => {
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