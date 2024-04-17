const fs = require('fs-extra');
const path = require('path');

const folder = 'musicFiles'

const sourceFolder = path.resolve(__dirname, folder);
const destinationFolder = path.resolve(__dirname, 'dist', folder);

fs.copySync(sourceFolder, destinationFolder);

console.log(`Successfully copied '${folder}' folder to 'dist' directory.`);