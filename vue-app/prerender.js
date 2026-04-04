import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', { url: 'http://localhost' })
globalThis.window = dom.window
globalThis.document = dom.window.document
globalThis.HTMLElement = dom.window.HTMLElement
globalThis.SVGElement = dom.window.SVGElement
globalThis.localStorage = dom.window.localStorage
globalThis.history = dom.window.history
globalThis.location = dom.window.location
Object.defineProperty(globalThis, 'navigator', {
  value: dom.window.navigator,
  writable: true,
  configurable: true,
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, 'dist')
const outputDir = path.resolve(distDir, 'output')

async function prerender() {
  const template = fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8')

  const { render, routes } = await import(
    path.resolve(distDir, 'server', 'entry-server.js')
  )

  const routePaths = routes.map((r) => r.path)

  for (const routePath of routePaths) {
    console.log(`Prerendering ${routePath} ...`)

    const { body, headTags } = await render(routePath)
    const finalHtml = template
      .replace('<div id="app"></div>', `<div id="app">${body}</div>`)
      .replace(/<title>.*?<\/title>/, '')
      .replace('</head>', `${headTags}\n  </head>`)

    const filePath =
      routePath === '/'
        ? path.resolve(outputDir, 'index.html')
        : path.resolve(outputDir, routePath.slice(1), 'index.html')

    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.writeFileSync(filePath, finalHtml)
    console.log(`  -> ${path.relative(__dirname, filePath)}`)
  }

  console.log('\nPrerendering complete.')
}

prerender().catch((err) => {
  console.error('Prerender failed:', err)
  process.exit(1)
})
