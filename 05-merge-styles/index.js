const fs = require('fs');
const path = require('path');

function buildBundle() {
    const folderStyles = path.join(__dirname, 'styles');
    const outBundle = path.join(__dirname, 'project-dist', 'bundle.css');

    fs.rm(outBundle, { force: true }, (err) => {
        if (err) console.error('Error deleting bundle.css:', err);

        fs.readdir(folderStyles, { withFileTypes: true }, (err, files) => {
            if (err) return console.error('Error reading styles directory:', err);

            const filesCss = files.filter((file) => file.isFile() && path.extname(file.name) === '.css');
            const readPromises = filesCss.map((file) => {
                const filePath = path.join(folderStyles, file.name);

                return new Promise((resolve, reject) => {
                    fs.readFile(filePath, 'utf-8', (err, content) => {
                        if (err) reject(err);
                        else resolve(content);
                    });
                });
            });

            Promise.all(readPromises)
                .then((contents) => {
                    const bundleContent = contents.join('\n');
                    fs.writeFile(outBundle, bundleContent, (err) => {
                        if (err) console.error('Error writing bundle.css:', err);
                        else console.log('The bundle.css file has been created successfully!');
                    });
                })
                .catch((err) => {
                    console.error('Error reading CSS files:', err);
                });
        });
    });
}
buildBundle();