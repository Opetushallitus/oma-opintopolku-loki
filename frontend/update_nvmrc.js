const fs = require('fs');
const path = require('path');

const packageJson = require('./package.json');
const requiredNodeVersion = packageJson.engines.node;

fs.writeFileSync(path.join(__dirname, '.nvmrc'), requiredNodeVersion, 'UTF8');
