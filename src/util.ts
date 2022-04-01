import { marked } from 'marked'
import { stringify } from 'qs'
// import filter from 'lodash/filter'
// import map from 'lodash/map'
// import trim from 'lodash/trim'
import defaultLanguageMap from './defaultLanguageMap'
// https://www.npmjs.com/package/markdown2confluence
// https://github.com/Shogobg/markdown2confluence
const codeBlockParams = {
  options: {
    title: 'none',
    language: 'none',
    borderStyle: 'solid',
    theme: 'RDark', // dark is good
    linenumbers: true,
    collapse: true
  },

  get (lang: string) {
    const codeOptions = this.options
    codeOptions.language = lang

    return codeOptions
  }
}

const rawRenderer = marked.Renderer

class Renderer extends rawRenderer {
  text (text: string) {
    return text
  }

  paragraph (text: string) {
    return `${text}\n\n`
  }

  html (text: string) {
    const regex =
      /<([\w]+)\s*[\w=]*"?([\/:\s\w=\-@\.\&\?\%]*)"?>([\/:\s\w.!?\\<>\-]*)(<\/\1>)?/gi

    // We need special handling for anchors
    text = text.replace(regex, (match, tag, link, content) => {
      if (tag === 'a') {
        return `[${link}|`
      }

      return `${tag}. ${content}`
    })

    // Closing anchor tag </a> otherwise remove the closing tag
    text = text.replace(/<\/([\s\w]+)>/gi, (match, tag) => {
      if (tag === 'a') {
        return ']'
      }

      return ''
    })

    return text
  }

  heading (text: string, level: number) {
    return `h${level}. ${text}\n\n`
  }

  strong (text: string) {
    return `*${text}*`
  }

  em (text: string) {
    return `_${text}_`
  }

  del (text: string) {
    return `-${text}-`
  }

  codespan (text: string) {
    const textArr = text.split(/(&[^;]*;)/).map((match, index) => {
      // These are the delimeters.
      if (index % 2) {
        return match
      }

      return match.replace(/[^a-zA-Z0-9 ]/g, (badchar) => {
        return `&#${badchar[0].charCodeAt(0)};`
      })
    })

    return `{{${textArr.join('')}}}`
  }

  blockquote (text: string) {
    return `{quote}\n${text.trim()}\n{quote}\n\n`
  }

  br () {
    return '\n'
  }

  hr () {
    return '----\n\n'
  }

  link (href: string, title: string, text: string) {
    // Sadly, one must choose if the link's title should be displayed
    // or the linked text should be displayed. We picked the linked text.
    text = text || title

    if (text) {
      text += '|'
    }

    return `[${text}${href}]`
  }

  list (text: string, ordered: boolean) {
    text = text.trim()

    if (ordered) {
      text = text.replace(/^\*/gm, '#')
    }

    return `\r${text}\n\n`
  }

  listitem (text: string) {
    // If a list item has a nested list, it will have a "\r" in the
    // text. Turn that "\r" into "\n" but trim out other whitespace
    // from the list.
    text = text.replace(/\s*$/, '').replace(/\r/g, '\n')

    // Convert newlines followed by a # or a * into sub-list items
    text = text.replace(/\n([*#])/g, '\n*$1')

    return `* ${text}\n`
  }

  image (href: string) {
    return `!${href}!`
  }

  table (header: string, body: string) {
    return `${header}${body}\n`
  }

  tablerow (text: string) {
    const boundary = text.match(/^\|*/)
    let str: string
    if (boundary) {
      str = boundary[0]
    } else {
      str = '|'
    }

    return `${text}${str}\n`
  }

  tablecell (
    text: string,
    flags: {
      header: boolean
    }
  ) {
    let boundary

    if (flags.header) {
      boundary = '||'
    } else {
      boundary = '|'
    }

    return `${boundary}${text}`
  }

  code (text: string, lang: string) {
    lang = defaultLanguageMap[(lang ?? '').toLowerCase()]

    const param = stringify(codeBlockParams.get(lang), {
      delimiter: '|'
    })
    return `{code:${param}}\n${text}\n{code}\n\n`
  }
}

export function markdown2confluence (markdown: string) {
  const renderer = new Renderer()
  return marked(markdown, { renderer: renderer })
}
