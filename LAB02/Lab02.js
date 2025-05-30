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
  // Generate computer's choice using Math.random()
  const randomNum = Math.random();
  let computerSelection = '';

  if (randomNum <= 0.34) {
    computerSelection = 'PAPER';
  } else if (randomNum <= 0.67) {
    computerSelection = 'SCISSORS';
  } else {
    computerSelection = 'ROCK';
  }
  // Log both selections
  console.log(`User selected: ${userSelection}`);
  console.log(`Computer selected: ${computerSelection}`);

