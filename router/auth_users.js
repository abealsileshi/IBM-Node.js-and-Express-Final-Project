const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//returns boolean, true is user array contains specified username
const isValid = (username) => { 
  let hasUser = users.filter((user) => {
    return user.username === username
  })
  if(hasUser.length > 0){
    return false
  }
  else{
    return true
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Filter the users array for any user with the same username and password
  let validUsers = users.filter((user) => {
    return (user.username === username & user.password === password);
  })
  // Return true if any valid user is found, otherwise false
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
}

// login logic to login a PREVIOUSLY REGISTERED USER
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  // console.log('Hey Abeal, these are the users registered')
  // if(users.length == 0){
  //   console.log('users array is empty')
  // }
  // else{
  //   for(var i = 0; i < users.length; i++){
  //     console.log(users[i])
  //   }
  // }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign(
      {data : password},
      'access',
      //expires in a day. 60 secs x 60 times = 1hr
      {expiresIn : 60 * 60});
    
    req.session.authorization = {
      accessToken, username
    }

    // debug statement console.log("Access Token:", accessToken);

    // debug statement console.log("this is req.session.authorization \n", req.session.authorization)
    return res.status(200).send(`User ${username} successfully logged in`)
  }
  else{
    return res.status(500).json({message: "Invalid Login. Username and Password not recognized."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn
  let review = req.query.review
  let username = req.session.authorization?.username
  
  // console.log("the req.session.authorization objected here \n ", req.session.authorization);

  //first check if a user is logged in and if so put that review under their name
  if(!username){
    return res.status(400).send('User is not logged in. Invalid Request.')
  }

  books[isbn].reviews[username] = review
  return res.status(200).json({message: "Review added/updated Successfully!"});
  
});

//The code for deleting a book review
//Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization?.username
  let isbn = req.params.isbn
  
  
  let breview = books[isbn].reviews[username]
  //check the book review exists
  if (breview) {
    // console.log(`the current user is ${username} `)
    // console.log(`here we can see the book review ${breview}`)

    Object.keys(books[isbn].reviews).forEach(key => {
      if (key === username) {
        delete books[isbn].reviews[key];
        return res.status(200).send(`Book review by ${username}, found at isbn ${isbn} was deleted successfully`)
      }
    })
  }
  else{
    return res.status(400).send('The specified book review was not found for some reason')
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
