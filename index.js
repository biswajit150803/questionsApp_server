const express = require('express');
const cors = require('cors'); // Import cors
const { GoogleGenerativeAI } = require('@google/generative-ai');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize the GoogleGenerativeAI class with the API key
const genAI = new GoogleGenerativeAI( process.env.GOOGLE_API_KEY );

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Function to clean up response text
const cleanResponseText = (text) => {
    return text.replace(/[*#]+/g, '');
};

// Endpoint to handle question
app.post('/ask', async (req, res) => {
  const prompt = req.body.question;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    const cleanedText = cleanResponseText(text);
    res.json({ answer: cleanedText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get the answer' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
