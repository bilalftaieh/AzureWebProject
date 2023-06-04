'use strict';

const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const path = require('path');
const { createReadStream } = require('fs');
const sleep = require('util').promisify(setTimeout);
const { ComputerVisionClient } = require('@azure/cognitiveservices-computervision');
const { ApiKeyCredentials } = require('@azure/ms-rest-js');
const bodyParser = require('body-parser');
app.use(bodyParser.json());


const port = 3000;

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = process.env.VISION_KEY;
const endpoint = process.env.VISION_ENDPOINT;

const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
  endpoint
);
/**
 * END - Authenticate
 */

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/analyze', async (req, res) => {
  try {
    const imageURL = req.body.imageURL; // Retrieve the imageURL from the request body
    console.log('Received image:', imageURL);
    const tags = await analyzeImage(imageURL);
    res.json({ tags });
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

async function analyzeImage(imageURL) {
  const tags = (await computerVisionClient.analyzeImage(imageURL, { visualFeatures: ['Tags'] })).tags;
  return tags.map(tag => ({ name: tag.name, confidence: tag.confidence.toFixed(2) }));
}


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
