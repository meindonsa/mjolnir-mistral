import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'custom',
})

app.use(vite.middlewares)

app.use('*splat', async (req, res) => {
  const url = req.originalUrl

  try {
    let template = fs.readFileSync(resolve(__dirname, 'index.html'), 'utf-8')
    template = await vite.transformIndexHtml(url, template)

    const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
    const { html, state } = await render(url)

    const page = template
      .replace('<!--ssr-outlet-->', html)
      .replace('<!--pinia-state-->', `<script>window.__pinia=${state}</script>`)

    res.status(200).set({ 'Content-Type': 'text/html' }).end(page)
  } catch (e) {
    vite.ssrFixStacktrace(e)
    console.error(e)
    res.status(500).end(e.message)
  }
})

app.listen(3000, () => console.log('SSR server running at http://localhost:3000'))
