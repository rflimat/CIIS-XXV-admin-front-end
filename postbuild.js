const fs = require('fs');
const path = require('path');

const exportDir = path.join(__dirname, 'out');

function moveHtmlToIndex(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.lstatSync(fullPath).isDirectory()) {
      moveHtmlToIndex(fullPath);
    } else if (file.endsWith('.html') && file !== 'index.html') {
      const fileName = file.replace('.html', '');
      const targetDir = path.join(dir, fileName);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir);
      }

      fs.renameSync(fullPath, path.join(targetDir, 'index.html'));
    }
  });
}

moveHtmlToIndex(exportDir);
