# md2confluence

> This is a fork form [Shogobg/markdown2confluence](https://github.com/Shogobg/markdown2confluence), Thanks for `Shogobg` to provide such goof util and i wanna do some refactors with markdown ast utils.

This tool converts [Markdown] to [Confluence Wiki Markup].

## Overview

Using [Markdown] is fast becoming a standard for open-source projects and their documentation. There are a few variants, such as [GitHub Flavored Markdown], which add additional features.

Atlassian's Confluence has a different way of writing documentation, according to their [Confluence Wiki Markup] and [later pages][confluence-wiki-markup] and [references][wiki-render-help-action].

This project contains a library and a command-line tool that bridges the gap and converts from Markdown to Confluence.

## Installation

```sh
npm i -g md2confluence
```

```sh
npm i --save md2confluence
```

## Command-Line Use

Read in a Markdown file and write Confluence format to another file:

```sh
md2confluence <path/to/markdown.md> <path/to/output.txt>
```

Or output to standard output:

    md2confluence README.md

## As library dependency

Or just edit your application `package.json` and add the following code to your `dependencies` object:

    {
        ...
        "dependencies": {
            ...
            "md2confluence": "*"
            ...
        }
        ...
    }

Now you write some JavaScript to load Markdown content and convert.

```javascript
const md2confluence = require('md2confluence');
const markdown = fs.readFileSync('README.md');
const confluence = md2confluence(markdown);
console.log(confluence);
```

This uses the wonderful [marked](https://www.npmjs.com/package/marked) library to parse and reformat the Markdown text.

## Custom options

Since this tool uses [marked](https://www.npmjs.com/package/marked), there is a pre-defined renderer which we pass to [marked](https://www.npmjs.com/package/marked).
If you want to replace any of the predefined functions or the renderer as a whole, you can do so by passing an options object to the tool.

```javascript
md2confluence = require('md2confluence');
markdown = fs.readFileSync('README.md');
confluence = md2confluence(markdown, {
  renderer: {
    link: href => {
      return `http://example.com/${href}`;
    },
  },
});
console.log(confluence);
```

Additionally, the options objects takes custom arguments for the confluence code block options.

```javascript
md2confluence = require('md2confluence');
markdown = fs.readFileSync('README.md');
confluence = md2confluence(markdown, {
  renderer: {
    link: href => {
      return `http://example.com/${href}`;
    },
  },
  codeBlock: {
    // Adds support for new language
    languageMap: {
      leet: '1337',
    },
    // Shows the supported options and their default values
    options: {
      title: 'none',
      language: 'none',
      borderStyle: 'solid',
      theme: 'RDark', // dark is good
      linenumbers: true,
      collapse: true,
    },
  },
});
console.log(confluence);
```


