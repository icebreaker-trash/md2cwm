import fs from 'fs'
import path from 'path'

const testsFolder = `${process.cwd()}/tests/mdStrings/`

const getTestStrings = (testName: string) => {
  const source = fs
    .readFileSync(path.resolve(testsFolder, `${testName}.md`))
    .toString()

  const target = fs
    .readFileSync(path.resolve(testsFolder, `${testName}.confluence`))
    .toString()

  return { source, target }
}

export default getTestStrings
