const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const app = express();

app.use(express.json());

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(isValid(username)){
      //pushing into the array an object, later we can search with key-value pairs
      users.push({"username" : username, "password" : password })
      return res.status(200).json({message : `User ${username} , has successfully been added.`})
    }
    else{
      return res.status(400).json({message: `Username: ${username} already exists! Choose another name`}); 
    }
  }
  else{
    return res.status(400).json({message: "No Username or Password provided. Please try again."}); 
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // console.log(books)
  return res.send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  
  return res.send(JSON.stringify(books[isbn], null, 2));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  results = []
  let author = req.params.author
  Object.entries(books).forEach( ([key,value]) => {
    if( value.author === author){
      results.push(books[key])
    }
  })
  return res.send(results)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
   results = []
   let title = req.params.title
   Object.entries(books).forEach( ([key,value]) => {
     if(value.title === title){
       results.push(books[key])
     }
   })
   if(results.length == 0){
    return res.send(` No books with ${title} found!`)
   }
   else{
    return res.send(results)
   }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  
  return res.send(JSON.stringify(books[isbn].reviews , null, 2));
});

module.exports.general = public_users;
