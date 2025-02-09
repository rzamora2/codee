// server.js
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // You can also use axios if preferred.
const cors = require('cors');

const app = express();

// Enable CORS for requests from your Judge0 IDE frontend
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint for AI chat
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    // Call OpenAI's API with the provided prompt
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`

      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Change as needed, e.g., 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7 // Adjust this parameter to control response creativity
      })
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.statusText);
      return res.status(500).json({ error: 'Error fetching AI response.' });
    }

    const data = await response.json();
    // Extract the reply from the response; adjust based on the API response structure
    const aiMessage = data.choices[0].message.content;
    res.json({ reply: aiMessage });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('OpenAI API Key:', process.env.OPENAI_API_KEY);
});
