/**
 * @type { import('vite').UserConfig }
 */
const config = {
    jsx: 'preact',
    alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
    },
    base: 'src/client',
    outDir: 'dist/client',
}

module.exports = config
