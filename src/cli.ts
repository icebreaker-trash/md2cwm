import { markdown2confluence } from './util'
import fg from 'fast-glob'
import fs from 'fs/promises'
import path from 'path'
import logSymbols from 'log-symbols'

async function mkdir (dir: string) {
  try {
    await fs.access(dir)
  } catch (error) {
    await fs.mkdir(dir, {
      recursive: true
    })
  }
}

async function write (source: string, dir: string) {
  const basename = path.basename(source, path.extname(source))
  try {
    const buffer = await fs.readFile(path.resolve(process.cwd(), source))
    // We want to remove widdershins metadata
    let commentEnd = buffer.indexOf('-->', 0)

    commentEnd = commentEnd > 0 ? (commentEnd += 3) : 0

    // Generate the confluence wiki markup
    const confluenceMarkup = markdown2confluence(
      buffer.slice(commentEnd, buffer.length).toString()
    )

    await fs.writeFile(
      path.resolve(process.cwd(), dir, `${basename}.txt`),
      confluenceMarkup,
      {
        encoding: 'utf-8'
      }
    )

    return {
      path: source,
      value: confluenceMarkup
    }
  } catch (error) {
    const err = new Error('read file ' + source + ' error!')
    // @ts-ignore
    err.innerError = error
    // @ts-ignore
    err.path = source
    throw err
  }
}

async function main () {
  const filename = process.argv[2]
  let source = '*.md'
  if (filename) {
    source = filename
  }

  let outputDir = 'docs'
  const targetDir = process.argv[3]
  if (targetDir) {
    outputDir = targetDir
  }
  const entries = await fg([source], { dot: true })

  await mkdir(outputDir)

  const result = await Promise.allSettled(
    entries.map((source) => {
      return write(source, outputDir)
    })
  )
  for (let i = 0; i < result.length; i++) {
    const p = result[i]
    if (p.status === 'fulfilled') {
      console.log(logSymbols.success, `${p.value.path} generate success!`)
      continue
    }
    if (p.status === 'rejected') {
      console.log(logSymbols.error, `${p.reason.path} generate fail!`)
      continue
    }
  }
}

main()
