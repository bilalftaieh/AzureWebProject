'use strict';

const analyzeButton = document.getElementById('analyze-btn');

analyzeButton.addEventListener('click', function () {
  // Read the selected file
  const file = document.getElementById('upload').files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const imageDataUrl = reader.result;
    analyzeImage(imageDataUrl);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

async function analyzeImage(imageDataUrl) {
  try {
    /**
     * AUTHENTICATE
     * This single client is used for all examples.
     */
    const key = 'b1b0db44f3124e31afec38e51fd524cb';
    const endpoint = '002439690a2646ab9e2fa77cf89f8aea';

    const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
    const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

    const computerVisionClient = new ComputerVisionClient(
      new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint
    );
    /**
     * END - Authenticate
     */

    /**
     * DETECT TAGS
     * Detects tags for an image, which returns:
     *     all objects in image and confidence score.
     */
    console.log('-------------------------------------------------');
    console.log('DETECT TAGS');
    console.log();

    // Analyze image
    console.log('Analyzing image...');
    const tags = (await computerVisionClient.analyzeImageByDomain("default", { url: imageDataUrl }, { visualFeatures: ['Tags'] })).tags;
    console.log(`Tags: ${formatTags(tags)}`);

    // Format tags for display
    function formatTags(tags) {
      return tags.map(tag => (`${tag.name} (${tag.confidence.toFixed(2)})`)).join(', ');
    }

    console.log();
    console.log('-------------------------------------------------');
    console.log('End of analysis.');

  } catch (error) {
    console.log('Error analyzing image:', error);
  }
}
