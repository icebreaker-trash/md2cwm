import { marked } from 'marked'
import { stringify } from 'qs'
import filter from 'lodash/filter'
import map from 'lodash/map'
import trim from 'lodash/trim'
import split from 'lodash/split'

// https://www.npmjs.com/package/markdown2confluence

const MAX_CODE_LINE = 20

const rawRenderer = marked.Renderer

const langArr =
  'actionscript3 bash csharp coldfusion cpp css delphi diff erlang groovy java javafx javascript perl php none powershell python ruby scala sql vb html/xml'.split(
    /\s+/
  )
const langMap = {
  shell: 'bash',
  html: 'html',
  xml: 'xml'
}

for (let i = 0, x; (x = langArr[i++]);) {
  langMap[x] = x
}

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

  code (code, lang) {
    // {code:language=java|borderStyle=solid|theme=RDark|linenumbers=true|collapse=true}
    if (lang) {
      lang = lang.toLowerCase()
    }
    lang = langMap[lang] || 'none'
    const param = {
      language: lang,
      borderStyle: 'solid',
      theme: 'RDark', // dark is good
      linenumbers: true,
      collapse: false
    }
    const lineCount = split(code, '\n').length
    if (lineCount > MAX_CODE_LINE) {
      // code is too long
      param.collapse = true
    }
    const str = stringify(param, {
      delimiter: '|'
    })
    // param = qs.stringify(param, '|', '=')
    return '{code:' + str + '}\n' + code + '\n{code}\n\n'
  }
}

const renderer = new Renderer()

export function markdown2confluence (markdown) {
  return marked(markdown, { renderer: renderer })
}
