const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
const querystring = require('querystring');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/res_connect')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Define schema and model
const userSchema = new mongoose.Schema({
  firstname: String,
  middlename: String,
  lastname: String,
  designation: String,
  address: String,
  email: String,
  phoneno: String,
  summary: String
});

const User = mongoose.model('user', userSchema);

// Create Server
const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    // Serve the registration form
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.writeHead(200, { 'Content-Type': 'text/css' });
    fs.createReadStream('C:/Users/JACINTH RAJ/OneDrive - karunya.edu.in/Sem-5/Web Tech/III IA/pro/public/index.html').pipe(res);
  }
  else if (req.url === '/save' && req.method === 'POST') {
    // Handle form submission
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const formData = querystring.parse(body);

      // Save form data to MongoDB
      const newUser = new User({
        firstname: formData.firstname,
        middlename: formData.middlename,
        lastname: formData.lastname,
        designation: formData.designation,
        address: formData.address,
        email: formData.email,
        phoneno: formData.phoneno,
        summary: formData.summary,
      });

      newUser.save()
        .then(() => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.write('<h3>Data Saved Successfully</h3>');
          res.end();
        })
        .catch(err => {
          res.writeHead(500, { 'Content-Type': 'text/html' });
          res.write('<h3>Error saving data!</h3>');
          res.end();
        });
    });
  }
  else {
    // If no matching route, send 404
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h3>404 - Not Found</h3>');
    res.end();
  }
});

// Start the server
server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
