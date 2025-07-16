const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(users[username]) {
    return res.status(400).json({message: "User already exists"});
  }else if (username && password) {
    users[username] = {password: password};
    return res.status(200).json({message: "User registered successfully"});
  } else {
    return res.status(400).json({message: "Username and password are required"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.json(books); // <-- FIXED
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  //Write your code here
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor); // <-- FIXED
  } else {
    return res.status(404).json({message: "No books found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle); // <-- FIXED
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "No reviews found for this book"});
  }
});



// Task 10: Get book list using Promise with Axios
public_users.get('/books-promise', (req, res) => {
  axios.get('http://localhost:5000/')
    .then(response => res.status(200).json(response.data)) 
    .catch(error => res.status(500).json({ message: "Error fetching books", error: error.message }));
});



// Task 11: Get book details by ISBN using Promise with Axios
public_users.get('/isbn-promise/:isbn', (req, res) => {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(404).json({ message: "Book not found", error: error.message }));
});



// Task 12: Get book details by author using Promise with Axios
public_users.get('/author-promise/:author', (req, res) => {
  axios.get(`http://localhost:5000/author/${req.params.author}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(404).json({ message: "No books found for this author", error: error.message }));
});

// Task 13: Get book details by title using async/await with Axios


// Task 13: Get book details by title using Promise with Axios
public_users.get('/title-promise/:title', (req, res) => {
  axios.get(`http://localhost:5000/title/${req.params.title}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(404).json({ message: "No books found with this title", error: error.message }));
});

module.exports.general = public_users;
