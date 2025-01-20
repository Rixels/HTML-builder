
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'file.txt');
const stream = fs.createWriteStream(file, { flags: 'a' });
process.stdout.write('Enter text:');
process.stdin.on('data', (data) => {
    const inputText = data.toString().trim();
    if (inputText.toLowerCase() === 'exit') {
        callback();
    } else {
        stream.write(inputText + '\n');
    }
});
process.on('SIGINT', callback);
function callback() {
    process.stdout.write('Thank you! Goodbye!');
    stream.end();
    process.exit();
}