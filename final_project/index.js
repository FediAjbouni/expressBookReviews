const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    const authHeader = req.headers['authorization'];
    if(!authHeader) {
        return res.status(401).json({ message: "Autorization header missing" });
    }

    const token = authHeader.split(' ')[1];
    if(!token) {
        res.status(401).status.json({ message: "Token missing"});
    }
    const secretKey = "access";
    jwt.verify(token, secretKey, (err, user) => {
        if(err){
            return res.status(401).status.json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
