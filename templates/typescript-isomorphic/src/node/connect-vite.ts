import Router from '@koa/router'
import { Context } from 'koa'
import axios from 'axios'

const router = new Router()

router.get('/api/lorem-ipsum', async (ctx: Context, next) => {
    const response = await axios.get(
        'https://raw.githubusercontent.com/arleym/kjv-markdown/master/01%20-%20Genesis%20-%20KJV.md',
        {
            responseType: 'stream'
        },
    )

    ctx.res.setHeader('content-type', 'text/plain; charset=utf-8')
    ctx.body = response.data
})

export default ({
    root, // project root directory, absolute path
    app, // Koa app instance
    server, // raw http server instance
    watcher // chokidar file watcher instance
}) => {
    app.use(router.routes())
    app.use(router.allowedMethods())
}
