import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const origin = 'https://tinh-hoa-nang-luong-so.hieutrantaskflow.workers.dev'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
// A Windows checkout (core.autocrlf) builds text with CRLF while CI builds LF,
// so text is compared with line endings normalized; images stay byte for byte.
const isText = route => /\.(js|css|json|md|html|svg|txt)$/.test(route)
const comparable = (route, bytes) =>
  isText(route) ? Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n')) : bytes
const checks = []

async function get(route) {
  const response = await fetch(new URL(route, origin), {
    headers: { Accept: 'text/html,application/json,*/*', 'Sec-Fetch-Mode': 'navigate', 'Cache-Control': 'no-cache' },
    redirect: 'follow',
    signal: AbortSignal.timeout(25000),
  })
  assert.equal(response.status, 200, `${route} must return HTTP 200`)
  return response
}

for (const route of ['/', '/lo-trinh', '/tra-cuu', '/thu-vien?slide=6', '/tu-truong/sinh-khi']) {
  const html = await (await get(route)).text()
  assert.match(html, /Tinh Hoa Năng Lượng Số/, `${route} has the new website title`)
  checks.push({ route, status: 200, titleVerified: true })
}

const localHtml = await readFile(path.join(root, 'dist/index.html'), 'utf8')
const script = localHtml.match(/src="(\/assets\/[^\"]+\.js)"/)?.[1]
const css = localHtml.match(/href="(\/assets\/[^\"]+\.css)"/)?.[1]
assert.ok(script && css, 'The build must contain fingerprinted JS and CSS assets')
for (const route of [script, css, '/content/nls/slides.json', '/content/nls/TINH-HOA-NLS-6868.md', '/content/nls/slides/006-1.webp', '/content/nls/thumbnails/006-1.webp']) {
  const response = await get(route)
  const bytes = comparable(route, Buffer.from(await response.arrayBuffer()))
  const local = comparable(route, await readFile(path.join(root, 'dist', route)))
  assert.equal(
    hash(bytes),
    hash(local),
    isText(route)
      ? `${route} must match the validated build after normalizing line endings`
      : `${route} must match the validated build byte for byte`,
  )
  checks.push({ route, status: 200, sha256: hash(bytes), comparison: isText(route) ? 'text-lf' : 'bytes' })
}

const slides = await (await get('/content/nls/slides.json')).json()
const localSlides = JSON.parse(await readFile(path.join(root, 'dist/content/nls/slides.json'), 'utf8'))
assert.equal(slides.length, 143)
assert.equal(slides.filter(slide => slide.quality === 'blank').length, 9)
const proofreadCount = slides.filter(slide => slide.quality === 'proofread').length
assert.equal(proofreadCount, localSlides.filter(slide => slide.quality === 'proofread').length)
assert.equal(slides[116].quality, 'native')
const health = await (await get('/api/health')).json()
assert.equal(health.ok, true)
checks.push({ route: '/api/health', status: 200, ok: true })

const report = { url: origin, workerName: 'tinh-hoa-nang-luong-so', checkedAt: new Date().toISOString(), slideCount: slides.length, proofreadCount, checks }
await mkdir(path.join(root, '.cache'), { recursive: true })
await writeFile(path.join(root, '.cache/production-verification.json'), JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify(report, null, 2))
