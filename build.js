const path = require('path')
const { buildMarkup } = require('./lib')

const main = async () => {
  await buildMarkup({
    srcDirPath: path.join(__dirname, 'examples'),
    outDirPath: path.join(__dirname, 'examples'),
    srcExtensions: ['.md'],
    generateSrc: (markup) => {
      return [
        '```markdown',
        markup,
        '```',
      ].join('')
    }
  })
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
