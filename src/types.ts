// import type { marked } from 'marked'

export type LanguageMap = Record<string, string>

export type CodeBlockOptions = {
  options?: Record<string, string | boolean>
  get?: (lang: string) => Record<string, string | boolean>
}

export interface UserDefinedOptions {
  codeBlock?: {
    languageMap?: LanguageMap
    options?: CodeBlockOptions
  }
  renderer?: Record<string, Function>
}
