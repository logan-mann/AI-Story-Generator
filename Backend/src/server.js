const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../config.env")});
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const OpenAI = require('openai-api')
const pgPool = require('./middleware/pgPool.js');
const initializeDB = require('./initializeDB.js');
const app = express();
const pool = pgPool.getPool();

app.use(express.json());
app.use(cors());
initializeDB.start()
    .then(res => console.log(res))
    .catch(err => console.log(err))

const openai = new OpenAI(process.env.OPENAI_KEY)

app.post("/register", async(req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;

        console.log("REQUEST", req)

        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required.");
        }
        
        const user_res = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        if (user_res.rows.length != 0) {
            res.status(400).send("User already exists with this email.");
        }

        hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)', [email.toLowerCase(), hashedPassword, first_name, last_name]);
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        let user = result.rows[0];
        const token = jwt.sign(
            {user_id: user.user_id, email: email.toLowerCase()},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );


        response_body = {
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            token: token
        }
        res.status(200).json(response_body);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
})

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!(email && password)) {
            res.status(400).send({error: "All input is required"});
        }

        let result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
        if (result.rows.length == 0) {
            res.status(400).send({error: "Account not found."});
        }
        user = result.rows[0];
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                {user_id: user.user_id, email: user.email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            response_body = {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                token: token
            }
            res.status(200).send(response_body);
        } else {
            res.status(400).send({error: "Invalid login credentials."});
        }

    } catch (err) {
        console.log(err);
        res.status(500).send({error: err});
    }
});

app.post('/generateStory', async(req,res) => {
    const gptResponse = await openai.complete({
        "engine": "babbage",
        "prompt": req.body.prompt,
        "temperature": 0.29,
        "max_tokens": 64,
        "top_p": 1,
        "frequency_penalty":100,
        "presence_penalty": 0
      })
      console.log(gptResponse.data)
})

app.listen(8080, () => console.log("Backend API running on http://localhost:8080"));
