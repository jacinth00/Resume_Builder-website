const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');
const querystring = require('querystring');
const path = require('path');

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

// Function to get Content-Type based on file extension
function getContentType(ext) {
  switch (ext) {
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.png': return 'image/png';
    case '.jpg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.avif': return 'image/avif';
    default: return 'text/html';
  }
}

// Create Server
const server = http.createServer((req, res) => {
  
  if (req.url === '/' && req.method === 'GET') {
    // Serve the registration form (HTML)
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(path.join(__dirname, 'public', 'index.html')).pipe(res);
  } 
  
  else if (req.method === 'GET') {
    // Serve static files like CSS, JS, images, SVG, etc.
    const filePath = path.join(__dirname, 'public', req.url);
    const ext = path.extname(req.url);
    
    // If file has no extension, assume it's HTML
    const contentType = getContentType(ext || '.html');
    
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.write('<h3>File Not Found</h3>');
        res.end();
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.write(data);
        res.end();
      }
    });
  } 
  
  else if (req.url === '/save' && req.method === 'POST') {
    // Handle form submission
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const formData = querystring.parse(body);
      console.log('Form Data Received:', formData); // Log the form data

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
