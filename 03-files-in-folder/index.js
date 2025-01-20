const fs = require('fs');
const path = require('path');
const folder = path.join(__dirname, 'secret-folder');
fs.readdir(folder, { withFileTypes: true }, (err, items) => {
    if (err) {
        return console.error('Error reading:', err);
    }
    items.forEach((item) => {
        if (item.isFile()) {
            const file = path.join(folder, item.name);
            fs.stat(file, (err, stats) => {
                if (err) {
                    return console.error('Error:', err);
                }
                const name = path.parse(item.name).name;
                const extension = path.parse(item.name).ext.slice(1);
                const size = (stats.size / 1024).toFixed(3);
                console.log(`${name} - ${extension} - ${size}kb`);
            });
        }
    });
});
