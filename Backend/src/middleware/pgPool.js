const {Pool} = require('pg');
var pool;
module.exports = {
    getPool: function () {
      if (pool) return pool; // if it is already there, grab it here
      pool = new Pool({
        connectionString: process.env.PGURL,
        ssl: {rejectUnauthorized: false}});
      return pool;
    }
};