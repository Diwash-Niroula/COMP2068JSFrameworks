// Import the prompt package
const prompt = require('prompt');

// Start the prompt
prompt.start();
// Ask user to input ROCK, PAPER, or SCISSORS
prompt.get(['userSelection'], function (err, result) {
  if (err) {
    console.error(err);
    return;
  }

  // Get user input and convert to uppercase to standardize
  const userSelection = result.userSelection.toUpperCase();

