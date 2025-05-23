const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (!siValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  users.push({username: username, password: password});
  return res.status(200).json({ message: "User registrated succefully" });
});


// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  try {
    // Simulate fetching books data asynchronously
    // Since books is a local object, wrap it in a Promise
    const fetchBooks = () => {
      return new Promise((resolve, reject) => {
        if (books) {
          resolve(books);
        } else {
          reject("No books data available");
        }
      });
    };
    const booksData = await fetchBooks();
    return res.status(200).json(booksData);
  }catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
  //Write your code here
    const isbn = req.params.isbn;
    const fetchBookByIsbn = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book){
          resolve(book);
        } else {
          reject("Book not found");
        }
      });
    };
      const book = await fetchBookByIsbn(isbn);
      return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: "book not found" });
  }
});
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  try{
  const author = req.params.author;
  const fechBookByAuthor = (author) => {
    return new promis ((resolve, reject) => {
      const booksByAuthor = [];
      for (let key in books){
        if(books[key].author === author){
          booksByAuthor.push(books[key]);
        }
      }
      if(booksByAuthor.length > 0){
        resolve(booksByAuthor);
      } else {
        reject("No books found by this zuthor");
      }
    });
  };
  const booksByAuthor = await fechBookByAuthor(author);
  return res.status(200).json(booksByAuthor)
  } catch (error) {
    return res.status(404).json({ message: error})
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try {
  const title = req.params.title;
  const fetchBooksByTitla = (title) => {
    return new promise ((resolve, reject) => {
      const booksByTitle = [];
      for (let key in books) {
        if (books[key].title === title){
          books.title.push(books[key]);
        }
      }
      if(booksByTitle.length > 0){
        resolve(booksByTitle);
      } else {
        reject("No books found with this title");
      }
    });
  };
  const booksByTitle = await fetchBooksByTitla(title);
  return res.status(200).json(booksByTitle);
  }catch(error){
    return res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    if (reviews) {
      return res.status(200).json(reviews);
    }
    return res.status(404).json({ message: "No reviews found for this book" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
