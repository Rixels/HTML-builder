const fs = require('fs');
const path = require('path');

function folderCopy() {
    const originalFolder = path.join(__dirname, 'files');
    const doubleFolder = path.join(__dirname, 'files-copy');
    fs.rm(doubleFolder, { recursive: true, force: true }, (err) => {
        if (err) return console.error('Error when deleting directory:', err);

        fs.mkdir(doubleFolder, { recursive: true }, (err) => {
            if (err) return console.error('Error creating directory:', err);

            fs.readdir(originalFolder, { withFileTypes: true }, (err, files) => {
                if (err) return console.error('Error reading directory:', err);

                files.forEach((file) => {
                    const originalPath = path.join(originalFolder, file.name);
                    const doublePath = path.join(doubleFolder, file.name);

                    if (file.isDirectory()) {
                        copyRecursive(originalPath, doublePath);
                    } else if (file.isFile()) {
                        fs.copyFile(originalPath, doublePath, (err) => {
                            if (err) console.error(`Error copying file ${file.name}:`, err);
                        });
                    }
                });
            });
        });
    });
}
function copyRecursive(originalFolder, doubleFolder) {
    fs.mkdir(doubleFolder, { recursive: true }, (err) => {
        if (err) return console.error('Error creating directory:', err);

        fs.readdir(originalFolder, { withFileTypes: true }, (err, files) => {
            if (err) return console.error('Error reading directory:', err);

            files.forEach((file) => {
                const originalPath = path.join(originalFolder, file.name);
                const doublePath = path.join(doubleFolder, file.name);

                if (file.isDirectory()) {
                    copyRecursive(originalPath, doublePath);
                } else if (file.isFile()) {
                    fs.copyFile(originalPath, doublePath, (err) => {
                        if (err) console.error(`Error copying file ${file.name}:`, err);
                    });
                }
            });
        });
    });
}
folderCopy();