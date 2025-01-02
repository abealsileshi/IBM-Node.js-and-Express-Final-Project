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
// Task 10: getting the list of books available in the shop 
// using Promise callbacks or async-await with Axios
public_users.get('/', function (req, res) {
  new Promise((resolve) => {
    resolve(books); // Replace this with any asynchronous data fetching logic
    console.log("promise resolved")
  })
  .then((data) => {
    res.send(JSON.stringify(data, null, 2));
  })
  .catch((err) => {
    res.status(500).send('Error fetching books');
  });
});

// Get book details based on ISBN
// Part 2: Do task again using promises or async/await
public_users.get('/isbn/:isbn',function (req, res) { 
  new Promise((resolve, reject) => {
    let isbn = req.params.isbn; 
    if (books[isbn]) { // Check if the book at the specified index exists
      resolve(books[isbn]); // Resolve with the specific book
      console.log('promise resolved')
    } else {
      reject(new Error("Book not found")); // Reject with an error
    }
  })
    // The data parameter contains whatever was passed to resolve.
    .then((data) => {
      res.send(JSON.stringify(data, null, 2)); // Send the book details as a response
    })
    .catch((err) => {
      res.status(404).send(err.message); // Send a 404 status with the error message
    });
});
  
// Get book details based on author
// Task 12 : use promises/ async-await to do function
public_users.get('/author/:author',function (req, res) {
  results = []
  let author = req.params.author
  new Promise((resolve, reject) => {
    const results = Object.values(books).filter((book) => book.author === author);
    if (results.length > 0) { // Check if the book at the specified index exists
      resolve(results); // Resolve with the specific book
      // debug statement console.log('promise resolved')
    } else {
      reject(new Error(` No books with ${author} found!`)); // Reject with an error
    }
  })
    // The data parameter contains whatever was passed to resolve.
    .then((data) => {
      res.send(JSON.stringify(data, null, 2)); // Send the book details as a response
    })
    .catch((err) => {
      res.status(404).send(err.message); // Send a 404 status with the error message
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  results = []
  let title = req.params.title
  new Promise((resolve, reject) => {
    const results = Object.values(books).filter((book) => book.title === title);
    if (results.length > 0) { // Check if the book at the specified index exists
      resolve(results); // Resolve with the specific book
      // debug statement console.log('promise resolved')
    } else {
      reject(new Error(` No books with ${title} found!`)); // Reject with an error
    }
  })
    // The data parameter contains whatever was passed to resolve.
    .then((data) => {
      res.send(JSON.stringify(data, null, 2)); // Send the book details as a response
    })
    .catch((err) => {
      res.status(404).send(err.message); // Send a 404 status with the error message
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  
  return res.send(JSON.stringify(books[isbn].reviews , null, 2));
});

module.exports.general = public_users;