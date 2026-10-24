// Local, resumable Vietnamese OCR. Install the tool only in the ignored cache:
// npm install --prefix .cache/ocr tesseract.js@7 --no-save --no-audit --no-fund
// node scripts/ocr-presentation.mjs [number-of-images]
import { readFile, mkdir, writeFile, access } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const { createWorker } = await import(pathToFileURL(path.join(root, '.cache/ocr/node_modules/tesseract.js/src/index.js')))
const manifest = JSON.parse(await readFile(path.join(root, 'docs/nls/slides-manifest.json'), 'utf8'))
const images = [...new Map(manifest.slides.flatMap(slide => slide.images).map(image => [image.original, image])).values()]
const limit = Number(process.argv[2]) || images.length
const output = path.join(root, '.cache/nls-ocr')
await mkdir(output, { recursive: true })
let cursor = 0
const pending = []
for (const image of images.slice(0, limit)) {
  const destination = path.join(output, path.basename(image.original) + '.json')
  if (await access(destination).then(() => true, () => false)) continue
  pending.push({ image, destination })
}
await Promise.all(Array.from({ length: Math.min(3, pending.length) }, async () => {
  const worker = await createWorker('vie', 1, { cachePath: path.join(root, '.cache/ocr') })
  try {
    while (cursor < pending.length) {
      const { image, destination } = pending[cursor++]
      const { data } = await worker.recognize(path.join(root, image.original))
      await writeFile(destination, JSON.stringify({ source: image.original, language: 'vie', confidence: data.confidence, text: data.text }, null, 2) + '\n')
      console.log(`OCR ${path.basename(image.original)}: confidence ${data.confidence}, ${data.text.length} characters`)
    }
  } finally {
    await worker.terminate()
  }
}))
