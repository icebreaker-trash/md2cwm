import defu from 'defu'
import type { UserDefinedOptions } from './types'
export function getDefaultLanguageMap () {
  const defaultLanguageMap: Record<string, string> = {
    '': 'none',
    actionscript3: 'actionscript3',
    bash: 'bash',
    csharp: 'csharp',
    coldfusion: 'coldfusion',
    cpp: 'cpp',
    css: 'css',
    delphi: 'delphi',
    diff: 'diff',
    erlang: 'erlang',
    groovy: 'groovy',
    html: 'html',
    java: 'java',
    javafx: 'javafx',
    javascript: 'javascript',
    js: 'javascript',
    perl: 'perl',
    php: 'php',
    powershell: 'powershell',
    python: 'python',
    ruby: 'ruby',
    scala: 'scala',
    shell: 'bash',
    sql: 'sql',
    vb: 'vb',
    xml: 'xml'
  }
  return defaultLanguageMap
}

export function getCodeBlockParams () {
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
  return codeBlockParams
}

export function getOptions (options: UserDefinedOptions) {
  return defu(options, {
    codeBlock: {
      languageMap: getDefaultLanguageMap(),
      options: getCodeBlockParams()
    }
  })
}
