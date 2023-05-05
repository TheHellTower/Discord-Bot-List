const fs = require('fs');
const path = require('path');
const jscodeshift = require('jscodeshift');

// transform all files in the given directory
function transformFiles(dir, transform) {
  // get a list of all files in the directory
  const files = fs.readdirSync(dir);

  // transform each file in the directory
  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // skip directories
    if (fs.statSync(filePath).isDirectory()) {
      return transformFiles(filePath, transform);
    }

    // skip non-js files
    if (!filePath.endsWith('.js')) {
      return;
    }

    // read the contents of the file
    const source = fs.readFileSync(filePath, 'utf8');

    // transform the contents of the file
    const output = transform({ path: filePath, source }, { jscodeshift }, {});

    // write the new contents of the file
    fs.writeFileSync(filePath, output, 'utf8');
  });
}

// run the transformation
const transform = require('./scripts/snake-to-camel.js');

transformFiles('./src', transform);
