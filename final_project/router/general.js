const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "user successfully registered." });
    } else {
      return res.status(404).json({ message: "user already exists!" });
    }
  }
  return res.status(404).json({ message: "unable to register user" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    new Promise((resolve, reject) => {
        res.send(JSON.stringify(books, null, 4));
    });
});
  
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        resolve(books[isbn]);
    }).then( (value) => {
        res.send(value);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    new Promise((resolve, reject) => {
        let keys = Object.keys(books);
        let author = req.params.author;
        let result = [];
        for (let i = 0; i < keys.length; i++) {
            if (books[keys[i]].author === author) {
            result.push(books[keys[i]]);
            }
        }
        resolve(result);
    }).then((value)=> {
        res.send(value);
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    new Promise((resolve, reject) => {
        let keys = Object.keys(books);
        let title = req.params.title;
        let result = [];
        for (let i = 0; i < keys.length; i++) {
            if (books[keys[i]].title === title) {
            result.push(books[keys[i]]);
            }
        }
        resolve (result);
    }).then((value)=> {
        res.send(value);
    })
  
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
