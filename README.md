# @viewdoc/markup-demo
> A tool to create demo files for markup syntax

It turns this:

```
// markup-start

> This is an example.

// markup-end
```

into this:

````
```markdown
> This is an example.
```

> This is an example.
````

## Install

```bash
$ npm install @viewdoc/markup-demo
```

## Usage

```
const { buildMarkup } = require('@viewdoc/markup-demo')
const path = require('path')

const main = async () => {
  await buildMarkup({
    srcDirPath: path.join(__dirname, 'src'),
    outDirPath: __dirname,
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
```
