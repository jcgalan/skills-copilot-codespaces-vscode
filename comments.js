// Create web server
// 1. Create a new web server
// 2. Create a new route for comments
// 3. Add new comments to the comments
// 4. Show the comments
// 5. Add a form to add new comments
// 6. Add a delete button to delete comments

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/comments', (req, res) => {
  fs.readFile('./comments.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading comments.json');
    }
    const comments = JSON.parse(data);
    let commentsHTML = '<ul>';
    comments.forEach((comment, index) => {
      commentsHTML += `<li>${comment} <form method="POST" action="/comments/${index}?_method=DELETE"><button type="submit">Delete</button></form></li>`;
    });
    commentsHTML += '</ul>';
    res.send(commentsHTML);
  });
});

app.post('/comments', (req, res) => {
  const newComment = req.body.comment;
  fs.readFile('./comments.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading comments.json');
    }
    const comments = JSON.parse(data);
    comments.push(newComment);
    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
      if (err) {
        return res.status(500).send('Error writing comments.json');
      }
      res.redirect('/comments');
    });
  });
});

app.delete('/comments/:index', (req, res) => {
  const index = req.params.index;
  fs.readFile('./comments.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading comments.json');
    }
    const comments = JSON.parse(data);
    comments.splice(index, 1);
    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
      if (err) {
        return res.status(500).send('Error writing comments.json');
      }
      res.redirect('/comments');
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on

