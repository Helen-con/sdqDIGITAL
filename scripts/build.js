const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const filesToCopy = ['index.html', 'styles.css', 'script.js', 'README.md'];

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

filesToCopy.forEach((file) => {
  const source = path.join(projectRoot, file);
  const destination = path.join(distDir, file);
  fs.copyFileSync(source, destination);
});

console.log('Build complete. Assets are available in the dist/ directory.');
