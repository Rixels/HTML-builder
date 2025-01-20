const fs = require('fs');
const path = require('path');
const folderStyles = path.join(__dirname, 'styles');
const folderAssets = path.join(__dirname, 'assets');
const projectDist = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const folderComponents = path.join(__dirname, 'components');
const outAssetsDir = path.join(projectDist, 'assets');
function initializeDir() {
    fs.rm(projectDist, { recursive: true, force: true }, (err) => {
        if (err) return console.error('Error when deleting project-dist:', err);

        fs.mkdir(projectDist, { recursive: true }, (err) => {
            if (err) return console.error('Error creating project-dist folder:', err);
            generateHTML();
            generateStyles();
            copyAssets(folderAssets, outAssetsDir);
        });
    });
}
function generateHTML() {
    fs.readFile(templatePath, 'utf-8', (err, templateContent) => {
        if (err) return console.error('Error reading template.html:', err);

        const tags = templateContent.match(/{{\s*[\w]+\s*}}/g) || [];
        let tagsProcess = tags.length;
        tags.forEach((tag) => {
            const componentName = tag.replace(/{{\s*|\s*}}/g, '');
            const componentFile = path.join(folderComponents, `${componentName}.html`);
            fs.readFile(componentFile, 'utf-8', (err, componentContent) => {
                if (err) {
                    console.error(`Error reading component ${componentName}:`, err);
                    tagsProcess -= 1;
                    if (tagsProcess === 0) saveHTML(templateContent);
                    return;
                }
                templateContent = templateContent.replace(tag, componentContent);
                tagsProcess -= 1;
                if (tagsProcess === 0) saveHTML(templateContent);
            });
        });
        if (tags.length === 0) saveHTML(templateContent);
    });
}
function saveHTML(content) {
    const htmlPath = path.join(projectDist, 'index.html');
    fs.writeFile(htmlPath, content, 'utf-8', (err) => {
        if (err) console.error('Error writing index.html:', err);
        else console.log('index.html created successfully.');
    });
}
function generateStyles() {
    fs.readdir(folderStyles, { withFileTypes: true }, (err, files) => {
        if (err) return console.error('Error reading styles directory:', err);

        const cssFiles = files.filter((file) => file.isFile() && path.extname(file.name) === '.css');
        let cssContent = '';

        cssFiles.forEach((file, index) => {
            const filePath = path.join(folderStyles, file.name);

            fs.readFile(filePath, 'utf-8', (err, content) => {
                if (err) return console.error(`Error reading CSS file ${file.name}:`, err);
                cssContent += content + '\n';
                if (index === cssFiles.length - 1) {
                    const bundlePath = path.join(projectDist, 'style.css');
                    fs.writeFile(bundlePath, cssContent, 'utf-8', (err) => {
                        if (err) console.error('Error writing style.css:', err);
                        else console.log('style.css created successfully.');
                    });
                }
            });
        });
    });
}
function copyAssets(src, dest) {
    fs.mkdir(dest, { recursive: true }, (err) => {
        if (err) return console.error('Error creating directory:', err);

        fs.readdir(src, { withFileTypes: true }, (err, entries) => {
            if (err) return console.error('Error reading directory:', err);

            entries.forEach((entry) => {
                const sourcePath = path.join(src, entry.name);
                const finalFilePath = path.join(dest, entry.name);

                if (entry.isDirectory()) {
                    copyAssets(sourcePath, finalFilePath);
                } else if (entry.isFile()) {
                    fs.copyFile(sourcePath, finalFilePath, (err) => {
                        if (err) console.error(`Error copying file ${entry.name}:`, err);
                    });
                }
            });
        });
    });
}

initializeDir();