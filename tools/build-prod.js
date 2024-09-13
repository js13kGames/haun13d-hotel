// build.js
const esbuild = require('esbuild');
const { webglPlugin } = require('esbuild-plugin-webgl');
const fs = require('fs');
const { minify } = require('terser');
const ifdef = require("./plugins/esbuild-ifdef");
const copyStaticFiles = require('esbuild-copy-static-files');

const define = {
    "process.env.DEBUG": "false"
};

esbuild.build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    minify: false,
    drop: ['console'],
    target: 'ES2022',
    format: 'esm',
    outfile: './dist/bundle.js',
    define,
    plugins: [
        copyStaticFiles({
            src: './static', // Source directory
            dest: './dist', // Destination directory
        }),
        webglPlugin(),
        ifdef(define)
    ],
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
        const fs = require('fs');
        const code = fs.readFileSync('dist/bundle.js', 'utf8');

        // Minify with Terser
        minify(code, {
            toplevel: true,
            mangle: {
                properties: {
                    regex: /^_/
                }
            }
        }).then(result => {
            // Write the minified code to the output file
            fs.writeFileSync('dist/index.js', result.code);
        });
        // console.log(result);

        // rollup.rollup({ input: ['./dist/index.js'], output: ['./dist/foo.js'] })
        //     .then(async bundle => {
        //         console.log('rolling up...');
        //         console.log(bundle);

        //         //await bundle.generate({ compact: true });
        //         await bundle.write({ format: 'cjs', compact: true, file: './dist/foox.js' });
        //         await bundle.close();
        //     });

        // fs.writeFile('./metafile.json', JSON.stringify(result.metafile), (err) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     console.log('Metafile has been written\n\n');
        // });
    })
    .catch((e) => {
        console.log(e);
        process.exit(1);
    });

