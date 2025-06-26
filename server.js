// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase config — replace with your own values
const SUPABASE_URL = 'https://aqdbzngeanfaiomacjlt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZGJ6bmdlYW5mYWlvbWFjamx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MTEyNTgsImV4cCI6MjA2NjQ4NzI1OH0.NWzI98VsqgGKjcum8plZF5s11y_V_v5PREEc5kEjNdc';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // For serving HTML, images, etc.

// POST /signup — Save email to Supabase
app.post('/signup', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  try {
    const { data, error } = await supabase
      .from('emails')
      .insert([{ email }]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ message: 'Failed to save email' });
    }

    console.log(`📬 New email saved to Supabase: ${email}`);
    res.status(200).json({ message: 'Signed up successfully!' });
  } catch (err) {
    console.error('Unexpected server error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional route to fetch emails (for testing/debug)
app.get('/emails', async (req, res) => {
  try {
    const { data, error } = await supabase.from('emails').select('email');

    if (error) {
      console.error('Error fetching emails:', error);
      return res.status(500).send('Could not fetch emails.');
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).send('Server error.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Astralisse server running on port ${PORT}`);
});
