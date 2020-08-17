#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'
import minimist from 'minimist'
import axios from 'axios'

const argv = minimist(process.argv.slice(2))

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

async function init() {
    const targetDir = argv._[0] || '.'
    const cwd = process.cwd()
    const root = path.join(cwd, targetDir)
    const renameFiles = {
        _gitignore: '.gitignore',
    }

    console.log(`Scaffolding project in ${root}...`)

    await fs.ensureDir(root)

    const existing = await fs.readdir(root)

    if (existing.length) {
        console.error(`Error: target directory is not empty.`)
        process.exit(1)
    }

    const templateDir = path.join(
        __dirname,
        '..',
        'templates',
        argv.t || argv.template || 'typescript-isomorphic',
    )

    const write = async (file, content) => {
        const targetPath = renameFiles[file]
            ? path.join(root, renameFiles[file])
            : path.join(root, file)

            if (content) {
            await fs.writeFile(targetPath, content)
        } else {
            await fs.copy(path.join(templateDir, file), targetPath)
        }
    }

    const files = await fs.readdir(templateDir)
    const filtered = files.filter((f) => {
        return f !== 'package.json' || f !== 'node_modules'
    })

    for (const file of filtered) {
        await write(file, null)
    }

    const pkg = require(path.join(templateDir, `package.json`))
    pkg.name = path.basename(root)
    await write('package.json', JSON.stringify(pkg, null, 2))

    const lang = argv.lang || 'node'
    const githubGitIgnore = (await axios(`https://raw.githubusercontent.com/github/gitignore/master/${capitalize(lang)}.gitignore`)).data
    await write('.gitignore', githubGitIgnore)

    console.log(`\nDone. Now run:\n`)

    if (root !== cwd) {
        console.log(`  cd ${path.relative(cwd, root)}`)
    }

    console.log(`  npm install (or \`yarn\`)`)
    console.log(`  npm run dev (or \`yarn dev\`)`)
    console.log()
}

init().catch((e) => {
    console.error(e)
})
