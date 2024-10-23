// server.js
const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

let db;

MongoClient.connect(url, (err, client) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  }
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
  const collection = db.collection('mycollection');
  collection.insertOne(req.body, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Data inserted successfully!');
      res.send('Form submitted successfully!');
    }
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});