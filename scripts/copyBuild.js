const fs = require('fs');
const path = require('path');

async function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = fs.lstatSync(full);
    if (stat.isDirectory()) {
      await rmrf(full);
    } else {
      fs.unlinkSync(full);
    }
  }
  fs.rmdirSync(dir);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.error(`Source path does not exist: ${src}`);
    process.exit(1);
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const symlink = fs.readlinkSync(srcPath);
      fs.symlinkSync(symlink, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    const repoRoot = path.resolve(__dirname, '..');
    const buildDir = path.join(repoRoot, 'frontend', 'build');
    const targetStatic = path.join(repoRoot, 'backend', 'app', 'static');

    console.log('Removing existing static directory (if any):', targetStatic);
    await rmrf(targetStatic);

    console.log('Copying frontend build from', buildDir, 'to', targetStatic);
    copyRecursive(buildDir, targetStatic);
    // Some CRA builds place public images in build/img (top-level).
    // Our FastAPI mounts the `static` subfolder at `/static`, so ensure
    // images are also available under `static/img` by copying them there
    // if they exist at the top-level `targetStatic/img`.
    const topLevelImg = path.join(targetStatic, 'img');
    const staticImgDest = path.join(targetStatic, 'static', 'img');
    if (fs.existsSync(topLevelImg) && !fs.existsSync(staticImgDest)) {
      console.log('Copying top-level images into', staticImgDest);
      // Ensure parent exists
      fs.mkdirSync(path.join(targetStatic, 'static'), { recursive: true });
      copyRecursive(topLevelImg, staticImgDest);
    }
    console.log('Done copying frontend build to backend static folder.');
  } catch (err) {
    console.error('Error copying build:', err);
    process.exit(1);
  }
})();