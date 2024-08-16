// build.js
const esbuild = require('esbuild');
const { webglPlugin } = require('esbuild-plugin-webgl');

async function serve() {
    let ctx = await esbuild.context({
        entryPoints: ['./src/index.ts'],
        bundle: true,
        minify: true,
        target: 'ES2022',
        format: 'esm',
        outfile: './dist/index.js',
        plugins: [webglPlugin()],
        loader: {
            '.vs': 'text',
            '.fs': 'text',
            '.frag': 'text',
            '.vert': 'text',
            '.glsl': 'text',
        },
    });
    await ctx.watch();

    await ctx.serve({ port: 8080, servedir: './dist', host: 'localhost' });
    console.log('Server is running on http://localhost:8080');
}

serve();

