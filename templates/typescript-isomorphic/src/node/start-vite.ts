import { createServer } from 'vite'
import portscanner from 'portscanner'
import { build } from 'vite'
import chokidar from 'chokidar'

import viteConfig from '../../vite.config'
import connectKoaPlugin from './connect-vite'

const watch = async () => {
    await build(viteConfig)

    const watcher = chokidar.watch(
        viteConfig.base,
        {
            ignored: /(^|[\/\\])\../,
            persistent: true,
        },
    )

    watcher.on(
        'change',
        async (path) => {
            console.log(`changed path: ${path}`)

            await build(viteConfig)
        },
    )
}

const main = async () => {

    const port = await portscanner.findAPortNotInUse(
        3000,
        3999,
        '127.0.0.1'
    )

    watch()

    createServer({
        configureServer: [
            connectKoaPlugin,
        ],
    })
    .listen(port, () => {
        console.log(`Listening at http://localhost:${port}`)
    })
}

main()
