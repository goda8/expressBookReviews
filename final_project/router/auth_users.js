const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {}; // Change from [] to {}

// Check if username exists
const isValid = (username)=>{ 
  return users.hasOwnProperty(username);
}

// Check if username and password match
const authenticatedUser = (username,password)=>{ 
  if (isValid(username)) {
    return users[username].password === password;
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({data: username}, "fingerprint_customer", {expiresIn: 3600});
      req.session.authorization = {accessToken, username};
      return res.status(200).json({message: "User successfully logged in", accessToken});
    } else {
      return res.status(401).json({message: "Invalid login. Check username and password."});
    }
  } else {
    return res.status(400).json({message: "Username and password required."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (review) {
    // Find the book by ISBN and add the review
    const book = books[isbn];
    if (book) {
      if (!Array.isArray(book.reviews)) {
        book.reviews = [];
      }
      book.reviews.push(review);
      return res.status(200).json({message: "Review added successfully"});
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } else {
    return res.status(400).json({message: "Review content is required"});
  }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (review) {
    // Find the book by ISBN and remove the review
    const book = books[isbn];
    if (book) {
      book.reviews = book.reviews.filter(r => r !== review);
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  } else {
    return res.status(400).json({message: "Review content is required"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
