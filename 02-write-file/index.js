const fs = require('fs');
const path = require('path');
let writeableStream = fs.createWriteStream(path.join(__dirname, path.sep, 'text.txt'), 'utf-8');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('What languages do you know?');

function ask(question) {
  rl.question(question, (answer) => {
    if (answer === 'exit') {
      exit();
    }
    writeableStream.write(`${answer}\n`);
    ask(question);
  })
}

rl.on('SIGINT', () => {
  exit();
})

const exit = () => {
  console.log('Goodbye!');
  process.exit(1);
}


ask('');