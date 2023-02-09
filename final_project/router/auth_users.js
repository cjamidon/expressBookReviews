const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{//returns boolean
    let validusers = users.filter((user)=> {
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password) {
        return res.status(404).json({message: "error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60*60});

        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).send("user successfully logged in");
    } else {
        return res.status(200).json({message: "invalid login"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review;
  let username = req.session.authorization['username'];
  let isbn = req.params.isbn;

    books[isbn].reviews[username] = review;
    return res.status(200).send("successfully updated reviews");
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.session.authorization['username'];
  let isbn = req.params.isbn;
  let review = books[isbn].reviews[username];

  if (review){
      delete books[isbn].reviews[username];
      res.send("successfully deleted review");
  } else {
    res.send("no review found");
  }

});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
