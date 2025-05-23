const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { use } = require('react');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password){
    return res.status(400).json({ message: "Username and passsword are required"});
  }
  if(!authenticatedUser(username, password)){
    return res.status(401).json({ message: "Ivalid username or password"});
  }
  const token = jwt.singn({username:username}, 'access', {expiresln:60*60});
  return res.status(200).json({ message: "User logged in", token:token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;

  if(!review){
    return res.status(400).json({ message: "Review id required"});

  }
  const token = req.headers.authorization?.split(" ")[1];
  if(!token){
    return res.status(401).json({ message: "Aurhorization token is required"});
  }
  let username;
  try {
    const decoded = jwt.verify(token, 'access');
    username = decoded.username;
  } catch (err) {
    return res.status(401).jdon({ message: "Invalid token"});
  }
  const book = books[isbn];
  if(!book){
    return res.status(404).json({ message: "Book not found"});
  }
  if(!book.reviews){
    book.reviews = {};
  }
  book.reviews[username]= review;
  return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.headers.authorization?.split(" ")[1];
  if(!token){
    return res.status(401).json({message: "authorization token is required" });
  }
  let username;
  try {
    const decoded = jwt.verify(token, 'access');
    username = decoded.username;
  } catch(err) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const book = books[isbn];
  if (!book){
    return res.status(404).json({ message: "Book not found" });
  }
  if(!book.review || !book.reviews[username]){
    return res.status(404).json({ message: "Review by user not found"});
  }
  delete book.reviews[username];
  return res.status(200).json({ message: "Review deleted successfully", reviews: book.revies });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
