import { marked } from 'marked'
import { stringify } from 'qs'
import filter from 'lodash/filter'
import map from 'lodash/map'
import trim from 'lodash/trim'
import defaultLanguageMap from './defaultLanguageMap'
// https://www.npmjs.com/package/markdown2confluence

const codeBlockParams = {
  options: {
    title: 'none',
    language: 'none',
    borderStyle: 'solid',
    theme: 'RDark', // dark is good
    linenumbers: true,
    collapse: true
  },

  get (lang) {
    const codeOptions = this.options
    codeOptions.language = lang

    return codeOptions
  }
}

const rawRenderer = marked.Renderer

class Renderer extends rawRenderer {
  paragraph (text) {
    return text + '\n\n'
  }

  html (html) {
    return html
  }

  heading (text, level, raw) {
    return 'h' + level + '. ' + text + '\n\n'
  }

  strong (text) {
    return '*' + text + '*'
  }

  em (text) {
    return '_' + text + '_'
  }

  del (text) {
    return '-' + text + '-'
  }

  codespan (text) {
    return '{{' + text + '}}'
  }

  blockquote (quote) {
    return '{quote}' + quote + '{quote}'
  }

  br () {
    return '\n'
  }

  hr () {
    return '----'
  }

  link (href, title, text) {
    const arr = [href]
    if (text) {
      arr.unshift(text)
    }
    return '[' + arr.join('|') + ']'
  }

  list (body, ordered) {
    const arr = filter(trim(body).split('\n'), function (line) {
      return line
    })
    const type = ordered ? '#' : '*'
    return (
      map(arr, function (line) {
        return type + ' ' + line
      }).join('\n') + '\n\n'
    )
  }

  listitem (body, ordered) {
    return body + '\n'
  }

  image (href, title, text) {
    return '!' + href + '!'
  }

  table (header, body) {
    return header + body + '\n'
  }

  tablerow (content) {
    return content + '\n'
  }

  tablecell (content, flags) {
    const type = flags.header ? '||' : '|'
    return type + content
  }

  code (text, lang) {
    lang = defaultLanguageMap[(lang ?? '').toLowerCase()]

    const param = stringify(codeBlockParams.get(lang), {
      delimiter: '|'
    })
    return `{code:${param}}\n${text}\n{code}\n\n`
  }
}

const renderer = new Renderer()

export function markdown2confluence (markdown) {
  return marked(markdown, { renderer: renderer })
}
