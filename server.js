// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // for serving HTML, images, etc.

const EMAIL_FILE = 'emails.txt';

// Handle email submissions
app.post('/signup', (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  fs.appendFile(EMAIL_FILE, email + '\n', (err) => {
    if (err) {
      console.error('Error saving email:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    console.log(`New email signup: ${email}`);
    res.status(200).json({ message: 'Signed up successfully!' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});