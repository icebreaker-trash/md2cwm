import type { marked } from 'marked'

export type LanguageMap = Record<string, string>

export type CodeBlockOptions = {
  options?: Record<string, string | boolean>
  get?: (lang: string) => Record<string, string | boolean>
}

export interface UserDefinedOptions extends marked.MarkedOptions {
  codeBlock?: {
    languageMap?: LanguageMap
    options?: CodeBlockOptions
  }
}
