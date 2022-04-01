import { markdown2confluence } from './util'
import fs from 'fs/promises'
import path from 'path'

async function main () {
  let filename = process.argv[2]
  const outputFileName = process.argv[3]

  if (!filename) {
    filename = '/dev/stdin'
  }
  try {
    const buffer = await fs.readFile(path.resolve(process.cwd(), filename))
    // We want to remove widdershins metadata
    let commentEnd = buffer.indexOf('-->', 0)

    commentEnd = commentEnd > 0 ? (commentEnd += 3) : 0

    // Generate the confluence wiki markup
    const confluenceMarkup = markdown2confluence(
      buffer.slice(commentEnd, buffer.length).toString()
    )

    if (outputFileName) {
      await fs.writeFile(
        path.resolve(process.cwd(), outputFileName),
        confluenceMarkup,
        {
          encoding: 'utf-8'
        }
      )
    } else {
      const basename = path.basename(
        filename,
        path.extname(filename)
      )
      await fs.writeFile(
        path.resolve(process.cwd(), basename + '.txt'),
        confluenceMarkup,
        {
          encoding: 'utf-8'
        }
      )
    }

    return confluenceMarkup
  } catch (error) {
    throw new Error('read file ' + filename + ' error!')
  }
}

main()
