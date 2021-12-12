const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../config.env")});
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const OpenAI = require('openai-api')
const pgPool = require('./middleware/pgPool.js');
const initializeDB = require('./initializeDB.js');
const { verifyToken } = require('./middleware/auth.js');
const stories = require("./middleware/stories.js");
const { saveStory } = require('./middleware/stories.js');
const app = express();
const pool = pgPool.getPool();
const twitterQueue = require('./middleware/twitterQueue.js')
// Set the Region 
app.use(express.json());
app.use(cors());
initializeDB.start()
    .then(res => console.log(res))
    .catch(err => console.log(err))

const openai = new OpenAI(process.env.OPENAI_KEY)


app.post("/register", async(req, res) => {
    try {
        const {first_name, last_name, email, password} = req.body;
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required.");
        }
        
        await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()])
        .then(async(user_res) => {
            if (user_res.rows.length != 0) {
                console.log("User already exists")
                res.status(400).send("User already exists with this email.");
                return;
            }
    
            await bcrypt.hash(password, 10)
            .then(async(hashedPassword) => {
                await pool.query('INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)', [email.toLowerCase(), hashedPassword, first_name, last_name])
                .then(async() => {
                    await pool.query('SELECT * FROM users WHERE email = $1', [email])
                    .then((result) => {
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
                    })
                    .catch(err => {
                        console.log("Database error: ", err.message)
                        res.status(500).send({error: "Database error: " + err.message})
                        return;
                    })

                })
                .catch(err => {
                    console.log("Database error: ", err.message)
                    res.status(500).send({error: "Database error: " + err.message})
                    return;
                })

            })
            .catch(err => {
                console.log("Error hashing password: " + err.message)
                res.status(500).send({error: "Error hashing password: " + err.message})
                return;
            })
        })
        .catch(err => {
            console.log("Database error: ", err.message)
            res.status(500).send({error: "Database error: " + err.message})
            return;
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
})

app.post('/login', async (req, res) => {
    try {
        console.log(req.body)
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
 
app.post('/verifyToken', async(req, res) => {
    console.log("Validating token...")
    await verifyToken(req)
    .then((userData) => {
        console.log("Token verified: ", JSON.stringify(userData))
        res.status(200).send(userData)
        return
    })
    .catch((err) => {
        console.log("Token validation failed:", err)
        res.status(400).send({error: "Token validation failed: " + err})
        return
    })
})

app.post('/generateStory', async(req,res) => {
    console.log("prompt", req.body.prompt)
    openai.complete({
        "engine": "babbage",
        "prompt": req.body.prompt,
        "temperature": 0.25,
        "max_tokens": 64,
        "top_p": 1,
        "frequency_penalty":100,
        "presence_penalty": 0
      })
      .then(gptResponse => gptResponse.data)
      .then(data => {
          console.log(data)
          res.status(200).send({text: data.choices[0].text})
      })
      .catch(err => {
          console.log("Error generating text: "+ err);
          res.status(500).send({error: "Error generating text: " + err});
      })
})

app.post("/saveStory", async(req, res) => {
    saveStory(req)
    .then(() => {
        res.status(200).send({success:"Successfully saved story!"})
    })
    .catch(err => {
        res.status(400).send({error: err});
    })
})

app.get("/topStories", async(req, res) => {
    await stories.getTopStories()
    .then(result => {
        res.status(200).send(result);
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({error: "Error retrieving stories."})
    })
})

app.post("/submitRating", async(req, res) => {
    stories.submitRating(req)
    .then(() => {
        res.status(200).send({success:"Successfully submitted rating!"})
    })
    .catch(err => {
        console.log(err)
        res.status(400).send({error: err})
    })
})

app.post("/sendTweet", async(req, res) => {
    twitterQueue.sendTweet(req.body.tweetBody)
    .then((result) => {
        console.log(result)
        res.status(200).send(result)
    })
    .catch(err => {
        console.log(err)
        res.status(500).send({error: err})
    })
})

app.listen(8080, () => console.log("Backend API running on http://localhost:8080"));
