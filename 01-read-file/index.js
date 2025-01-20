const fs = require("fs");
const path = require("path");
const file = path.join(__dirname, "text.txt");
const readStream = fs.createReadStream(file, "utf-8");
let chunks = '';
readStream.on("data", (chunk) => {
    chunks += chunk;
});
readStream.on("end", () => process.stdout.write(chunks));
readStream.on("error", (error) => process.stdout.write("Error " + error.message));