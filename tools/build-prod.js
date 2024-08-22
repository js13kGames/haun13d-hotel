// build.js
const esbuild = require('esbuild');
const { webglPlugin } = require('esbuild-plugin-webgl');
const { minify } = require('rollup-plugin-esbuild');
const fs = require('fs');
const rollup = require('rollup');

esbuild.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: true,
    drop: ['console'],
    target: 'ES2022',
    format: 'esm',
    outfile: './dist/index.js',
    plugins: [webglPlugin()],
    metafile: true,
    loader: {
        '.vs': 'text',
        '.fs': 'text',
        '.frag': 'text',
        '.vert': 'text',
        '.glsl': 'text',
    },
})
    .then(result => {
        console.log(result);

        rollup.rollup({ input: ['./dist/index.js'], output: ['./dist/foo.js'] })
            .then(async bundle => {
                console.log('rolling up...');
                console.log(bundle);

                //await bundle.generate({ compact: true });
                await bundle.write({ format: 'cjs', compact: true, file: './dist/foox.js' });
                await bundle.close();
            });

        fs.writeFile('./metafile.json', JSON.stringify(result.metafile), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Metafile has been written\n\n');
        });
    })
    .catch(() => process.exit(1));

