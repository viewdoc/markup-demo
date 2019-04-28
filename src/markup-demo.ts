import { readFile, writeFile } from 'fs-extra'
import path from 'path'
import walk from 'walk'

const MARKUP_START = '// markup-start'
const MARKUP_END = '// markup-end'

export interface BuildMarkupOptions {
  srcDirPath: string
  outDirPath: string
  srcExtensions: string[]
  generateSrc (markup: string): string
}

interface ReadState {
  isMarkup: boolean
  markupLines: string[]
}

export const buildMarkup = (buildMarkupOptions: BuildMarkupOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    const { srcDirPath: srcPath, outDirPath, srcExtensions, generateSrc } = buildMarkupOptions
    const getOutName = (fileName: string): string | undefined => {
      for (const srcExtension of srcExtensions) {
        if (fileName.endsWith(`.src${srcExtension}`)) {
          return `${fileName.substring(0, fileName.length - `.src${srcExtension}`.length)}${srcExtension}`
        }
      }
      return
    }
    const walker = walk.walk(srcPath)
    walker.on('file', async (dirPath, fileStats, next) => {
      const outName: string | undefined = getOutName(fileStats.name)
      if (!outName) {
        next()
        return
      }
      const srcLines = (await readFile(path.join(dirPath, fileStats.name), 'utf-8')).split('\n')
      const outLines: string[] = []
      const state: ReadState = { isMarkup: false, markupLines: [] }
      srcLines.forEach((srcLine) => {
        if (srcLine === MARKUP_START) {
          state.isMarkup = true
          return
        }
        if (srcLine === MARKUP_END) {
          const markup = state.markupLines.join('\n')
          outLines.push(generateSrc(markup), markup)
          state.isMarkup = false
          state.markupLines = []
          return
        }
        if (state.isMarkup) {
          state.markupLines.push(srcLine)
          return
        }
        outLines.push(srcLine)
      })
      const outPath = path.join(outDirPath, path.relative(srcPath, dirPath), outName)
      await writeFile(outPath, outLines.join('\n'))
      console.log(outPath)
      next()
    })
    walker.on('errors', reject)
    walker.on('end', resolve)
  })
}
