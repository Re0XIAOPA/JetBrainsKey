const esbuild = require('esbuild');

async function buildAll() {
  await esbuild.build({
    entryPoints: ['assets/js/main.js'],
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2018'],
    outfile: 'assets/js/app.bundle.js',
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});

