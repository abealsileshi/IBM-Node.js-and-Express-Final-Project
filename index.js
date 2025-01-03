const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true,  cookie: { maxAge: 3600000 }}))

// an extra middleware for debugging purposes - see how the log changes using cURL requests
// app.use((req, res, next) => {
//     console.log('req.session variable: \n', req.session);
//     console.log('req.session.username : \n', req.session.username);

//     next();
//   });

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    //console.log('this is req.session var (in /customer/auth/* middleware): \n', req.session)
    if(req.session.authorization){
        let token = req.session.authorization['accessToken']
        //Verify JWT token
        jwt.verify(token, 'access', (err, user) => {
            if(!err){
                req.user = user
                //proceed to the next middleware
                next(); 
            }
            else{
                return res.status(403).json({message : "User not authenticated"})
            }
        });
    }
    else {
        return res.status(403).json({ message : "User not logged in."})
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
