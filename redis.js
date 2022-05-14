const express = require('express');
const app = express();
const port = 3000
const host = '127.0.0.1';
// <libraryes>//
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(session);
// 
const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost'
});
// 
app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: 'mySecret',
    saveUninitialized: false,
    resave: false, 
    cookie: {
        secure: false, // if true: only transmit cookie over https
        httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000 * 60 * 30, // session max age in milliseconds
        sameSite: 'lax' // make sure sameSite is not none
    }
}));



app.use((req, res, next) => {
    if (!req.session || !req.session.clientId) {
        const err = new Error('You shall not pass');
        err.statusCode = 401;
        next(err);
    }
    next();
});
// </libraryes>//

// <API>
    // app.post("/login",(req, res) => {
    //     const {email, password} = req;
    //     req.session.clientId = "clientId1";
    //     req.session.myNum = 1;
    //     res.json("Logged")
    // })
// </API>
app.get('/', (req, res) => {
    // res.sendFile(__dirname+"/pages/index.html")
    res.send(req.session)
});

app.post('/login', (req, res,next) => {
    const {email, password} = req;
    console.log({email, password})
    req.session.clientId = 'abc123';
    req.session.myNum = 5;
    console.log(req.body)
    res.json('you are now logged in');
    console.log(req.session,req.session.user)
    // if (!req.session || !req.session.user) {
    //     const err = new Error('You shall not pass');
    //     err.statusCode = 401;
    //     next(err);
    // }
    // next();
});





app.listen(port, function () {
    console.log(`Server stated on: http://${host}:${port}`)
});