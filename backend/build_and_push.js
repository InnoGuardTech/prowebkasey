const { execSync } = require('child_process');

try {
  console.log('Building...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Adding to git...');
  execSync('git add .', { stdio: 'inherit', cwd: '..' });
  console.log('Committing...');
  execSync('git commit -m "Update backend dist"', { stdio: 'inherit', cwd: '..' });
  console.log('Pushing...');
  execSync('git push', { stdio: 'inherit', cwd: '..' });
  console.log('Done!');
} catch (e) {
  console.error('Failed', e.message);
}
