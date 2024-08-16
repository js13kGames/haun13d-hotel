// build.js
const esbuild = require('esbuild');
const { webglPlugin } = require('esbuild-plugin-webgl');
const fs = require('fs');

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

        fs.writeFile('./metafile.json', JSON.stringify(result.metafile), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Metafile has been written');
        });
    })
    .catch(() => process.exit(1));

